//  Su.GuiCuan

cc.Class({
    extends: cc.Component,

    properties: {
        nameText: cc.Label,
        valueText: cc.Label,
        reviewText: cc.Label,

        reviewBtn: cc.Node,
        vedioIcon: cc.Node,
        checkIcon: cc.Node,
    },

    setKey(key) {
        this.key = key;
        this.data = cc.ObjConfig.ONLINE[key];
        this.limmitTime = cc.whole.onlineLimmit[key];

        this.show();
    },

    show() {
        this.nameText.string = this.data.name;
        this.valueText.string = `x${this.data.value}`;

        this.checkReview();
    },

    checkReview() {
        if (cc.whole.onlineData.review[this.key]) {
            this.checkIcon.active = true;
            this.reviewBtn.active = false;
        } else {
            this.checkIcon.active = false;
            this.reviewBtn.active = true;
            if (cc.whole.localOnlineTime >= this.limmitTime) {
                this.canReview = true;
                this.vedioIcon.active = false;
                this.reviewText.string = '领  取';
            } else {
                this.canReview = false;
                this.vedioIcon.active = true;
                this.reviewText.string = '超前领取';
            }
        }
    },

    onClick(event, tag) {
        cc.AudioMgr.playSound('button');
        this.review();
    },

    review() {
        if (this.canReview) {
            this.updateProp();
        } else {
            cc.WxAdMgr.ShowVideoAd((tag) => {
                if (tag) {
                    this.updateProp();
                }
            });
        }
    },

    updateProp() {
        cc.whole.reviewOnlineReward(this.key);
        cc.whole.updateValue(this.data.key, this.data.value);

        this.scheduleOnce(() => {
            cc.Utils.showTip({ name: this.data.name, value: this.data.value, iconIndex: this.data.iconIndex });
        }, 0.5);

        if (this.data.key == 'strength') {
            cc.whole.checkRecoverST();
        }

        this.checkReview();
    },
});
