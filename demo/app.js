const REFRESH_MS = 15_000;

const JOB_POLL_MS = 1200;

const els = {
  game: document.getElementById('game'),
  stats: document.getElementById('stats'),
  feed: document.getElementById('feed'),
  filters: document.getElementById('filters'),
  sort: document.getElementById('sort'),
  vertical: document.getElementById('vertical'),
  template: document.getElementById('card-template'),
  mode: document.getElementById('mode'),
};

let filter = 'all';
let sort = 'opportunity';
let latest = null;

// Chat-only means there is no app token, so no clip was ever fetched. Every
// moment then has saturation 0 — and that 0 means "not measured", not "nobody
// has it". The difference matters enough to change the words on the card:
// telling an operator a moment is unclaimed when we simply never looked is the
// one lie this feed cannot afford.
let chatOnly = false;

// Cards are rebuilt from scratch on every feed poll, so clip state cannot live
// in the DOM or it would vanish mid-download. Keyed by moment id; `cards`
// tracks which node is currently showing each moment so a job update repaints
// one card instead of re-rendering (and re-sorting) the whole feed under the
// operator's cursor.
const clipJobs = new Map();
const cards = new Map();
let jobTimer = null;

const SORTERS = {
  opportunity: (a, b) => b.opportunity - a.opportunity,
  newest: (a, b) => Date.parse(b.lastClipAt) - Date.parse(a.lastClipAt),
  saturation: (a, b) => b.saturation - a.saturation,
  chat: (a, b) => b.chatZ - a.chatZ,
};

const number = (value) => (value ?? 0).toLocaleString();

