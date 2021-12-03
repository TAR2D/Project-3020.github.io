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
        let sessionDuration = Number(session.duration);

        /*  some logic to avoid confusion:
            say we have a goal k and k.duration = 2.
            we create new session called j associated with k where j.duration = 1.
            then, in this case, k.duration stays the same since j.duration < k.duration.
            now let's create another session called h also associated with k where h.duration = 3.
            as a result, we have that k.duration = (k.duration - j.duration) + h.duration = (2-1)+3 = 4
        */
       console.log('goal dur: ' + this.duration);
       console.log('total dur of sessions: ' + this.calculateDurationOfSessions());
       console.log('session dur: ' + sessionDuration); //FIX BUG!!

        if((this.duration - this.calculateDurationOfSessions()) < sessionDuration) {
            this.duration = ((this.duration - this.calculateDurationOfSessions()) + sessionDuration);
        }
        // else: sessionDuration < this.duration, so we don't update goal's duration

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
