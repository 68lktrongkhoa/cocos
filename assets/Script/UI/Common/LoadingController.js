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
        sceneToLoad: {
            default: "Lobby",
        },
        label: {
            default: null,
            type: cc.Label,
        }
    },

    onLoad() {
        this.progressBar.progress = 0;

        this.startPosX = -this.progressBar.totalLength / 2;

        if (this.progressTip) {
            this.progressTip.x = this.startPosX;
        }
        this.labelChangeWhenLoading();

        this.startLoading();
    },

    startLoading() {
        cc.director.preloadScene(
            this.sceneToLoad,
            this.onProgress.bind(this),
            (error) => {
                if (error) {
                    cc.log("Tải scene thất bại:", error.message);
                    return;
                }

                this.progressBar.progress = 1;
            }
        );
    },

    labelChangeWhenLoading() {
        if (!this.label) {
            return;
        }
        let labelFrame = ["Loading", "Loading.", "Loading..", "Loading..."];
        console.log(this.label.string);
        let i = 0;
        cc.tween(this.node).repeatForever(
            cc
                .tween()
                .call(() => {
                    this.label.string = labelFrame[i];
                    i = (i + 1) % labelFrame.length;
                })
                .delay(0.5)
        ).start();
    },

    onProgress(completedCount, totalCount, item) {
        if (this.progressBar) {
            this.progressBar.progress = completedCount / totalCount;
        }
    },

    update(dt) {
        if (this.progressTip) {
            const newX =
                this.startPosX +
                this.progressBar.totalLength * this.progressBar.progress;
            this.progressTip.x = newX;
        }

        if (this.progressBar.progress >= 1) {
            if (!this.sceneLaunched) {
                this.sceneLaunched = true;
                cc.director.loadScene(this.sceneToLoad);
            }
        }
    },
});
