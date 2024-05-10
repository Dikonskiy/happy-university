export class Course {
    constructor(code, name, credits, ects, hours, attendance, absence, permission, manual, dates) {
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.ects = ects;
        this.hours = hours;
        this.attendance = attendance;
        this.absence = absence;
        this.permission = permission;
        this.manual = manual;
        this.dates = dates;
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

    setAttendance(attendance) {
        this.attendance = attendance;
    }
    setAbsence(absence) {
        this.absence = absence;
    }
    setPermission(permission) {
        this.permission = permission;
    }
    setManual(manual) {
        this.manual = manual;
    }
}