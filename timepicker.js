// this is for time picker for goal input form
const TimePicker = tui.TimePicker;

// for goals input form
var tpSpinboxGoals = new tui.TimePicker('#timepicker-selectbox-goals', {   // this is a time picker with drop downs
    initialHour: 0,
    initialMinute: 15,  
    inputType: 'selectbox',
    showMeridiem: false         // this enables a.m. and p.m.
});

// for start a break input form
var tpSpinboxBreak = new tui.TimePicker('#timepicker-selectbox-break', {
    initialHour: 0,
    initialMinute: 5,
    inputType: 'selectbox',
    showMeridiem: false        
});

// starting a task input form
var tpSpinboxBreak = new tui.TimePicker('#timepicker-selectbox-task', {
    initialHour: 0,
    initialMinute: 25,
    inputType: 'selectbox',
    showMeridiem: false
});

//Add goal name to left box.
function updateGoal(){
    let gName = document.getElementById("gname").value;
    document.getElementById("currGoal").innerHTML = "Current Goal: " + gName;
}

//Add task name to left box.
function updateTask(){
    //let tName = document.getElementById("tname").value;
    //document.getElementById("currTask").innerHTML = "Current Task: " + tName;
    //uncomment when input for task is done.
}
