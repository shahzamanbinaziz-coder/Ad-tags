(() => {
  "use strict";

  const TURNSTILE_SITE_KEY = "0x4AAAAAACJ99NcrRLPVFxdI";

  /* ------------------------------
   * ORIGINAL GPT CODE (UNCHANGED)
   * ------------------------------ */
  const GAM_CODE = `
    window.googletag = window.googletag || { cmd: [] };

    googletag.cmd.push(function() {
      googletag.defineSlot(
        '/23054716555/ad-tags',
        [750, 300],
        'div-gpt-ad-1767247756816-0'
      ).addService(googletag.pubads());

      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });

    googletag.cmd.push(function() {
      googletag.display('div-gpt-ad-1767247756816-0');
    });
  `;

  /* ------------------------------
   * HELPERS
   * ------------------------------ */
  function loadJS(src, cb) {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = cb;
    document.head.appendChild(s);
  }

  function injectScript(code) {
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.text = code;
    document.body.appendChild(s);
  }

  /* ------------------------------
   * VISIBLE TURNSTILE
   * ------------------------------ */
  function showCaptcha() {
    loadJS("https://challenges.cloudflare.com/turnstile/v0/api.js", () => {
      const box = document.createElement("div");
      box.id = "turnstile-box";
      box.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 999999;
        background: #ffffff;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(0,0,0,.3);
      `;
      document.body.appendChild(box);

      turnstile.render(box, {
        sitekey: 0x4AAAAAACJ99NcrRLPVFxdI,
        theme: "light",
        callback: token => {
          if (!token) return;

          // Remove captcha UI
          box.remove();

          // Load GPT, then run GAM tag
          loadJS(
            "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
            () => injectScript(GAM_CODE)
          );
        }
      });
    });
  }

  /* ------------------------------
   * START
   * ------------------------------ */
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    showCaptcha();
  } else {
    document.addEventListener("DOMContentLoaded", showCaptcha);
  }
})();
