cc.Class({
    extends: cc.Component,

    properties: {
        popupNode: {
            default: null,
            type: cc.Node,
        },

        closeButtons: {
            default: [],
            type: [cc.Button],
        },

        openAnimation: {
            default: null,
            type: cc.Animation,
        },
        openAnimationClipName: {
            default: "",
            type: cc.String,
        },

        closeAnimation: {
            default: null,
            type: cc.Animation,
            tooltip: "(Tùy chọn) Component Animation để chạy khi đóng popup."
        },
        closeAnimationClipName: {
            default: "",
            type: cc.String,
            tooltip: "Tên của animation clip để chạy khi đóng (nếu có Close Animation)."
        },
    },

    onLoad () {
        if (!this.popupNode) {
            this.popupNode = this.node;
        }

        if (this.popupNode) {
            this.popupNode.active = false;
        }

        if (this.closeButtons && this.closeButtons.length > 0) {
            this.closeButtons.forEach(button => {
                if (button && button.node) {
                    button.node.on('click', this.hidePopup, this);
                } else {
                    cc.warn("Một trong các closeButtons không hợp lệ hoặc thiếu node.");
                }
            });
        }
    },

    showPopup(data) {
        if (this.popupNode) {
            if (this.popupNode.active) {
                cc.log(this.popupNode.name + " đã được hiển thị rồi.");
                return;
            }

            this.popupNode.active = true;

            if (this.openAnimation && this.openAnimationClipName) {
                this.openAnimation.play(this.openAnimationClipName);
            }
            let specificController = this.getComponent('SpecificPopupLogic');
            if (specificController && typeof specificController.setup === 'function') {
                specificController.setup(data);
            }

            cc.log(this.popupNode.name + " được hiển thị.");
        } else {
            cc.error("popupNode chưa được gán cho PopupCommonController trên node: " + this.node.name);
        }
    },

    hidePopup() {
        if (this.popupNode && this.popupNode.active) {
            const doHide = () => {
                this.popupNode.active = false;
                cc.log(this.popupNode.name + " đã được đóng.");
            };

            if (this.closeAnimation && this.closeAnimationClipName) {
                this.closeAnimation.once('finished', doHide, this);
                this.closeAnimation.play(this.closeAnimationClipName);
            } else {
                doHide();
            }
        }
    },

    onDestroy() {
        if (this.closeButtons && this.closeButtons.length > 0) {
            this.closeButtons.forEach(button => {
                if (button && button.node) {
                    button.node.off('click', this.hidePopup, this);
                }
            });
        }

        if (this.closeAnimation) {
            this.closeAnimation.off('finished', this.hidePopup, this);
        }
    }
});