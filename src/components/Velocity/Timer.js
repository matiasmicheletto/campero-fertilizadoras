class Timer {
    current = 0;
    running = false;
    start = () => {
        this.running = true;
        this.step();
    };
    stop = () => {
        this.running = false;
    };
    clear = () => {
        this.current = 0;
    };
    step = ()=>{
        if(this.running) {            
            this.current += 100;
            this.callback(this.current);
            setTimeout(this.step, 100);
        }
    };
    callback = ()=>{console.log(this.current)}
}

export default Timer;