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
        if (!this.musicAudioSource) {
            return;
        }
        if (!this.volumeSlider) {
            return;
        }

        let initialVolume = this.musicAudioSource.volume;
        this.volumeSlider.progress = initialVolume;
        this.updateVolumeLabel(initialVolume);

        this.volumeSlider.node.on('slide', this.onSliderVolumeChanged, this);
    },

    onSliderVolumeChanged(slider) {
        let newVolume = slider.progress;

        if (this.musicAudioSource) {
            this.musicAudioSource.volume = newVolume;
        }

        this.updateVolumeLabel(newVolume);

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