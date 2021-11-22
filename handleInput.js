import allGoals from './allGoals.js';
'use strict';

document.getElementById('createGoalButton').addEventListener("click", newGoalCreated);
document.getElementById('createTaskButton').addEventListener("click", newStudySessionCreated);
const dropDown = document.getElementById('goalForTaskDropdown');
const newGoals = new allGoals();

//When Create goal is clicked.
function newGoalCreated(){
    //get name
    let gName = document.getElementById("gname").value;
    //if name is empty or repeated do nothing. (to implement: show a message indicating the problem)
    if (gName !== "" && !newGoals.repeatedName(gName)){
        //calculate total min.
        let totalMin = tpSpinboxGoals.getMinute() + tpSpinboxGoals.getHour()*60; 
        //create the new Goal.
        newGoals.addGoal(gName, totalMin);
        //Update the dropDown.
        dropDown.add(new Option(gName, undefined));
        //update the left box.
        document.getElementById("currGoal").innerHTML = "Current Goal: " + gName;

        //Prints every goal created (testing)
        //console.log(newGoals.info());   
    }
}

//When Task goal is clicked.
function newStudySessionCreated(){
    //get name of task
    let SsName = document.getElementById("tname").value;
    //if name is empty do nothing
    if (SsName !== ""){
        let totalMin = tpSpinboxTask.getMinute() + tpSpinboxTask.getHour()*60;
        //get the name of the goal to which it belongs. 
        let gName = dropDown.options[dropDown.selectedIndex].value;
        //add the study session to that goal.
        newGoals.getGoal(gName).addStudySession(SsName, totalMin);
        //update the left box.
        document.getElementById("currentTask").innerHTML = "Current Task: " + SsName;
        document.getElementById("currGoal").innerHTML = "Current Goal: " + gName;

        //Prints every study session of that goal(testing).
        //console.log("-> " +newGoals.getGoal(gName).allStudySessions());   
    }
}

//This allows any other .js file to access the data.
export function data(){
    return newGoals;
}
