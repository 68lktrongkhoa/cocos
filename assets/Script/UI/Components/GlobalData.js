// GlobalData.js
let GlobalData = cc.Class({
    extends: cc.Component,

    statics: {
        nextSceneToLoad: null,
    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        cc.log("GlobalData đã khởi tạo và node đã được thiết lập để tồn tại xuyên suốt.");
    },
});

// Quan trọng: Xuất class để các script khác có thể require
module.exports = GlobalData;