const Emitter = require('mEmitter');
const VOLUME_CHANGED_EVENT = "volume_changed_event";

cc.Class({
    extends: cc.Component,

    properties: {
        _currentVolumeForSound: 1,
    },

    onLoad() {
        if (!Emitter.instance) {
            cc.error("ButtonClickSoundEmitter: mEmitter.instance is not initialized!");
            return;
        }

        this._boundOnVolumeChanged = this.onVolumeChanged.bind(this);
        Emitter.instance.registerEvent(VOLUME_CHANGED_EVENT, this._boundOnVolumeChanged);
    },

    onDestroy() {
        if (Emitter.instance && this._boundOnVolumeChanged) {
            Emitter.instance.removeEvent(VOLUME_CHANGED_EVENT, this._boundOnVolumeChanged);
        }
    },

    onVolumeChanged(newVolume) {
        this._currentVolumeForSound = newVolume;
        cc.log(`ButtonClickSoundEmitter (${this.node.name}): Volume updated to ${this._currentVolumeForSound}`);
    },
});