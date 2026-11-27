// No server. The dashboard above this line is the real one, byte for byte;
// this stands in for the machine it normally talks to.
//
// It has to run before the page's modules, which is why it is a classic script
// in the head rather than an import: app.js fetches as soon as it loads, and a
// module would be deferred until after that.
(() => {
  'use strict';

  const FEED = {"game":{"id":"0","name":"Grand Theft Auto VI (demo data)"},"moments":[{"id":"chat:wavebreak:1795754176","broadcasterId":"3","broadcaster":"wavebreak","basis":"chat","source":"chat","vodId":"v3demo","offsetSeconds":7170,"reactionOffsetSeconds":7170,"game":null,"offsetEstimated":true,"saturation":0,"uniqueClippers":0,"firstClipper":null,"firstClipAt":"2026-11-27T04:36:25.889Z","lastClipAt":"2026-11-27T04:36:25.889Z","spanMinutes":0.17,"clipViews":0,"title":"first heist goes wrong","thumbnail":null,"exampleClipUrl":null,"unconfirmed":true,"shared":false,"reaction":11.4,"ageMinutes":0.5,"minutesSinceLastClip":0.5,"clipsPerMinute":0,"newClips":0,"chat":{"z":4.2,"reaction":11.4,"shared":false,"messagesPerSecond":58.1,"baseline":19,"chatters":240,"chattersZ":3.8,"copypasta":0.44,"spiking":true,"classes":{"clipit":{"count":9,"z":4},"funny":{"count":31,"z":4},"hype":{"count":0,"z":0},"tension":{"count":0,"z":0},"shock":{"count":0,"z":0}}},"chatZ":4.2,"viewers":96000,"streamTitle":"first heist goes wrong","state":"early","deepLink":null,"opportunity":8.2011},{"id":"chat:hotel_cortez:1795754086","broadcasterId":"5","broadcaster":"hotel_cortez","basis":"chat","source":"chat","vodId":"v5demo","offsetSeconds":7080,"reactionOffsetSeconds":7080,"game":null,"offsetEstimated":true,"saturation":0,"uniqueClippers":0,"firstClipper":null,"firstClipAt":"2026-11-27T04:34:55.889Z","lastClipAt":"2026-11-27T04:34:55.889Z","spanMinutes":0.17,"clipViews":0,"title":"cop chase across the causeway","thumbnail":null,"exampleClipUrl":null,"unconfirmed":true,"shared":false,"reaction":7.2,"ageMinutes":2,"minutesSinceLastClip":2,"clipsPerMinute":0,"newClips":0,"chat":{"z":4.2,"reaction":7.2,"shared":false,"messagesPerSecond":58.1,"baseline":19,"chatters":240,"chattersZ":3.8,"copypasta":0.44,"spiking":true,"classes":{"clipit":{"count":0,"z":0},"funny":{"count":0,"z":0},"hype":{"count":26,"z":4},"tension":{"count":0,"z":0},"shock":{"count":11,"z":4}}},"chatZ":4.2,"viewers":28000,"streamTitle":"cop chase across the causeway","state":"early","deepLink":null,"opportunity":4.571},{"id":"6:vod:8740","broadcasterId":"6","broadcaster":"grainysaint","basis":"vod","source":"both","vodId":"v62","gameId":null,"offsetSeconds":8740,"reactionOffsetSeconds":8770,"saturation":3,"uniqueClippers":3,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:32:20.191Z","lastClipAt":"2026-11-27T04:32:28.191Z","spanMinutes":0.13,"clipViews":130,"title":"the alligator got him","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":true,"reaction":4.55,"ageMinutes":4.6,"minutesSinceLastClip":4.5,"clipsPerMinute":4,"newClips":0,"chat":{"z":4.2,"reaction":9.1,"shared":true,"messagesPerSecond":58.1,"baseline":19,"chatters":240,"chattersZ":3.8,"copypasta":0.44,"spiking":true,"classes":{"clipit":{"count":0,"z":0},"funny":{"count":0,"z":0},"hype":{"count":40,"z":4},"tension":{"count":0,"z":0},"shock":{"count":0,"z":0}}},"chatZ":4.2,"viewers":14000,"streamTitle":"the alligator got him","state":"warm","deepLink":null,"opportunity":1.5383},{"id":"2:vod:1235","broadcasterId":"2","broadcaster":"vicebeam","basis":"vod","source":"clips","vodId":"v21","gameId":null,"offsetSeconds":1235,"reactionOffsetSeconds":1265,"saturation":1,"uniqueClippers":1,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:23:53.358Z","lastClipAt":"2026-11-27T04:23:53.358Z","spanMinutes":0,"clipViews":47,"title":"physics bug launches the car","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":6.4,"ageMinutes":13,"minutesSinceLastClip":13,"clipsPerMinute":1.33,"newClips":0,"chat":{"z":6.4,"messagesPerSecond":71.2,"baseline":22,"spiking":true},"chatZ":6.4,"viewers":212000,"streamTitle":"physics bug launches the car","state":"fresh","deepLink":null,"opportunity":1.463},{"id":"2:vod:3726","broadcasterId":"2","broadcaster":"vicebeam","basis":"vod","source":"clips","vodId":"v22","gameId":null,"offsetSeconds":3726,"reactionOffsetSeconds":3756,"saturation":3,"uniqueClippers":3,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:25:27.463Z","lastClipAt":"2026-11-27T04:25:35.463Z","spanMinutes":0.13,"clipViews":982,"title":"meeting Lucia for the first time","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":6.4,"ageMinutes":11.5,"minutesSinceLastClip":11.3,"clipsPerMinute":4,"newClips":0,"chat":{"z":6.4,"messagesPerSecond":71.2,"baseline":22,"spiking":true},"chatZ":6.4,"viewers":212000,"streamTitle":"meeting Lucia for the first time","state":"warm","deepLink":null,"opportunity":1.0736},{"id":"2:vod:4582","broadcasterId":"2","broadcaster":"vicebeam","basis":"vod","source":"clips","vodId":"v20","gameId":null,"offsetSeconds":4582,"reactionOffsetSeconds":4612,"saturation":2,"uniqueClippers":2,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:19:27.942Z","lastClipAt":"2026-11-27T04:19:31.942Z","spanMinutes":0.07,"clipViews":412,"title":"beach shootout","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":6.4,"ageMinutes":17.5,"minutesSinceLastClip":17.4,"clipsPerMinute":2.67,"newClips":0,"chat":{"z":6.4,"messagesPerSecond":71.2,"baseline":22,"spiking":true},"chatZ":6.4,"viewers":212000,"streamTitle":"beach shootout","state":"fresh","deepLink":null,"opportunity":0.7854},{"id":"4:vod:1264","broadcasterId":"4","broadcaster":"moth_kid","basis":"vod","source":"clips","vodId":"v41","gameId":null,"offsetSeconds":1264,"reactionOffsetSeconds":1294,"saturation":4,"uniqueClippers":4,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:22:25.941Z","lastClipAt":"2026-11-27T04:22:37.941Z","spanMinutes":0.2,"clipViews":1350,"title":"stole a plane, immediately crashed it","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":4.8,"ageMinutes":14.5,"minutesSinceLastClip":14.3,"clipsPerMinute":5.33,"newClips":0,"chat":{"z":4.8,"messagesPerSecond":33.5,"baseline":12,"spiking":true},"chatZ":4.8,"viewers":71000,"streamTitle":"stole a plane, immediately crashed it","state":"warm","deepLink":null,"opportunity":0.6059},{"id":"1:vod:2010","broadcasterId":"1","broadcaster":"low_tide_tv","basis":"vod","source":"clips","vodId":"v11","gameId":null,"offsetSeconds":2010,"reactionOffsetSeconds":2040,"saturation":3,"uniqueClippers":3,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:25:09.385Z","lastClipAt":"2026-11-27T04:25:17.385Z","spanMinutes":0.13,"clipViews":389,"title":"an NPC said something unhinged","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":2.1,"ageMinutes":11.8,"minutesSinceLastClip":11.6,"clipsPerMinute":4,"newClips":0,"chat":{"z":2.1,"messagesPerSecond":40.8,"baseline":31,"spiking":false},"chatZ":2.1,"viewers":184000,"streamTitle":"an NPC said something unhinged","state":"warm","deepLink":null,"opportunity":0.5789},{"id":"4:vod:8530","broadcasterId":"4","broadcaster":"moth_kid","basis":"vod","source":"clips","vodId":"v40","gameId":null,"offsetSeconds":8530,"reactionOffsetSeconds":8560,"saturation":2,"uniqueClippers":2,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:17:58.516Z","lastClipAt":"2026-11-27T04:18:02.516Z","spanMinutes":0.07,"clipViews":212,"title":"three stars and no plan","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":4.8,"ageMinutes":19,"minutesSinceLastClip":18.9,"clipsPerMinute":2.67,"newClips":0,"chat":{"z":4.8,"messagesPerSecond":33.5,"baseline":12,"spiking":true},"chatZ":4.8,"viewers":71000,"streamTitle":"three stars and no plan","state":"fresh","deepLink":null,"opportunity":0.5703},{"id":"1:vod:6562","broadcasterId":"1","broadcaster":"low_tide_tv","basis":"vod","source":"clips","vodId":"v10","gameId":null,"offsetSeconds":6562,"reactionOffsetSeconds":6592,"saturation":4,"uniqueClippers":4,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:26:05.255Z","lastClipAt":"2026-11-27T04:26:17.255Z","spanMinutes":0.2,"clipViews":649,"title":"drove into the ocean on purpose","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":2.1,"ageMinutes":10.8,"minutesSinceLastClip":10.6,"clipsPerMinute":5.33,"newClips":0,"chat":{"z":2.1,"messagesPerSecond":40.8,"baseline":31,"spiking":false},"chatZ":2.1,"viewers":184000,"streamTitle":"drove into the ocean on purpose","state":"warm","deepLink":null,"opportunity":0.5604},{"id":"3:vod:1768","broadcasterId":"3","broadcaster":"wavebreak","basis":"vod","source":"clips","vodId":"v30","gameId":null,"offsetSeconds":1768,"reactionOffsetSeconds":1798,"saturation":1,"uniqueClippers":1,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:29:25.410Z","lastClipAt":"2026-11-27T04:29:25.410Z","spanMinutes":0,"clipViews":108,"title":"first heist goes wrong","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":0,"ageMinutes":7.5,"minutesSinceLastClip":7.5,"clipsPerMinute":1.33,"newClips":0,"chat":null,"chatZ":0,"viewers":96000,"streamTitle":"first heist goes wrong","state":"fresh","deepLink":null,"opportunity":0.4858},{"id":"4:vod:8233","broadcasterId":"4","broadcaster":"moth_kid","basis":"vod","source":"clips","vodId":"v42","gameId":null,"offsetSeconds":8233,"reactionOffsetSeconds":8263,"saturation":5,"uniqueClippers":5,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:20:49.040Z","lastClipAt":"2026-11-27T04:21:05.040Z","spanMinutes":0.27,"clipViews":941,"title":"cop chase across the causeway","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":4.8,"ageMinutes":16.1,"minutesSinceLastClip":15.8,"clipsPerMinute":6.67,"newClips":0,"chat":{"z":4.8,"messagesPerSecond":33.5,"baseline":12,"spiking":true},"chatZ":4.8,"viewers":71000,"streamTitle":"cop chase across the causeway","state":"warm","deepLink":null,"opportunity":0.4723},{"id":"3:vod:3392","broadcasterId":"3","broadcaster":"wavebreak","basis":"vod","source":"clips","vodId":"v32","gameId":null,"offsetSeconds":3392,"reactionOffsetSeconds":3422,"saturation":5,"uniqueClippers":5,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:29:11.599Z","lastClipAt":"2026-11-27T04:29:27.599Z","spanMinutes":0.27,"clipViews":1438,"title":"the alligator got him","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":0,"ageMinutes":7.7,"minutesSinceLastClip":7.5,"clipsPerMinute":6.67,"newClips":0,"chat":null,"chatZ":0,"viewers":96000,"streamTitle":"the alligator got him","state":"warm","deepLink":null,"opportunity":0.4358},{"id":"6:vod:1822","broadcasterId":"6","broadcaster":"grainysaint","basis":"vod","source":"clips","vodId":"v61","gameId":null,"offsetSeconds":1822,"reactionOffsetSeconds":1852,"saturation":4,"uniqueClippers":4,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:27:46.541Z","lastClipAt":"2026-11-27T04:27:58.541Z","spanMinutes":0.2,"clipViews":675,"title":"physics bug launches the car","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":0,"ageMinutes":9.2,"minutesSinceLastClip":9,"clipsPerMinute":5.33,"newClips":0,"chat":null,"chatZ":0,"viewers":14000,"streamTitle":"physics bug launches the car","state":"warm","deepLink":null,"opportunity":0.4112},{"id":"5:vod:4467","broadcasterId":"5","broadcaster":"hotel_cortez","basis":"vod","source":"clips","vodId":"v50","gameId":null,"offsetSeconds":4467,"reactionOffsetSeconds":4497,"saturation":2,"uniqueClippers":2,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:26:13.988Z","lastClipAt":"2026-11-27T04:26:17.988Z","spanMinutes":0.07,"clipViews":702,"title":"meeting Lucia for the first time","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":0,"ageMinutes":10.7,"minutesSinceLastClip":10.6,"clipsPerMinute":2.67,"newClips":0,"chat":null,"chatZ":0,"viewers":28000,"streamTitle":"meeting Lucia for the first time","state":"fresh","deepLink":null,"opportunity":0.3986},{"id":"6:vod:4123","broadcasterId":"6","broadcaster":"grainysaint","basis":"vod","source":"clips","vodId":"v63","gameId":null,"offsetSeconds":4123,"reactionOffsetSeconds":4153,"saturation":4,"uniqueClippers":4,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:26:49.770Z","lastClipAt":"2026-11-27T04:27:01.770Z","spanMinutes":0.2,"clipViews":843,"title":"beach shootout","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":0,"ageMinutes":10.1,"minutesSinceLastClip":9.9,"clipsPerMinute":5.33,"newClips":0,"chat":null,"chatZ":0,"viewers":14000,"streamTitle":"beach shootout","state":"warm","deepLink":null,"opportunity":0.38},{"id":"6:vod:6568","broadcasterId":"6","broadcaster":"grainysaint","basis":"vod","source":"clips","vodId":"v60","gameId":null,"offsetSeconds":6568,"reactionOffsetSeconds":6598,"saturation":3,"uniqueClippers":3,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:21:58.888Z","lastClipAt":"2026-11-27T04:22:06.888Z","spanMinutes":0.13,"clipViews":505,"title":"stole a plane, immediately crashed it","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":0,"ageMinutes":15,"minutesSinceLastClip":14.8,"clipsPerMinute":4,"newClips":0,"chat":null,"chatZ":0,"viewers":14000,"streamTitle":"stole a plane, immediately crashed it","state":"warm","deepLink":null,"opportunity":0.2689},{"id":"3:vod:6026","broadcasterId":"3","broadcaster":"wavebreak","basis":"vod","source":"clips","vodId":"v31","gameId":null,"offsetSeconds":6026,"reactionOffsetSeconds":6056,"saturation":3,"uniqueClippers":3,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:20:06.378Z","lastClipAt":"2026-11-27T04:20:14.378Z","spanMinutes":0.13,"clipViews":903,"title":"an NPC said something unhinged","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":0,"ageMinutes":16.8,"minutesSinceLastClip":16.7,"clipsPerMinute":4,"newClips":0,"chat":null,"chatZ":0,"viewers":96000,"streamTitle":"an NPC said something unhinged","state":"warm","deepLink":null,"opportunity":0.23},{"id":"1:vod:4845","broadcasterId":"1","broadcaster":"low_tide_tv","basis":"vod","source":"clips","vodId":"v12","gameId":null,"offsetSeconds":4845,"reactionOffsetSeconds":4875,"saturation":14,"uniqueClippers":14,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:19:40.354Z","lastClipAt":"2026-11-27T04:20:32.354Z","spanMinutes":0.87,"clipViews":2511,"title":"three stars and no plan","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":2.1,"ageMinutes":17.3,"minutesSinceLastClip":16.4,"clipsPerMinute":16.09,"newClips":0,"chat":{"z":2.1,"messagesPerSecond":40.8,"baseline":31,"spiking":false},"chatZ":2.1,"viewers":184000,"streamTitle":"three stars and no plan","state":"flooded","deepLink":null,"opportunity":0.1734},{"id":"5:vod:6313","broadcasterId":"5","broadcaster":"hotel_cortez","basis":"vod","source":"clips","vodId":"v51","gameId":null,"offsetSeconds":6313,"reactionOffsetSeconds":6343,"saturation":14,"uniqueClippers":14,"firstClipper":"a_viewer","firstClipAt":"2026-11-27T04:21:11.754Z","lastClipAt":"2026-11-27T04:22:03.754Z","spanMinutes":0.87,"clipViews":2598,"title":"drove into the ocean on purpose","thumbnail":null,"exampleClipUrl":null,"unconfirmed":false,"shared":false,"reaction":0,"ageMinutes":15.7,"minutesSinceLastClip":14.9,"clipsPerMinute":16.09,"newClips":0,"chat":null,"chatZ":0,"viewers":28000,"streamTitle":"drove into the ocean on purpose","state":"flooded","deepLink":null,"opportunity":0.1437}],"meta":{"counts":{"early":2,"fresh":5,"warm":11,"flooded":2},"totalMoments":20,"clipsScanned":77,"truncated":false,"windowMinutes":25,"liveChannels":6,"lastClipPoll":"2026-11-27T04:36:55.889Z","lastStreamPoll":"2026-11-27T04:36:55.889Z","pollSeconds":30,"chat":{"enabled":true,"channels":80,"shards":5,"connectedShards":5,"spiking":2},"lastError":null,"demo":true}};
  const UPLOADS = {"youtube":{"built":true,"keys":true,"connected":true,"mode":"on","spacingMinutes":360,"today":2,"perDay":4,"maxPerDay":6,"capWhy":"YouTube allows 10,000 quota units a day and each upload costs 1,600","spacingRange":{"min":1,"max":1440},"fitsPerDay":8,"limitsSetHere":false,"nextAt":null,"waitingFor":null,"lastError":null,"next":[],"queued":0,"lifetime":{"done":61,"failed":2,"since":"2026-11-04T09:12:00.000Z"},"upcoming":[],"recent":[{"file":"wavebreak-t041207.mp4","status":"done","title":"wavebreak in GTA 6: \"the alligator got him\" #Shorts #GTA6","videoId":"demo0001","error":null,"at":"2026-11-27T02:10:04.000Z"},{"file":"vicebeam-t118822.mp4","status":"done","title":"vicebeam in GTA 6: \"beach shootout\" #Shorts #GTA6","videoId":"demo0002","error":null,"at":"2026-11-26T20:04:51.000Z"}],"privacy":"public"},"tiktok":{"built":true,"keys":true,"connected":true,"mode":"dry-run","spacingMinutes":300,"today":1,"perDay":3,"maxPerDay":5,"capWhy":"TikTok allows 5 pending shares in any 24 hours","spacingRange":{"min":1,"max":1440},"fitsPerDay":5,"limitsSetHere":false,"nextAt":null,"waitingFor":null,"lastError":null,"next":[],"queued":0,"lifetime":{"done":24,"failed":0,"since":"2026-11-11T18:40:00.000Z"},"upcoming":[],"recent":[],"draftsOnly":true,"draftNote":"TikTok uploads arrive as a draft in your inbox — open TikTok to post it. Going straight to your profile needs the video.publish scope and TikTok’s audit."},"instagram":{"built":true,"keys":true,"connected":true,"mode":"off","spacingMinutes":240,"today":0,"perDay":5,"maxPerDay":50,"capWhy":"Instagram allows 50 published posts in a moving 24 hours","spacingRange":{"min":1,"max":1440},"fitsPerDay":45,"limitsSetHere":false,"nextAt":null,"waitingFor":null,"lastError":null,"next":[],"queued":0,"lifetime":{"done":0,"failed":0,"since":null},"upcoming":[],"recent":[],"shareToFeed":true}};
  const AUTOMATION = {"enabled":true,"mode":"clips+chat","scope":"channels","games":["Grand Theft Auto VI","Fortnite"],"music":true,"musicTracks":3,"musicDir":"music","channels":[{"login":"wavebreak","state":"live"},{"login":"hotel_cortez","state":"live"},{"login":"grainysaint","state":"live"},{"login":"vicebeam","state":"live"},{"login":"moth_kid","state":"listening"},{"login":"low_tide_tv","state":"listening"},{"login":"canal_street","state":"listening"},{"login":"nineiron","state":"offline"},{"login":"palmcourt","state":"offline"},{"login":"dusk_runner","state":"offline"},{"login":"saltflats","state":"offline"},{"login":"the_overpass","state":"offline"}],"status":{"queued":1,"done":38,"failed":1,"lastHour":3,"perHour":60,"dir":"clips\\ready","skipped":{}},"health":{"level":"ok","message":null},"recordings":[],"lookups":{"failures":0,"consecutive":0,"lastError":null,"lastErrorAt":null,"lastOkAt":"2026-11-27T04:41:00.000Z"},"shorts":[],"keepHours":6};
  const STATS = {"youtube":{"keys":true,"connected":true,"channel":{"title":"Saturation Feed","subscribers":1240,"views":412900,"videos":61}},"tiktok":{"keys":true,"connected":true,"profile":{"displayName":"saturationfeed","followers":318,"following":12,"likes":9410,"videos":24}},"instagram":{"keys":false,"connected":false}};

  // Live state, so pressing something has an effect that lasts. A reload puts
  // it back, which is the behaviour you want on a page strangers share.
  const state = { uploads: UPLOADS, automation: AUTOMATION, jobs: new Map() };

  // "Next post" is a clock, and a clock baked into a fixture is wrong by the
  // time anybody reads it. Stamped against the moment the page opens instead,
  // so the demo never shows a post due an hour ago that never went.
  const QUEUED = { youtube: 3, tiktok: 2, instagram: 0 };
  for (const [platform, view] of Object.entries(state.uploads)) {
    view.queued = QUEUED[platform] ?? 0;
    view.nextAt =
      view.mode === 'off' || !view.queued
        ? null
        : new Date(Date.now() + (platform === 'youtube' ? 38 : 97) * 60_000).toISOString();
    if (view.mode !== 'off' && !view.queued) view.waitingFor = 'nothing cut yet today';
  }

  // ----------------------------------------------------------------- limits

  // The same ceilings the tool enforces, for the same reasons. They are here
  // so the demo refuses an impossible number the way the real page does,
  // rather than quietly accepting one and teaching the wrong thing.
  const CEILINGS = {
    youtube: { perDay: 6, why: 'YouTube allows 10,000 quota units a day and each upload costs 1,600' },
    tiktok: { perDay: 5, why: 'TikTok allows 5 pending shares in any 24 hours' },
    instagram: { perDay: 50, why: 'Instagram allows 50 published posts in a moving 24 hours' },
  };

  const fitsInADay = (spacing) => Math.max(1, Math.floor(1440 / Math.min(1440, Math.max(1, Number(spacing) || 1))));

  function checkLimit(platform, field, value) {
    const ceiling = CEILINGS[platform];
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const n = Number(value);
    if (!Number.isInteger(n)) throw new Error('that needs to be a whole number');
    if (field === 'perDay') {
      if (n < 1) throw new Error('at least one a day — use Off to stop uploading altogether');
      if (n > ceiling.perDay) throw new Error(`${ceiling.perDay} a day is the most this can be: ${ceiling.why}`);
      return n;
    }
    if (n < 1 || n > 1440) throw new Error('the gap has to be between 1 and 1440 minutes');
    return n;
  }

  // ------------------------------------------------------------------ routes

  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

  function uploadsPost(body) {
    const platform = body.platform;
    const view = state.uploads[platform];
    if (!view) return json({ error: 'bad_request', message: `${platform} upload is not built yet` }, 400);

    try {
      if (body.disconnect) {
        view.mode = 'off';
        view.connected = false;
      } else if (body.privacy !== undefined) {
        view.privacy = body.privacy;
      } else if (body.perDay !== undefined || body.spacingMinutes !== undefined) {
        if (body.perDay !== undefined) {
          const n = checkLimit(platform, 'perDay', body.perDay);
          view.perDay = n ?? CEILINGS[platform].perDay - 1;
          view.limitsSetHere = n !== null;
        }
        if (body.spacingMinutes !== undefined) {
          const n = checkLimit(platform, 'spacingMinutes', body.spacingMinutes);
          view.spacingMinutes = n ?? 180;
          view.limitsSetHere = view.limitsSetHere || n !== null;
        }
        view.fitsPerDay = fitsInADay(view.spacingMinutes);
      } else {
        const mode = body.mode;
        if (!['off', 'dry-run', 'on'].includes(mode)) throw new Error(`${mode} is not a mode`);
        if (mode !== 'off' && !view.connected) throw new Error('connect the account first');
        view.mode = mode;
      }
    } catch (err) {
      return json({ error: 'bad_request', message: err.message }, 400);
    }
    return json(state.uploads);
  }

  function automationPost(body) {
    const a = state.automation;
    if (body.enabled !== undefined) a.enabled = Boolean(body.enabled);
    if (body.music !== undefined) a.music = Boolean(body.music);
    if (body.mode !== undefined) a.mode = body.mode;
    if (body.scope !== undefined) a.scope = body.scope;
    if (body.games !== undefined) a.games = body.games;
    if (body.add) {
      const login = String(body.add).trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (!login) return json({ error: 'bad_request', message: 'that is not a channel name' }, 400);
      if (a.channels.some((c) => c.login === login)) {
        return json({ error: 'bad_request', message: `${login} is already on the list` }, 400);
      }
      a.channels = [...a.channels, { login, state: 'listening' }];
    }
    if (body.remove) a.channels = a.channels.filter((c) => c.login !== body.remove);
    return json(a);
  }

  // A cut takes a while in the real thing: it fetches the section of the
  // broadcast, re-encodes it and writes a file. The stages and their wording
  // are the real ones, on a timer instead of real work.
  const STAGES = [
    { at: 0, state: 'queued', progress: 0, message: 'queued' },
    { at: 900, state: 'running', progress: 12, message: 'finding the broadcast' },
    { at: 2200, state: 'running', progress: 38, message: 'downloading the section' },
    { at: 4200, state: 'running', progress: 71, message: 'cutting and re-encoding' },
    { at: 6000, state: 'running', progress: 92, message: 'writing the 9:16 copy' },
  ];

  function jobNow(job) {
    const elapsed = Date.now() - job.startedAt;
    if (elapsed >= 7200) {
      return {
        id: job.id,
        state: 'done',
        progress: 100,
        message: 'done',
        path: `clips\\ready\\${job.broadcaster}-t${job.offset}.mp4`,
        verticalPath: `clips\\ready\\${job.broadcaster}-t${job.offset}-vertical.mp4`,
      };
    }
    const { at, ...stage } = [...STAGES].reverse().find((s) => elapsed >= s.at) || STAGES[0];
    return { id: job.id, ...stage };
  }

  function clipPost(body) {
    const id = `demo-${Math.random().toString(36).slice(2, 9)}`;
    const job = {
      id,
      startedAt: Date.now(),
      broadcaster: body.broadcaster || 'channel',
      offset: Math.round(Number(body.offsetSeconds) || 0),
    };
    state.jobs.set(id, job);
    return json({ job: jobNow(job) });
  }

  function route(path, method, body) {
    if (path.startsWith('/api/feed')) return json(FEED);
    if (path === '/api/uploads') return method === 'POST' ? uploadsPost(body) : json(state.uploads);
    if (path === '/api/stats') return json(STATS);
    if (path === '/api/automation') return method === 'POST' ? automationPost(body) : json(state.automation);
    if (path === '/api/clip') return clipPost(body);
    if (path.startsWith('/api/clip/')) {
      const job = state.jobs.get(path.slice('/api/clip/'.length));
      if (!job) return json({ error: 'not_found', message: 'no such job' }, 404);
      return json({ job: jobNow(job) });
    }
    if (path.includes('/reveal')) {
      note('Opening the folder is something the copy on your own computer does.');
      return json({ ok: true });
    }
    return json({ error: 'not_found', message: `${path} is not part of the demo` }, 404);
  }

  const realFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
    const path = url.startsWith('http') ? new URL(url).pathname + new URL(url).search : url;
    if (!path.startsWith('/api/')) return realFetch(input, init);

    const method = (init.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    let body = {};
    try {
      const raw = init.body ?? (input instanceof Request ? await input.clone().text() : null);
      if (raw) body = JSON.parse(raw);
    } catch {
      body = {};
    }

    // A real round trip is never instant, and code that works only against an
    // instant answer is code that breaks on a real network.
    await new Promise((r) => setTimeout(r, 90 + Math.random() * 120));
    return route(path.split('?')[0] === path ? path : path.split('?')[0], method, body);
  };

  // ------------------------------------------------------------ the asides

  let noteTimer = null;

  function note(text) {
    let el = document.querySelector('.demo-note');
    if (!el) {
      el = document.createElement('div');
      el.className = 'demo-note';
      el.setAttribute('role', 'status');
      document.body.append(el);
    }
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      el.style.opacity = '0';
    }, 5200);
  }

  const OFF = {
    'auth/youtube': 'Signing in happens on your own machine, against your own Google account. There is nothing here to sign into.',
    'auth/tiktok': 'Signing in happens on your own machine, against your own TikTok account. There is nothing here to sign into.',
    'auth/instagram': 'Signing in happens on your own machine, against your own Instagram account. There is nothing here to sign into.',
    'youtube.html': 'The per-account pages are not in the demo. They show that account’s own views, subscribers and recent posts.',
    'tiktok.html': 'The per-account pages are not in the demo. They show that account’s own followers, likes and recent posts.',
    'instagram.html': 'The per-account pages are not in the demo. They show that account’s own followers and recent Reels.',
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-demo-off]');
    if (!link) return;
    event.preventDefault();
    note(OFF[link.dataset.demoOff] || 'That part is not in the demo.');
  });

  // Downloading a short asks the server for a file. There is no server, and a
  // dead download reads worse than an honest refusal.
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest('a[download]');
      if (!link) return;
      event.preventDefault();
      note('The finished clips live on the operator’s own disk. The demo has no files to hand you.');
    },
    true,
  );
})();
