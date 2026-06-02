//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
		iq: cc.Node,

		titleLabel: cc.Label,
		levelText: cc.Label,
		scoreText: cc.Label,
		timeText: cc.Label,
		chapterText: cc.Label,

		nextBtn: cc.Node,
		homeBtn: cc.Node,
		restartBtn: cc.Node,
	},

	start() {
		this.scheduleOnce(() => {
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.ENDREWARDPANEL, cc.UILayer.panel);
		}, 0.8);


		cc.WxAdMgr.ShowBannerAd();
	},

	onShow() {
		cc.EndPanel = this;
		cc.MoreBlood = false;
		cc.RecorderCount++;
		cc.whole.stopRecorder();
		this.canClick = false;
		this.init();
		//this.checkGuide();

		cc.whole.updateValue('skillData', false);
	},

	checkGuide() {
		if (cc.LayerMinIndex == 0 && !cc.FinishGuide) {
			this.homeBtn.active = false;
			this.restartBtn.active = false;
		}
	},

	onClick(event, tag) {
		if (!this.canClick) {
			return;
		}

		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'home':
				//cc.GameEvent.send('返回主界面',{'back_home': '返回主界面'});
				cc.WxAdMgr.HideBannerAd();
				this.toMain();
				break;

			case 'restart':
				//cc.GameEvent.send('重新开始',{'restart': '重新开始'});
				//cc.SkinKey = this.skinKey;
				cc.WxAdMgr.HideBannerAd();
				cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERINFOPANEL, cc.UILayer.panel, { index: cc.LayerIndex });
				this.dead();
				break;

			case 'rank':
				cc.Utils.showWxRank();
				break

			case 'next':
				cc.WxAdMgr.HideBannerAd();
				cc.Guide && cc.Guide.dead();
				cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERINFOPANEL, cc.UILayer.panel, { index: cc.LayerIndex + 1 });
				this.dead();
				break;

			default:
				break;
		}
	},

	init() {
		cc.AudioMgr.stopAll();
		this.checkParam();
	},

	checkParam() {
		this.score = cc.UILayer.score;
		this.time = cc.Game.useTime;
		if (cc.IsWin) {
			//cc.RecorderCount ++;
			cc.AudioMgr.playSound('pass');
			this.titleLabel.string = '闯关成功';
			if (cc.ChapterModel == 'risk') {
				this.levelText.node.scale = 1;
				this.iq.active = false;
				if (this.score >= cc.MaxScore * 2 / 3) {
					this.level = 'A';
					cc.UILayer.levelCode = 0;
				} else if (this.score >= cc.MaxScore / 3 && this.score < cc.MaxScore * 2 / 3) {
					this.level = 'B';
					cc.UILayer.levelCode = 1;
				} else if (this.score >= cc.MaxScore / 4 && this.score < cc.MaxScore / 3) {
					this.level = 'C';
					cc.UILayer.levelCode = 2;
				} else {
					this.level = 'D';
					cc.UILayer.levelCode = 3;
				}
			} else {
				this.levelText.node.scale = 0.6;
				this.iq.active = true;
				this.level = `+${cc.Game.curConf.iq}`;
				cc.UILayer.levelCode = 0;
			}


			cc.UILayer.updateLocalChapterData();
			//this.submitGameLevel();
			this.endTag = "complete";
		} else {
			this.levelText.node.scale = 1;
			this.titleLabel.string = '闯关失败';
			this.level = 'C';
			cc.UILayer.levelCode = 2;
			this.endTag = "fail";
		}

		cc.GameEvent.stageEnd({
			stageId: `${cc.ChapterCode}.${cc.LayerIndex}`,     //关卡ID 该字段必传
			stageName: `${cc.ChapterModelName}第${cc.LayerIndex + 1}关`, //关卡名称  该字段必传
			event: this.endTag,
			params: {
				desc: "关卡结束"   //描述
			}
		});

		this.nextBtn.active = cc.IsWin;
		this.scoreText.string = this.score;
		this.timeText.string = cc.Utils.conversionTime(this.time);
		this.levelText.string = this.level;
		this.chapterText.string = `第 ${cc.LayerIndex + 1} 关`;

		if (cc.IsWin) {
			cc.Utils.reportRank && cc.Utils.reportRank({
				score: this.score,
				time: this.time,
				chapter: cc.LayerIndex,
			});
		}
	},

	submitGameLevel() {
		if (!cc.MyPlat) {
			return;
		}

		sqSdk.getDyb().game_level(cc.LayerIndex, (res) => {
			console.log(res.code, '上报关卡' + res.msg);
		});
	},

	toMain() {
		this.scheduleOnce(() => {
			cc.Player = null;
			cc.UILayer = null;
			cc.Game = null;
			cc.EndPanel = null;
			//cc.wholeUI.showUI(false);
			cc.director.loadScene('main');
		}, 0.1);

		setTimeout(() => {
			cc.WxAdMgr.ShowInterstitialAd();
		}, 2000);
	},

	dead() {
		cc.EndPanel = null;
		cc.wholeUI.showUI(false);
		this.node.destroy();
	},
});
