// NOTE: have to update this when object hierarchy for goals, study sessions, etc. is completed

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
    taskDuration.push(['0/' + tpSpinboxGoals.getMinute() + tpSpinboxGoals.getHour()*60]);
}

// builds the list of goals (keep this logic to be used when "backend" is finished)
function setUpGoals() {
    var goalDiv, taskList, progress, progressVal;

    for(let i = 0; i < goals.length; i++) {
        goalDiv = document.getElementById('goal' + i);      // grab div representing a goal on goals page
        if(!goalDiv) {                                      // only create goal if we haven't created it yet
            goalDiv = document.createElement("div");        // create new div element to represent that goal
            goalDiv.className = 'goal';
            goalDiv.id = 'goal' + i;                        // give goal a unique id
            
            goalDiv.innerHTML = '<input class="goal-button" id="' + 'goalbutton' + i + '" type="checkbox"></input>';  // store goal name with arrow
            goalDiv.innerHTML += '<label for="' + 'goalbutton' + i + '"><p id="goalname">'
                + goals[i] + '</p>' + '<p id="goalarrowdown">' + arrowDownSymbol + '</p></label>';
            
            
            progress = document.createElement("div");
            progress.className = 'progress-container';
            progressVal = getGoalProgress(taskDuration[i]);

            if(!progressVal)
                progressVal = 0;

            progress.innerHTML += '<div class="progressbar-container"><div class="progressbar" style="width:' + 
                progressVal + '%"></div></div><div class="progress-percentage"><p>' + progressVal + '%</p></div>';
            goalDiv.appendChild(progress);

            taskList = document.createElement("ul");          // create unordered list to store tasks
            taskList.className = 'tasklist';
            taskList.id = 'goal' + i + 'tasks';
            goalDiv.appendChild(taskList);
            goalsBody.appendChild(goalDiv);              
        }

        taskList = document.getElementById('goal' + i + 'tasks');   // get list of tasks for current goal
        updateTaskList(i, taskList);                                // set up list of tasks
    }        

}

// 'goalIndex' is an int that represents the index of a goal in array 'goals' and the index for the
// array of tasks in the 2D array 'tasksForGoals'. 'ul' is the unordered list that holds all the tasks 
// associated with current goal.
function updateTaskList(currGoalIndex, ul) {
    var li, currTask;

    var tasks = tasksForGoals[currGoalIndex];           // grab array of tasks associated with current goal
    var taskDurations = taskDuration[currGoalIndex];   // grab array of time associated with those tasks for the current goal

    for(let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {   // go through array of tasks
        currTask = document.getElementById('goal' + currGoalIndex + 'task' + taskIndex);

        if(!currTask) {    // only create new task if it hasn't been created
            li = document.createElement("li");                     // create list item
            // li.className = 'goaltasks';   // give each task a unique id
            li.id = 'goal' + currGoalIndex + 'task' + taskIndex;
            li.innerHTML = '<li class="taskname">' + tasks[taskIndex] + '</li>';
            li.innerHTML += '<li class="timeval">' + convertToTimeFormat(taskDurations[taskIndex]) + '</li>';  // store name and duration of task in list
            ul.appendChild(li);                                    // store list item in unordered list
        }
    }

    /* TO-DO: fix multiple instances of summary when clicking goals button */
    li = document.createElement("li");              // add list item for time spent on goal
    li.className = "goalSummary timeSpentonGoal";
    li.innerHTML = '<li>Time spent on goal:</li>';
    li.innerHTML += '<li class="timeval">' + convertMinToFormat(progressTowardGoalTime) + '</li>';
    ul.appendChild(li);

    li = document.createElement("li");              // add list item for time left for goal
    li.className = "goalSummary timeLeft";
    li.innerHTML = '<li>Time remaining:</li>';
    li.innerHTML += '<li class="timeval">' + convertMinToFormat(entireGoalDuration - progressTowardGoalTime) + '</li>';
    ul.appendChild(li);

    li = document.createElement("li");              // add list item for total time for goal
    li.className = "goalSummary totalGoalDuration";
    li.innerHTML = '<li>Goal duration:</li>';
    li.innerHTML += '<li class="timeval">' + convertMinToFormat(entireGoalDuration) + '</li>';
    ul.appendChild(li);

    // updateGoalSummary();
}

// function updateGoalSummary(prevProgressTime, prevTimeRemaining, prevGoalDuration) {
// }

function getGoalProgress(tasksDurationArray) {
    var taskDetails;
    progressTowardGoalTime = 0;    // reset values
    entireGoalDuration = 0;

    for(let i = 0; i < tasksDurationArray.length; i++) {
        taskDetails = tasksDurationArray[i].split('/'); // taskDetails[0] = time spent on that task, taskDetails[1] = task duration
        progressTowardGoalTime += Number(taskDetails[0]);
        entireGoalDuration += Number(taskDetails[1]);
    }
    return Math.floor(progressTowardGoalTime/entireGoalDuration * 100);
}

// takes a string representing time associated with a task in the form '16/25' and 
// turns it into '0:16:00/0:25:00'
function convertToTimeFormat(time) {
    var strArray = time.split('/');
    return convertMinToFormat(strArray[0]) + '/' + convertMinToFormat(strArray[1]);
}

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
        result = '0' + val.toString();
    }
    return result;
}