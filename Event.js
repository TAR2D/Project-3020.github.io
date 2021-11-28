class Event {
    constructor(title, duration) {
        this.title = title;
        this.duration = duration;
    }
}

class Goal extends Event{

    constructor(title = "Default", duration = 50) {
        super(title, duration);
        this.listOfSession = [];
        this.elapsedTime = 0;
        this.completed = false;
    }

    addSession(session) {
        this.elapsedTime +=session.duration;
        if(this.elapsedTime > this.duration) {
            this.elapsedTime = this.duration;
            this.completed = true;
        }
        this.listOfSession.push(session);
    }

    getListOfSessions() {
        return this.listOfSession;
    }

    getNumberOfSessions() {
        return this.listOfSession.length;
    }
}

class Session extends Event {

    constructor(title = "Default", duration = 50, goal) {
        super(title, duration);
        this.goal = goal;
    }
}

class Break extends Event {

    constructor(title = "Default", duration = 5) {
        super(title, duration);
    }
}
