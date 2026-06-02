//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
		reviewBtn: cc.Node,
		iconArea: cc.Node,
		nameArea: cc.Node,

		valueLabel: cc.Label,
	},

	onShow(data) {
		cc.WxAdMgr.ShowBannerAd();
		this.data = data;

		this.init();
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				this.review(1);
				break;

			case 'review':
				cc.GameEvent.send("抽奖普通领取");
				this.review(1);
				break;

			case 'review2':
				cc.GameEvent.send("点击抽奖3倍领取");
				cc.WxAdMgr.ShowVideoAd((tag) => {
					if (tag) {
						cc.GameEvent.send("抽奖3倍领取成功");
						this.review(3);
					} else {
						cc.GameEvent.send("抽奖3倍领取失败");
					}
				});
				break;

			default:
				break;
		}
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.icons = this.iconArea.children;
		this.names = this.nameArea.children;

		this.scheduleOnce(() => {
			this.reviewBtn.active = true;
		}, 3);

		this.showItem();

	},

	showItem() {
		this.valueLabel.string = `x ${this.data.value}`;
		this.icons[this.data.iconIndex].active = true;
		this.names[this.data.iconIndex].active = true;
	},

	review(p) {
		let v = this.data.value * p;
		if (this.data.bigKey == 'prop') {
			cc.whole.updateValue(this.data.key, v);
		} else {
			cc.whole.updateValue(this.data.key, v);
			if (this.data.key == 'strength') {
				cc.whole.checkRecoverST();
			}
		}

		cc.Utils.showTip({ name: this.data.name, value: v, iconIndex: this.data.iconIndex });
		this.dead();
	},

	dead() {
		this.animCtrl.play('panelClose');
		cc.WxAdMgr.HideBannerAd();
		cc.LotterPanel.isResult = false;
		cc.LotterPanel.show();
		this.scheduleOnce(() => {
			this.node.destroy();
		}, 0.18);
	},
});
