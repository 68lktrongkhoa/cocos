const PopupController = require('PopupController');
const mEmitter = require('mEmitter');
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
        },

    },
    statics: {
        POPUP_ID: {
            SETTINGS: 'settings_popup',
            RANKING: 'ranking_popup'
        },
        EVENT_NAME: {
            OPEN_POPUP: 'ui_open_popup_event'
        }
    },

    onOpenSettingsClicked() {
        
        if (this.settingsPopupController) {
            cc.log(" Emitting open event for SETTINGS");
            this.settingsPopupController.showPopup();
            mEmitter.instance.emit(this.constructor.EVENT_NAME.OPEN_POPUP, { popupId: this.constructor.POPUP_ID.SETTINGS });
        } else {
            cc.warn("Settings Popup Controller chưa được gán trong UIManager.");
        }
    },

    onOpenRankingClicked() {
        if (this.rankingPopupController) {
            cc.log(" Emitting open event for RANKING");
            mEmitter.instance.emit(this.constructor.EVENT_NAME.OPEN_POPUP, { popupId: this.constructor.POPUP_ID.RANKING });
            this.rankingPopupController.showPopup();
        } else {
            cc.warn("Ranking Popup Controller chưa được gán trong UIManager.");
        }
    },
});