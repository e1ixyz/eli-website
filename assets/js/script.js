// Join Alert
var alerted = localStorage.getItem('alerted') || '';
if (alerted != 'yes') {
 alert("Welcome! For the best user experience, please enable audio in your browser settings.");
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
