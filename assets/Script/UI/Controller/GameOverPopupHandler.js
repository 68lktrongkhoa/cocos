// Trong GameOverPopupHandler.js

cc.Class({
    extends: cc.Component,

    properties: {
        retryButton: {
            default: null,
            type: cc.Button
        },
        lobbyButton: {
            default: null,
            type: cc.Button
        },
        lobbySceneName: {
            default: "Lobby",
            type: cc.String
        },

        _isLoadingScene: false,
        _popupController: null,
    },

    onLoad() {
        this._isLoadingScene = false;
        if (this.retryButton && cc.isValid(this.retryButton.node)) {
            this.retryButton.node.on(cc.Node.EventType.TOUCH_END, this.onRetryClicked, this);
        } else {
            if (this.retryButton) cc.warn(`GameOverPopupHandler (${this.node.name}): Node của 'retryButton' không hợp lệ.`);
            else cc.warn(`GameOverPopupHandler (${this.node.name}): 'retryButton' chưa được gán.`);
        }

        if (this.lobbyButton && cc.isValid(this.lobbyButton.node)) {
            this.lobbyButton.node.on(cc.Node.EventType.TOUCH_END, this.onGoToLobbyClicked, this);
        } else {
            if (this.lobbyButton) cc.warn(`GameOverPopupHandler (${this.node.name}): Node của 'lobbyButton' không hợp lệ.`);
            else cc.warn(`GameOverPopupHandler (${this.node.name}): 'lobbyButton' chưa được gán.`);
        }

        this._popupController = this.getComponent('PopupController');
        if (!this._popupController) {
            cc.warn(`GameOverPopupHandler (${this.node.name}): Không tìm thấy PopupController component.`);
        }
    },

    onRetryClicked() {
        const currentScene = cc.director.getScene();
        if (currentScene && currentScene.name) {
            this._attemptLoadScene(currentScene.name, this.retryButton);
        } else {
            cc.error("GameOverPopupHandler: Không thể lấy scene hiện tại để tải lại.");
        }
    },

    onGoToLobbyClicked() {
        if (this.lobbySceneName && this.lobbySceneName.length > 0) {
            this._attemptLoadScene(this.lobbySceneName, this.lobbyButton);
        } else {
            cc.error("GameOverPopupHandler: 'lobbySceneName' chưa được đặt hoặc rỗng.");
        }
    },

    _attemptLoadScene(sceneName, buttonToDisable) {
        if (this._isLoadingScene) {
            cc.log(`GameOverPopupHandler: Scene '${sceneName}' hoặc scene khác đã đang được tải. Vui lòng đợi.`);
            return;
        }

        if (this._popupController && typeof this._popupController.hidePopup === 'function') {
            this._popupController.hidePopup();
        }

        cc.log(`GameOverPopupHandler: Đang thử tải scene: ${sceneName}`);
        this._isLoadingScene = true;
        if (buttonToDisable && cc.isValid(buttonToDisable)) {
            buttonToDisable.interactable = false;
        }
        if (this.retryButton && cc.isValid(this.retryButton) && this.retryButton !== buttonToDisable) {
            this.retryButton.interactable = false;
        }
        if (this.lobbyButton && cc.isValid(this.lobbyButton) && this.lobbyButton !== buttonToDisable) {
            this.lobbyButton.interactable = false;
        }


        cc.director.loadScene(sceneName, (err) => {
            if (err) {
                cc.error(`GameOverPopupHandler: Lỗi khi tải scene '${sceneName}': ${err.message || err}`);
                this._isLoadingScene = false;
                if (this.retryButton && cc.isValid(this.retryButton)) this.retryButton.interactable = true;
                if (this.lobbyButton && cc.isValid(this.lobbyButton)) this.lobbyButton.interactable = true;
                return;
            }
            cc.log(`GameOverPopupHandler: Scene '${sceneName}' đã được tải thành công.`);
        });
    },

    onDestroy() {
        this._isLoadingScene = false;

        if (this.retryButton && cc.isValid(this.retryButton.node)) {
            this.retryButton.node.off(cc.Node.EventType.TOUCH_END, this.onRetryClicked, this);
        }
        if (this.lobbyButton && cc.isValid(this.lobbyButton.node)) {
            this.lobbyButton.node.off(cc.Node.EventType.TOUCH_END, this.onGoToLobbyClicked, this);
        }
    },
});