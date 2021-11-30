import StudySession from './StudySession.js';
/*
/   Goal
*/

'use strict';
class Goal{
   
    constructor(name, duration){
        this.name = name;
        this.duration = duration;
        this.studySessions = [];
        this.numStudyS = 0;
        this.elapsed = 0;
        this.completed = false;
    }
    
    addStudySession(SsName, SsDuration){
        var studyS = new StudySession(SsName, SsDuration);
        this.elapsed += studyS.duration;    //increase time worked.
        if (this.elapsed > this.duration){  //time completed.
            this.elapsed = this.duration;
            this.completed = true;
        }
        this.studySessions.push(studyS);
        this.numStudyS++;
    };

    //For testing (returns all of the study sessions.)
    allStudySessions(){
        var s ="";
        for (var i = 0; i < this.numStudyS; i++){
            s+= i+": "+this.studySessions[i].name + "\n";
        }
        return s;
    };
    
}
export default Goal;