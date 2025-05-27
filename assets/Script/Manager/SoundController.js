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


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playBGM();
    },

    start () {

    },
    
    playBGM(){
        console.log("Playe BGM");
        this.playBGM = cc.audioEngine.play(this.audioPGM, false, 1);
    },

    playOnclickSound(){
        console.log("Play Onclick");
        this.click = cc.audioEngine.play(this.audioClick, false, 1);
    },

    // update (dt) {},
});
