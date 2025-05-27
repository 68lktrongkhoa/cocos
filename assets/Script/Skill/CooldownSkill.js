cc.Class({
    extends: cc.Component,

    properties: {
        cooldownProgressBar: {
            default: null,
            type: cc.ProgressBar
        },
        skillIconSprite: {
            default: null,
            type: cc.Sprite
        },
        cooldownLabel: {
            default: null,
            type: cc.Label
        },
        cooldownDuration: {
            default: 5.0,
            type: cc.Float
        },
        buttonComponent: {
            default: null,
            type: cc.Button
        },

        _currentTime: 0,
        _isCoolingDown: false,
    },

    onLoad () {
        this._currentTime = 0;
        this._isCoolingDown = false;
        this.resetCooldown();
    },

    start () { 
        this.startCooldown(); 
    },

    startCooldown() {
        if (this._isCoolingDown) {
            cc.warn("Skill is already cooling down!");
            return;
        }

        this._isCoolingDown = true;
        this._currentTime = this.cooldownDuration;

        if (this.cooldownProgressBar) {
            this.cooldownProgressBar.node.active = true; 
            this.cooldownProgressBar.progress = 1;
        }
        if (this.cooldownLabel) {
            this.cooldownLabel.node.active = true;
            this.cooldownLabel.string = Math.ceil(this._currentTime).toString();
        }
        if (this.buttonComponent) {
            this.buttonComponent.interactable = false;
        }
    },

    resetCooldown() {
        this._isCoolingDown = false;
        this._currentTime = 0;

        if (this.cooldownProgressBar) {
            this.cooldownProgressBar.progress = 0;
        }
        if (this.cooldownLabel) {
            this.cooldownLabel.string = "";
            this.cooldownLabel.node.active = false;
        }
        if (this.buttonComponent) {
            this.buttonComponent.interactable = true;
        }
    },

    update (dt) {
        if (!this._isCoolingDown) {
            return;
        }

        this._currentTime -= dt;

        if (this._currentTime <= 0) {
            this.resetCooldown();
        } else {
            if (this.cooldownProgressBar) {
                this.cooldownProgressBar.progress = this._currentTime / this.cooldownDuration;
            }
            if (this.cooldownLabel) {
                this.cooldownLabel.string = Math.ceil(this._currentTime).toString();
            }
        }
    },
});