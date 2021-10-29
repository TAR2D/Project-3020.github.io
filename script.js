
let timeMinutes = getMinutes();   //get the minutes
let timeSecond = timeMinutes*60;  //calculate seconds

const timeH = document.querySelector("h1");
displayTime(timeSecond);

const countDown = setInterval(() => {
  timeSecond--;
  displayTime(timeSecond);
  if (timeSecond == 0 || timeSecond < 1) {  //time runs out
    endCount();
    clearInterval(countDown);
  }
}, 1000);

// In this function we will store the Minutes
function getMinutes(){
    return 5;
}

// Function to display the time
function displayTime(second) {
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  timeH.innerHTML = `
  ${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}
  `;
}

//Function when time runs out
function endCount() {
  timeH.innerHTML = "Time for a break";
}