function ago(minutes) {
  if (!Number.isFinite(minutes)) return '—';
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${Math.round(minutes)}m ago`;
  return `${(minutes / 60).toFixed(1)}h ago`;
}

/**
 * Text on its way into markup.
 *
 * Everything else on this page is set with textContent, which needs no help.
 * The one place that builds markup is notice(), and one of the strings it is
 * handed comes back from the network.
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function notice(title, html, isError = false) {
  els.feed.innerHTML = '';
  const box = document.createElement('div');
  box.className = `notice${isError ? ' is-error' : ''}`;
  box.innerHTML = `<h2>${title}</h2>${html}`;
  els.feed.append(box);
}

/**
 * How loud chat got, said the way a person would say it.
 *
 * The number underneath is a z-score: how far above this channel's OWN normal
 * the last minute ran. That is the right measure and the wrong label — "38σ"
 * is a reading off an instrument, and the page is not an instrument. The
 * exact figure stays, as the title, for anyone who wants it.
 */
const LOUDNESS = [
  [8, 'chat erupted'],
  [4, 'chat spiked'],
  [2, 'chat busy'],
  [0, 'chat lifting'],
];

const loudness = (z) => (LOUDNESS.find(([floor]) => z >= floor) || LOUDNESS.at(-1))[1];

const loudnessTitle = (z) => `${z.toFixed(1)}σ above this channel's own normal`;

function renderStats(meta, game) {
  els.game.textContent = game ? game.name : 'no category resolved';

  // "5/5 sockets" is true and tells a person nothing: a socket is this
  // program's business, not theirs. What they can act on is whether chat is
  // being heard at all, and the count only matters while some of it is not.
  const chat = !meta.chat?.enabled
    ? 'chat off'
    : meta.chat.connectedShards >= meta.chat.shards
      ? `chat on, ${number(meta.chat.channels)} channels`
      : `chat reconnecting (${meta.chat.connectedShards}/${meta.chat.shards})`;

  // Without a token there are no clips to scan, and no way to know which of
  // the watched channels is actually broadcasting. Reporting either as a zero
  // would read as a measurement rather than an absence.
  // Early, Fresh, Warm and Flooded are not four statistics. They are one
  // scale — how crowded each moment already is — and the whole point of the
  // tool. Drawn as seven equal cells alongside "clips scanned", the shape of
  // the hour was invisible. Drawn as one run, it reads at a glance.
  const buckets = chatOnly
    ? [['early', 'Early', meta.counts.early ?? 0]]
    : [
        ['early', 'Early', meta.counts.early ?? 0],
        ['fresh', 'Fresh', meta.counts.fresh],
        ['warm', 'Warm', meta.counts.warm],
        ['flooded', 'Flooded', meta.counts.flooded],
      ];

  // Everything else is how the measurement was taken, not the measurement.
  // It is still worth showing; it is not worth the same size.
  const context = chatOnly
    ? [`${number(meta.watchedChannels)} watched`]
    : [`${number(meta.clipsScanned)} clips scanned`, `${number(meta.liveChannels)} live`];
  context.push(`${meta.windowMinutes}m window`, chat);

  els.stats.innerHTML =
    `<div class="gauge">${buckets
      .map(
        ([key, label, value]) =>
          `<div class="gauge-cell is-${key}"><b>${value ?? 0}</b><span>${label}</span></div>`,
      )
      .join('')}</div>` + `<div class="bar-meta">${context.join(' · ')}</div>`;
}

function buildCard(moment) {
  const node = els.template.content.firstElementChild.cloneNode(true);
  node.classList.add(`is-${moment.state}`);

  // Zero is the whole pitch for a chat-sourced moment, so say it as a word
  // rather than showing a "0" that reads like missing data.
  node.querySelector('.sat-count').textContent = moment.saturation === 0 ? '—' : moment.saturation;
  node.querySelector('.sat-label').textContent =
    moment.saturation === 0
      ? chatOnly
        ? 'not measured'
        : 'nobody yet'
      : moment.uniqueClippers === moment.saturation
        ? 'clippers'
        : 'clips';

  node.querySelector('.state').textContent =
    moment.state === 'early' ? 'chat only' : moment.state;

  const name = node.querySelector('.broadcaster');
  name.textContent = moment.broadcaster;
  name.href = `https://www.twitch.tv/${moment.broadcaster}`;

  const fresh = node.querySelector('.new-clips');
  fresh.textContent = moment.newClips > 0 ? `+${moment.newClips} since last poll` : '';

  const title = node.querySelector('.title');
  title.textContent = moment.title || moment.streamTitle || '';

  // This was one row of up to eight middot-separated phrases, all the same
  // weight, so "offset estimated" said itself as loudly as the viewer count.
  // Measurements keep the row; the caveats about how the measurement was
  // arrived at become tags after it, where they are read second and read as
  // qualifications rather than as more numbers.
  const measures = [];
  const caveats = [];

  if (moment.chat?.spiking) measures.push([loudness(moment.chatZ), 'hot', loudnessTitle(moment.chatZ)]);
  else if (moment.chatZ > 0) measures.push([loudness(moment.chatZ), null, loudnessTitle(moment.chatZ)]);
  if (moment.saturation > 0) measures.push([`${moment.clipsPerMinute}/min`]);
  if (moment.viewers != null) measures.push([`${number(moment.viewers)} viewers`]);
  // Same lie as saturation: with no API this is an absence, not a zero.
  if (!chatOnly) measures.push([`${number(moment.clipViews)} clip views`]);
  measures.push([ago(moment.minutesSinceLastClip)]);
  if (moment.firstClipper) measures.push([`first: ${moment.firstClipper}`]);

  if (moment.basis === 'created') caveats.push(['VOD position pending']);
  if (moment.offsetEstimated) caveats.push(['offset estimated']);
  if (moment.shared) caveats.push(['whole category spiked', 'shared']);

  // Built as nodes rather than joined into a string: a broadcaster's name goes
  // in here, and it is theirs to choose, not ours to trust.
  const metaNodes = [];
  measures.forEach(([text, kind, hint], i) => {
    if (i) {
      const dot = document.createElement('span');
      dot.textContent = '·';
      metaNodes.push(dot);
    }
    const cell = document.createElement('span');
    if (kind) cell.className = kind;
    if (hint) cell.title = hint;
    cell.textContent = text;
    metaNodes.push(cell);
  });
  for (const [text, kind] of caveats) {
    const tag = document.createElement('span');
    tag.className = kind ? `meta-flag ${kind}` : 'meta-flag';
    tag.textContent = text;
    metaNodes.push(tag);
  }
  node.querySelector('.meta').replaceChildren(...metaNodes);

  renderChatEvidence(node.querySelector('.chat-evidence'), moment);

  const open = node.querySelector('.open');
  open.href = moment.deepLink;
  // Chat-only has no VOD and no clip to point at, so the link is the live
  // channel — and the button should say so rather than promise a clip.
  open.textContent = moment.vodId
    ? 'Open at moment'
    : chatOnly
      ? 'Watch live'
      : 'Open clip';

  const clip = node.querySelector('.clip');
  if (!canClip(moment)) {
    // Without a VOD id and offset there is nothing to cut from: these are the
    // moments whose position Twitch has not published yet.
    clip.disabled = true;
    clip.title = chatOnly
      ? 'Needs Twitch credentials to resolve the VOD — clip it on Twitch for now'
      : 'No VOD position yet — Twitch publishes it a minute or two late';
  } else {
    clip.addEventListener('click', () => startClip(moment));
  }

  cards.set(moment.id, node);
  paintClip(moment.id);

  return node;
}

const canClip = (moment) => Boolean(moment.vodId) && Number.isFinite(moment.offsetSeconds);

const CLASS_LABELS = {
  clipit: 'chat asked for a clip',
  funny: 'laughing',
  hype: 'hype',
  tension: 'tension',
  shock: 'shock',
};

/**
 * What chat actually did, under the card.
 *
 * An unconfirmed moment has to show its working: nobody has clipped it, the
 * offset is a guess, and the only reason it is on screen at all is this. The
 * operator deserves to see the evidence rather than a number asking to be
 * trusted.
 */
function renderChatEvidence(box, moment) {
  const chat = moment.chat;
  const classes = chat?.classes || {};
  const fired = Object.entries(classes)
    .filter(([, value]) => value.count > 0 && value.z > 1)
    .sort((a, b) => b[1].z - a[1].z)
    .slice(0, 3);

  if (!fired.length && !moment.unconfirmed) {
    box.hidden = true;
    return;
  }

  box.hidden = false;
  box.textContent = '';

  if (moment.unconfirmed) {
    const warn = document.createElement('b');
    warn.textContent = chatOnly
      ? 'Chat only — clip count unavailable. '
      : 'Unconfirmed — no clips yet. ';
    box.append(warn);
  }

  if (!fired.length) {
    box.append(document.createTextNode('Chat spiked.'));
    return;
  }

  box.append(
    document.createTextNode(
      fired.map(([name, value]) => `${CLASS_LABELS[name] || name} ×${value.count}`).join(', '),
    ),
  );
  if (chat?.copypasta > 0.3) {
    box.append(document.createTextNode(` · ${Math.round(chat.copypasta * 100)}% copypasta`));
  }
}

function paintClip(momentId) {
  const node = cards.get(momentId);
  const job = clipJobs.get(momentId);
  if (!node) return;

  const button = node.querySelector('.clip');
  const status = node.querySelector('.clip-status');

  if (!job) {
    status.hidden = true;
    return;
  }

  const busy = job.state === 'queued' || job.state === 'running';
  button.disabled = busy;
  button.textContent = busy ? 'Clipping…' : job.state === 'done' ? 'Clip again' : 'Retry clip';

  status.hidden = false;
  status.className = `clip-status is-${job.state}`;

  // textContent, not innerHTML: a failure message is yt-dlp's words about a
  // Twitch page, and those are not ours to trust with markup.
  status.textContent = '';
  const say = (text, tag = 'span') => {
    const el = document.createElement(tag);
    el.textContent = text;
    status.append(el);
  };

  if (job.state === 'done') {
    say('Saved ');
    say(job.path, 'code');
    if (job.verticalPath) {
      say(' · 9:16 ');
      say(job.verticalPath, 'code');
    }
    return;
  }
  if (job.state === 'failed') {
    say(`Clip failed: ${job.message}`);
    return;
  }

  const percent = job.state === 'running' && job.progress ? ` ${job.progress}%` : '';
  say(`${job.state}${percent} — ${job.message || 'working'}`);
}

async function startClip(moment) {
  clipJobs.set(moment.id, { state: 'queued', progress: 0, message: 'queued' });
  paintClip(moment.id);

  try {
    const res = await fetch('/api/clip', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        vodId: moment.vodId,
        // Cut around where people reacted, not where the first clip began.
        offsetSeconds: moment.reactionOffsetSeconds ?? moment.offsetSeconds,
        broadcaster: moment.broadcaster,
        momentId: moment.id,
        vertical: els.vertical.checked,
      }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || `server returned ${res.status}`);
    clipJobs.set(moment.id, body.job);
  } catch (err) {
    clipJobs.set(moment.id, { state: 'failed', message: err.message });
  }

  paintClip(moment.id);
  watchJobs();
}

