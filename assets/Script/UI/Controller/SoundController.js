// SoundController.js
const Emitter = require('mEmitter');
const PLAY_CLICK_SOUND_EVENT = "play_click_sound_event";
const SOUND_CLICK_TOGGLE_EVENT = "sound_click_toggle_event";

cc.Class({
    extends: cc.Component,

    properties: {
        audioPGM: {
            type: cc.AudioClip,
            default: null
        },
        audioClick: {
            type: cc.AudioClip,
            default: null
        },
        _isClickSoundEnabled: true
    },

    onLoad () {
        if (!Emitter.instance) {
            Emitter.instance = new Emitter();
        }

        this.playBGM();
        this._boundPlayOnClickSound = this.playOnclickSound.bind(this);
        Emitter.instance.registerEvent(PLAY_CLICK_SOUND_EVENT, this._boundPlayOnClickSound);

        this._boundToggleClickSound = this.toggleClickSound.bind(this);
        Emitter.instance.registerEvent(SOUND_CLICK_TOGGLE_EVENT, this._boundToggleClickSound);
    },

    onDestroy() {
        if (Emitter.instance) {
            if (this._boundPlayOnClickSound) {
                Emitter.instance.removeEvent(PLAY_CLICK_SOUND_EVENT, this._boundPlayOnClickSound);
            }
            if (this._boundToggleClickSound) {
                Emitter.instance.removeEvent(SOUND_CLICK_TOGGLE_EVENT, this._boundToggleClickSound);
            }
        }

        if (this.bgmAudioId !== undefined && cc.audioEngine.getState(this.bgmAudioId) === cc.audioEngine.AudioState.PLAYING) {
            cc.audioEngine.stop(this.bgmAudioId);
        }
        if (this.clickAudioId !== undefined && cc.audioEngine.getState(this.clickAudioId) === cc.audioEngine.AudioState.PLAYING) {
            cc.audioEngine.stop(this.clickAudioId);
        }
    },

    toggleClickSound(isEnabled) {
        this._isClickSoundEnabled = isEnabled;
        cc.log(`SoundController: Click sound is now ${this._isClickSoundEnabled ? 'ENABLED' : 'DISABLED'}.`);
    },

    
    playBGM(){
        if (this.audioPGM) {
            this.bgmAudioId = cc.audioEngine.play(this.audioPGM, true, 1);
        } else {
            cc.warn("audioPGM is not assigned in soundController.");
        }
    },
    

    playOnclickSound(receivedData) {
        if (!this._isClickSoundEnabled) {
            cc.log("SoundController: Click sound is disabled, not playing.");
            return;
        }

        cc.log("SoundController: Play Onclick due to mEmitter event.");
        let volumeToPlay = 1;

        if (receivedData) {
            cc.log("SoundController: Received data:", receivedData);
            if (typeof receivedData.soundVolume === 'number') {
                volumeToPlay = receivedData.soundVolume;
            }
        }

        if (this.audioClick) {
            this.clickAudioId = cc.audioEngine.play(this.audioClick, false, volumeToPlay);
            cc.log(`SoundController: Playing click sound with volume: ${volumeToPlay}`);
        } else {
            cc.warn("audioClick is not assigned in soundController.");
        }
    },
});