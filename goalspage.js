// NOTE: have to update entire file to use objects

// import {data} from './handleInput.js'; 
// let goals = data();

// arrays below are filled with random data; feel free to add or change
var goals = ["COMP 3380", "COMP 3020", "MATH 1700", "COMP 3020", "MATH 1300"]; // list of user's goals

// tasks associated with each goal.
// i've set this up so that tasksForGoals[0] is associated with goals[0]
var tasksForGoals = [["Assignment 1", "Test 1", "Assignment 2"], 
                     ["Test 1", "Quiz 2"], 
                     ["Assignment 1", "Assignment 2"],
                     ["Work on web application :)"],
                     ["Test 1"]];


// time spent on task and total task duration of a goal,
// where taskDuration[0] are the duration of tasks for goals[0]
var taskDuration = [['13/25', '14/20', '15/15'],   
                    ['160/160', '50/70'],
                    ['5/5', '0/60'],
                    ['100/100'],
                    ['0/300']];

var goalsNavButton = document.querySelector(".navBar__item--goals");
var goalsBody = document.querySelector(".goalsBody");
var createGoalButton = document.getElementById("createGoalButton");

goalsNavButton.addEventListener("click", setUpGoals);
createGoalButton.addEventListener("click", addNewGoal);

const arrowDownSymbol = '<i class="fas fa-arrow-down"></i>';

var progressTowardGoalTime = 0; // time spent towards a goal
var entireGoalDuration = 0;     // entire duration of a goal (all task durations for that goal summed up)

// adds new goal to user's list of goals
function addNewGoal() {
    let newGoalName = document.getElementById("gname").value;   // grab string from goal name input field
    goals.push(newGoalName);                                    // add it to list of goals
    tasksForGoals.push([]);                                     // new goal has no tasks associated with it at the start
    taskDuration.push(['0/' + (tpSpinboxGoals.getMinute() + tpSpinboxGoals.getHour()*60)]);
}

// adds new goal to user's list of goals
function addNewTaskToGoal() {
    let newGoalName = document.getElementById("gname").value;   // grab string from goal name input field
    goals.push(newGoalName);                                    // add it to list of goals
    tasksForGoals.push([]);                                     // new goal has no tasks associated with it at the start
    taskDuration.push(['0/' + (tpSpinboxGoals.getMinute() + tpSpinboxGoals.getHour()*60)]);
}

// builds the list of goals
function setUpGoals() {
    var goalDiv, taskList, progress, progressVal;

    for(let i = 0; i < goals.length; i++) {
        goalDiv = document.getElementById('goal' + i);      // grab div representing a goal on goals page
        if(!goalDiv) {                                      // only create goal if we haven't created it yet
            goalDiv = document.createElement("div");        // create new div element to represent that goal
            goalDiv.className = 'goal';
            goalDiv.id = 'goal' + i;                        
            
            // store goal name with arrow
            goalDiv.innerHTML = '<input class="goal-button" id="' + 'goalbutton' + i + '" type="checkbox"></input>'; 
            goalDiv.innerHTML += '<label for="' + 'goalbutton' + i + '"><p id="goalname">'
                + goals[i] + '</p>' + '<p id="goalarrowdown">' + arrowDownSymbol + '</p></label>';
            
            // create div that holds all the progress items
            progress = document.createElement("div");
            progress.className = 'progress-container';
            progressVal = getGoalProgress(taskDuration[i]); // calcualte progress of that goal

            // create the progress bar and progress percentage
            progress.innerHTML += '<div class="progressbar-container"><div class="progressbar" style="width:' + 
                progressVal + '%"></div></div><div class="progress-percentage"><p>' + progressVal + '%</p></div>';
            goalDiv.appendChild(progress);

            taskList = document.createElement("ul");       // create unordered list to store tasks
            taskList.className = 'tasklist';
            taskList.id = 'goal' + i + 'tasks';
            goalDiv.appendChild(taskList);
            goalsBody.appendChild(goalDiv);              
        }

        // check if list of tasks for each goal needs to be updated with new values
        taskList = document.getElementById('goal' + i + 'tasks');   // get list of tasks for current goal
        updateTaskList(i, taskList);                                
    }
}

