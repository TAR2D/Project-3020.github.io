const timer = document.querySelector("#timer h1");
let timerSessionState = document.querySelector('.timerSessionState h2');
let timerBreakState = document.querySelector('.timerBreakState h2');
let TSSoverlayEffect = document.querySelector('.TSSoverlay');
let TBSoverlayEffect = document.querySelector('.TBSoverlay');
let initialSec = 20*60;   //intially at 20 min.
let breakSecond = 5*60;   //initially at 5 min.
let seconds = initialSec; //take same initial 20 seconds.
let statusTimer = "stopped";  //initially it will be paused
let isOnBreak = false;        //it will be on task when first opened.

let interval = null;
displayTime(seconds);

// In this function we will update the time when the user clicks on the timer.
function updateTimeEntered(){
  let str = timer.innerHTML;
  let newMin = parseInt(str.substr(0, str.indexOf(":")));
  let newSec = parseInt(str.substr(str.indexOf(":")+1));

  if (Number.isNaN(newMin) || Number.isNaN(newSec)){
    alert("A number is required of the form min:sec");
  } else if (newMin < 0 || newSec < 0 || newMin > 60 || newSec > 60){
    alert("The numbers should be from 0 to 60.");
  } else {
    seconds = newMin*60 + newSec;  //calculate seconds
    isOnBreak ? breakSecond = seconds : initialSec = seconds;
  }
  displayTime(seconds);
}

function updateTimeTaskButton(){
  isOnBreak = false;
  seconds = tpSpinboxTask.getMinute()*60 + tpSpinboxTask.getHour()*60*60;
  initialSec = seconds;
  displayTime(seconds);
}

function updateTimeTaskButton(){
  isOnBreak = true;
  seconds = tpSpinboxBreak.getMinute()*60 + tpSpinboxBreak.getHour()*60*60;
  breakSecond = seconds;
  displayTime(seconds);
}

function scale (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

//Function will be called repeatedly until a pause or skip button is pressed or time is 0.
function startTimer(){
  if(!isOnBreak) {
    let widthRange = scale(initialSec - seconds, 0, initialSec, 0, 100);
    TSSoverlayEffect.style.width = widthRange + "%";
  } else {
    TBSoverlayEffect.style.width = scale(breakSecond - seconds, 0, breakSecond, 0, 100) + "%";
  }
  seconds--;
  displayTime(seconds);
  if (seconds == 0 || seconds < 1) {  //time runs out
    skipTime();
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
  TSSoverlayEffect.style.width = "0%";
  if(confirmSkip()) {
    isOnBreak ? isOnBreak=false : isOnBreak=true; //checks if it comes another task or another break.
    isOnBreak ? (seconds = breakSecond) : (seconds = initialSec); //if it is a break then chances time to break time.
    if (isOnBreak) {
      timerBreakState.style.color = 'black';
      timerSessionState.style.color = 'rgba(128, 128, 128, 0.434)';
      TSSoverlayEffect.style.width = "0%";
    } else {
      timerBreakState.style.color = 'rgba(128, 128, 128, 0.434)';
      timerSessionState.style.color = 'black';
      TBSoverlayEffect.style.width = "0%";
    }
    displayTime(seconds);
    statusTimer = "started";
    startStop();
    timer.contentEditable = "true";
  }
}

// Function to display the time
function displayTime(second) {
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  timer.innerHTML = `
  ${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}
  `;
}

function confirmSkip() {
  return confirm("Are you sure you want to skip?"); 
}
