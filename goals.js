var goals = ["COMP 3380", "COMP 3020", "MATH 1700", "COMP 3020", "MATH 1300"]; // list of user's goals

// tasks associated with each goal.
// i've set this up so that tasksForGoals[0] is associated with goals[0]
var tasksForGoals = [["Assignment 1", "Test 1", "Assignment 2"], 
                     ["Test 1", "Quiz 2"], 
                     ["Assignment 1", "Assignment 2"],
                     ["Work on web application :)"],
                     ["Test 1"]];


// time spent on task and total task duration of all goals
// where taskDuration[0] are the duration of tasks for goals[0]
var taskDuration = [['13/25', '14/20', '15/15'],   
                        ['160/160', '50/70'],
                        ['5/5', '0/60'],
                        ['100/100'],
                        ['0/300']];

var goalsNavButton = document.querySelector(".navBar__item--goals");
var goalsContent = document.getElementById("goalsContent");
var createGoalButton = document.getElementById("createGoalButton");

goalsNavButton.addEventListener("click", setUpGoals);
createGoalButton.addEventListener("click", addNewGoal);

const arrowDownSymbol = '<i class="fas fa-arrow-down"></i>';

// adds new goal to user's list of goals
function addNewGoal() {
    let newGoalName = document.getElementById("gname").value;   // grab string from goal name input field
    goals.push(newGoalName);                                    // add it to list of goals
    tasksForGoals.push([]);                                     // new goal has no tasks associated with it at the start
    taskDuration.push([]);
}

// builds the list of goals (keep this logic to be used when "backend" is finished)
function setUpGoals() {
    var div, button, ul, progress, progressVal;

    for(let i = 0; i < goals.length; i++) {
        div = document.getElementById('goal' + i);      // grab div representing a goal on goals page

        if(!div) {                                      // check if we already created that goal
            div = document.createElement("div");        // create new div element to represent that goal
            div.className = 'goal';
            div.id = 'goal' + i;                        // give goal a unique id
            button = document.createElement("div");  // create button element 
            button.innerHTML = '<button class="goal-button"><p id = "goalname">'+ goals[i] + '</p>' + '<p id="goalarrowdown">' + arrowDownSymbol + '</p></button>';  // store goal name with arrow
            // div.appendChild(button);                    // store button in div
            
            progress = document.createElement("div");
            progress.className = 'progress-container';
            progressVal = getGoalProgress(taskDuration[i]);
            if(!progressVal)
                progressVal = 0;
            console.log(progressVal);
            progress.innerHTML += '<div class="progressbar-container"><div class="progressbar" style="width:' + 
                                    progressVal + '%"></div></div><p class="progress-percentage">' + progressVal + '%</p>';
            button.append(progress);

            ul = document.createElement("ul");          // create unordered list to store tasks
            ul.id = 'goal' + i + 'tasks';               // give unordered list unique id
            button.appendChild(ul);
            div.appendChild(button);
            goalsContent.appendChild(div);              
        }

        ul = document.getElementById('goal' + i + 'tasks'); // get list of tasks for current goal
        updateTaskList(i, ul);                              // set up list of tasks
        // console.log(div);
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
            li.innerHTML = '<li>' + tasks[taskIndex] + '</li>';
            li.innerHTML += '<li class="goalduration">' + convertToTimeFormat(taskDurations[taskIndex]) + '</li>';  // store name and duration of task in list
            ul.appendChild(li);                                    // store list item in unordered list
        }
        // console.log(ul);
    }
}

function getGoalProgress(tasksDurationArray) {
    var taskDetails; 
    var progressTowardGoal = 0;
    var entireGoalDuration = 0;

    for(let i = 0; i < tasksDurationArray.length; i++) {
        taskDetails = tasksDurationArray[i].split('/'); // taskDetails[0] = time spent on that task, taskDetails[1] = task duration
        progressTowardGoal += Number(taskDetails[0]);
        entireGoalDuration += Number(taskDetails[1]);
    }
    return Math.floor(progressTowardGoal/entireGoalDuration * 100);
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