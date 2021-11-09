const timer = document.getElementById("timer");

let timeMinutes = 20;   //get the minutes
let timeSecond = timeMinutes*60;  //calculate seconds
let interval = null;
let statusTimer = "stopped";
displayTime(timeSecond);

// In this function we will update the time.
function updateTime(){
  let str = timer.innerHTML;
  let newMin = parseInt(str.substr(0, str.indexOf(":")));
  let newSec = parseInt(str.substr(str.indexOf(":")+1));

  if (Number.isNaN(newMin) || Number.isNaN(newSec)){
    alert("A number is required of the form min:sec");
  } else if (newMin < 0 || newSec < 0 || newMin > 60 || newSec > 60){
    alert("The numbers should be from 0 to 60.");
  } else {
    timeMinutes = newMin;   //get the minutes
    timeSecond = timeMinutes*60 + newSec;  //calculate seconds
  }
  displayTime(timeSecond);
}

//Function will be called when the button start is clicked.
function startTimer(){
  timeSecond--;
  displayTime(timeSecond);
  if (timeSecond == 0 || timeSecond < 1) {  //time runs out
    statusTimer = "started";
    startStop();
  }
}

function startStop(){
  if(statusTimer === "stopped"){
    //Start the timer (by calling the setInterval() function)
    interval = window.setInterval(startTimer, 1000);
    document.querySelector("#startStop i").className = "fas fa-pause";
    statusTimer = "started";
    timer.contentEditable = "false";
  } else {
    window.clearInterval(interval);
    document.querySelector("#startStop i").className = "fas fa-play";
    statusTimer = "stopped";
  }
}

function skipTime(){
  displayTime(timeMinutes*60);
  statusTimer = "started";
  startStop();
  timer.contentEditable = "true";
}

// Function to display the time
function displayTime(second) {
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  timer.innerHTML = `
  ${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}
  `;
}
