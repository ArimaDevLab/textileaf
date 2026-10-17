/* Textileaf page-view counter.
   Records only: which page (landing / app setup), a random browser ID, the referring site's
   host name and a ?ref= tag. No names, messages, IP addresses or other personal data.
   Visit any page once with ?me=1 to stop counting yourself in that browser (?me=0 to undo). */
(function () {
  try {
    var me = document.currentScript, page = (me && me.getAttribute('data-page')) || 'landing';
    var q = new URLSearchParams(location.search), ls = window.localStorage;
    if (q.get('me') === '1') ls.setItem('textileaf-me', '1');
    if (q.get('me') === '0') ls.removeItem('textileaf-me');
    if (ls.getItem('textileaf-me') === '1') return;
    // On the app page, count only the setup screen (not previews or the OBS overlay).
    if (page === 'app' && (q.get('channel') || q.get('demo') || q.get('role'))) return;
    var v = ls.getItem('textileaf-visitor') || '';
    if (!/^[a-z0-9]{16}$/.test(v)) {
      var r = new Uint8Array(16); crypto.getRandomValues(r);
      v = Array.prototype.map.call(r, function (b) { return 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]; }).join('');
      ls.setItem('textileaf-visitor', v);
    }
    var ref = '';
    try { var u = new URL(document.referrer); if (u.host !== location.host) ref = u.host.slice(0, 80); } catch (e) {}
    var src = (q.get('ref') || q.get('utm_source') || '').slice(0, 40);
    fetch('https://fpdyjvhmbjyzyxmiwlaa.supabase.co/rest/v1/page_views', {
      method: 'POST', keepalive: true,
      headers: { apikey: 'sb_publishable_i_ochJ2NZZ0QHLYmUAdClA_WItxfOZO', 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ page: page, visitor: v, ref: ref, src: src })
    }).catch(function () {});
  } catch (e) {}
})();
