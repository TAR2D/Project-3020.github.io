
let timeMinutes = getMinutes();   //get the minutes
let timeSecond = timeMinutes*60;  //calculate seconds

const timeH = document.getElementById("timer");
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

//Show createTask and hide createGoal and startBreak
function createTask(){
  makeVisible("createTask", ["createGoal", "startBreak"]);
}

//Show createGoal and hide createTask and startBreak
function createGoal(){
  makeVisible("createGoal", ["createTask", "startBreak"]);
}

//Show startBreak and hide createGoal and createTask
function startBreak(){
  makeVisible("startBreak", ["createTask", "createGoal"]);
}

//Will make an element visible. Parameter:(Id of the element)
function makeVisible( name, list){
  //hide every element given in the list
  let temp;
  for (var i = 0; i < list.length; i++){ 
    temp = document.getElementById(list[i]);
    if (getStyle(temp, "display") !== "none")
      temp.style.display = "none";
  }
  //hide or show element given.
  var el = document.getElementById(name)
  if (getStyle(el, "display") === "none")
    el.style.display = "block";
  else 
    el.style.display = "none";
}

// getStyle will test the style that's active on an element 'el'.
function getStyle(el, name)
{
  if ( document.defaultView && document.defaultView.getComputedStyle )
  {
    var style = document.defaultView.getComputedStyle(el, null);
    if ( style )
      return style[name];
  }
  else if ( el.currentStyle )
    return el.currentStyle[name];
  return null;
}
