//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
		itemArea: cc.Node,
		closeBtn: cc.Node,
	},

	start() {
		setTimeout(() => {
			cc.WxAdMgr.ShowInterstitialAd();
		}, 2000);
	},

	onShow() {
		cc.WxAdMgr.ShowBannerAd();
		cc.Oline = this;
		this.init();

		//cc.GameEvent.send("打开商店窗口");
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				this.dead();
				break;

			default:
				break;
		}
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.items = this.itemArea.children;
		this.initItem();
	},

	initItem() {
		for (let i = 0; i < this.items.length; i++) {
			let script = this.items[i].getComponent('OnlineItem');
			script.setKey(i);
		}

		this.scheduleOnce(() => {
			this.closeBtn.active = true;
		}, 2);
	},

	dead() {
		cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			cc.Oline = null;
			this.node.destroy();
		}, 0.18);
	},
});
