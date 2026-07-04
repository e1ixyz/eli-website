// Preloader
document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.getElementById("preloader");
  const mainContent = document.getElementById("main-content");
  setTimeout(function() {
    preloader.style.display = "none";
    mainContent.classList.add("visible");
  }, 500);
});

// Random Color Glitch

let colorizeEnabled = false;
let originalColors = {};

function toggleColorize() {
    if (!colorizeEnabled) {
        colorizeEnabled = true;
        randomizeColors();
    } else {
        colorizeEnabled = false;
        revertColors();
    }
}

function randomizeColors() {
    const elements = document.querySelectorAll('body *');

    elements.forEach(element => {
        originalColors[element] = {
            color: element.style.color,
            backgroundColor: element.style.backgroundColor
        };

        const randomColor = getRandomColor();
        element.style.color = randomColor;
        element.style.backgroundColor = getRandomColor();
    });
}

function revertColors() {
    const elements = document.querySelectorAll('body *');

    elements.forEach(element => {
        const originalColor = originalColors[element];
        if (originalColor) {
            element.style.color = originalColor.color;
            element.style.backgroundColor = originalColor.backgroundColor;
        }
    });

    originalColors = {};
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Theme switching

function setBackgroundImage(image) {
    document.body.style.backgroundImage = "url('assets/img/" + image + "')";
}

var bgImages = ["bg1.gif", "bg2.gif", "bg3.gif"];
var currentBgIndex = getRandomIndex(bgImages); // Randomly select an initial background

setBackgroundImage(bgImages[currentBgIndex]);

// ponytail: 3-state theme cycle; add a 4th theme by extending this array + setTheme()
const THEMES = ["light95", "dark95", "vista"];
const WINVER_KEY = "winver"; // cached theme choice; also gates the boot sequence
let themeIndex = 0;

function setTheme(name) {
    themeIndex = THEMES.indexOf(name);
    localStorage.setItem(WINVER_KEY, name); // every path (boot, Version btn, dark toggle) persists
    const link = document.getElementById("stylesheet");
    if (name === "vista") {
        link.setAttribute("href", "assets/css/vista.css");
        // image over gradient fallback -> graceful if the jpg is missing
        document.body.style.background =
            "url('assets/img/vista_aurora.jpg') center center / cover no-repeat fixed," +
            " linear-gradient(135deg,#04102e,#0a2a63 45%,#0e5a7a)";
    } else if (name === "dark95") {
        link.setAttribute("href", "assets/css/win95_dark.css");
        document.body.style.background = "";
        setBackgroundImage("bg_dark.gif");
    } else { // light95
        link.setAttribute("href", "assets/css/win95.css");
        document.body.style.background = "";
        currentBgIndex = getRandomIndex(bgImages);
        setBackgroundImage(bgImages[currentBgIndex]);
    }
}

function toggleVista() {
    setTheme(THEMES[themeIndex] === "vista" ? "light95" : "vista");
}

// existing dark-mode button shares the same state so the two controls stay in sync
function toggleStylesheet() {
    setTheme(THEMES[themeIndex] === "dark95" ? "light95" : "dark95");
}

function cycleBackgroundImages() {
    currentBgIndex = (currentBgIndex + 1) % bgImages.length;
    var randomBg = bgImages[currentBgIndex];
    setBackgroundImage(randomBg);
}

function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

// Boot sequence — first visit runs a DOS POST + version prompt; return visits run a
// quick per-version splash. The <html> mode class is set by the anti-flash script in index.html.

function revealSite() {
    const root = document.documentElement;
    root.classList.remove("booting", "boot-dos", "boot-win95", "boot-vista");
    const boot = document.getElementById("bootup");
    if (!boot) return;
    boot.style.transition = "opacity .4s";
    boot.style.opacity = "0";
    setTimeout(function () { boot.style.display = "none"; }, 400);
}

function runQuickBoot(name) {
    const root = document.documentElement;
    root.classList.remove("boot-dos");
    root.classList.add(name === "vista" ? "boot-vista" : "boot-win95"); // dark95 -> win95 splash
    setTimeout(revealSite, 1900); // just past the 1.7s bar fill
}

function runDosBoot() {
    const log = document.getElementById("boot-log");
    const prompt = document.getElementById("boot-prompt");
    const input = document.getElementById("boot-input");
    const lines = [
        "e1i.xyz BIOS v4.00.950",
        "",
        "640K RAM ......... OK",
        "Detecting IDE drives ... C: OK",
        "Booting from C: ...",
        "",
        "Starting MS-DOS...",
        "C:\\> WIN",
        "",
        "Starting Windows 95 ...",
        "",
        "================================",
        " UPDATE AVAILABLE: Windows Vista",
        "================================",
        " Install the upgrade now?  (Y/N)",
        "",
    ];
    let i = 0;
    (function next() {
        if (i < lines.length) {
            log.textContent += lines[i++] + "\n";
            setTimeout(next, 170);
        } else {
            prompt.style.display = "flex";
            input.focus();
        }
    })();
    input.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        const v = input.value.trim().toLowerCase();
        const choice = ["y", "yes", "u", "update", "upgrade", "1"].includes(v) ? "vista" : "light95";
        log.textContent += "C:\\> " + input.value + "\n";
        prompt.style.display = "none";
        setTheme(choice);     // caches the choice
        runQuickBoot(choice); // "applying update" payoff, then reveals
    });
}

document.addEventListener("DOMContentLoaded", function () {
    if (document.documentElement.classList.contains("boot-dos")) {
        runDosBoot();
    } else {
        const saved = localStorage.getItem(WINVER_KEY) || "light95";
        setTheme(saved);
        runQuickBoot(saved);
    }
});