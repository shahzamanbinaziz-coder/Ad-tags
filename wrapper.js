// gpt-wrapper.js
(function() {
    // Load GPT library asynchronously
    var gptScript = document.createElement('script');
    gptScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    gptScript.async = true;
    document.head.appendChild(gptScript);

    // Wait for GPT to load
    window.googletag = window.googletag || {cmd: []};
    googletag.cmd.push(function() {
        // Define your ad slot
        var slot = googletag.defineSlot('/23330254529/gptwrapper', [728, 90], 'div-gpt-ad-1')
            .addService(googletag.pubads());

        // Enable single request mode (faster)
        googletag.pubads().enableSingleRequest();

        // Enable lazy loading (optional, improves performance)
        googletag.pubads().enableLazyLoad({
            fetchMarginPercent: 50,  // load ads 50% before they appear
            renderMarginPercent: 25, // render when 25% visible
            mobileScaling: 2.0       // mobile adjustment
        });

        googletag.enableServices();

        // Display the ad
        googletag.display('div-gpt-ad-1');
    });
})();
