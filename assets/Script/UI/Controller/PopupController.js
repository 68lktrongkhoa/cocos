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
        },

        _isShown: false,
        _boundHandleOpenPopupEvent: null,
    },

    onLoad () {
        if (!this.popupNode) {
            this.popupNode = this.node;
            cc.log(`PopupController (${this.node.name}): popupNode not assigned, using this.node as popupNode.`);
        }

        if (this.popupNode) {
            this.popupNode.active = false;
            this._isShown = false;
        } else {
            cc.error(`PopupController (${this.node.name}): popupNode is not assigned and this.node is also invalid. Popup cannot function.`);
            return;
        }

        this.closeButtons.forEach(button => {
            if (button && button.node) {
                button.node.on(cc.Node.EventType.TOUCH_END, this.hidePopup, this);
            } else {
                cc.warn(`PopupController (${this.popupId || this.node.name}): An invalid entry found in closeButtons array.`);
            }
        });

        if (!this.popupId) {
            cc.warn(`PopupController (${this.node.name}): popupId is not set. This popup cannot be opened via the global OPEN_POPUP event.`);
        } else {
            this._boundHandleOpenPopupEvent = (eventData) => {
                if (eventData && eventData.popupId === this.popupId) {
                    this.showPopup(eventData.data);
                }
            };
            if (mEmitter && mEmitter.instance) {
                mEmitter.instance.registerEvent(UIManager.EVENT_NAME.OPEN_POPUP, this._boundHandleOpenPopupEvent);
                cc.log(`PopupController (${this.popupId}): Registered for event '${UIManager.EVENT_NAME.OPEN_POPUP}'`);
            } else {
                cc.error(`PopupController (${this.popupId}): mEmitter.instance not available. Cannot register for OPEN_POPUP event.`);
            }
        }
    },

    showPopup(data) {
        if (!this.popupNode) {
            cc.error(`PopupController (${this.node.name}): popupNode is not assigned. Cannot show popup.`);
            return;
        }

        if (this._isShown) {
            return;
        }

        this.popupNode.active = true;
        this._isShown = true;
        cc.log(`PopupController (${this.popupId || this.node.name}): onPopupWillShow`, data);

        if (this.openAnimation && this.openAnimationClipName) {
            if (!this.openAnimation.enabledInHierarchy) this.openAnimation.enabled = true;
            this.openAnimation.play(this.openAnimationClipName);
        } else {
            cc.log(`PopupController (${this.popupId || this.node.name}): onPopupDidShow`, data);
        }
        mEmitter.instance.emit(UIManager.EVENT_NAME.POPUP_SHOWN, this.popupId);
    },

    hidePopup() {
        if (!this.popupNode || !this._isShown) {
            cc.log(`PopupController (${this.popupId || this.node.name}): Popup is already hidden or not initialized.`);
            return;
        }
        cc.log(`PopupController (${this.popupId || this.node.name}): onPopupWillHide`);

        const doHide = () => {
            if (this.popupNode) {
                this.popupNode.active = false;
            }
            this._isShown = false;
            cc.log(`PopupController (${this.popupId || this.node.name}): onPopupDidHide`);
            mEmitter.instance.emit(UIManager.EVENT_NAME.POPUP_HIDDEN, this.popupId);
        };

        if (this.closeAnimation && this.closeAnimationClipName && this.popupNode.active) {
            if (!this.closeAnimation.enabledInHierarchy) this.closeAnimation.enabled = true;
            this.closeAnimation.play(this.closeAnimationClipName);
            this.closeAnimation.once(cc.Animation.EventType.FINISHED, doHide, this);
        } else {
            doHide();
        }
    },

    onDestroy() {
        this.closeButtons.forEach(button => {
            if (button && button.node) {
                button.node.off(cc.Node.EventType.TOUCH_END, this.hidePopup, this);
            }
        });

        if (mEmitter && mEmitter.instance && this._boundHandleOpenPopupEvent) {
            mEmitter.instance.removeEvent(UIManager.EVENT_NAME.OPEN_POPUP, this._boundHandleOpenPopupEvent);
            cc.log(`PopupController (${this.popupId || this.node.name}): Unregistered from event '${UIManager.EVENT_NAME.OPEN_POPUP}'`);
        }
        this._boundHandleOpenPopupEvent = null;
    }
});