# eli-website

Personal homepage for [e1i.xyz](https://www.e1i.xyz/) — a single-page static site skinned to look like a retro Windows desktop.

Plain HTML/CSS/JS, no build step. First-time visitors get a retro DOS-style bootup that prompts them to upgrade to Windows Vista or stay on Windows 95; the choice is remembered, and later visits show a quick version-specific boot splash. It has an embedded Webamp (Winamp) music player, and the bottom taskbar lets you switch between three themes: **Windows 95** (light), **Windows 95** (dark), and **Windows Vista** (Aero).

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

No dependencies to install and no build — deploy is just the flat files.

See [HANDOFF.md](HANDOFF.md) for architecture, theming details, and gotchas.
