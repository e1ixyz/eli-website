// Join Alert
var alerted = localStorage.getItem('alerted') || '';
if (alerted != 'yes') {
 alert("Welcome! For the optimal user experience, please enable audio in your browser settings. =)");
 localStorage.setItem('alerted','yes');
  }

// Audio Button
function playMyAudio(){
    document.getElementById("myAudio").play();
  }

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
