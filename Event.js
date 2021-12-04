class Event {
    constructor(title, duration) {
        this.title = title;
        this.duration = duration;
    }
}

class Goal extends Event{

    constructor(title = "Default", duration = 0) {
        super(title, duration);
        this.listOfSession = [];
        this.elapsedTime = 0;  // in seconds
        this.completed = false;
    }

    addSession(session) {
        let sessionDuration = Number(session.duration);
        let totalDurationOfSessions = this.calculateDurationOfSessions();

        if((this.duration - totalDurationOfSessions) < sessionDuration) {
            this.duration = totalDurationOfSessions + sessionDuration;
        }

        this.listOfSession.push(session);
    }

    calculateDurationOfSessions() {
        let totalSessionsDuration = 0;

        for(let i = 0; i < this.listOfSession.length; i++) {
            totalSessionsDuration += Number(this.listOfSession[i].duration);
        }
        return totalSessionsDuration;
    }

    calculateElapsedTime() {
        let timeSpentOnGoal = 0;

        for(let session of this.listOfSession) {
            timeSpentOnGoal += session.elapsedTime;
        }
        this.elapsedTime = timeSpentOnGoal;
        return this.elapsedTime;
    }

    calculateTimeRemaining() {
        return this.duration - this.elapsedTime;
    }

    getListOfSessions() {
        return this.listOfSession;
    }

    getNumberOfSessions() {
        return this.listOfSession.length;
    }
}

class Session extends Event {

    constructor(title = "Default", duration = 0, goal) {
        super(title, duration);
        this.elapsedTime = 0; // in seconds
        this.goal = goal;
    }

    updateSession(secsSpentOnSession) { 
        this.elapsedTime += secsSpentOnSession;
        
        if(this.elapsedTime > this.duration) {
            this.elapsedTime = this.duration;
            this.completed = true;
        }
    }

    incrementElapsedTime() {
        if(this.elapsedTime < this.duration)
            this.elapsedTime++;
    }

   ifComplete() {
       return this.elapsedTime >= this.duration;
   }
}

class Break extends Event {

    constructor(title = "Default", duration = 5) {
        super(title, duration);
    }
}
