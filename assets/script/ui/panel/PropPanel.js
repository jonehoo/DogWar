//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		iconArea: cc.Node,
		nameArea: cc.Node,
		content: cc.Node,
	},

	start() {
		cc.WxAdMgr.ShowInterstitialAd();
	},

	onShow(data) {
		cc.WxAdMgr.ShowBannerAd();
		cc.isPause = true;
		this.key = data.key;
		this.init();

		cc.GameEvent.send("打开看视频使用道具窗口");
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				this.dead();
				break;
			case 'use':

				cc.GameEvent.send("点击看视频使用道具按钮");
				cc.WxAdMgr.ShowVideoAd((tag) => {
					cc.usePropCB(tag);
					if (tag) {
						cc.GameEvent.send("看视频使用道具成功");
						this.dead();
					} else {
						cc.GameEvent.send("看视频使用道具失败");
					}
				});

				break;
			default:
				break;
		}
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.propData = cc.ObjConfig.SHOP[this.key];
		this.icons = this.iconArea.children;
		this.names = this.nameArea.children;

		this.show();
	},

	show() {
		this.icons[this.propData.iconIndex].active = true;
		this.names[this.propData.iconIndex].active = true;
	},

	dead() {
		cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			cc.isPause = false;
			this.node.destroy();
		}, 0.18);
	},
});
