//Start waving animation after page loads 
window.onload = waving(); 

//Waving animation 
function waving(){
    document.getElementById("companion").src = "images/waving-fullsize.gif";
    setTimeout(idle, 4000);
}

//Talking animation
function talking(){
    document.getElementById("companion").src = "images/talking-fullsize.gif";
    setTimeout(idle, 9500);
}

//Idle animation
function idle(){
    document.getElementById("companion").src = "images/blinking-fullsize.gif";
}
