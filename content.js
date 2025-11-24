// content.js - Fixed version with better SPA detection
// Polyfill for Firefox compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

(function () {
  let lastUrl = location.href;
  let redirectTimer = null;
  let isRedirecting = false; // Prevent multiple simultaneous redirects

  function isChannelRootPathname(pathname) {
    const trimmed = pathname.replace(/\/+$/, "");
    const parts = trimmed.split("/");
    
    // Validate format and channel name
    return parts.length === 2 && 
           parts[1].startsWith("@") && 
           parts[1].length > 1 &&
           /^@[\w-]+$/.test(parts[1]);
  }

  function safeRedirectToVideos(urlString) {
    if (isRedirecting) return; // Prevent race conditions
    
    try {
      const u = new URL(urlString);
      if (u.protocol !== "https:" || u.hostname !== "www.youtube.com") return;
      
      const parts = u.pathname.replace(/\/+$/, "").split("/");
      const channel = parts[1];
      
      if (!(parts.length === 2 && /^@[\w-]+$/.test(channel))) return;

      isRedirecting = true;
      
      const target = new URL(u.origin);
      target.pathname = `/${channel}/videos`;
      target.search = "";
      target.hash = "";

      window.location.replace(target.toString());
    } catch (e) {
      console.error("safeRedirectToVideos error:", e);
      isRedirecting = false;
    }
  }

  function handlePossibleNavigation(newUrl) {
    try {
      browserAPI.storage.local.get("redirectEnabled", ({ redirectEnabled }) => {
        if (!redirectEnabled || isRedirecting) return;
        
        const u = new URL(newUrl);
        if (!isChannelRootPathname(u.pathname)) return;

        // Clear any pending redirect
        if (redirectTimer) {
          clearTimeout(redirectTimer);
          redirectTimer = null;
        }
        
        // Debounce to handle rapid navigation
        redirectTimer = setTimeout(() => {
          redirectTimer = null;
          safeRedirectToVideos(newUrl);
        }, 150);
      });
    } catch (e) {
      console.error("handlePossibleNavigation error:", e);
    }
  }

  // Method 1: Listen to YouTube's native navigation events (most reliable)
  document.addEventListener('yt-navigate-finish', () => {
    try {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        handlePossibleNavigation(lastUrl);
      }
    } catch (e) {
      console.error("yt-navigate-finish handler error:", e);
    }
  });

  // Method 2: History API monitoring (backup for non-YouTube navigation events)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function() {
    originalPushState.apply(this, arguments);
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      handlePossibleNavigation(lastUrl);
    }
  };

  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      handlePossibleNavigation(lastUrl);
    }
  };

  // Method 3: MutationObserver (lightweight fallback)
  // Only observe title changes instead of entire DOM
  const observer = new MutationObserver(() => {
    try {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        handlePossibleNavigation(lastUrl);
      }
    } catch (e) {
      console.error("MutationObserver handler error:", e);
    }
  });

  // Only observe document title changes (much lighter than full DOM)
  const titleElement = document.querySelector('head > title');
  if (titleElement) {
    observer.observe(titleElement, { childList: true, characterData: true, subtree: true });
  }

  // Handle initial page load
  try {
    handlePossibleNavigation(location.href);
  } catch (e) {
    console.error("Initial navigation check error:", e);
  }
})();