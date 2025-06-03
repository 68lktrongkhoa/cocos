const Emitter = require('mEmitter');
const VOLUME_CHANGED_EVENT = "volume_changed_event";

cc.Class({
    extends: cc.Component,

    properties: {
        musicAudioSource: {
            default: null,
            type: cc.AudioSource,
        },
        volumeSlider: {
            default: null,
            type: cc.Slider,
        },
        volumeLabel: {
            default: null,
            type: cc.Label,
        }
    },

    onLoad () {
        if (!Emitter.instance) {
            Emitter.instance = new Emitter();
            cc.log("VolumnController: mEmitter instance created.");
        }

        if (!this.musicAudioSource) {
            cc.warn("VolumnController: musicAudioSource is not assigned.");
            return;
        }
        if (!this.volumeSlider) {
            cc.warn("VolumnController: volumeSlider is not assigned.");
            return; 
        }

        let initialVolume = 1;
        if (this.musicAudioSource) {
            initialVolume = this.musicAudioSource.volume;
        }

        this.volumeSlider.progress = initialVolume;
        this.updateVolumeLabel(initialVolume);

        Emitter.instance.emit(VOLUME_CHANGED_EVENT, initialVolume);
        cc.log(`VolumnController: Initial volume ${initialVolume} emitted.`);

        this.volumeSlider.node.on('slide', this.onSliderVolumeChanged, this);
    },

    onSliderVolumeChanged(slider) {
        let newVolume = slider.progress

        if (this.musicAudioSource) {
            this.musicAudioSource.volume = newVolume;
        }

        this.updateVolumeLabel(newVolume);
        Emitter.instance.emit(VOLUME_CHANGED_EVENT, newVolume);
        cc.log(`VolumnController: Volume changed to ${newVolume}, event emitted.`);
    },

    updateVolumeLabel(volume) { 
        if (this.volumeLabel) {
            this.volumeLabel.string = `${Math.round(volume * 100)}%`;
        }
    },

    onDestroy() {
        if (this.volumeSlider) {
            this.volumeSlider.node.off('slide', this.onSliderVolumeChanged, this);
        }
    }
});