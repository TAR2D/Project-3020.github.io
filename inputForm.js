class chatBox {
    constructor() {
        this.args = {
            goalButton : document.querySelector("#goalButton"),
            sessionButton : document.querySelector("#taskButton"),
            breakButton : document.querySelector("#breakButton"),
            
            goalForm : document.querySelector(".chatBox__createGoal"),
            sessionForm : document.querySelector(".chatBox__startSession"),
            breakForm : document.querySelector(".chatBox__break"),

            goalCancelBtn : document.querySelector(".createGoalBtngrp button"),
            sessionCancelBtn : document.querySelector(".startSessionBtnGrp button"),
            breakCancelBtn : document.querySelector(".breakBtnGrp button"),

            goalAddBtn : document.querySelector("#goalFormSubmit"),
            sessionAddBtn : document.querySelector("#sessionFormSubmit"),
            breakAddBtn : document.querySelector("#breakFormSubmit")
        }

        this.eventList = [];
        this.goalsList = [];
        this.sessionList = [];
        this.messageList = [];

        // Add default goals and session
        // this.goalsList.push(new Goal());
        // this.sessionList.push(this.goalsList[0]);
    }

    display() {
        const{goalButton,goalForm,
             sessionButton, sessionForm,
              breakButton, breakForm
            ,goalCancelBtn, sessionCancelBtn, breakCancelBtn, 
            goalAddBtn, sessionAddBtn, breakAddBtn} = this.args;

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
            
            this.createMessage("New Goal: " + goalTitle + " Created. Duration: " + 
            goalDurationH + " H and " + goalDurationM + " M");
            let newGoal = new Goal(goalTitle, goalDurationH*60 + goalDurationM);
            this.eventList.push(newGoal);
            this.goalsList.push(newGoal);

            this.updateGoalSelection(newGoal);  // why is it adding it twice?
            
            goalButton.disabled = false;
            //hide form after
            this.hideAll();
        });

        sessionAddBtn.addEventListener('click', () => {
            let sessionFormInfo = $('.chatBox__startSession form').serializeArray();
            let sessionGoalElement = document.querySelector('.chatBox__startSession select');

            let sessionTitle = sessionFormInfo[0].value;
            let sessionDuration = sessionFormInfo[1].value;
            let sessionGoal = this.goalsList[sessionGoalElement[sessionGoalElement.selectedIndex].id];
            
            this.createMessage(
                "New Session: " + sessionTitle + " created. Duration: " + sessionDuration +
                " M. Relative Goal: " + sessionGoal.title
            );

            let newSession = new Session(sessionTitle, sessionDuration, sessionGoal);
            sessionGoal.addSession(newSession);
            this.eventList.push(newSession);
            this.sessionList.push(newSession);

            sessionButton.disabled = false;
            this.hideAll();
        });

        breakAddBtn.addEventListener('click', () => {
            let breakFormInfo = $('.chatBox__break form').serializeArray();

            let breakDuration = breakFormInfo[0].value;
            this.createMessage(
                "Break Time set to " + breakDuration
                );
            breakButton.disabled = false;
            this.hideAll();
        });
    }

    updateGoalSelection(goal) {
        let goalSelection = document.querySelector(".goalRelatedSession select");
        let newOption = document.createElement("option");
        console.log("goallist length: " + this.goalsList.length);
        newOption.id = this.goalsList.length - 1;
        newOption.value = goal.title;
        newOption.innerHTML = goal.title;
        goalSelection.appendChild(newOption);
    }

    createMessage(text) {
        let msgBox = document.querySelector(".chatBox__msgBox");
        let message = document.createElement('p');
        message.innerHTML = text;
        msgBox.appendChild(message);
        // Scroll Down with Chat
        $(".chatBox").stop().animate({ scrollTop: $(".chatBox")[0].scrollHeight}, 1000);
    }

    changeState(form) {
        this.hideAll();
        form.style.display = "flex";
        $(".chatBox").stop().animate({ scrollTop: $(".chatBox")[0].scrollHeight}, 1000);
    }

    hideAll() {
        const{goalForm, sessionForm, breakForm} = this.args;
        goalForm.style.display = "none";
        sessionForm.style.display = "none";
        breakForm.style.display = "none";
    }
}

const cb = new chatBox();
cb.display();

// export function getChatBox() {
//     return cb;
// };

// Prevent Submitting Form
$(".chatBox__createGoal form").submit(function(e) {
    e.preventDefault();
});

$(".chatBox__startSession form").submit(function(e) {
    e.preventDefault();
});

$(".chatBox__break form").submit(function(e) {
    e.preventDefault();
});


let goals = cb.goalsList;  // list of Goal objects
let events = cb.eventList;

var goalsNavButton = document.querySelector(".navBar__item--goals");
var goalsPage = document.querySelector(".goalsBody");

goalsNavButton.addEventListener("click", setUpGoals);

const arrowDownSymbol = '<i class="fas fa-arrow-down"></i>';

// creates some data to show on goal page. feel free to add or change anything.
function createRandomData(){
    let randomGoalNames = ["COMP 3380", "COMP 2080", "MATH 1700", "COMP 3020", "MATH 1300"];
    let randomSessionNames = [["Assignment 1", "Test 1", "Assignment 2"], ["Test 1", "Quiz 2"], 
        ["Assignment 1", "Assignment 2"], ["Work on web application :)"], ["Test 1"]];
    let randomSessionDurations = [[25, 20, 15], [160, 70], [5, 60], [100], [300]];
    let randomSessionElapsedTime = [[13, 14, 15], [160, 50], [5, 0], [100], [0]];
    let numGoals = 5, numSessions;
    let newGoal, newSession;

    for(let i = 0; i < numGoals; i++) {
        newGoal = new Goal(randomGoalNames[i]);
        
        numSessions = randomSessionNames[i].length;
        for(let j = 0; j < numSessions; j++) {
            newSession = new Session(randomSessionNames[i][j], randomSessionDurations[i][j], newGoal);
            newSession.updateSession(randomSessionElapsedTime[i][j]);
            newGoal.addSession(newSession);
        }

        goals.push(newGoal);
        events.push(newGoal);
    }
}
createRandomData(); // insert random data

