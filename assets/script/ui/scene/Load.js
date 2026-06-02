//  Su.GuiCuan
cc.Class({
	extends: cc.Component,

	properties: {
		bar: cc.ProgressBar,

		ui: cc.Node,
		plot: cc.Node,
		plotSay: cc.Animation,

		princess: cc.Node,
		player: cc.Node,
		dragon: cc.Node,

		princessDialog: cc.Animation,
		playerDialog: cc.Animation,
		dragonDialog: cc.Animation,

		princessText: cc.Label,
		playerText: cc.Label,
		dragonText: cc.Label,
	},

	start() {
		this.init();
		//this.initRes();
	},

	update(dt) {
		this.checkDialog();
	},

	init() {
		this.checkPlot();
	},

	onClick(event, tag) {
		switch (tag) {
			case 'passPlot':
				this.passPlot();
				break;

			default:
				break;
		}
	},

	checkPlot() {
		let isCompletePlot = cc.DataMgr.getValue('isCompletePlot');
		if (!isCompletePlot) {
			this.initPlot();
			cc.DataMgr.setValue('isCompletePlot', true);
		} else {
			this.passPlot();
		}
	},

	passPlot() {
		this.plot.active = false;
		this.ui.active = true;
		this.initRes();
	},
	//电子邮件puhalskijsemen@gmail.com
	//源码网站 开vpn全局模式打开 http://web3incubators.com/
	//电报https://t.me/gamecode999

	initPlot() {
		this.dragonEndX = this.dragon.x + 300
		this.dragonEndY = this.dragon.y;
		this.dragonEndX2 = cc.winSize.width;
		this.dragonEndY2 = this.dragon.y;
		this.princessEndX = cc.winSize.width + this.dragon.width / 2 - this.princess.width / 2;
		this.princessEndY = this.dragon.y - this.princess.height * 3 / 4;
		this.playerAnim = this.player.getComponent(cc.Animation),
			this.showPlatSay();
	},

	showPlatSay() {
		this.scheduleOnce(() => {
			this.plotSay.play('plotSay');
			this.initDialog();
		}, 2.5);
	},

	initRes() {
		this.isLoading = true;
		cc.GameUI.init((progress) => {
			this.bar.progress = progress;
			if (progress == 1) {
				this.isLoading = false;
				cc.layerTag = 'main';
				this.scheduleOnce(() => {
					cc.director.loadScene("main");
				}, 0.2);

				/*this.scheduleOnce(() => {
					this.subscribeMsg();
				},1);*/
			}
		});
	},

	subscribeMsg() {
		if (!cc.MyPlat) {
			return;
		}

		sqSdk.getDyb().subscribeMsg((res) => {
			console.log(res)
		})
	},

	initDialog() {
		this.isDialog = true;
		this.isDialogShow = false;
		this.dialogIndex = 0;
		this.dialogCount = 0;
		this.holdCount = 0;
		this.dialogArr = cc.ObjConfig.PLOT;
		this.dialogMax = this.dialogArr.length - 1;
		this.dialogInfo = this.dialogArr[this.dialogIndex];
		this.peopleIndex = this.dialogInfo.index;
		this.lastPeopleIndex = this.peopleIndex;
		this.showTime = this.dialogInfo.time;
		this.holdTime = this.dialogInfo.holdTime;

		this.plotTexts = [this.princessText, this.playerText, this.dragonText];
		this.plotAnims = [this.princessDialog, this.playerDialog, this.dragonDialog];
	},

	checkDialog() {
		if (!this.isDialog) {
			return;
		}

		if (this.isDialogShow) {
			this.holdCount++;
			if (this.holdCount >= this.holdTime) {
				this.nextInfo();
				this.holdCount = 0;
			}
		} else {
			this.dialogCount++;
			if (this.dialogCount >= this.showTime) {
				this.showDialog();
				this.dialogCount = 0;
			}
		}
	},

	showDialog() {
		this.plotTexts[this.peopleIndex].string = this.dialogInfo.value;
		this.plotAnims[this.peopleIndex].play('plotDialog1');
		this.isDialogShow = true;
	},

	nextInfo() {
		this.plotAnims[this.peopleIndex].node.scale = 0;

		if (this.dialogIndex == 8) {
			this.isDialog = false;
			this.dragonMove();
		} else if (this.dialogIndex == 10) {
			this.isDialog = false;
			this.dragonMove();
		}
		else if (this.dialogIndex == 12) {
			this.scheduleOnce(() => {
				this.dragonMove2();
			}, 1);
		}

		this.dialogIndex++;
		if (this.dialogIndex >= this.dialogMax) {
			this.dialogIndex = this.dialogMax;
		}

		this.dialogInfo = this.dialogArr[this.dialogIndex];
		this.peopleIndex = this.dialogInfo.index;
		this.showTime = this.dialogInfo.time;
		this.holdTime = this.dialogInfo.holdTime;
		this.isDialogShow = false;
	},

	dragonMove() {
		cc.tween(this.dragon)
			.to(3, { position: cc.v2(this.dragonEndX, this.dragonEndY) })
			.call(() => {
				this.isDialog = true;
				this.dragonEndX = this.princess.x + this.princess.width / 2 - this.dragon.width / 2;
				this.dragonEndY = this.princess.y + this.princess.height * 3 / 4;
			}).start();
	},

	dragonMove2() {
		cc.tween(this.dragon)
			.to(6, { position: cc.v2(this.dragonEndX2, this.dragonEndY2) })
			.call(() => {
				this.scheduleOnce(() => {
					this.playerMove();
				}, 1);
			}).start();
		cc.tween(this.princess)
			.to(6, { position: cc.v2(this.princessEndX, this.princessEndY) })
			.start();
	},

	playerMove() {
		this.playerAnim.play('player');
		cc.tween(this.player)
			.to(3, { position: cc.v2(cc.winSize.width, this.player.y) })
			.call(() => {
				this.scheduleOnce(() => {
					this.plot.active = false;
					this.ui.active = true;
					this.initRes();
				}, 0.5);
			}).start();
	},
});
