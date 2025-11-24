// background.js - Fixed version with better error handling
// Polyfill for Firefox compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onInstalled.addListener(() => {
  try {
    browserAPI.storage.local.set({ redirectEnabled: true });
  } catch (e) {
    console.error("Storage set error:", e);
  }
});

function isChannelRootUrl(urlString) {
  try {
    const u = new URL(urlString);
    if (u.protocol !== "https:" || u.hostname !== "www.youtube.com") return false;

    const p = u.pathname.replace(/\/+$/, "");
    const segments = p.split("/");
    
    // Valid if: ["", "@channelname"] with no extra segments
    return segments.length === 2 && 
           segments[1].startsWith("@") && 
           segments[1].length > 1 &&
           /^@[\w-]+$/.test(segments[1]); // Additional validation: only alphanumeric, underscore, hyphen
  } catch (e) {
    console.error("URL validation error:", e);
    return false;
  }
}

browserAPI.webNavigation.onCommitted.addListener((details) => {
  try {
    const url = details.url;
    
    // Only top-level frame navigations
    if (details.frameId !== 0) return;
    if (!isChannelRootUrl(url)) return;

    browserAPI.storage.local.get("redirectEnabled", ({ redirectEnabled }) => {
      if (!redirectEnabled) return;

      try {
        const u = new URL(url);
        const nameSegment = u.pathname.replace(/\/+$/, "").split("/")[1];
        
        // Validate channel name format
        if (!/^@[\w-]+$/.test(nameSegment)) {
          console.warn("Invalid channel name format:", nameSegment);
          return;
        }
        
        u.pathname = `/${nameSegment}/videos`;
        u.hash = "";
        u.search = "";
        
        browserAPI.tabs.update(details.tabId, { url: u.toString() });
      } catch (e) {
        console.error("Redirect construction error:", e);
      }
    });
  } catch (e) {
    console.error("webNavigation handler error:", e);
  }
}, {
  url: [{ hostEquals: "www.youtube.com" }]
});