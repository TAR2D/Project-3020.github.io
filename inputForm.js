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
            breakCancelBtn : document.querySelector(".breakBtnGrp button")
        }
    }

    display() {
        const{goalButton,goalForm,
             sessionButton, sessionForm,
              breakButton, breakForm
            ,goalCancelBtn, sessionCancelBtn, breakCancelBtn} = this.args;

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
            breakCancelBtn.disabled = false;
        });

    }

    changeState(form) {
        this.hideAll();
            form.style.display = "flex";
    }

    hideAll() {
        const{goalForm, sessionForm, breakForm} = this.args;
        goalForm.style.display = "none";
        sessionForm.style.display = "none";
        breakForm.style.display = "none";
    }
}

const c = new chatBox();
c.display();
