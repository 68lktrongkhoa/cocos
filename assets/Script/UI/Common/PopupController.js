const mEmitter = require('mEmitter');
const UIManager = require('UIManager');
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
        popupId: {
            default: "",
            type: cc.String
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
        
        if (typeof this.handleOpenPopupEvent !== 'function') {
            
             return;
        }
        this._boundHandleOpenPopupEvent = this.handleOpenPopupEvent.bind(this);
        
        if (mEmitter.instance) {
            mEmitter.instance.registerEvent(UIManager.EVENT_NAME.OPEN_POPUP, this._boundHandleOpenPopupEvent);
            cc.log(`PopupController (${this.popupId}): Registered for event '${UIManager.EVENT_NAME.OPEN_POPUP}'`);
        } else {
            cc.error(`mEmitter.instance not available for PopupController (${this.popupId}). Cannot register event.`);
        }

        if (!this.popupId) {
            cc.warn(`popupId chưa được đặt cho PopupController trên node: ${this.node.name}. Popup này sẽ không thể mở qua sự kiện.`);
        }
    },

    showPopup(data) {
        if (this.popupNode) {
            if (this.popupNode.active) {
                return;
            }

            this.popupNode.active = true;

            if (this.openAnimation && this.openAnimationClipName) {
                this.openAnimation.play(this.openAnimationClipName);
            }
        } else {
            cc.error("popupNode chưa được gán cho PopupController trên node: " + this.node.name);
        }
    },

    hidePopup() {
        if (this.popupNode && this.popupNode.active) {
            const doHide = () => {
                this.popupNode.active = false;
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