var alerted = localStorage.getItem('alerted') || '';
if (alerted != 'yes') {
 alert("Welcome! For the best user experience, please enable audio in your browser settings.");
 localStorage.setItem('alerted','yes');
  }

function playMyAudio(){
    document.getElementById("myAudio").play();
  }