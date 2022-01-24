import { f7 } from "framework7-react";

const STEPS = [
    {
        page: "/control/",
        key: "w1",
        text: "Primero ingrese un dato aqui",
        popover_el: "help-popover-1",
        target_el: "help-target-1"
    },
    {
        page: "/control/",
        key: "w2",
        text: "Y luego, otro dato aqui",
        popover_el: "help-popover-2",
        target_el: "help-target-2"
    }
];

const DELAY = 1000;

export default class WalkthroughModel {
    constructor(){
        this.steps = STEPS;        
        this.currentIndex = -1;
        this.currentStep = null;
        this.model = null;
    }

    setModel(model){
        this.model = model;
    }

    start() {
        this.currentIndex = -1;
        this.currentStep = null;
        this.next();
    }

    finish() {        
        //f7.popover.close("."+this.steps[this.currentIndex].popover_el);
        f7.views.main.router.navigate('/');
    }

    next() {

        this.currentIndex++;
        
        if(this.currentIndex >= this.steps.length){
            this.finish();
            return;
        }
        
        this.currentStep = this.steps[this.currentIndex];
        
        if(this.currentIndex > 0){
            if(this.currentStep.page !== this.steps[this.currentIndex-1].page){
                f7.views.main.router.navigate(this.currentStep.page);
            }
            //f7.popover.close("."+this.steps[this.currentIndex-1].popover_el);    
        }else
            f7.views.main.router.navigate(this.currentStep.page);

        setTimeout(() => {
            const r = document.getElementsByClassName(this.currentStep.target_el);
            if(r.length > 0){
                r[0].scrollIntoView();
                f7.popover.open("."+this.currentStep.popover_el, "."+this.currentStep.target_el, true);    
            }else{
                console.log("Error de ayuda, elemento no existe");
            }
        }, DELAY);
        
    }
}