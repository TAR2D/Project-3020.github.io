class chatBox {
    constructor() {
        this.args = {
            goalButton: document.querySelector("#goalButton"),
            sessionButton: document.querySelector("#taskButton"),
            breakButton: document.querySelector("#breakButton"),

            goalForm: document.querySelector(".chatBox__createGoal"),
            sessionForm: document.querySelector(".chatBox__startSession"),
            breakForm: document.querySelector(".chatBox__break"),

            goalCancelBtn: document.querySelector(".createGoalBtngrp button"),
            sessionCancelBtn: document.querySelector(".startSessionBtnGrp button"),
            breakCancelBtn: document.querySelector(".breakBtnGrp button"),

            goalAddBtn: document.querySelector("#goalFormSubmit"),
            sessionAddBtn: document.querySelector("#sessionFormSubmit"),
            breakAddBtn: document.querySelector("#breakFormSubmit")
        }

        this.eventList = [];
        this.goalsList = [];
        this.sessionList = [];
        this.messageList = [];

        //Add default goals and session
        let defaultGoal = new Goal();
        this.goalsList.push(defaultGoal);
        this.updateGoalSelection(defaultGoal);
        this.sessionList.push(this.goalsList[0]);

        this.breakState = 0;

        this.currentSessionInProgress = null;   // current session user is working on
    }

    display() {
        const startButton = document.getElementById("startStop");
        const skipButton = document.getElementById("skip");
        
        const { goalButton, goalForm,
            sessionButton, sessionForm,
            breakButton, breakForm
            , goalCancelBtn, sessionCancelBtn, breakCancelBtn,
            goalAddBtn, sessionAddBtn, breakAddBtn } = this.args;

        window.addEventListener('load', () => {
            this.addMessageTime();
            this.createMessage("Welcome! To get started, please set your first session. You can do that by clicking the <b>Set Session</b> button below!");
        })

        goalButton.addEventListener('click', () => {
            this.changeState(goalForm);
            goalButton.disabled = true;
            breakButton.disabled = false;
            sessionButton.disabled = false;
        });

        sessionButton.addEventListener('click', () => {
            this.changeState(sessionForm);
            goalButton.disabled = false;
            breakButton.disabled = false;
            sessionButton.disabled = true;
        });

        breakButton.addEventListener('click', () => {
            this.changeState(breakForm);
            goalButton.disabled = false;
            breakButton.disabled = true;
            sessionButton.disabled = false;
        });

        goalCancelBtn.addEventListener('click', () => {
            this.hideAll();
            goalButton.disabled = false;
        });

        sessionCancelBtn.addEventListener('click', () => {
            this.hideAll();
            sessionButton.disabled = false;
        });

        breakCancelBtn.addEventListener('click', () => {
            this.hideAll();
            breakButton.disabled = false;
        });

        goalAddBtn.addEventListener('click', () => {

            let goalFormInfo = $('.chatBox__createGoal form').serializeArray();
            let goalTitle = goalFormInfo[0].value;
            let goalDurationH = Number(goalFormInfo[1].value);
            let goalDurationM = Number(goalFormInfo[2].value);

            if (goalDurationH < 0 || goalDurationM < 0) {
                alert("Time input should be greater than 0.");
            } else if(goalDurationM>=60) {
                alert("Minutes should be less than 60.");
            } else {
                companionTalking(); 
                this.addMessageTime();
                
                this.createMessage(
                    "Your goal, <b>" + goalTitle + "</b>, has been created. You must do <b>" + goalDurationH + " hours and " + goalDurationM + " minutes </b> of sessions to complete your goal.");
                    //"New Goal: " + goalTitle + " Created. Duration: " +
                    //goalDurationH + " H and " + goalDurationM + " M");
                let newGoal = new Goal(goalTitle, 60*(goalDurationH * 60 + goalDurationM));
                this.eventList.push(newGoal);
                this.goalsList.push(newGoal);

                this.updateGoalSelection(newGoal);

                goalButton.disabled = false;
                //hide form after
                this.hideAll();
            }
        });

        sessionAddBtn.addEventListener('click', () => {
            let sessionFormInfo = $('.chatBox__startSession form').serializeArray();
            let sessionGoalElement = document.querySelector('.chatBox__startSession select');
            let goalIndex = sessionGoalElement[sessionGoalElement.selectedIndex].id;
            let sessionTitle = sessionFormInfo[0].value;
            let sessionDuration = Number(sessionFormInfo[1].value);
            let sessionGoal = this.goalsList[goalIndex];

            if (sessionDuration < 0 || sessionDuration>60) {
                alert("Sessions can only be between 0 and 60 minutes long.");
            } else {

                companionTalking(); 
                this.addMessageTime();

                this.createMessage(
                    "Your session, <b>" + sessionTitle + "</b>, has been set for <b>" + sessionDuration + " minutes</b> under your goal called <b>" + sessionGoal.title + "</b>."

                   // "New Session: " + sessionTitle + " created. Duration: " + sessionDuration +
                   // " min. Relative Goal: " + sessionGoal.title
                );

                let newSession = new Session(sessionTitle, 60*sessionDuration, sessionGoal);
                sessionGoal.addSession(newSession);
                this.eventList.push(newSession);
                this.sessionList.push(newSession);
                this.currentSessionInProgress = newSession;
                
                sessionButton.disabled = true;
                this.hideAll();

                if (skipButton.disabled) {
                    skipButton.disabled = false;
                    startButton.disabled = false;
                }

                //update timer
                // skipTime();
                updateTimeSession(sessionDuration);
                //startStop();

                this.createMessage(
                    "To start your session, please press the <b>play</b> button beside the timer."
                );

                //update left box
                document.getElementById("currGoal").innerHTML = "Current Goal: "+sessionGoal.title;
                document.getElementById("currSession").innerHTML = "Current Session: " + sessionTitle;
            }
        });

        breakAddBtn.addEventListener('click', () => {
            let breakFormInfo = $('.chatBox__break form').serializeArray();

            let breakDuration = breakFormInfo[0].value;

            if (breakDuration < 0) {
                alert("Time input should be greater than 0.");
            } else {
                if (confirmSkipBreak()) {
                    companionTalking(); 
                    this.addMessageTime();
                    this.createMessage(
                        "Your break has started and will last for <b>" + breakDuration + " minutes</b>."
                    );
                    breakButton.disabled = false;
                    this.hideAll();

                    //update time
                    
                        updateTimeBreak(breakDuration);
                        startStop();
                    
                    if (skipButton.disabled) {
                        skipButton.disabled = false;
                        startButton.disabled = false;
                    }

                    this.createBreakMsg(this.breakState);
                    this.breakState = (this.breakState+1)%3;
                }
            }
        });
    }

    createBreakMsg(breakState) {

        switch (breakState) {
            //cat video
            case 0: 
                this.createMessage("Need a laugh? Watch this funny cat video on your break!");
                this.createMessage("<iframe width=\"100%\" src=\"https://www.youtube.com/embed/ByH9LuSILxU\"> </iframe>");
                break;

            //breathing/meditation video
            case 1: 
                this.createMessage("Need to relax? Watch this mini meditation video!");
                this.createMessage("<iframe width=\"100%\" src=\"https://www.youtube.com/embed/cEqZthCaMpo\"> </iframe>");
                break;

            //stretching video
            case 2:
                this.createMessage("Take a break and stretch! Watch this short video about stretching at your desk!");
                this.createMessage("<iframe width=\"100%\" src=\"https://www.youtube.com/embed/KBaSGF6kYqw\"> </iframe>");
                break;
        }

    }

    updateGoalSelection(goal) {
        let goalSelection = document.querySelector(".goalRelatedSession select");
        let newOption = document.createElement("option");
        newOption.id = this.goalsList.length - 1;
        newOption.innerHTML = goal.title;
        newOption.value = goal.title;
        goalSelection.appendChild(newOption);
    }

    createMessage(text) {
        let msgBox = document.querySelector(".chatBox__msgBox");
        let message = document.createElement('p');
        message.innerHTML = text;
        msgBox.appendChild(message);
        // Scroll Down with Chat
        $(".chatBox").stop().animate({ scrollTop: $(".chatBox")[0].scrollHeight }, 1000);
    }

    addMessageTime() {
        let msgBox = document.querySelector(".chatBox__msgBox");
        let message = document.createElement('div');
        message.className = 'chatMsgDate';
        let currTime = new Date(); 
        message.innerHTML = currTime.toString().slice(0, 24);; 
        msgBox.appendChild(message);
        // Scroll Down with Chat
        $(".chatBox").stop().animate({ scrollTop: $(".chatBox")[0].scrollHeight }, 1000);
    }

    changeState(form) {
        this.hideAll();
        form.style.display = "flex";
        $(".chatBox").stop().animate({ scrollTop: $(".chatBox")[0].scrollHeight }, 1000);
    }

    hideAll() {
        const { goalForm, sessionForm, breakForm } = this.args;
        goalForm.style.display = "none";
        sessionForm.style.display = "none";
        breakForm.style.display = "none";
    }
}

