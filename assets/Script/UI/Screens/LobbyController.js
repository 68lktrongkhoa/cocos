const GlobalData = require("GlobalData"); 
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onPlayButtonClicked() {
        if (GlobalData) {
            GlobalData.nextSceneToLoad = "Room";
            cc.director.loadScene("Loading");
        } else {
            cc.error("GlobalData không có sẵn. Không thể đặt scene kế tiếp.");
        }
    },
});