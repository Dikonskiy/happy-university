export class Course {
    constructor(code, name, credits, ects, hours, attendance, absence, permission) {
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.ects = ects;
        this.hours = hours;
    }
    setCode(code) {
        this.code = code;
    }

    setName(name) {
        this.name = name;
    }

    setCredits(credits) {
        this.credits = credits;
    }

    setEcts(ects) {
        this.ects = ects;
    }

    setHours(hours) {
        this.hours = hours;
    }
}
    