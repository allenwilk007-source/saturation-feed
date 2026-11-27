// Which palette the dashboard wears.
//
// Loaded from <head> and not deferred, because a theme applied after the
// stylesheet has painted is a white flash on every load for anyone who chose
// dark — the one thing a theme switch must not do.
//
// Light is the default rather than the operating system's preference. The
// dashboard is the same product as the page that sells it and should look like
// it out of the box; an operator who wants the old dark console for watching a
// stream at night picks it once and it sticks. Following prefers-color-scheme
// instead would mean the choice is made by a setting nobody made for this.
//
// The preference is a single word in this browser's localStorage. It never
// leaves the machine and there is nothing to lose if it does.
(function () {
  var root = document.documentElement;
  var KEY = 'saturation-theme';

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (err) {
      // Private windows and blocked site data both throw here rather than
      // returning null, and a theme is not worth a broken page.
      return null;
    }
  }

  function apply(name) {
    if (name === 'dark') root.dataset.theme = 'dark';
    else delete root.dataset.theme;
  }

  apply(stored() === 'dark' ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('theme');
    if (!button) return;

    function label() {
      var dark = root.dataset.theme === 'dark';
      button.textContent = dark ? 'Light' : 'Dark';
      button.setAttribute('aria-label', dark ? 'Switch to the light theme' : 'Switch to the dark theme');
    }

    label();

    button.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(next);
      try {
        localStorage.setItem(KEY, next);
      } catch (err) {
        // Nothing to do: the theme still changed for this page view.
      }
      label();
    });
  });
})();
