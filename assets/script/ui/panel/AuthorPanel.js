//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
	},

	start() {
		this.scheduleOnce(() => {
			cc.WxAdMgr.ShowInterstitialAd();
		}, 0.5);
	},

	onShow() {
		cc.WxAdMgr.ShowBannerAd();
		this.init();
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
	},

	dead() {
		cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			this.node.destroy();
		}, 0.18);
	},
});
