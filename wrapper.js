/**
 * Pubmatic GPT Wrapper with Turnstile
 * GAM ID: 23054716555
 * Ad Unit: /23054716555/ad-tags
 * Slot: 750x300
 * Div ID: div-gpt-ad-1767215367128-0
 */

(function () {
  "use strict";

  // -------------------------
  // CONFIG
  // -------------------------
  const TURNSTILE_SITE_KEY = "0x4AAAAAACJ99NcrRLPVFxdI"; // Replace with your Turnstile site key
  const AD_UNIT_PATH = "/23054716555/ad-tags";
  const AD_DIV_ID = "div-gpt-ad-1767215367128-0";
  const AD_SIZE = [750, 300];

  // -------------------------
  // STATE
  // -------------------------
  let gptLoaded = false;
  let captchaPassed = false;

  // -------------------------
  // GPT LOADER
  // -------------------------
  function loadGPT() {
    if (gptLoaded) return;
    gptLoaded = true;

    window.googletag = window.googletag || { cmd: [] };

    // Load GPT script
    const gptScript = document.createElement("script");
    gptScript.async = true;
    gptScript.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    document.head.appendChild(gptScript);

    window.googletag.cmd.push(function () {
      const slot = googletag.defineSlot(
        AD_UNIT_PATH,
        AD_SIZE,
        AD_DIV_ID
      );

      if (!slot) return;

      slot.addService(googletag.pubads());

      googletag.pubads().enableSingleRequest();
      googletag.enableServices();

      googletag.display(AD_DIV_ID);
      console.log("GPT loaded and ad displayed in div:", AD_DIV_ID);
    });
  }

  // -------------------------
  // TURNSTILE
  // -------------------------
  function renderTurnstile() {
    if (captchaPassed) return;

    let box = document.getElementById("cf-turnstile-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "cf-turnstile-box";
      box.style.cssText =
        "display:flex;justify-content:center;align-items:center;margin:20px 0;";
      document.body.insertBefore(box, document.getElementById(AD_DIV_ID));
    }

    console.log("Rendering Turnstile...");

    window.turnstile.render("#cf-turnstile-box", {
      sitekey: "0x4AAAAAACJ99NcrRLPVFxdI",
      callback: function () {
        captchaPassed = true;
        console.log("Turnstile passed, loading GPT ad...");
        loadGPT();
        // Remove Turnstile after pass
        box.style.display = "none";
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

  // -------------------------
  // SIMPLE BOT CHECK
  // -------------------------
  function isSuspiciousTraffic() {
    if (navigator.webdriver) return true;
    if (!navigator.plugins || navigator.plugins.length === 0) return true;
    if (!navigator.languages || navigator.languages.length === 0) return true;
    return false;
  }

  // -------------------------
  // INIT
  // -------------------------
  function init() {
    // Ensure ad container exists
    if (!document.getElementById(AD_DIV_ID)) {
      const adDiv = document.createElement("div");
      adDiv.id = AD_DIV_ID;
      adDiv.style.cssText = "width:750px;height:300px;margin:0 auto;";
      document.body.appendChild(adDiv);
    }

    if (isSuspiciousTraffic()) {
      console.log("Suspicious traffic detected → showing Turnstile");
      loadTurnstileScript();
    } else {
      console.log("Human traffic → showing Turnstile for verification");
      loadTurnstileScript();
    }
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


