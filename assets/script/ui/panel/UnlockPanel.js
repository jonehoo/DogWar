//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		descText: cc.Label,
		nameText: cc.Label,
		descTemp: cc.Node,
		content: cc.Node,
	},

	start() {
		this.scheduleOnce(() => {
			cc.WxAdMgr.ShowInterstitialAd();
		}, 0.5);
	},

	onShow(data) {
		cc.WxAdMgr.ShowBannerAd();
		this.isTempSkill = data.temp;
		this.skillName = data.name;
		this.cb = data.cb;
		this.init();
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				this.cb && this.cb();
				this.dead();
				break;
			default:
				break;
		}
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.show();
	},

	show() {
		this.descTemp.active = this.isTempSkill;
		this.descText.string = this.isTempSkill ? '临时解锁技能' : '恭喜解锁技能';
		this.nameText.string = this.skillName;
	},

	dead() {
		cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			this.node.destroy();
		}, 0.18);
	},
});
