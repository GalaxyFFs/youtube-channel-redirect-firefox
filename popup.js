// popup.js - Fixed version with Firefox compatibility
// Polyfill for Firefox compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function updateStatusUI(enabled) {
  if (enabled) {
    status.textContent = "Redirect is ON";
    status.classList.add("on");
    status.classList.remove("off");
    toggle.checked = true;
  } else {
    status.textContent = "Redirect is OFF";
    status.classList.add("off");
    status.classList.remove("on");
    toggle.checked = false;
  }
}

// Initialize popup state
try {
  browserAPI.storage.local.get("redirectEnabled", (result) => {
    const enabled = typeof result.redirectEnabled === "undefined" ? true : result.redirectEnabled;
    updateStatusUI(enabled);
  });
} catch (e) {
  console.error("popup init storage error:", e);
  updateStatusUI(false);
}

// Handle toggle changes
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  try {
    browserAPI.storage.local.set({ redirectEnabled: enabled }, () => {
      updateStatusUI(enabled);
      
      // Provide feedback to user
      if (browserAPI.runtime.lastError) {
        console.error("Storage error:", browserAPI.runtime.lastError);
        // Revert UI on error
        updateStatusUI(!enabled);
      }
    });
  } catch (e) {
    console.error("popup set storage error:", e);
    updateStatusUI(!enabled);
  }
});