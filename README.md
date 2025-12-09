# YouTube Channel Redirect

A lightweight Firefox extension that automatically redirects YouTube channel home pages to their videos tab.

[![Firefox Add-on](https://img.shields.io/badge/Firefox-Install-orange?logo=firefox)]()
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-white.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/GalaxyFFs/youtube-channel-redirect-firefox)](https://github.com/GalaxyFFs/youtube-channel-redirect-firefox/releases)

## 🎯 What it does

When you visit a YouTube channel like `youtube.com/@channelname`, this extension automatically redirects you to `youtube.com/@channelname/videos` so you can see their content immediately without clicking the Videos tab.

## ✨ Features

- **Automatic redirects** - Saves you a click on every channel visit
- **Toggle on/off** - Easy enable/disable via extension popup
- **Smart detection** - Works with both direct navigation and YouTube's SPA
- **Lightweight** - Minimal performance impact
- **Privacy-focused** - No data collection, no tracking, no external requests
- **Open source** - Full transparency, review the code yourself

## 📦 Installation

### From Firefox Add-ons (Recommended)
Install from [Firefox Add-ons]() *(Coming soon)*

### From GitHub Releases
1. Download the latest `.xpi` file from [Releases](https://github.com/GalaxyFFs/youtube-channel-redirect-firefox/releases)
2. Open Firefox and navigate to `about:addons`
3. Click the gear icon ⚙️ → "Install Add-on From File..."
4. Select the downloaded `.xpi` file

### From Source
```bash
git clone https://github.com/GalaxyFFs/youtube-channel-redirect-firefox.git
cd youtube-redirect
```

Then in Firefox:
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select any file in the extension directory (e.g., `manifest.json`)

## 🎮 Usage

1. **Install the extension** (see above)
2. **Visit any YouTube channel** - The redirect happens automatically!
3. **Toggle on/off** - Click the extension icon in your toolbar to enable/disable

That's it! The extension works silently in the background.

## 🔧 How it works

The extension uses two methods to catch navigation:

1. **Full page loads** - Intercepts via `webNavigation.onCommitted` API
2. **YouTube SPA navigation** - Listens to YouTube's `yt-navigate-finish` events and History API changes

When it detects you're on a channel root page (`/@channelname`), it safely redirects to `/@channelname/videos`.

## 🛡️ Privacy & Security

- ✅ **No data collection** - We don't collect, store, or transmit any data
- ✅ **No tracking** - No analytics, no telemetry
- ✅ **No external requests** - All processing happens locally
- ✅ **Minimal permissions** - Only requests what's necessary:
  - `storage` - To remember your enable/disable preference
  - `webNavigation` - To detect when you visit a channel
  - `tabs` - To perform the redirect
  - `https://www.youtube.com/*` - Only works on YouTube

## 🏗️ Technical Details

**Built with:**
- Manifest V2 (Firefox compatible)
- Vanilla JavaScript (no dependencies)
- Chrome Storage API for settings

**Files:**
- `manifest.json` - Extension configuration
- `background.js` - Handles full page navigation
- `content.js` - Handles SPA navigation within YouTube
- `popup.html/js` - Toggle UI

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/youtube-redirect.git
cd youtube-redirect

# Load in Firefox for testing
# Go to about:debugging → Load Temporary Add-on → Select manifest.json
```

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/GalaxyFFs/youtube-channel-redirect-firefox/issues) with:
- Firefox version
- Extension version
- Steps to reproduce
- Expected vs actual behavior

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) or [Releases](https://github.com/GalaxyFFs/youtube-channel-redirect-firefox/releases) for version history.

## 📄 License

This project is licensed under the GPL v3 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need to save one click per channel visit
- Thanks to all contributors and users

## ⭐ Support

If you find this extension useful, please:
- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Contribute code

---

Made with ❤️ for a better YouTube browsing experience
