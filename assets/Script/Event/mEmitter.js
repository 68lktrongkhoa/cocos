
const EventEmitter = require('events'); 

class mEmitter {
    constructor() {
        this._emitter = new EventEmitter();
        this._emitter.setMaxListeners(100); 
       
    }

    emit(...args) {
        this._emitter.emit(...args);
    }

    registerEvent(event, listener) {
        this._emitter.on(event, listener);
    }

    registerOnce(event, listener) {
        this._emitter.once(event, listener);
    }

    removeEvent(event, listener) {
        this._emitter.removeListener(event, listener);
    }

    destroy() {
        if (this._emitter) {
            this._emitter.removeAllListeners();
        }
    }
}

const instance = new mEmitter(); 
module.exports = instance; 