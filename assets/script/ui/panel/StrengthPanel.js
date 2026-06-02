//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
		iconArea: cc.Node,
		nameArea: cc.Node,
		value: cc.Label,
	},

	start() {
		cc.WxAdMgr.ShowInterstitialAd();
	},

	onShow(data) {
		cc.WxAdMgr.ShowBannerAd();
		if (data) {
			this.propKey = data.key || 'strength';
		} else {
			this.propKey = 'strength';
		}

		this.init();

		cc.GameEvent.send("打开看视频获取货币窗口");
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				this.dead();
				break;
			case 'vedio':
				if (cc.MyPlat) {
					cc.GameEvent.send("点击看视频获取货币按钮");
					cc.WxAdMgr.ShowVideoAd((tag) => {
						if (tag) {
							cc.GameEvent.send("看视频获取货币成功");
							this.addProp();
						} else {
							cc.GameEvent.send("看视频获取货币失败");
						}
					});
				} else {
					this.addProp();
				}

				break;
			default:
				break;
		}
	},

	init() {
		this.icons = this.iconArea.children;
		this.names = this.nameArea.children;
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.propVedioConf = cc.ObjConfig.VEDIO[this.propKey];
		this.show();
	},

	show() {
		this.icons[this.propVedioConf.iconIndex].active = true;
		this.names[this.propVedioConf.iconIndex].active = true;
		this.value.string = `x${this.propVedioConf.value}`
	},

	addProp() {
		cc.whole.updateValue(this.propKey, this.propVedioConf.value);
		cc.Shop && cc.Shop.checkPrice();
		this.dead();
	},


	dead() {
		cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			this.node.destroy();
		}, 0.18);
	},
});
