export default class CamperoModel {
    constructor(){
        this.ms = 0;
        this.ms_updated = false;
    }

    get measured_velocity() {
        return this.ms_updated ? this.ms : null;
    }

    set measured_velocity(v) {
        this.ms = v;
        this.ms_updated = true;
    }
}