(() => {
  "use strict";

  /* ---------------------------
   * 1. BASIC BOT BLOCK
   * --------------------------- */
  if (/bot|crawler|spider|googlebot|lighthouse/i.test(navigator.userAgent)) {
    console.warn("Bot detected — ads disabled");
    return;
  }

  /* ---------------------------
   * 2. CONFIG
   * --------------------------- */
  const CONFIG = {
    turnstileSiteKey: "0x4AAAAAACJ99NcrRLPVFxdI",
    gamNetwork: "23054716555",
    slots: [
      {
        adUnit: "/23054716555/ad-tags",
        sizes: [[750, 300]],
        divId: "div-gpt-ad-1"
      }
    ]
  };

  /* ---------------------------
   * 3. SCRIPT LOADER
   * --------------------------- */
  function loadJS(src, cb) {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* ---------------------------
   * 4. TURNSTILE GATE
   * --------------------------- */
  function verifyHuman(done) {
    loadJS("https://challenges.cloudflare.com/turnstile/v0/api.js", () => {
      const el = document.createElement("div");
      el.style.display = "none";
      document.body.appendChild(el);

      turnstile.render(el, {
        sitekey: CONFIG.turnstileSiteKey,
        callback: token => {
          if (token) done();
        }
      });
    });
  }

  /* ---------------------------
   * 5. LOAD GPT AFTER PASS
   * --------------------------- */
  function loadAds() {
    loadJS("https://securepubads.g.doubleclick.net/tag/js/gpt.js", () => {
      window.googletag = window.googletag || { cmd: [] };

      googletag.cmd.push(() => {
        CONFIG.slots.forEach(slot => {
          googletag
            .defineSlot(slot.adUnit, slot.sizes, slot.divId)
            .addService(googletag.pubads());
        });

        googletag.pubads().enableSingleRequest();
        googletag.enableServices();

        CONFIG.slots.forEach(slot => {
          googletag.display(slot.divId);
        });
      });
    });
  }

  /* ---------------------------
   * 6. START FLOW
   * --------------------------- */
  verifyHuman(loadAds);

})();

