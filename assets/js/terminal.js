// Interactive green-CRT terminal shell for the terminal pages (404, files, redirect stubs).
// Driven by an inline window.TERM_CONFIG = { mode, prompt, banner[], sheetUrl?, target?, label? }.
(function () {
  "use strict";

  var cfg = window.TERM_CONFIG || { mode: "plain", banner: [] };
  var out, input, files = []; // files: [{ name, link }]

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function scrollToBottom() { if (out) out.scrollTop = out.scrollHeight; }

  function line(text, cls) {
    var div = document.createElement("div");
    div.className = "term-line" + (cls ? " " + cls : "");
    div.textContent = text == null ? "" : text;
    out.appendChild(div);
    scrollToBottom();
    return div;
  }

  // typewriter: type one line char-by-char, resolve when done
  function typeLine(text, cls, speed) {
    speed = speed || 9;
    return new Promise(function (resolve) {
      var div = line("", cls);
      var i = 0;
      (function tick() {
        div.textContent = text.slice(0, i);
        scrollToBottom();
        if (i++ < text.length) setTimeout(tick, speed);
        else resolve(div);
      })();
    });
  }

  function typeLines(lines, speed) {
    return (lines || []).reduce(function (p, t) {
      return p.then(function () { return typeLine(t, null, speed); });
    }, Promise.resolve());
  }

  // ---- files mode: Google Sheets CSV (col B = link, col C = name) ----
  function parseCSV(text) {
    var rows = text.split("\n"), list = [];
    for (var i = 1; i < rows.length; i++) { // skip header row
      var cols = rows[i].split(",");
      if (cols.length >= 3) {
        var link = cols[1].trim(), name = cols[2].trim(); // B = link, C = name
        if (link) list.push({ link: link, name: name });
      }
    }
    return list;
  }

  function printFileList() {
    if (!files.length) { line("no files available.", "muted"); return; }
    files.forEach(function (f, idx) {
      var div = document.createElement("div");
      div.className = "term-line file-entry";
      var a = document.createElement("a");
      a.href = f.link; a.className = "assignment-link";
      a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = "[" + (idx + 1) + "] " + f.name;
      div.appendChild(a);
      out.appendChild(div);
    });
    scrollToBottom();
  }

  function openFile(n) {
    var f = files[n - 1];
    if (!f) { line("download: no file [" + n + "] — type 'ls' to list.", "err"); return; }
    line("opening " + f.name + " ...");
    window.open(f.link, "_blank", "noopener");
  }

  // ---- command registry ----
  var helpText = {
    help: "show this list",
    ls: "list downloadable files",
    "download <n>": "download file number n",
    home: "return to the main site",
    clear: "clear the screen",
    about: "about e1i.xyz",
  };

  var commands = {
    help: function () {
      line("available commands:");
      Object.keys(helpText).forEach(function (k) {
        line("  " + (k + "                ").slice(0, 16) + helpText[k]);
      });
    },
    clear: function () { out.innerHTML = ""; },
    home: function () { line("returning home...", "ok"); setTimeout(function () { location.href = "index.html"; }, 350); },
    about: function () { line("e1i.xyz — programmer, DJ, music producer. hand-built, notepad-approved."); },
    whoami: function () { line("guest@e1i.xyz"); },
    echo: function (args) { line(args.join(" ")); },
  };

  if (cfg.mode === "files") {
    commands.ls = commands.dir = function () { printFileList(); };
    var dl = function (args) { openFile(parseInt(args[0], 10)); };
    commands.download = commands.get = commands.open = dl;
  } else {
    delete helpText.ls; delete helpText["download <n>"];
    commands.ls = function () { line("(nothing here)"); };
  }

  function runCommand(raw) {
    var trimmed = (raw || "").trim();
    line((cfg.prompt || ">") + " " + trimmed, "cmd-echo");
    if (!trimmed) return;
    var parts = trimmed.split(/\s+/);
    var name = parts[0].toLowerCase();
    var fn = commands[name];
    if (fn) fn(parts.slice(1));
    else line("command not found: " + name + "  (try 'help')", "err");
  }

  function focusInput() {
    if (!input) return;
    try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
    scrollToBottom();
  }

  function enableInput() {
    var lineEl = document.getElementById("term-input-line");
    input = document.getElementById("term-input");
    if (!input) return; // redirect pages have no input
    var promptSpan = lineEl && lineEl.querySelector(".prompt");
    if (promptSpan) promptSpan.textContent = cfg.prompt || ">";
    if (lineEl) lineEl.style.visibility = "visible";
    input.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var v = input.value; input.value = "";
      runCommand(v);
    });
    // tap anywhere to focus (mobile); auto-focus only on non-touch (avoid popping the keyboard)
    document.addEventListener("click", function (e) {
      if (e.target.tagName !== "A") focusInput();
    });
    if (!("ontouchstart" in window)) focusInput();
  }

  // ---- redirect mode: "connecting..." then bounce (meta-refresh is the no-JS fallback) ----
  function redirectSeq() {
    return typeLine("establishing connection to " + (cfg.label || "destination") + " ", null, 16)
      .then(function (div) {
        return new Promise(function (resolve) {
          var n = 0, t = setInterval(function () {
            div.textContent += "."; scrollToBottom();
            if (++n >= 6) { clearInterval(t); resolve(); }
          }, 170);
        });
      })
      .then(function () {
        line("connection established — redirecting.", "ok");
        setTimeout(function () { location.href = cfg.target; }, 500);
      });
  }

  function boot() {
    out = document.getElementById("term-output");
    if (!out) return;
    typeLines(cfg.banner, 9).then(function () {
      if (cfg.mode === "files") {
        return fetch(cfg.sheetUrl)
          .then(function (r) { return r.text(); })
          .then(function (t) { files = parseCSV(t); line(""); line((cfg.prompt || ">") + " ls", "cmd-echo"); printFileList(); })
          .catch(function () { line("failed to load file index.", "err"); });
      }
      if (cfg.mode === "redirect") return redirectSeq();
    }).then(function () {
      if (cfg.mode !== "redirect") enableInput();
    });
  }

  ready(boot);
})();
