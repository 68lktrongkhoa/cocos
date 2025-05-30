const PopupController = require('PopupController');
const mEmitter = require('mEmitter');
const UIConstants = require('UIConstants');

cc.Class({
    extends: cc.Component,

    properties: {
        settingsPopupController: {
            default: null,
            type: PopupController
        },
        rankingPopupController: {
            default: null,
            type: PopupController,
        }
    },
    onOpenSettingsClicked() {
        if (this.settingsPopupController) {
            mEmitter.instance.emit(UIConstants.EVENT_NAME.OPEN_POPUP, { popupId: UIConstants.POPUP_ID.SETTINGS });
        } else {
            cc.warn("Settings Popup Controller chưa được gán trong UIManager.");
        }
    },

    onOpenRankingClicked() {
        if (this.rankingPopupController) {
            mEmitter.instance.emit(UIConstants.EVENT_NAME.OPEN_POPUP, { popupId: UIConstants.POPUP_ID.RANKING });
        } else {
            cc.warn("Ranking Popup Controller chưa được gán trong UIManager.");
        }
    },
    
    openGameOverPopup() {
        mEmitter.instance.emit(UIConstants.EVENT_NAME.OPEN_POPUP, { popupId: UIConstants.POPUP_ID.GAME_OVER });
    }
});