/** One ticker for every in-flight job, stopped as soon as none are left. */
function watchJobs() {
  if (jobTimer) return;
  jobTimer = setInterval(async () => {
    const active = [...clipJobs].filter(
      ([, job]) => job.id && (job.state === 'queued' || job.state === 'running'),
    );
    if (!active.length) {
      clearInterval(jobTimer);
      jobTimer = null;
      return;
    }
    for (const [momentId, job] of active) {
      try {
        const res = await fetch(`/api/clip/${job.id}`);
        if (!res.ok) continue;
        const body = await res.json();
        clipJobs.set(momentId, body.job);
      } catch {
        // A dropped poll is not a failed job; the next tick will catch up.
      }
      paintClip(momentId);
    }
  }, JOB_POLL_MS);
}

function render() {
  if (!latest) return;
  const { moments, meta, game } = latest;

  // Set before anything draws: the mode changes the wording on every card.
  chatOnly = Boolean(meta.chatOnly);
  els.mode.hidden = !chatOnly;
  if (chatOnly) {
    els.mode.innerHTML =
      '<b>Chat-only.</b> No Twitch credentials, so moments come from chat alone — ' +
      'found before anybody clips them, which is the point. What is missing is ' +
      'saturation: with no API there is no way to count who already has a moment. ' +
      'Add <code>TWITCH_CLIENT_ID</code> and <code>TWITCH_CLIENT_SECRET</code> to ' +
      '<code>.env</code> and restart for the full feed.';
  }

  renderStats(meta, game);

  if (meta.lastError) {
    // The message is built from fixed strings and a status code today, so
    // there is no known way to get markup into it. "Today" is the whole
    // problem: it is the one error string on this page that comes back from
    // the network, and escaping it costs a line.
    notice(
      'Last poll failed',
      `<p>${escapeHtml(meta.lastError.message)}</p><p>Showing the most recent good data. Retrying every ${Number(meta.pollSeconds)}s.</p>`,
      true,
    );
    return;
  }

  const shown = moments
    .filter((m) => filter === 'all' || m.state === filter)
    .sort(SORTERS[sort]);

  if (!shown.length) {
    const why = moments.length
      ? 'Nothing in this filter right now.'
      : chatOnly
        ? 'No chat spikes yet. The baseline is a rolling median and needs about a minute to settle; after that, moments appear as chat reacts. A quiet watch list stays empty, which is correct.'
        : `No clips in the last ${meta.windowMinutes} minutes. Either the category is quiet, or the game has not launched yet.`;
    notice('Empty feed', `<p>${why}</p>`);
    return;
  }

  const frag = document.createDocumentFragment();
  cards.clear();
  for (const moment of shown.slice(0, 150)) frag.append(buildCard(moment));
  els.feed.innerHTML = '';
  els.feed.append(frag);
}

