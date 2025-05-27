cc.Class({
    extends: cc.Component,

    properties: {
        cooldownProgressBar: {
            default: null,
            type: cc.ProgressBar,
            tooltip: "ProgressBar component điều khiển cooldown."
        },
        skillIconSprite: { // Vẫn giữ lại nếu bạn muốn làm gì đó với icon (ví dụ: làm mờ)
            default: null,
            type: cc.Sprite,
            tooltip: "Sprite icon kỹ năng chính."
        },
        cooldownLabel: {
            default: null,
            type: cc.Label,
            tooltip: "Label hiển thị thời gian hồi chiêu còn lại."
        },
        cooldownDuration: {
            default: 5.0,
            type: cc.Float,
            tooltip: "Tổng thời gian hồi chiêu (giây)."
        },
        buttonComponent: {
            default: null,
            type: cc.Button,
            tooltip: "Component Button của Node này (nếu có)."
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

    startCooldown: function () {
        if (this._isCoolingDown) {
            cc.warn("Skill is already cooling down!");
            return;
        }

        this._isCoolingDown = true;
        this._currentTime = this.cooldownDuration;

        if (this.cooldownProgressBar) {
            this.cooldownProgressBar.node.active = true; // Kích hoạt Node chứa ProgressBar nếu nó bị ẩn
            this.cooldownProgressBar.progress = 1; // Bắt đầu với progress đầy (mặt nạ che hết)
        }
        if (this.cooldownLabel) {
            this.cooldownLabel.node.active = true;
            this.cooldownLabel.string = Math.ceil(this._currentTime).toString();
        }
        if (this.buttonComponent) {
            this.buttonComponent.interactable = false;
        }
    },

    resetCooldown: function () {
        this._isCoolingDown = false;
        this._currentTime = 0;

        if (this.cooldownProgressBar) {
            this.cooldownProgressBar.progress = 0; // Hết cooldown, progress về 0 (mặt nạ không che)
            // Bạn có thể chọn ẩn Node ProgressBar đi nếu muốn
            // this.cooldownProgressBar.node.active = false;
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
                // Cập nhật progress của ProgressBar
                // Giá trị progress đi từ 1 (đầy) về 0 (hết)
                this.cooldownProgressBar.progress = this._currentTime / this.cooldownDuration;
            }
            if (this.cooldownLabel) {
                this.cooldownLabel.string = Math.ceil(this._currentTime).toString();
            }
        }
    },

    onSkillButtonClicked: function () {
        if (!this._isCoolingDown) {
            cc.log("Skill Used!");
            this.startCooldown();
        } else {
            cc.log("Skill on cooldown!");
        }
    }
});