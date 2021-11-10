const TimePicker = tui.TimePicker;

var tpSpinbox = new tui.TimePicker('#timepicker-selectbox', {
    initialHour: 0,
    initialMinute: 15,
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