const PopupController = require('PopupController');
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