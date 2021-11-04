let companionImage = document.getElementById("companion");
let goalButton = document.getElementById("goalButton");
let taskButton = document.getElementById("taskButton");
let breakButton = document.getElementById("breakButton");

//Start waving animation after page loads 
window.addEventListener("load", waving);

//Change animation when buttons are clicked
goalButton.addEventListener("click", talking); 
taskButton.addEventListener("click", talking); 
breakButton.addEventListener("click", talking); 

//Waving animation 
function waving(){
    companionImage.src = "images/waving-fullsize.gif";
    setTimeout(idle, 4000);
}

//Talking animation
function talking(){
    companionImage.src = "images/talking-fullsize.gif";
    setTimeout(idle, 9500);
}

//Idle animation
function idle(){
    companionImage.src = "images/blinking-fullsize.gif";
}
