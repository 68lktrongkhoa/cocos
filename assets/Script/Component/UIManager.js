const PopupCommonController = require('PopupCommonController');
cc.Class({
    extends: cc.Component,

    properties: {
        settingsPopupController: {
            default: null,
            type: PopupCommonController 
        },

        inventoryPopupController: {
            default: null,
            type: PopupCommonController
        },
        rankingPopupController: {
            default: null,
            type: PopupCommonController,
        },

    },

    onOpenSettingsClicked() {
        if (this.settingsPopupController) {
            this.settingsPopupController.showPopup();
        } else {
            cc.warn("Settings Popup Controller chưa được gán trong UIManager.");
        }
    },

    onOpenInventoryClicked() {
        if (this.inventoryPopupController) {
            this.inventoryPopupController.showPopup();
        }else {
            cc.warn("Inventory Popup Controller chưa được gán trong UIManager.");
        }
    },

    onOpenRankingClicked() {
        if (this.rankingPopupController) {
            this.rankingPopupController.showPopup();
        } else {
            cc.warn("Ranking Popup Controller chưa được gán trong UIManager.");
        }
    },
});