const cb = new chatBox();
cb.display();

// Prevent Submitting Form
$(".chatBox__createGoal form").submit(function (e) {
    e.preventDefault();
});

$(".chatBox__startSession form").submit(function (e) {
    e.preventDefault();
});

$(".chatBox__break form").submit(function (e) {
    e.preventDefault();
});

// -------------- Start of Timer Code -------------- //

const timer = document.querySelector("#timer h1");
let timerSessionState = document.querySelector('.timerSessionState h2');
let TSSoverlayEffect = document.querySelector('.TSSoverlay');
let initialSec = 20 * 60;   //intially at 20 min.
let breakSecond = 5 * 60;   //initially at 5 min.
let seconds = initialSec; //take same initial 20 seconds.
let statusTimer = "stopped";  //initially it will be paused
let isOnBreak = false;        //it will be on task when first opened.

let interval = null;
displayTime(seconds);

// In this function we will update the time when the user clicks on the timer.
function updateTimeEntered() {
    let str = timer.innerHTML;
    let newMin = parseInt(str.substr(0, str.indexOf(":")));
    let newSec = parseInt(str.substr(str.indexOf(":") + 1));

    if (Number.isNaN(newMin) || Number.isNaN(newSec)) {
        alert("A number is required of the form min:sec");
    } else if (newMin < 0 || newSec < 0 || newMin > 60 || newSec > 60) {
        alert("The numbers should be from 0 to 60.");
    } else {
        seconds = newMin * 60 + newSec;  //calculate seconds
        isOnBreak ? breakSecond = seconds : initialSec = seconds;
    }
    displayTime(seconds);
}

