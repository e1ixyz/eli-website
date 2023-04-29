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


// Gradient
/* function generateGradient() {
  var colorValues = ["#1e90ff", "#9370db", "#ff69b4", "#c0c0c0", "#ffffff", "#ffa07a"];

  function generateRandomColor() {
    var x = Math.floor(Math.random() * colorValues.length);
    return colorValues[x];
  }

  var newColor1 = generateRandomColor();
  var newColor2 = generateRandomColor();
  var angle = Math.round( Math.random() * 360 );

  var gradient = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";

  var cardHeader = document.querySelector(".card-header");
  cardHeader.style.background = gradient;
}

document.addEventListener("DOMContentLoaded", function() {
  generateGradient();
}); */
