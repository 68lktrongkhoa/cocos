cc.Class({
    extends: cc.Component,

    properties: {
        destroyDelay: {
            default: 0.2
        }
    },

    onLoad() {
        if (this.animationComponent) {
            this.animationComponent.on('finished', this.onEffectFinished, this);
        } else {
            this.scheduleOnce(this.onEffectFinished, this.destroyDelay);
        }
    },

    onEffectFinished() {
        if (cc.isValid(this.node)) {
            this.node.destroy();
        }
    },

    onDestroy() {
        if (this.animationComponent) {
            this.animationComponent.off('finished', this.onEffectFinished, this);
        }
    }
});