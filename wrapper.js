/**
 * pubmatic.site – GPT Wrapper v1.0
 * Features:
 * - Cloudflare Turnstile gating
 * - Google Ad Manager GPT loader
 * - 750x300 ad unit
 * - Bot-safe & policy-safe
 */

(function () {
  "use strict";

  /* =======================
     CONFIG
  ======================= */

  const TURNSTILE_SITE_KEY = "0x4AAAAAACJ99NcrRLPVFxdI";
  const AD_UNIT_PATH = "/1234567/your-ad-unit-path";
  const AD_DIV_ID = "pubmatic-750x300";

  /* =======================
     STATE
  ======================= */

  let gptLoaded = false;
  let captchaPassed = false;

  /* =======================
     GPT LOADER
  ======================= */

  function loadGPT() {
    if (gptLoaded) return;
    gptLoaded = true;

    window.googletag = window.googletag || { cmd: [] };

    const gptScript = document.createElement("script");
    gptScript.async = true;
    gptScript.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    document.head.appendChild(gptScript);

    window.googletag.cmd.push(function () {

      const slot = googletag.defineSlot(
        AD_UNIT_PATH,
        [750, 300],
        AD_DIV_ID
      );

      if (!slot) return;

      slot.addService(googletag.pubads());

      googletag.pubads().enableSingleRequest();
      googletag.enableServices();

      googletag.display(AD_DIV_ID);
    });
  }

  /* =======================
     TURNSTILE
  ======================= */

  function renderTurnstile() {
    if (captchaPassed) return;

    let box = document.getElementById("cf-turnstile-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "cf-turnstile-box";
      box.style.cssText =
        "display:flex;justify-content:center;align-items:center;margin:20px 0;";
      document.body.appendChild(box);
    }

    window.turnstile.render("#cf-turnstile-box", {
      sitekey: TURNSTILE_SITE_KEY,
      callback: function () {
        captchaPassed = true;
        loadGPT();
      }
    });
  }

  function loadTurnstileScript() {
    if (window.turnstile) {
      renderTurnstile();
      return;
    }

    const ts = document.createElement("script");
    ts.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    ts.async = true;
    ts.defer = true;
    ts.onload = renderTurnstile;
    document.head.appendChild(ts);
  }

  /* =======================
     BOT HEURISTICS (LIGHT)
  ======================= */

  function isSuspiciousTraffic() {
    if (navigator.webdriver) return true;
    if (!navigator.plugins || navigator.plugins.length === 0) return true;
    if (!navigator.languages || navigator.languages.length === 0) return true;
    return false;
  }

  /* =======================
     INIT
  ======================= */

  function init() {
    // Ensure ad container exists
    if (!document.getElementById(AD_DIV_ID)) {
      const adDiv = document.createElement("div");
      adDiv.id = AD_DIV_ID;
      adDiv.style.cssText = "width:750px;height:300px;margin:0 auto;";
      document.body.appendChild(adDiv);
    }

    if (isSuspiciousTraffic()) {
      loadTurnstileScript();
    } else {
      loadGPT();
    }
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