function updateTimeSession( min ) {
    isOnBreak = false;
    seconds = min * 60;
    initialSec = seconds;
    displayTime(seconds);
}

function updateTimeBreak( min ) {
    isOnBreak = true;
    seconds = min*60;
    breakSecond = seconds;
    displayTime(seconds);
}

function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

//Function will be called repeatedly until a pause or skip button is pressed or time is 0.
function startTimer() {
	let widthRange = isOnBreak ? scale(breakSecond - seconds, 0, breakSecond, 0, 100) : scale(initialSec - seconds, 0, initialSec, 0, 100);
	TSSoverlayEffect.style.width = widthRange + "%";
    seconds--;
    displayTime(seconds);
    if(!isOnBreak)
        cb.currentSessionInProgress.incrementElapsedTime();
    if (seconds == 0 || seconds < 1) {  //time runs out
        seconds = 0;
        alarm();
        skipTime();
    }
}

function startStop() {
    if (statusTimer === "stopped") {
        //Start the timer (by calling the setInterval() function)
        interval = window.setInterval(startTimer, 1000);
        document.querySelector("#startStop i").className = "fas fa-pause";
        statusTimer = "started";
        document.querySelector("#taskButton").disabled = true; // disable session button while timer is running
        timer.contentEditable = "false";
    } else {
        window.clearInterval(interval);
        document.querySelector("#startStop i").className = "fas fa-play";
        statusTimer = "stopped";
    }
}

function skipTime() {
    TSSoverlayEffect.style.width = "0%";
    isOnBreak ? isOnBreak = false : isOnBreak = true; //checks if it comes another task or another break.
    isOnBreak ? (seconds = breakSecond) : (seconds = initialSec); //if it is a break then chances time to break time.
    if (isOnBreak) {
        timerSessionState.innerHTML = "On Break";
    } else {
        timerSessionState.innerHTML = "Working";
    }
    displayTime(0);
    statusTimer = "started";
    startStop();
    timer.contentEditable = "true";
    document.querySelector("#taskButton").disabled = false; // enable session button again when time is skipped
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
    if (confirm("Your remaining progress time will not be saved. Are you sure you want to skip?")) {
        skipTime();
        return true;
    } else {
        //Uncomment this if you want to pause after canceling skip.
        // startStop();
    }
}

