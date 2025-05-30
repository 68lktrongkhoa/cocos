const mEmitter = require('mEmitter'); 
const UIManager = require('UIManager');

cc.Class({
    extends: cc.Component,

    properties: {
        popupIdToOpen: {
            default: ""
        },
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClicked, this);
    },

    onButtonClicked() {
        if (!this.popupIdToOpen) {
            cc.warn("ButtonOpenPopup: popupIdToOpen chưa được đặt!");
            return;
        }

        if (mEmitter && mEmitter.instance && UIManager && UIManager.EVENT_NAME && UIManager.POPUP_ID) {
            cc.log(`ButtonOpenPopup: Emitting ${UIManager.EVENT_NAME.OPEN_POPUP} for popupId: ${this.popupIdToOpen}`);
            mEmitter.instance.emit(UIManager.EVENT_NAME.OPEN_POPUP, {
                popupId: this.popupIdToOpen,
            });
        } else {
            cc.error("ButtonOpenPopup: Không thể phát sự kiện OPEN_POPUP. Kiểm tra mEmitter hoặc UIManager.");
        }
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onButtonClicked, this);
    }
});