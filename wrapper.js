(() => {
  "use strict";

  /* =========================================================
   * 1. HARD BOT BLOCK (same as PubGuru intent)
   * ========================================================= */
  if (/bot|crawler|spider|googlebot|lighthouse|facebookexternalhit/i.test(navigator.userAgent)) {
    console.warn("[ADS] Bot detected – aborting ads");
    return;
  }

  /* =========================================================
   * 2. CONFIG (CENTRALIZED)
   * ========================================================= */
  const CONFIG = {
    turnstileSiteKey: "0x4AAAAAACJ99NcrRLPVFxdI",
    gamScript: "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
    slots: [
      {
        adUnit: "/23054716555/ad-tags",
        sizes: [[750, 300]],
        divId: "div-gpt-ad-1"
      }
    ]
  };

  /* =========================================================
   * 3. SAFE SCRIPT LOADER
   * ========================================================= */
  function loadJS(src, cb) {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* =========================================================
   * 4. DOM READY GUARANTEE
   * ========================================================= */
  function onDomReady(cb) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      cb();
    } else {
      document.addEventListener("DOMContentLoaded", cb);
    }
  }

  /* =========================================================
   * 5. TURNSTILE GATE (TRAFFICCOP EQUIVALENT)
   * ========================================================= */
  function verifyHuman(cb) {
    loadJS("https://challenges.cloudflare.com/turnstile/v0/api.js", () => {
      const el = document.createElement("div");
      el.style.display = "none";
      document.body.appendChild(el);

      turnstile.render(el, {
        sitekey: CONFIG.turnstileSiteKey,
        callback: token => {
          if (token) {
            console.log("[ADS] Turnstile passed");
            cb();
          }
        }
      });
    });
  }

  /* =========================================================
   * 6. LOAD GPT (NO REQUEST YET)
   * ========================================================= */
  function loadGPT(cb) {
    window.googletag = window.googletag || { cmd: [] };
    loadJS(CONFIG.gamScript, cb);
  }

  /* =========================================================
   * 7. DEFINE SLOTS + SEND REQUEST (CRITICAL PART)
   * ========================================================= */
  function requestAds() {
    googletag.cmd.push(() => {
      const slots = [];

      CONFIG.slots.forEach(cfg => {
        if (!document.getElementById(cfg.divId)) {
          console.warn("[ADS] Missing div:", cfg.divId);
          return;
        }

        const slot = googletag
          .defineSlot(cfg.adUnit, cfg.sizes, cfg.divId)
          .addService(googletag.pubads());

        slots.push(slot);
      });

      if (!slots.length) return;

      // IMPORTANT: match PubGuru default behavior
      // ❌ Do NOT enableSingleRequest unless needed
      // googletag.pubads().enableSingleRequest();

      googletag.pubads().collapseEmptyDivs();
      googletag.enableServices();

      // 🔥 THIS IS WHAT SENDS THE GAM REQUEST
      googletag.pubads().refresh(slots);

      console.log("[ADS] GAM request sent");
    });
  }

  /* =========================================================
   * 8. MASTER FLOW (ORDER MATTERS)
   * ========================================================= */
  onDomReady(() => {
    verifyHuman(() => {
      loadGPT(requestAds);
    });
  });

})();