async function poll() {
  try {
    // Pass the page's own query through, so /?demo=1 reaches the API.
    const res = await fetch(`/api/feed${location.search}`);
    if (res.status === 503) {
      const body = await res.json();
      els.game.textContent = 'not configured';
      els.stats.innerHTML = '';
      els.mode.hidden = true;
      // Two ways out of this state, and the cheap one needs no account at all.
      notice(
        'Nothing to watch',
        `<p>${body.message}</p>
         <p><b>Chat-only, no account needed:</b> put
            <code>WATCH_CHANNELS=name,name</code> in <code>.env</code> and restart.
            Moments come from chat, found before anybody clips them. Saturation
            will be unavailable.</p>
         <p><b>Full feed:</b></p>
         <ol>
           <li>Register an app at <code>dev.twitch.tv/console/apps</code></li>
           <li><code>cp .env.example .env</code></li>
           <li>Paste the Client ID and Client Secret into <code>.env</code></li>
           <li>Restart with <code>npm start</code></li>
         </ol>`,
        true,
      );
      return;
    }
    if (!res.ok) throw new Error(`feed returned ${res.status}`);
    latest = await res.json();
    render();
  } catch (err) {
    notice('Cannot reach the server', `<p>${err.message}</p><p>Is <code>npm start</code> still running?</p>`, true);
  }
}

els.filters.addEventListener('click', (event) => {
  const button = event.target.closest('.chip');
  if (!button) return;
  filter = button.dataset.filter;
  for (const chip of els.filters.children) chip.classList.toggle('is-on', chip === button);
  render();
});

els.sort.addEventListener('change', () => {
  sort = els.sort.value;
  render();
});

poll();
setInterval(poll, REFRESH_MS);

// ---------- channel automation ----------
//
// Add a channel, switch it on, and finished shorts appear here. The panel is
// a view of /api/automation; the server does the work whether or not this page
// is open.

const AUTO_REFRESH_MS = 5000;

const auto = {
  root: document.getElementById('auto'),
  enabled: document.getElementById('auto-enabled'),
  enabledLabel: document.getElementById('auto-enabled-label'),
  channels: document.getElementById('auto-channels'),
  form: document.getElementById('auto-add'),
  input: document.getElementById('auto-add-input'),
  error: document.getElementById('auto-error'),
  status: document.getElementById('auto-status'),
  shorts: document.getElementById('shorts'),
  template: document.getElementById('short-template'),
  games: document.getElementById('auto-games'),
  gameForm: document.getElementById('game-add'),
  gameInput: document.getElementById('game-add-input'),
  music: document.getElementById('auto-music'),
  musicNote: document.getElementById('auto-music-note'),
  scopeWrap: document.getElementById('auto-scope-wrap'),
  scope: document.getElementById('auto-scope'),
};

// ---------- posting ----------
//
// One click per platform: that platform's version of the text goes on the
// clipboard, its upload page opens, and the folder opens with the file
// selected, ready to drag in. You press post. Nothing is uploaded for you —
// doing that needs each platform's own developer app (see the README).

const joinLines = (lines) =>
  lines
    .filter((line) => line !== null && line !== undefined)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

// Shorts made since the per-platform copy existed carry each platform's text
// ready-made (p.platforms); older ones are assembled from their pieces.
const PLATFORMS = {
  tiktok: {
    // tiktok.com/upload now bounces to the home page; Studio's upload holds.
    url: 'https://www.tiktok.com/tiktokstudio/upload',
    text: (p) => p.platforms?.tiktok || joinLines([p.caption, '', p.credit, '', p.tags]),
    hint: 'Caption copied and TikTok upload opened. Drag the selected file in, paste, post.',
  },
  youtube: {
    url: 'https://www.youtube.com/upload',
    // First line is the title (YouTube allows 100 characters), the rest the
    // description. #Shorts in the title is what files a vertical video there.
    text: (p) =>
      p.platforms?.youtube ||
      joinLines([
        `${p.caption} #Shorts`.slice(0, 100),
        '',
        p.credit,
        p.link ? `Full stream: ${p.link}` : null,
        '',
        `${p.tags} #shorts`,
      ]),
    hint: 'Copied and YouTube upload opened. The first line is the title, the rest the description.',
  },
  instagram: {
    // The home page on purpose. instagram.com/create/... looks like the upload
    // page but Instagram routes it as a USERNAME: it opens a stranger's
    // profile (@create). There is no direct upload URL; click Create.
    url: 'https://www.instagram.com/',
    text: (p) => p.platforms?.instagram || joinLines([p.caption, '', p.credit, '', p.tags]),
    hint: 'Caption copied and Instagram opened. Click Create, pick the selected file, paste.',
  },
};

// Which platforms each short has been opened for, so the ticks survive a
// reload. Per browser, and nothing breaks if storage is unavailable.
function postedFor(file) {
  try {
    return new Set(JSON.parse(localStorage.getItem(`posted:${file}`) || '[]'));
  } catch {
    return new Set();
  }
}

function markPosted(file, platform) {
  const done = postedFor(file);
  done.add(platform);
  try {
    localStorage.setItem(`posted:${file}`, JSON.stringify([...done]));
  } catch {
    /* private window: the tick just will not survive a reload */
  }
}

async function postTo(platform, item, node) {
  const target = PLATFORMS[platform];
  const hint = node.querySelector('.short-hint');
  const parts = item.post || { caption: item.postText || item.caption || '', credit: '', link: '', tags: '' };
  const text = item.post ? target.text(parts) : item.postText || item.caption || '';

  // Copy while this page still has focus: opening a tab takes it away, and
  // the clipboard refuses a page that is not focused.
  let copied = true;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    copied = false;
  }
  window.open(target.url, '_blank', 'noopener');
  fetch(`/api/shorts/${encodeURIComponent(item.file)}/reveal`, { method: 'POST' }).catch(() => {});

  markPosted(item.file, platform);
  const button = node.querySelector(`.post-btn[data-platform="${platform}"]`);
  button.classList.add('is-done');
  hint.textContent = copied ? target.hint : `${target.hint.split('.')[0]}. Copying failed, so use Copy post text.`;
  hint.hidden = false;
}

