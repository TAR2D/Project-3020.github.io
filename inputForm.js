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

        // Add Defualt Goal and session
        this.goalsList.push(new Goal());
        this.sessionList.push(this.goalsList[0]);
    }

    display() {
        const{goalButton,goalForm,
             sessionButton, sessionForm,
              breakButton, breakForm
            ,goalCancelBtn, sessionCancelBtn, breakCancelBtn, 
            goalAddBtn, sessionAddBtn, breakAddBtn} = this.args;

        window.addEventListener('load', () => {
            this.createMessage("Welcome! To get started, please create a new study session.");
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
            let goalDurationH = goalFormInfo[1].value;
            let goalDurationM = goalFormInfo[2].value;

            this.createMessage("New Goal: " + goalTitle + " Created. Duration: " + 
            goalDurationH + " H and " + goalDurationM + " M");

            let newGoal = new Goal(goalTitle, goalDurationH*60 + goalDurationM);
            this.eventList.push(newGoal);
            this.goalsList.push(newGoal);

            this.updateGoalSelection(newGoal);
            
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

            let newSession = new Session(sessionTitle, sessionDuration, sessionGoal)
            this.eventList.push(newSession);
            this.sessionList.push(newSession);

            sessionButton.disabled = false;
            this.hideAll();

            const startButton = document.getElementById("startStop");
            const skipButton = document.getElementById("skip");

            if(skipButton.disabled) {
                skipButton.disabled = false; 
                startButton.disabled = false; 
            }
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
