//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		timeText: cc.Label,
		continueText: cc.Label,
		noPlayBtn: cc.Node,
	},

	start() {
		cc.WxAdMgr.ShowInterstitialAd();
	},

	onShow() {
		cc.WxAdMgr.ShowBannerAd();
		cc.whole.stopRecorder();
		this.init();
		this.startTime();
	},

	init() {
		cc.AudioMgr.pause('bg');
		this.timeIndex = 0;
		this.timeLimmit = cc.GameConfig.CONSTANT.TIME_RATE;
		this.time = cc.GameConfig.CONSTANT.CONTINUE_TIME;
		this.pTime = this.time - 3;
		this.timeText.string = this.time;
		this.continueText.string = cc.ContinueTimes;

		this.scheduleOnce(() => {
			this.checkTimerOver();
		}, 0.5);
	},

	update() {
		this.checkTime();
	},

	checkTimerOver() {
		if (cc.Game.time > 0) {
			return;
		}

		cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.TIMEOVER, cc.UILayer.panel);
	},

	startTime() {
		this.scheduleOnce(() => {
			this.isTime = true;
		}, 0.3);
	},

	checkTime() {
		if (!this.isTime) {
			return;
		}

		this.timeIndex++;
		if (this.timeIndex >= this.timeLimmit) {
			this.time--;
			if (this.time <= 0) {
				this.time = 0;
				this.isTime = false;
				cc.Player.isHurtDead = false;
				cc.Player.setPass(false);
				this.dead();
			}

			if (this.time == this.pTime) {
				this.noPlayBtn.active = true;
			}

			this.timeText.string = this.time;
			this.timeIndex = 0;
		}
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				cc.IsWin = false;
				cc.Game.end();
				this.dead();
				break;

			case 'continue':
				if (cc.MyPlat) {
					this.play();
				} else {
					this.resetParam();
				}
				break;

			case 'share':
				if (cc.MyPlat) {
					this.vedioShare();
				} else {
					cc.MoreBlood = true;
					this.resetParam();
				}

				break;
			default:
				break;
		}
	},

	vedioShare() {
		let self = this;
		self.isTime = false;
		console.log("DeadPanel: vedioShare called, cc.MyPlat exists:", !!cc.MyPlat);
		if (cc.MyPlat && typeof cc.MyPlat.shareVideo === 'function') {
			console.log("DeadPanel: calling cc.MyPlat.shareVideo");
			cc.MyPlat.shareVideo({
				videoPath: `${cc.whole.videoPath}`,
				success() {
					console.log("DeadPanel: shareVideo success");
					cc.MoreBlood = true;
					self.resetParam();
					setTimeout(() => {
						cc.MyPlat.showToast({
							title: '分享成功',
							icon: 'none'
						});
					}, 500);
				},
				fail(e) {
					console.log("DeadPanel: shareVideo fail", e);
					self.isTime = true;
					setTimeout(() => {
						cc.MyPlat.showToast({
							title: '分享失败!',
							icon: 'none'
						});
					}, 500);
				}
			});
		} else if (cc.MyPlat) {
			console.log("DeadPanel: calling cc.Utils.share");
			cc.Utils.share((res) => {
				console.log("DeadPanel: cc.Utils.share callback executed with res:", res);
				if (res === 1) {
					cc.MoreBlood = true;
					self.resetParam();
					setTimeout(() => {
						cc.MyPlat.showToast({
							title: '分享成功',
							icon: 'none'
						});
					}, 500);
				} else {
					self.isTime = true;
					setTimeout(() => {
						cc.MyPlat.showToast({
							title: '分享失败!',
							icon: 'none'
						});
					}, 500);
				}
			});
		} else {
			console.log("DeadPanel: cc.MyPlat not exist, direct resetParam");
			cc.MoreBlood = true;
			self.resetParam();
		}
	},

	play() {
		this.isTime = false;
		cc.AudioMgr.resume('bg');
		cc.GameEvent.send("点击复活按钮");
		cc.WxAdMgr.ShowVideoAd((tag) => {
			this.isTime = true;
			if (tag) {
				cc.GameEvent.send("复活成功");
				this.resetParam();
			} else {
				cc.GameEvent.send("复活失败");
			}
		});
	},

	resetParam() {
		console.log("DeadPanel: resetParam executed, cc.ContinueTimes:", cc.ContinueTimes, "cc.isPause:", cc.isPause);
		cc.WxAdMgr.HideBannerAd();
		if (cc.ContinueTimes > 0) {
			cc.ContinueTimes--;
		}

		cc.isPause = false;
		cc.Game.continuePlay();
		this.dead();
	},

	dead() {
		this.node.destroy();
	},
});