// Kept between refreshes and rebuilt only when that short changed, or a video
// someone is watching would restart every five seconds.
const shortCards = new Map();

const CHANNEL_STATES = {
  recording: 'Recording: its moments can be cut',
  'recording live': 'Recording the live stream: it has no VOD, so its moments are cut from the recording',
  'not recording': 'Not recording: its moments can be watched, not cut',
  listening: 'Listening for a moment',
  live: 'Live in the category',
  'not live in category': 'Not live in the category',
};

function showAutoError(message) {
  auto.error.textContent = message || '';
  auto.error.hidden = !message;
}

async function changeAutomation(change) {
  showAutoError('');
  try {
    const res = await fetch('/api/automation', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(change),
    });
    const body = await res.json();
    if (!res.ok) {
      showAutoError(body.message || `automation returned ${res.status}`);
      return false;
    }
    renderAutomation(body);
    return true;
  } catch (err) {
    showAutoError(err.message);
    return false;
  }
}

// A channel that is not live in the category is not a problem, it is just not
// the task. Twenty-seven of them wrapped into four rows of chips and pushed
// the work itself off the screen, so the quiet ones fold behind a count.
const DORMANT = new Set(['not live in category', 'not recording']);

let showQuietChannels = false;

function channelChip({ login, state }) {
  const chip = document.createElement('span');
  chip.className = `channel is-${state.replaceAll(' ', '-')}`;
  chip.title = CHANNEL_STATES[state] || state;
  const dot = document.createElement('i');
  const name = document.createElement('span');
  name.textContent = login;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = '×';
  remove.title = `Stop automating ${login}`;
  remove.setAttribute('aria-label', `Stop automating ${login}`);
  remove.addEventListener('click', () => changeAutomation({ remove: login }));
  chip.append(dot, name, remove);
  return chip;
}

/**
 * One category in the watch list.
 *
 * The last one has no remove button rather than a remove button that fails:
 * an empty list would mean "every category on Twitch", and the server refuses
 * it, so the panel should not offer the click in the first place.
 */
function gameChip(name, only) {
  const chip = document.createElement('span');
  chip.className = 'game';
  const label = document.createElement('span');
  label.textContent = name;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = '\u00d7';
  if (only) {
    remove.disabled = true;
    remove.title = 'Keep at least one game';
    remove.setAttribute('aria-label', 'Keep at least one game');
  } else {
    remove.title = `Stop clipping ${name}`;
    remove.setAttribute('aria-label', `Stop clipping ${name}`);
    remove.addEventListener('click', () => changeAutomation({ removeGame: name }));
  }
  chip.append(label, remove);
  return chip;
}

function renderChannels(view) {
  const busy = view.channels.filter((c) => !DORMANT.has(c.state));
  const quiet = view.channels.filter((c) => DORMANT.has(c.state));
  const nodes = (showQuietChannels ? [...busy, ...quiet] : busy).map(channelChip);

  if (quiet.length) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'channel-more';
    more.setAttribute('aria-expanded', String(showQuietChannels));
    more.textContent = showQuietChannels ? `Hide ${quiet.length} quiet` : `+${quiet.length} quiet`;
    more.title = showQuietChannels
      ? 'Hide the channels that are not live in the category'
      : 'Channels that are not live in the category right now. They are still automated.';
    more.addEventListener('click', () => {
      showQuietChannels = !showQuietChannels;
      renderChannels(view);
    });
    nodes.push(more);
  }

  auto.channels.replaceChildren(...nodes);
}

function statusLine(view) {
  const s = view.status;
  const working = Math.max(0, s.queued - s.done - s.failed);
  if (!view.channels.length) return 'Add a channel to start.';
  if (!view.enabled) return 'Switched off. Nothing will be cut until it is on.';
  const parts = [`${s.done} ready`];
  if (working) parts.push(`${working} rendering`);
  if (s.failed) parts.push(`${s.failed} failed`);
  parts.push(`${s.lastHour} of ${s.perHour} this hour`);
  const live = view.recordings?.filter((r) => r.state === 'recording').length || 0;
  if (live) parts.push(`recording ${live} live`);
  const note =
    view.mode === 'chat-only' ? ' · chat-only: a channel has to be recording to be cut' : '';
  return `On · ${parts.join(' · ')}${note}`;
}

const shortKey = (item) => [item.momentId, item.status, item.file, item.score].join('|');

// The engagement meter, as a bar and a line. Shorts made before the meter
// existed have no score and show none.
function paintMeter(node, item) {
  const meter = node.querySelector('.short-meter');
  if (!Number.isFinite(item.score)) return;
  meter.hidden = false;
  meter.querySelector('.meter-fill').style.width = `${Math.max(3, Math.min(100, item.score))}%`;
  const bits = [`Engagement ${item.score}`];
  if (Number.isFinite(item.funny)) bits.push(`funny ${item.funny}`);
  if (item.redone) bits.push(`re-cut from ${item.before ?? 'a weaker cut'}`);
  if (item.weak) bits.push('weak: not worth posting');
  meter.querySelector('.meter-text').textContent = bits.join(' · ');
  meter.title = item.reasons?.length ? item.reasons.join('; ') : '';
  node.classList.toggle('is-weak', Boolean(item.weak));
  node.classList.toggle('is-strong', item.score >= 65);
}

