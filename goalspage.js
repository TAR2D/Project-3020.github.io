import {getChatBox} from './inputForm.js';

let cb = getChatBox();
let goals = cb.goalsList;               // list of Goal objects

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
    let numGoals = 5, numSessions = 0;
    let newGoal, newSession;

    for(let i = 0; i < numGoals; i++) {
        newGoal = new Goal(randomGoalNames[i]);
        
        numSessions = randomSessionNames[i].length; // num sessions for curr goal
        for(let j = 0; j < numSessions; j++) {
            newSession = new Session(randomSessionNames[i][j], randomSessionDurations[i][j], newGoal);
            newSession.updateSession(randomSessionElapsedTime[i][j]);
            newGoal.addSession(newSession);
        }

        goals.push(newGoal);
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

// 'ul' is an unordered list representing sessions for current goal
function updateTaskList(currGoal, currGoalIndex, ul) {
    let li, currSession;

    let goalSessions = currGoal.getListOfSessions();      // grab array of sessions associated with current goal
    // let taskDurations = taskDuration[currGoalIndex];   // grab array of time associated with those sessions for the current goal

    for(let i = 0; i < goalSessions.length; i++) {  // go through array of sessions
        currSession = document.getElementById('goal' + currGoalIndex + 'session' + i);

        if(!currSession) {                          // only create new task if it hasn't been created
            currSession = goalSessions[i];
            li = document.createElement("li");      // create list item for new task
            li.id = 'goal' + currGoalIndex + 'session' + i;
            li.innerHTML = '<li class="taskname">' + currSession.title + '</li>';    // store name and duration of task in list
            li.innerHTML += '<li class="timeval" id="timespent' + i + '">' + 
                convertToTimeFormat(currSession.elapsedTime, currSession.duration) + '</li>'; 
            ul.appendChild(li);                             // store list item in unordered list
        }
    }

    let timeToDisplay = convertMinToFormat(currGoal.calculateElapsedTime());
    li = document.getElementById('goaltimespent' + currGoalIndex);
    if(!li){    // create list item for goal time spent if it doesn't exist
        li = document.createElement("li");              // add list item for time spent on goal
        li.className = "goalSummary timeSpentonGoal";
        li.innerHTML = '<li>Time spent on goal:</li>';
        li.innerHTML += '<li class="timeval" id="goaltimespent' + currGoalIndex + '">' + timeToDisplay + '</li>';
        ul.appendChild(li);
    }
    else    // if it exists, update the value
        document.getElementById('goaltimespent' + currGoalIndex).innerHTML = timeToDisplay;

    li = document.getElementById('goaltimeleft' + currGoalIndex);
    timeToDisplay = convertMinToFormat(currGoal.calculateTimeRemaining());
    if(!li){
        li = document.createElement("li");              // add list item for time left for goal
        li.className = "goalSummary timeLeft";
        li.innerHTML = '<li>Time remaining:</li>';
        li.innerHTML += '<li class="timeval" id="goaltimeleft' + currGoalIndex + '">' + timeToDisplay + '</li>';
        ul.appendChild(li);
    }
    else
        document.getElementById('goaltimeleft' + currGoalIndex).innerHTML = timeToDisplay;

    li = document.getElementById('goaltotaltime' + currGoalIndex);
    timeToDisplay = convertMinToFormat(currGoal.duration);
    if(!li){
        li = document.createElement("li");              // add list item for total time for goal
        li.className = "goalSummary totalGoalDuration";
        li.innerHTML = '<li>Goal duration:</li>';
        li.innerHTML += '<li class="timeval" id="goaltotaltime' + currGoalIndex + '">' + timeToDisplay + '</li>';
        ul.appendChild(li);
    }
    else
        document.getElementById('goaltotaltime' + currGoalIndex).innerHTML = timeToDisplay;
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