// 'ul' is an unordered list representing tasks for current goal
function updateTaskList(currGoalIndex, ul) {
    var li, currTask;

    var tasks = tasksForGoals[currGoalIndex];          // grab array of tasks associated with current goal
    var taskDurations = taskDuration[currGoalIndex];   // grab array of time associated with those tasks for the current goal

    for(let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {   // go through array of tasks
        currTask = document.getElementById('goal' + currGoalIndex + 'task' + taskIndex);

        if(!currTask) {                         // only create new task if it hasn't been created
            li = document.createElement("li");  // create list item for new task
            // store name and duration of task in list
            li.innerHTML = '<li class="taskname">' + tasks[taskIndex] + '</li>';
            li.innerHTML += '<li class="timeval" id="timespent' + taskIndex + '">' + convertToTimeFormat(taskDurations[taskIndex]) + '</li>'; 
            ul.appendChild(li);                             // store list item in unordered list
        }
    }

    li = document.getElementById('goaltimespent' + currGoalIndex);
    if(!li){    // create list item for goal time spent if it doesn't exist
        li = document.createElement("li");              // add list item for time spent on goal
        li.className = "goalSummary timeSpentonGoal";
        li.innerHTML = '<li>Time spent on goal:</li>';
        li.innerHTML += '<li class="timeval" id="goaltimespent' + currGoalIndex + '">' + convertMinToFormat(progressTowardGoalTime) + '</li>';
        ul.appendChild(li);
    }
    else    // if it exists, update the value
        document.getElementById('goaltimespent' + currGoalIndex).innerHTML = convertMinToFormat(progressTowardGoalTime);

    li = document.getElementById('goaltimeleft' + currGoalIndex);
    if(!li){
        li = document.createElement("li");              // add list item for time left for goal
        li.className = "goalSummary timeLeft";
        li.innerHTML = '<li>Time remaining:</li>';
        li.innerHTML += '<li class="timeval" id="goaltimeleft' + currGoalIndex + '">' + convertMinToFormat(entireGoalDuration - progressTowardGoalTime) + '</li>';
        ul.appendChild(li);
    }
    else
        document.getElementById('goaltimeleft' + currGoalIndex).innerHTML = convertMinToFormat(entireGoalDuration - progressTowardGoalTime);

    li = document.getElementById('goaltotaltime' + currGoalIndex);
    if(!li){
        li = document.createElement("li");              // add list item for total time for goal
        li.className = "goalSummary totalGoalDuration";
        li.innerHTML = '<li>Goal duration:</li>';
        li.innerHTML += '<li class="timeval" id="goaltotaltime' + currGoalIndex + '">' + convertMinToFormat(entireGoalDuration) + '</li>';
        ul.appendChild(li);
    }
    else
        document.getElementById('goaltotaltime' + currGoalIndex).innerHTML = convertMinToFormat(entireGoalDuration);
}

function getGoalProgress(tasksDurationArray) {
    var taskDetails;
    progressTowardGoalTime = 0;    // reset values
    entireGoalDuration = 0;

    // go through array representing duration of tasks for a specific goal
    for(let i = 0; i < tasksDurationArray.length; i++) {
        taskDetails = tasksDurationArray[i].split('/'); // taskDetails[0] = time spent on that task, taskDetails[1] = total task duration
        progressTowardGoalTime += Number(taskDetails[0]);   // sum up time spent on all tasks
        entireGoalDuration += Number(taskDetails[1]);       // sum up all task durations
    }
    return Math.floor(progressTowardGoalTime/entireGoalDuration * 100); // return int that represents the progress percentage
}

// takes a string representing time associated with a task in the form '16/25' and 
// turns it into '0:16:00/0:25:00'
function convertToTimeFormat(time) {
    var strArray = time.split('/');
    return convertMinToFormat(strArray[0]) + '/' + convertMinToFormat(strArray[1]);
}

// takes minutes and converts it to right format (ex: 16 becomes 0:16:00)
function convertMinToFormat(origTimeInMinutes) {
    var hours, mins;

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

    return hours + ':' + mins + ':' + '00';
}

// adds extra zero to val if val < 10 (ex: '7' turns into '07')
function addZero(val) {
    var result = val;

    if(val < 10) {
        result = '0' + val;
    }
    return result;
}