function hoursLeft(at) {
  const minutes = Math.max(0, Math.round((at - Date.now()) / 60_000));
  return minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes}m`;
}

// Who, when, and whether it stays: repainted on every refresh so the
// countdown to deletion does not go stale on a reused card.
function paintMeta(node, item) {
  const when = new Date(item.finishedAt || item.createdAt);
  const life = item.kept
    ? ' · kept'
    : item.expiresAt
      ? ` · deleted in ${hoursLeft(item.expiresAt)} unless downloaded`
      : '';
  node.querySelector('.short-meta').textContent =
    `@${item.broadcaster} · ${when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${life}`;
}

function buildShort(item) {
  const node = auto.template.content.firstElementChild.cloneNode(true);
  const frame = node.querySelector('.short-frame');
  const copy = node.querySelector('.short-copy');
  const download = node.querySelector('.short-download');

  node.querySelector('.short-caption').textContent = item.caption || '(no caption)';
  paintMeter(node, item);
  paintMeta(node, item);

  if (item.file) {
    const src = `/shorts/${encodeURIComponent(item.file)}`;
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    frame.append(video);
    download.href = `${src}?download=1`;
    // Kept from now on: say so without waiting for the next refresh.
    download.addEventListener('click', () => paintMeta(node, { ...item, kept: true }));
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'short-placeholder';
    placeholder.textContent =
      item.status === 'queued'
        ? 'Cutting…'
        : item.status === 'failed'
          ? `Failed: ${item.error || 'unknown error'}`
          : item.status === 'interrupted'
            ? 'Interrupted by a restart'
            : item.status === 'rejected'
              ? `Rejected, moved to clips/rejected/: ${item.error || 'failed its checks'}`
              : 'File moved or deleted';
    frame.append(placeholder);
    node.classList.add(`is-${item.status}`);
    download.remove();
  }

  const post = node.querySelector('.short-post');
  if (item.file) {
    const done = postedFor(item.file);
    for (const button of post.querySelectorAll('.post-btn')) {
      if (done.has(button.dataset.platform)) button.classList.add('is-done');
      button.addEventListener('click', () => postTo(button.dataset.platform, item, node));
    }
  } else {
    post.remove();
  }

  if (item.postText) {
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(item.postText);
        copy.textContent = 'Copied';
      } catch {
        copy.textContent = 'Copy failed';
      }
      setTimeout(() => {
        copy.textContent = 'Copy post text';
      }, 1500);
    });
  } else {
    copy.remove();
  }
  return node;
}

function renderShorts(items) {
  const wanted = items.map((item) => {
    const key = shortKey(item);
    const reused = shortCards.get(key);
    if (reused) paintMeta(reused, item);
    return { key, node: reused || buildShort(item) };
  });
  shortCards.clear();
  for (const { key, node } of wanted) shortCards.set(key, node);

  // Moving a playing <video> pauses it, so nodes are only ever added, removed
  // or replaced in place — never re-inserted.
  const keep = new Set(wanted.map(({ node }) => node));
  for (const node of [...auto.shorts.children]) if (!keep.has(node)) node.remove();
  wanted.forEach(({ node }, i) => {
    const at = auto.shorts.children[i];
    if (at !== node) auto.shorts.insertBefore(node, at || null);
  });
}

function renderAutomation(view) {
  auto.root.hidden = false;
  auto.root.classList.toggle('is-on', view.enabled);
  auto.enabled.checked = view.enabled;
  auto.enabledLabel.textContent = view.enabled ? 'On' : 'Off';

  const games = view.games || [];
  auto.games.replaceChildren(...games.map((name) => gameChip(name, games.length === 1)));
  auto.music.checked = Boolean(view.music);
  auto.musicNote.textContent = !view.music
    ? ''
    : view.musicTracks
      ? `${view.musicTracks} track${view.musicTracks === 1 ? '' : 's'} in ${view.musicDir}/`
      : `no tracks yet: add royalty-free audio to ${view.musicDir}/`;
  // Only meaningful with credentials: chat-only can only hear the list.
  auto.scopeWrap.hidden = view.mode !== 'full';
  if (view.scope) auto.scope.value = view.scope;
  renderChannels(view);
  // A collector that cannot cut anything says so, instead of looking healthy.
  const health = view.health?.level !== 'ok' && view.health?.message ? ` · ${view.health.message}` : '';
  auto.status.textContent = statusLine(view) + health;
  auto.status.classList.toggle('is-warn', view.health?.level === 'warn');
  auto.status.classList.toggle('is-error', view.health?.level === 'error');
  renderShorts(view.shorts);
}

async function pollAutomation() {
  try {
    const res = await fetch('/api/automation');
    // An older server with no automation: the panel just stays hidden.
    if (!res.ok) return;
    renderAutomation(await res.json());
  } catch {
    /* the feed poll already reports an unreachable server */
  }
}

auto.enabled.addEventListener('change', async () => {
  const wanted = auto.enabled.checked;
  if (!(await changeAutomation({ enabled: wanted }))) auto.enabled.checked = !wanted;
});

auto.music.addEventListener('change', async () => {
  const wanted = auto.music.checked;
  if (!(await changeAutomation({ music: wanted }))) auto.music.checked = !wanted;
});

auto.scope.addEventListener('change', () => changeAutomation({ scope: auto.scope.value }));

auto.gameForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = auto.gameInput.value.trim();
  if (!value) return;
  if (await changeAutomation({ addGame: value })) auto.gameInput.value = '';
});

auto.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = auto.input.value.trim();
  if (!value) return;
  if (await changeAutomation({ add: value })) auto.input.value = '';
});

// --- auto upload ---------------------------------------------------------------

// What the server last refused for each card, kept until that card's next
// change is accepted. The panel re-renders from the server's view every five
// seconds, and the view knows nothing about a number it rejected - so without
// this the reason appeared and then vanished on its own. See renderPlatform.
const REFUSED = {};

const up = {
  box: document.getElementById('uploads'),
  youtube: platformEls('yt', 'youtube'),
  tiktok: platformEls('tt', 'tiktok'),
  instagram: platformEls('ig', 'instagram'),
};

function platformEls(prefix, name) {
  const pill = document.getElementById(`${prefix}-pill`);
  return {
    card: document.getElementById(`up-${name}`),
    pill,
    pillText: pill.querySelector('.up-pill-text'),
    account: document.getElementById(`${prefix}-account`),
    connect: document.getElementById(`${prefix}-connect`),
    mode: document.getElementById(`${prefix}-mode`),
    perDay: document.getElementById(`${prefix}-perday`),
    spacing: document.getElementById(`${prefix}-spacing`),
    stats: document.getElementById(`${prefix}-stats`),
    status: document.getElementById(`${prefix}-status`),
    next: document.getElementById(`${prefix}-next`),
  };
}

const clock = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const count = (n) => (Number(n) || 0).toLocaleString();

// "every ${Math.round(minutes / 60)}h" read as "every 0h" at twenty minutes
// apart and "every 1h" at thirty-four. Say minutes while they are minutes.
const spacingLabel = (minutes) => {
  const m = Math.round(Number(minutes) || 0);
  if (m < 90) return `${m} min`;
  const hours = m / 60;
  return `${hours % 1 ? hours.toFixed(1) : hours} h`;
};

// The server names the reason in its own terms, and those terms do not survive
// being dropped into a sentence: 'Waiting on today's 1 are done.' An unknown
// reason still gets through verbatim rather than being swallowed.
const waitingNote = (why) => {
  if (why === 'spacing') return 'Waiting for the gap between posts to pass.';
  if (/are done$/.test(why)) return "Today's allowance is used up.";
  return `Waiting on ${why}.`;
};

/** A grid of labelled numbers, built as nodes because the values are not ours. */
function statGrid(target, cells) {
  const out = [];
  for (const [label, value, mod] of cells) {
    const cell = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    if (mod) dd.className = mod;
    cell.append(dt, dd);
    out.push(cell);
  }
  target.replaceChildren(...out);
}

function renderPlatform(name, state) {
  const els = up[name];
  if (!els || !state?.built) return;

  // Three states, said in a colour and a shape before they are said in a word:
  // live, signed out, never set up.
  const where = !state.keys ? 'missing' : state.connected ? 'on' : 'off';
  els.pill.className = `up-pill is-${where}`;
  els.pillText.textContent = where === 'on' ? 'Connected' : where === 'off' ? 'Not connected' : 'No keys yet';
  els.card.classList.toggle('is-missing', where === 'missing');

  els.connect.textContent = where === 'on' ? 'Reconnect' : where === 'off' ? 'Connect' : 'Needs keys in .env';
  els.connect.toggleAttribute('aria-disabled', !state.keys);

  if (document.activeElement !== els.mode) els.mode.value = state.mode;
  els.mode.querySelector('[value="on"]').disabled = !state.connected;

  // Never while a box is being typed in. The panel polls every few seconds,
  // and a poll landing mid-edit would swap the half-typed number for the
  // stored one under the cursor.
  if (document.activeElement !== els.perDay) els.perDay.value = state.perDay ?? '';
  if (document.activeElement !== els.spacing) els.spacing.value = state.spacingMinutes ?? '';
  if (state.maxPerDay) {
    // The server refuses anything past this anyway; saying so on the control
    // means not having to be refused to find out.
    els.perDay.max = state.maxPerDay;
    els.perDay.title = `Up to ${state.maxPerDay} a day — ${state.capWhy}. Empty the box to go back to what .env says.`;
  }
  if (state.spacingRange) {
    els.spacing.min = state.spacingRange.min;
    els.spacing.max = state.spacingRange.max;
  }
  els.spacing.title = 'The gap between uploads. Empty the box to go back to what .env says.';

  // The select above already says what the mode is, so the grid holds only
  // numbers: what today allows, when the next one goes, and the record. The
  // lifetime count is the one figure that separates a first bad day from a
  // long bad run, and the panel had no way to show it.
  const cells = [];
  if (state.mode !== 'off') {
    cells.push(['Today', `${state.today}/${state.perDay}`]);
    if (state.nextAt) cells.push(['Next', clock(state.nextAt)]);
    cells.push(['Every', spacingLabel(state.spacingMinutes)]);
  }
  const life = state.lifetime || { done: 0, failed: 0 };
  cells.push(['Posted', count(life.done)]);
  if (life.failed) cells.push(['Failed', count(life.failed), 'is-bad']);
  statGrid(els.stats, cells);

  const notes = [];
  if (state.mode === 'off') {
    notes.push('Nothing is uploaded while this is off.');
  } else {
    if (state.waitingFor) notes.push(waitingNote(state.waitingFor));
    if (state.mode === 'on' && state.draftsOnly) notes.push('Each one arrives as a draft — open TikTok to post it.');
    if (state.mode === 'on' && !state.draftsOnly && state.privacy && state.privacy !== 'private') {
      notes.push('Google keeps uploads private until its audit passes.');
    }
  }
  // A setting that contradicts itself, not a status, so it is said whether or
  // not uploading is on: five a day six hours apart is four a day, and the
  // panel used to show 5 with nothing accounting for the fifth.
  if (state.fitsPerDay < state.perDay) {
    notes.push(`${state.spacingMinutes} minutes apart only fits ${state.fitsPerDay} a day, so ${state.fitsPerDay} is the real cap.`);
  }
  if (state.lastError) notes.push(`Last error: ${state.lastError}`);
  // A refusal has to outlive the next poll. Without it the box went quietly
  // back to the stored number with nothing left on the page saying why, which
  // reads as the change being taken and then undone.
  const refused = REFUSED[name];
  if (refused) notes.push(refused);
  els.status.textContent = notes.join(' ');
  els.status.classList.toggle('is-error', Boolean(state.lastError || refused));

  const posted = state.recent.map((r) => `${r.status === 'dry-run' ? 'would post' : r.status}: ${r.title || r.file}`);
  const queued = state.next.map((c) => `next (${c.score}): ${c.title}`);
  els.next.replaceChildren(
    ...[...queued.slice(0, 2), ...posted.slice(0, 3)].map((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      li.title = text;
      return li;
    }),
  );
}

// Named apart from the PLATFORMS above, which maps the manual-post links.
const UPLOAD_PLATFORMS = ['youtube', 'tiktok', 'instagram'];

function renderUploads(view) {
  up.box.hidden = false;
  for (const name of UPLOAD_PLATFORMS) renderPlatform(name, view[name]);
}

async function pollUploads(change) {
  try {
    const res = await fetch('/api/uploads', change ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(change) } : {});
    const body = await res.json();
    if (!res.ok) {
      // Shown against the switch that was just moved, not the other one's.
      const els = up[change?.platform] || up.youtube;
      const message = body.message || `upload settings returned ${res.status}`;
      if (change?.platform) REFUSED[change.platform] = message;
      els.status.textContent = message;
      els.status.classList.add('is-error');
      return;
    }
    // Accepted, so whatever was refused before it no longer needs saying.
    if (change?.platform) delete REFUSED[change.platform];
    renderUploads(body);
  } catch {
    /* the server is restarting; the next poll catches up */
  }
}

for (const platform of UPLOAD_PLATFORMS) {
  up[platform].mode.addEventListener('change', () => pollUploads({ platform, mode: up[platform].mode.value }));
  // 'change', not 'input': one request when the number is settled, rather than
  // one per keystroke - each of which would also be a write to disk, and would
  // see 1 on the way to typing 15.
  up[platform].perDay.addEventListener('change', () => pollUploads({ platform, perDay: up[platform].perDay.value }));
  up[platform].spacing.addEventListener('change', () =>
    pollUploads({ platform, spacingMinutes: up[platform].spacing.value }),
  );
}

// --- the accounts themselves ---------------------------------------------
//
// /api/uploads says what this tool is doing. This says what the account looks
// like from the platform's own side, which is a different question and the
// one an owner asks when a card says "Connected" and they want to know what
// that connection is worth.
//
// Only YouTube answers with numbers. TikTok hands back the handle it stored
// at sign-in and nothing else, and Instagram is not connected at all — so
// each card prints what its platform actually tells us and stays quiet
// otherwise, rather than showing a zero that reads as a failure.
//
// Polled far slower than the panel above it: the server keeps this behind a
// refresh floor so an open page cannot spend the uploader's quota, and a
// subscriber count does not move in five seconds.
const STATS_REFRESH_MS = 120_000;

function renderAccount(name, state) {
  const els = up[name];
  if (!els) return;
  // TikTok stores the account as a name, YouTube as a channel object.
  const channel = typeof state?.channel === 'string' ? { title: state.channel } : state?.channel;
  const parts = [];
  if (channel?.title) parts.push(channel.title);

  const subs = Number(channel?.subscribers ?? channel?.followers);
  if (!channel?.subscribersHidden && Number.isFinite(subs)) {
    const noun = name === 'youtube' ? 'subscriber' : 'follower';
    parts.push(`${count(subs)} ${noun}${subs === 1 ? '' : 's'}`);
  }
  const views = Number(channel?.views);
  if (Number.isFinite(views)) parts.push(`${count(views)} views`);

  els.account.textContent = parts.join(' · ');
  els.account.hidden = parts.length === 0;
}

async function pollStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return;
    const body = await res.json();
    for (const name of UPLOAD_PLATFORMS) renderAccount(name, body[name]);
  } catch {
    /* the account line is an extra: the panel above it stands without it */
  }
}

// ?demo=1 renders a fixture feed, and automation would act on the real one.
if (!new URLSearchParams(location.search).has('demo')) {
  pollAutomation();
  setInterval(pollAutomation, AUTO_REFRESH_MS);
  pollUploads();
  setInterval(pollUploads, AUTO_REFRESH_MS);
  pollStats();
  setInterval(pollStats, STATS_REFRESH_MS);
}
