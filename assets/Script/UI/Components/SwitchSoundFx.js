const Emitter = require('mEmitter');
const SOUND_CLICK_TOGGLE_EVENT = "sound_click_toggle_event";

cc.Class({
    extends: cc.Component,

    properties: {
        _customSwitchController: null,
    },

    onLoad() {
        if (!Emitter.instance) {
            Emitter.instance = new Emitter();
            cc.log("SwitchSoundFx: mEmitter instance created.");
        }

        this._customSwitchController = this.node.getComponent('SwitchController');
        if (!this._customSwitchController) {
            cc.error("SwitchSoundFx: SwitchController component not found on this node.");
            this.enabled = false;
            return;
        }

        this.node.on('toggle', this.onSwitchToggled, this);

        this.emitSoundToggleState(this._customSwitchController.toggle.isChecked);
    },

    onSwitchToggled(toggleComponent) {
        const isEnabled = toggleComponent.isChecked;
        this.emitSoundToggleState(isEnabled);
    },

    emitSoundToggleState(isEnabled) {
        if (!Emitter.instance) {
            cc.error("SwitchSoundFx: mEmitter.instance is not initialized!");
            return;
        }
        cc.log(`SwitchSoundFx: Sound click is now ${isEnabled ? 'ENABLED' : 'DISABLED'}. Emitting event.`);
        Emitter.instance.emit(SOUND_CLICK_TOGGLE_EVENT, isEnabled);
    },

    onDestroy() {
        if (this.node) {
            this.node.off('toggle', this.onSwitchToggled, this);
        }
    }
});