// builds the list of goals
function setUpGoals() {
    let goalDiv, sessionList, progress, progressVal, currGoal;
    let goalID, goalButtonID, sessionID;

    for(let i = 0; i < goals.length; i++) {
        
        goalID = 'goal' + i;
        goalDiv = document.getElementById(goalID);          // find div representing a goal on goals page
        currGoal = goals[i];
        
        if(!goalDiv) {                                      // only create goal if we haven't created it yet
            goalDiv = document.createElement("div");        // create new div element to represent that goal
            goalDiv.className = 'goal';
            goalDiv.id = goalID;                        
            
            // store goal name with arrow
            goalButtonID = 'goalbutton' + i;
            goalDiv.innerHTML = '<input class="goal-button" id="' + goalButtonID + '" type="checkbox"></input>'; 
            goalDiv.innerHTML += '<label for="' + goalButtonID + '"><p id="goalname">'
                + currGoal.title + '</p><p class="goalarrowdown">' + arrowDownSymbol + '</p></label>';
            
            // create div that holds the progress bar and progress percentage
            progress = document.createElement("div");
            progress.className = 'progress-container';
            progressVal = getGoalProgress(currGoal); // calcualte progress of that goal
            // create the progress bar and progress percentage
            progress.innerHTML += '<div class="progressbar-container"><div class="progressbar" style="width:' + 
                progressVal + '%"></div></div><div class="progress-percentage"><p>' + progressVal + '%</p></div>';
            goalDiv.appendChild(progress);

            sessionList = document.createElement("ul");    // create unordered list to store sessions
            sessionList.className = 'sessionlist';
            sessionID = 'goal' + i + 'sessions';
            sessionList.id = sessionID;
            goalDiv.appendChild(sessionList);             // add list to goal div
            goalsPage.appendChild(goalDiv);               // add goal div to goals page
        }

        // check if list of sessions for each goal needs to be updated with new values
        sessionList = document.getElementById(sessionID);   // get list of sessions for current goal
        updateTaskList(currGoal, i, sessionList);                                
    }
}

function updateTaskList(currGoal, currGoalIndex, sessionList) {
    let listItem, currSession;

    let goalSessions = currGoal.getListOfSessions();      // grab array of sessions associated with current goal
    // let taskDurations = taskDuration[currGoalIndex];   // grab array of time associated with those sessions for the current goal

    for(let i = 0; i < goalSessions.length; i++) {  // go through array of sessions
        currSession = document.getElementById('goal' + currGoalIndex + 'session' + i);

        if(!currSession) {                          // only create new task if it hasn't been created
            currSession = goalSessions[i];
            listItem = document.createElement("li");      // create list item for new task
            listItem.id = 'goal' + currGoalIndex + 'session' + i;
             // store name and duration of task in list
            listItem.innerHTML = '<li class="taskname">' + currSession.title + '</li><li class="timeval">' + 
                convertToTimeFormat(currSession.elapsedTime, currSession.duration) + '</li>'; 
            sessionList.appendChild(listItem);                             // store list item in unordered list
        }
    }
    setUpSummary('goaltimespent', 'Time spent on goal:', currGoalIndex, currGoal.calculateElapsedTime(), sessionList);
    setUpSummary('goaltimeleft', 'Time remaining:', currGoalIndex, currGoal.calculateTimeRemaining(), sessionList);
    setUpSummary('goaltotaltime', 'Goal duration:', currGoalIndex, currGoal.duration, sessionList);
}

function setUpSummary(summaryType, message, currGoalIndex, time, dropDownList) {
    let timeToDisplay = convertMinToFormat(time);
    let listItem = document.getElementById(summaryType + currGoalIndex);

    if(!listItem){    // create list item if it doesn't exist
        listItem = document.createElement("li");
        listItem.className = 'goalSummary ' + summaryType;  // leave space between
        listItem.innerHTML = '<li>' + message + '</li><li class="timeval" id="' + summaryType + currGoalIndex + '">' + timeToDisplay + '</li>';
        dropDownList.appendChild(listItem);
    }
    else{    // if element exists, update the time value
        document.getElementById(summaryType + currGoalIndex).innerHTML = timeToDisplay;
    }
}

function getGoalProgress(goal) {
    return Math.floor((goal.calculateElapsedTime()/goal.duration)*100);
}

// takes a string representing time associated with a task in the form '16/25' and 
// turns it into '0:16:00/0:25:00'
function convertToTimeFormat(elapsedTime, totalTime) {
    return convertMinToFormat(elapsedTime) + '/' + convertMinToFormat(totalTime);
}

// takes minutes and converts it to right format (ex: 16 becomes 00:16:00)
function convertMinToFormat(origTimeInMinutes) {
    let hours, mins;

    hours = Math.floor(origTimeInMinutes/60);

    if(hours > 0) {
        mins = Math.abs(Math.round((hours - origTimeInMinutes/60) * 60));
        mins = addZero(mins);
        hours = addZero(hours);
    }
    else {
        hours = '00';
        mins = addZero(origTimeInMinutes);
    }

    return hours + ':' + mins + ':' + '00'; // TO-DO: implement specifying seconds
}

// adds extra zero to val if val < 10 (ex: '7' turns into '07')
function addZero(val) {
    var result = val;

    if(val < 10) {
        result = '0' + val;
    }
    return result;
}