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
        // Gọi resetCooldown ở cuối onLoad sau khi các thuộc tính khác có thể đã được thiết lập
        // Hoặc đảm bảo các node con (progress bar, label) đã sẵn sàng nếu resetCooldown ẩn chúng.
        // Hiện tại, resetCooldown chỉ thay đổi progress và string, nên có thể ổn ở đây.

        if (this.buttonComponent && cc.isValid(this.buttonComponent.node)) { // Thêm kiểm tra cc.isValid(this.buttonComponent.node)
            this.buttonComponent.node.on('click', this.onSkillButtonClicked, this);
        } else {
            // Log chi tiết hơn nếu buttonComponent được gán nhưng node của nó không hợp lệ
            if (this.buttonComponent && !cc.isValid(this.buttonComponent.node)) {
                cc.warn(`CooldownSkill (${this.node.name}): 'buttonComponent' được gán nhưng node của nó không hợp lệ. Kỹ năng không thể kích hoạt bằng click.`);
            } else {
                cc.warn(`CooldownSkill (${this.node.name}): Thuộc tính 'buttonComponent' chưa được gán. Kỹ năng không thể kích hoạt bằng click.`);
            }
        }
        this.resetCooldown(); // Có thể an toàn hơn khi gọi sau khi đăng ký sự kiện
    },

    start () {
        // `start` được gọi sau `onLoad` và thường chỉ một lần khi component được kích hoạt lần đầu.
        // Nếu bạn muốn cooldown bắt đầu ngay khi component active, thì để đây là đúng.
        // Nếu bạn muốn nó bắt đầu khi scene load, có thể không cần hàm này và chỉ dựa vào onSkillButtonClicked.
        // this.startCooldown(); // Bỏ comment nếu muốn tự động bắt đầu cooldown khi component start.
    },

    onSkillButtonClicked() {
        this.startCooldown();
    },

    startCooldown() {
        if (!cc.isValid(this.node)) { // Kiểm tra xem component này còn hợp lệ không
            cc.warn("CooldownSkill: Component hoặc Node đã bị hủy, không thể bắt đầu cooldown.");
            return;
        }

        if (this.cooldownDuration <= 0) {
            cc.warn(`CooldownSkill (${this.node.name}): 'cooldownDuration' phải lớn hơn 0.`);
            this.resetCooldown();
            return;
        }

        if (this._isCoolingDown) {
            // Có thể không cần warn ở đây nếu người dùng click liên tục là bình thường
            // cc.warn(`CooldownSkill (${this.node.name}): Kỹ năng đã đang trong quá trình hồi chiêu!`);
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
        if (!cc.isValid(this.node)) { // Kiểm tra xem component này còn hợp lệ không
            return;
        }

        this._isCoolingDown = false;
        this._currentTime = 0;

        if (this.cooldownProgressBar && cc.isValid(this.cooldownProgressBar.node)) {
            this.cooldownProgressBar.progress = 0;
            // Tùy bạn quyết định có ẩn progress bar khi reset không
            // this.cooldownProgressBar.node.active = false;
        }
        if (this.cooldownLabel && cc.isValid(this.cooldownLabel.node)) {
            this.cooldownLabel.string = ""; // Hoặc "0" hoặc text mặc định nào đó
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
        // Sử dụng cc.isValid để đảm bảo cả component và node của nó đều hợp lệ
        if (this.buttonComponent && cc.isValid(this.buttonComponent, true) && cc.isValid(this.buttonComponent.node, true)) {
            this.buttonComponent.node.off('click', this.onSkillButtonClicked, this);
        }
        // Bạn cũng có thể muốn dừng các hành động hoặc scheduler nếu có
        // this.unscheduleAllCallbacks(); // Nếu bạn có dùng schedule
    }
});