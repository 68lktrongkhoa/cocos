cc.Class({
    extends: cc.Component,

    properties: {
        cooldownProgressBar: {
            default: null,
            type: cc.ProgressBar
        },
        cooldownLabel: {
            default: null,
            type: cc.Label
        },
        cooldownDuration: {
            default: 5.0,
            type: cc.Float,
            min: 0.1
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

        if (this.buttonComponent) {
            this.buttonComponent.node.on('click', this.onSkillButtonClicked, this);
        } else {
            cc.warn("CooldownManager: Thuộc tính 'buttonComponent' chưa được gán. Kỹ năng không thể kích hoạt bằng click.");
        }
    },

    start () {
        this.startCooldown();
    },

    onSkillButtonClicked() {
        this.startCooldown();
    },

    startCooldown() {
        if (this.cooldownDuration <= 0) {
            cc.warn("CooldownManager: 'cooldownDuration' phải lớn hơn 0.");
            this.resetCooldown();
            return;
        }

        if (this._isCoolingDown) {
            cc.warn("CooldownManager: Kỹ năng đã đang trong quá trình hồi chiêu!");
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

    onDestroy() {
        if (this.buttonComponent) {
            this.buttonComponent.node.off('click', this.onSkillButtonClicked, this);
        }
    }
});