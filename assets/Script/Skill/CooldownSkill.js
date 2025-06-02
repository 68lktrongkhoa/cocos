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
       
        if (this.buttonComponent && cc.isValid(this.buttonComponent.node)) { 
            this.buttonComponent.node.on('click', this.onSkillButtonClicked, this);
        } else {
            if (this.buttonComponent && !cc.isValid(this.buttonComponent.node)) {
                cc.warn(`CooldownSkill (${this.node.name}): 'buttonComponent' được gán nhưng node của nó không hợp lệ. Kỹ năng không thể kích hoạt bằng click.`);
            } else {
                cc.warn(`CooldownSkill (${this.node.name}): Thuộc tính 'buttonComponent' chưa được gán. Kỹ năng không thể kích hoạt bằng click.`);
            }
        }
        this.resetCooldown();
    },

    start () {
        
    },

    onSkillButtonClicked() {
        this.startCooldown();
    },

    startCooldown() {
        if (!cc.isValid(this.node)) {
            cc.warn("CooldownSkill: Component hoặc Node đã bị hủy, không thể bắt đầu cooldown.");
            return;
        }

        if (this.cooldownDuration <= 0) {
            cc.warn(`CooldownSkill (${this.node.name}): 'cooldownDuration' phải lớn hơn 0.`);
            this.resetCooldown();
            return;
        }

        if (this._isCoolingDown) {
            
            return;
        }

        this._isCoolingDown = true;
        this._currentTime = this.cooldownDuration;

        if (this.cooldownProgressBar && cc.isValid(this.cooldownProgressBar.node)) {
            this.cooldownProgressBar.node.active = true;
            this.cooldownProgressBar.progress = 1;
        }
        if (this.cooldownLabel && cc.isValid(this.cooldownLabel.node)) {
            this.cooldownLabel.node.active = true;
            this.cooldownLabel.string = Math.ceil(this._currentTime).toString();
        }
        if (this.buttonComponent && cc.isValid(this.buttonComponent.node)) {
            this.buttonComponent.interactable = false;
        }
    },

    resetCooldown() {
        if (!cc.isValid(this.node)) { 
            return;
        }

        this._isCoolingDown = false;
        this._currentTime = 0;

        if (this.cooldownProgressBar && cc.isValid(this.cooldownProgressBar.node)) {
            this.cooldownProgressBar.progress = 0;
        }
        if (this.cooldownLabel && cc.isValid(this.cooldownLabel.node)) {
            this.cooldownLabel.string = "";
            this.cooldownLabel.node.active = false;
        }
        if (this.buttonComponent && cc.isValid(this.buttonComponent.node)) {
            this.buttonComponent.interactable = true;
        }
    },

    update (dt) {
        if (!this._isCoolingDown || !cc.isValid(this.node)) {
            return;
        }

        this._currentTime -= dt;

        if (this._currentTime <= 0) {
            this.resetCooldown();
        } else {
            if (this.cooldownProgressBar && cc.isValid(this.cooldownProgressBar.node)) {
                this.cooldownProgressBar.progress = this._currentTime / this.cooldownDuration;
            }
            if (this.cooldownLabel && cc.isValid(this.cooldownLabel.node)) {
                this.cooldownLabel.string = Math.ceil(this._currentTime).toString();
            }
        }
    },

    onDestroy() {
        if (this.buttonComponent && cc.isValid(this.buttonComponent, true) && cc.isValid(this.buttonComponent.node, true)) {
            this.buttonComponent.node.off('click', this.onSkillButtonClicked, this);
        }
    }
});