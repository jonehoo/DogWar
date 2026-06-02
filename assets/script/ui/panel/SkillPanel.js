//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
		itemArea: cc.Node,
	},

	start() {

		cc.WxAdMgr.ShowInterstitialAd();

	},

	onShow() {
		//cc.WxAdMgr.ShowBannerAd();
		cc.Skill = this;
		this.init();
		cc.GameEvent.send("打开技能窗口");
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
		//this.keys = Object.keys(cc.ObjConfig.SHOP);
		//this.initItem();
	},

	initItem() {
		this.scripts = [];
		for (let i = 0; i < this.items.length; i++) {
			let script = this.items[i].getComponent('ShopItem');
			script.setKey(this.keys[i]);
			this.scripts.push(script);
		}
	},

	checkPrice() {
		for (let key in this.scripts) {
			this.scripts[key].checkPrice();
		}
	},

	dead() {
		//cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			cc.Skill = null;
			this.node.destroy();
		}, 0.18);
	},
});
