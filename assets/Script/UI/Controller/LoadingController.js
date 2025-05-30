// LoadingController.js
const GlobalData = require("GlobalData");
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar,
        },
        progressTip: {
            default: null,
            type: cc.Node,
        },
        defaultSceneToLoad: { // Đổi từ sceneToLoad
            default: "Lobby",
            tooltip: "Scene mặc định sẽ tải nếu GlobalData.nextSceneToLoad không được thiết lập."
        },
        label: {
            default: null,
            type: cc.Label,
        }
    },

    _sceneToLoadInternal: "",
    sceneLaunched: false, // Thêm biến này để đảm bảo scene chỉ được load 1 lần
    loadingTween: null, // Thêm để quản lý tween

    onLoad() {
        this.progressBar.progress = 0;
        this.sceneLaunched = false; // Reset khi load lại
        this.startPosX = -this.progressBar.totalLength / 2;

        if (this.progressTip) {
            this.progressTip.x = this.startPosX;
        }

        if (GlobalData && GlobalData.nextSceneToLoad) {
            this._sceneToLoadInternal = GlobalData.nextSceneToLoad;
            cc.log(`LoadingController sẽ tải scene từ GlobalData: ${this._sceneToLoadInternal}`);
            GlobalData.nextSceneToLoad = null;
        } else {
            this._sceneToLoadInternal = this.defaultSceneToLoad;
            cc.log(`LoadingController sẽ tải scene mặc định: ${this._sceneToLoadInternal}`);
        }

        if (!this._sceneToLoadInternal) {
            cc.error("Không có scene nào được chỉ định để tải trong LoadingController!");
            this._sceneToLoadInternal = "Lobby"; // Fallback
            cc.warn("Đang quay lại tải 'Lobby' do không có scene nào được chỉ định.");
        }

        this.labelChangeWhenLoading();
        this.startLoading();
    },

    startLoading() {
        if (!this._sceneToLoadInternal) {
            cc.error("Attempting to load an undefined scene name.");
            return;
        }
        cc.log(`Đang preload scene: ${this._sceneToLoadInternal}`);
        cc.director.preloadScene(
            this._sceneToLoadInternal,
            this.onProgress.bind(this),
            (error) => {
                if (error) {
                    cc.error(`Không thể preload scene '${this._sceneToLoadInternal}': ${error.message}`);
                    return;
                }
                cc.log(`Đã preload thành công scene: ${this._sceneToLoadInternal}`);
                // Không cần set progress = 1 ở đây, update sẽ xử lý
            }
        );
    },

    labelChangeWhenLoading() {
        if (!this.label) {
            return;
        }
        let labelFrame = ["Loading", "Loading.", "Loading..", "Loading..."];
        let i = 0;
        if (this.loadingTween) { // Dừng tween cũ nếu có
            this.loadingTween.stop();
        }
        this.loadingTween = cc.tween(this.node).repeatForever(
            cc.tween()
                .call(() => {
                    if (this.label && cc.isValid(this.label.node)) {
                        this.label.string = labelFrame[i];
                    }
                    i = (i + 1) % labelFrame.length;
                })
                .delay(0.5)
        );
        this.loadingTween.start();
    },

    onProgress(completedCount, totalCount, item) {
        if (this.progressBar) {
            let progress = completedCount / totalCount;
            this.progressBar.progress = isNaN(progress) ? 0 : progress;
        }
    },

    update(dt) {
        if (this.progressTip && this.progressBar) {
            const newX =
                this.startPosX +
                this.progressBar.totalLength * this.progressBar.progress;
            this.progressTip.x = newX;
        }

        if (this.progressBar && this.progressBar.progress >= 1) {
            if (!this.sceneLaunched) { // Kiểm tra biến cờ
                this.sceneLaunched = true; // Đặt cờ
                if (this.loadingTween) {
                    this.loadingTween.stop();
                }
                cc.log(`Đang tải scene: ${this._sceneToLoadInternal}`);
                cc.director.loadScene(this._sceneToLoadInternal, (err, scene) => {
                    if (err) {
                        cc.error(`Lỗi khi tải scene ${this._sceneToLoadInternal}: ${err.message}`);
                        this.sceneLaunched = false; // Cho phép thử lại nếu có cơ chế
                        return;
                    }
                    cc.log(`Scene ${this._sceneToLoadInternal} đã được tải thành công.`);
                });
            }
        }
    },

    onDestroy() {
        if (this.loadingTween) {
            this.loadingTween.stop();
            this.loadingTween = null;
        }
    }
});