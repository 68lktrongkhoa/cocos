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

        openAnimation: {
            default: null,
            type: cc.Animation,
        },
        openAnimationClipName: {
            default: "",
            type: cc.String,
        },

        closeAnimation: {
            default: null,
            type: cc.Animation,
            tooltip: "(Tùy chọn) Component Animation để chạy khi đóng popup."
        },
        closeAnimationClipName: {
            default: "",
            type: cc.String,
            tooltip: "Tên của animation clip để chạy khi đóng (nếu có Close Animation)."
        },

        // Tùy chọn: Có đóng popup khi click ra ngoài vùng popup không?
        // Yêu cầu popup có một Node Background với cc.BlockInputEvents
        // closeOnTouchOutside: {
        //     default: false,
        //     tooltip: "Đóng popup khi click ra ngoài? (Yêu cầu có background chặn input)"
        // },
        // backgroundNodeForTouchOutside: {
        //     default: null,
        //     type: cc.Node,
        //     tooltip: "Node background để bắt sự kiện click bên ngoài (nếu closeOnTouchOutside=true)",
        //     visible: function() { return this.closeOnTouchOutside; }
        // }
    },

    onLoad () {
        if (!this.popupNode) {
            this.popupNode = this.node;
        }

        if (this.popupNode) {
            this.popupNode.active = false;
        }

        if (this.closeButtons && this.closeButtons.length > 0) {
            this.closeButtons.forEach(button => {
                if (button && button.node) {
                    button.node.on('click', this.hidePopup, this);
                } else {
                    cc.warn("Một trong các closeButtons không hợp lệ hoặc thiếu node.");
                }
            });
        }

        // (Tùy chọn: Xử lý closeOnTouchOutside)
        // if (this.closeOnTouchOutside && this.backgroundNodeForTouchOutside) {
        //     // Thêm một component cc.BlockInputEvents vào backgroundNodeForTouchOutside nếu chưa có
        //     // và lắng nghe sự kiện 'touchstart' hoặc 'mousedown' trên nó
        //     // Trong handler, gọi this.hidePopup();
        //     // Quan trọng: Đảm bảo background này là con trực tiếp của popupNode
        //     // và các element tương tác được nằm phía trên nó trong thứ tự render.
        //     // Ví dụ:
        //     // this.backgroundNodeForTouchOutside.on(cc.Node.EventType.TOUCH_START, this.hidePopup, this);
        // }
    },

    showPopup(data) {
        if (this.popupNode) {
            if (this.popupNode.active) {
                cc.log(this.popupNode.name + " đã được hiển thị rồi.");
                return;
            }

            this.popupNode.active = true;

            if (this.openAnimation && this.openAnimationClipName) {
                this.openAnimation.play(this.openAnimationClipName);
            }
            // Hoặc hiệu ứng đơn giản:
            // this.popupNode.scale = 0.8;
            // this.popupNode.opacity = 0;
            // cc.tween(this.popupNode)
            //     .to(0.3, { scale: 1, opacity: 255 }, { easing: 'sineOut' })
            //     .start();

            // Gọi một hàm tùy chỉnh trên popup nếu có, để xử lý dữ liệu được truyền vào
            // Ví dụ: một script khác trên cùng popupNode có hàm `setup(data)`
            let specificController = this.getComponent('SpecificPopupLogic');
            if (specificController && typeof specificController.setup === 'function') {
                specificController.setup(data);
            }

            cc.log(this.popupNode.name + " được hiển thị.");
        } else {
            cc.error("popupNode chưa được gán cho PopupCommonController trên node: " + this.node.name);
        }
    },

    hidePopup() {
        if (this.popupNode && this.popupNode.active) {
            const doHide = () => {
                this.popupNode.active = false;
                cc.log(this.popupNode.name + " đã được đóng.");
            };

            if (this.closeAnimation && this.closeAnimationClipName) {
                this.closeAnimation.once('finished', doHide, this);
                this.closeAnimation.play(this.closeAnimationClipName);
            } else {
                // Hoặc hiệu ứng đơn giản:
                // cc.tween(this.popupNode)
                //     .to(0.3, { scale: 0.8, opacity: 0 }, { easing: 'sineIn' })
                //     .call(doHide)
                //     .start();
                doHide();
            }
        }
    },

    onDestroy() {
        if (this.closeButtons && this.closeButtons.length > 0) {
            this.closeButtons.forEach(button => {
                if (button && button.node) {
                    button.node.off('click', this.hidePopup, this);
                }
            });
        }

        if (this.closeAnimation) {
            this.closeAnimation.off('finished', this.hidePopup, this);
        }
    }
});