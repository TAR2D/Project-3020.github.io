'use strict';
import Goal from './Goal.js';

/*
/   allGoals
/   Array that holds the Goals that had been created.
*/

class allGoals {
    constructor(){
        this.goals = [];
        this.goals.push(new Goal("None", 100));
        this.numGoals = 1;
    };

    addGoal(goalName, duration){
        var g = new Goal(goalName, duration);
        this.goals.push(g);
        this.numGoals++;
    };

    getGoal(name){
        var found = false;
        var g;
        for (var i = 0; i < this.numGoals && !found; i++){
            g = this.goals[i];
            if (g.name === name){
                found = true;
            }
        }
        return g;
    };

    repeatedName(name){
        var repeated = false;
        for (var i = 0; i < this.numGoals && !repeated; i++){
            if (this.goals[i].name === name){
                repeated = true;
            }
        }
        return repeated;
    };

    info(){
        var s ="All goals: ";
        for (var i = 0; i < this.numGoals; i++){
            s+= "Name: "+this.goals[i].name + " time: "+ this.goals[i].duration+"\n";
        }
        return s;
    };
}

export default allGoals;