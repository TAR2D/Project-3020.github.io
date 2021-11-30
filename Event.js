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
        this.elapsedTime = 0;  // in minutes
        this.completed = false;
    }

    addSession(session) {
        this.duration += session.duration;
        this.listOfSession.push(session);
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
        this.elapsedTime = 0; // in minutes
        this.goal = goal;
    }

    updateSession(minsSpentOnSession) { 
        this.elapsedTime += minsSpentOnSession;
        
        if(this.elapsedTime > this.duration) {
            this.elapsedTime = this.duration;
            this.completed = true;
        }
    }
}

class Break extends Event {

    constructor(title = "Default", duration = 5) {
        super(title, duration);
    }
}