function confirmSkipBreak() {
    if (confirm("Your remaining progress time will not be saved. Are you sure you want to start a new break?")) {
        skipTime();
        return true;
    } else {
        //Uncomment this if you want to pause after canceling skip.
        // startStop();
    }
}

function alarm(){
    let alarmSound = new Audio('alarm.mp3');  // play alarm (source: https://freesound.org/people/kwahmah_02/sounds/250629/)
    alarmSound.load();
    alarmSound.volume = document.getElementById("volumeSlider").value/100;   //set volume of the alarm.
    if (document.getElementById("toggleSound").checked){ //checks settings.
        alarmSound.play();
    }
}

// -------------- End of Timer Code -------------- //

// ---- Start of Goal Page Code ---- //

let goals = cb.goalsList;  // list of Goal objects
let events = cb.eventList;

var goalsNavButton = document.querySelector(".navBar__item--goals");
var goalsPage = document.querySelector(".goalsBody");

goalsNavButton.addEventListener("click", setUpGoals);

const arrowDownSymbol = '<i class="fas fa-arrow-down"></i>';
const menuSymbolCircles= '<i class="fas fa-ellipsis-v"></i>';
const menuSymbolBars = '<i class="fas fa-bars"></i>';

// creates some data to show on goal page. feel free to add or change anything.
function createRandomData() {
    let randomGoalNames = ["COMP 3380", "COMP 2080", "MATH 1700", "COMP 3020", "MATH 1300"];
    let randomSessionNames = [["Assignment 1", "Test 1", "Assignment 2"], ["Test 1", "Quiz 2"],
    ["Assignment 1", "Assignment 2"], ["Work on web application :)"], ["Test 1"]];
    let randomGoalDuration = [60, 60, 65, 40, 40];
    let randomSessionDurations = [[25, 28, 35], [37, 20], [20, 60], [40], [35]];
    let randomSessionElapsedTime = [[13, 18, 35], [37, 18], [20, 0], [40], [0]];
    let numGoals = 5, numSessions;
    let newGoal, newSession;

    for (let i = 0; i < numGoals; i++) {
        newGoal = new Goal(randomGoalNames[i], 60*randomGoalDuration[i]);

        numSessions = randomSessionNames[i].length;
        for (let j = 0; j < numSessions; j++) {
            newSession = new Session(randomSessionNames[i][j], 60*randomSessionDurations[i][j], newGoal);
            newSession.updateSession(60*randomSessionElapsedTime[i][j]);
            newGoal.addSession(newSession);
        }

        goals.push(newGoal);
        events.push(newGoal);
        cb.updateGoalSelection(newGoal);
    }
}
createRandomData(); // insert random data

// builds the list of goals
function setUpGoals() {
    let goalDiv, sessionsList, progress, progressVal, currGoal;
    let goalID, goalButtonID, sessionID;
    
    // start at i = 1 so we avoid creating a div for Default goal
    for (let i = 1; i < goals.length; i++) {

        goalID = 'goal' + i;
        goalDiv = document.getElementById(goalID);          // find div representing a goal on goals page
        currGoal = goals[i];
        sessionID = 'goal' + i + 'sessions';

        if(!goalDiv) { 
            goalDiv = document.createElement("div");        // create new div element to represent that goal
            goalDiv.className = 'goal';
            goalDiv.id = goalID;

            // create goal label
            goalButtonID = 'goalbutton' + i;
            goalDiv.innerHTML = '<input class="goal-button" id="' + goalButtonID + '" type="checkbox"></input>';
            goalDiv.innerHTML += '<label class="goal-label" for="' + goalButtonID + '"><div class="goalname"><p>'
                + currGoal.title + '</p></div>' + '<div class="goalprogress" id="goalprogress' + i + '"></div></label>';
            
            // create progress bar
            goalDiv.innerHTML += '<div class="progressbar-container"><div class="progressbar" id="progressbar' + i + '"></div>' + '</div>';

            sessionsList = document.createElement("ul");   // create unordered list to store sessions
            sessionsList.className = 'sessionlist';
            sessionsList.id = sessionID;
            goalDiv.appendChild(sessionsList);             // add list to goal div
            goalsPage.appendChild(goalDiv);                // add goal div to goals page
        }

        // check if list of sessions for each goal needs to be updated with new values
        sessionsList = document.getElementById(sessionID);   // get list of sessions for current goal
        updateTaskList(currGoal, i, sessionsList);
        updateGoalProgress(currGoal, i);                    // update progress values
    }
}

