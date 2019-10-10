
const LinkedList = require('./linked-list');
class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.initial=config.initial;
        this.state=config.initial;
        this.states=config.states;        
        this.statesStack=new LinkedList();
        this.undoStack=new LinkedList();
        return this;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        for (let key in this.states){
            // console.log(this.states[key])
            if (key==state) {
                this.statesStack.append(this.state);
                this.state=state;
                this.undoStack.clear();
                return this;
            }
        }               
        throw new Error();
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for (let key in this.states[this.state].transitions){
            if (key==event) {
                this.statesStack.append(this.state);
                this.state=this.states[this.state].transitions[key];
                this.undoStack.clear();
                return this;
            }
        }

        throw new Error();
       
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state=this.initial;
        this.statesStack.clear();

    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */

    getStates(event) {   
        if (event===undefined){
            return ['normal', 'busy', 'hungry', 'sleeping'];
        }
        let array=[];
        for (let state in this.states){
            for (let key in this.states[state].transitions){                    
                if (event==key) array.push(state);
            }
        }
        return array;
    }
    
    // getStates(event) {        
    //     let array=[];
    //     if (event===undefined){
    //         for (let state in this.states){
    //             outer:for (let key in this.states[state].transitions){
    //                 console.log(this.states[state].transitions[key]);
    //                 for (let i=0; i<array.length;i++){
    //                     if (this.states[state].transitions[key]==array[i])
    //                     continue outer;
    //                 }
    //                 array.push(this.states[state].transitions[key])
    //             }
    //         }
    //     } else {
    //          for (let state in this.states){
    //              for (let key in this.states[state].transitions){                    
    //                  if (event==key) array.push(state);
    //            }
    //        }
    //     }
    //     return array;
    // }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.statesStack.length>0){
            this.undoStack.append(this.state);
            this.state=this.statesStack.tail();
            this.statesStack.deleteAt(this.statesStack.length-1);
            return true;
        }else return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoStack.length>0){
            this.statesStack.append(this.state);
            this.state=this.undoStack.tail();
            this.undoStack.deleteAt(this.undoStack.length-1);
            return true;
        }else return false;

    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.statesStack.clear();
    }
}
const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};


 a=new FSM(config);
 let b=a.getStates();
     console.log(b);

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
