//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		tip: cc.Label,
		time: cc.Label,

		progressBar: cc.ProgressBar,
		content: cc.Node,
	},

	onShow() {
		//cc.OnlinePanel = this;
		this.init();
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				this.dead();
				break;
			case 'bag':

				break;
			default:
				break;
		}
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);

		this.show();
		this.checkInterstAd();
	},

	checkInterstAd() {
		cc.InterstCount++;
		if (cc.InterstCount >= 3) {
			cc.WxAdMgr.ShowInterstitialAd();
		}
	},

	show() {
		//this.checkState();
	},

	checkState() {
		if (cc.whole.bagData.canReview) {
			this.time.string = '请领取';
			this.reviewBtn2.active = true;
			this.scheduleOnce(() => {
				this.reviewBtn.active = true;
			}, 2);
		} else {
			this.reviewBtn2.active = false;
			this.reviewBtn.active = false;
			//this.time.string = cc.Utils.conversionTime(cc.whole.onlineTime);
		}

	},

	review() {
		/*let realValue = this.data.value * p;
		cc.whole.updateValue(this.data.key,realValue);
		
		cc.Utils.showTip({name: this.data.name,value: realValue,iconIndex: this.data.iconIndex});
		cc.whole.addOnlineTimes();
		this.dead();*/
	},

	dead() {
		this.animCtrl.play('panelClose');
		//cc.OnlinePanel = null;
		this.scheduleOnce(() => {
			this.node.destroy();
		}, 0.18);
	},
});