function updateGoalProgress(currGoal, goalIndex) {
    let progressVal = getGoalProgress(currGoal); // calculate progress of a goal

    // update goal progress and goal percentage in goal label
    document.getElementById('goalprogress' + goalIndex).innerHTML = '<h1>' + convertToTimeFormat(currGoal.calculateElapsedTime(), currGoal.duration) + 
    '&nbsp(' + progressVal + '%)&nbsp</h1>' + menuSymbolBars;

    // update goal progress bar width
    document.getElementById('progressbar' + goalIndex).style.width = progressVal + '%';
}

function updateTaskList(currGoal, currGoalIndex, sessionsList) {
    let listItem, currSession, sessionID, sessionProgress;

    let goalSessions = currGoal.getListOfSessions();      // grab array of sessions associated with current goal

    for (let i = 0; i < goalSessions.length; i++) {  // go through array of sessions
        sessionID = 'goal' + currGoalIndex + 'session' + i;
        currSession = document.getElementById(sessionID);

        if (!currSession) {                                // only create new task if it hasn't been created
            currSession = goalSessions[i];
            listItem = document.createElement("li");      // create list item for new task
            listItem.id = sessionID;
            listItem.className = 'session-items';
            // store name and duration of task in list item
            listItem.innerHTML = '<li class="taskname">' + currSession.title + '</li><li class="timeval" id="' + sessionID + 'progress' 
                + i + '">' + convertToTimeFormat(currSession.elapsedTime, currSession.duration) + '</li>';
            sessionsList.insertBefore(listItem, sessionsList.childNodes[goalSessions.length-1]);
        }
        else {
            sessionProgress = document.getElementById(sessionID + 'progress' + i);
            sessionProgress.innerHTML = convertToTimeFormat(goalSessions[i].elapsedTime, goalSessions[i].duration);
        }
    }
    setUpSummary('goaltimespent', 'Time spent on goal:', currGoalIndex, Number(currGoal.calculateElapsedTime()), sessionsList);
    setUpSummary('goaltimeleft', 'Time remaining:', currGoalIndex, Number(currGoal.calculateTimeRemaining()), sessionsList);
    setUpSummary('goaltotaltime', 'Goal duration:', currGoalIndex, Number(currGoal.duration), sessionsList);
}

function setUpSummary(summaryType, message, currGoalIndex, time, dropDownList) {
    let timeToDisplay = convertSecToFormat(time);
    let listItem = document.getElementById(summaryType + currGoalIndex);

    if (!listItem) {    // create list item if it doesn't exist
        listItem = document.createElement("li");
        listItem.className = 'goalSummary ' + summaryType;  // leave space between
        listItem.innerHTML = '<li>' + message + '</li><li class="timeval" id="' 
            + summaryType + currGoalIndex + '">' + timeToDisplay + '</li>';
        dropDownList.appendChild(listItem);
    }
    else {    // if element exists, update the time value
        document.getElementById(summaryType + currGoalIndex).innerHTML = timeToDisplay;
    }
}

function getGoalProgress(goal) {
    return Math.floor((goal.calculateElapsedTime() / goal.duration) * 100);
}

// takes two times given in minutes and turns it into the format '0:16:00/0:25:00'
function convertToTimeFormat(elapsedTime, totalTime) {
    return convertSecToFormat(elapsedTime) + '/' + convertSecToFormat(totalTime);
}

function convertSecToFormat(timeInSecs) {
    let date = new Date(0);
    date.setSeconds(timeInSecs);
    return date.toISOString().substr(11, 8);
}