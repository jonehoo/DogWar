//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  
const GameConfig = require('GameConfig');
cc.Class({
	extends: cc.Component,

	properties: {

	},


	onLoad() {
		cc.game.addPersistRootNode(this.node);
		cc.whole = this;

		this.init();
	},

	update() {
		if (this.isPause) {
			return;
		}

		this.checkOnline();
		this.recoverStrength();
	},


	init() {
		cc.GameConfig = require('GameConfig');
		cc.ObjConfig = require('ObjConfig');
		cc.MathUtil = require('MathUtil');
		cc.Utils = require('Utils');
		cc.WxAdMgr = require("WXAdMgr");

		var GameEvent = require('Event');
		cc.GameEvent = new GameEvent();

		cc.ChapterModel = 'risk';
		cc.ExtraMap = require('ExtraMapData');
		cc.Map = require('GameMapData');
		cc.MinMap = require('MinMapData');
		cc.Maps = Object.keys(cc.Map);
		cc.MinMaps = Object.keys(cc.MinMap);
		cc.MapMax = cc.Maps.length - 1;
		cc.MinMapMax = cc.MinMaps.length - 1;

		var ResMgr = require('ResMgr');
		cc.ResMgr = new ResMgr();

		var GameUI = require('GameUI');
		cc.GameUI = new GameUI();

		var CameraManager = require('CameraManager');
		cc.CameraMgr = new CameraManager();

		var DataMgr = require('DataManager');
		cc.DataMgr = new DataMgr();
		cc.DataMgr.init();


		cc.FinishGuide = cc.DataMgr.getValue('finishGuide');
		cc.FinishStep = cc.DataMgr.getValue('finishStep');

		cc.Utils.init();
		//cc.AudioMgr.init();

		if (window.wx) {
			cc.MyPlat = window.wx;
		} else if (window.tt) {
			cc.MyPlat = window.tt;
		}

		cc.WxAdMgr.InitAd();

		this.initParam();
		/*this.scheduleOnce(() => {
			this.checkUpdate();
		}, 1);*/
	},

	/*checkUpdate(){
		if(!cc.MyPlat){
			return;
		}
		
		let updateManager = cc.MyPlat.getUpdateManager()
		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			//console.log(res.hasUpdate)
		})

		updateManager.onUpdateReady(function () {
			cc.MyPlat.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})

		updateManager.onUpdateFailed(function () {
		// 新版本下载失败
		});
	},
	
	initSdk(){
		if(!cc.MyPlat){
			return;
		}
		
		//window.sqSdk = require('qqsdk_v3.3');
		this.initUserInfo();
		
	},*/

	/*checkSession(){
		if(!cc.MyPlat){
			return;
		}
		
		cc.MyPlat.checkSession({
			success() {
				// session_key 未过期，并且在本生命周期一直有效
			},
			fail() {
				// session_key 已经失效，需要重新执行登录流程
				cc.MyPlat.login() // 重新登录
			}
		})
	},*/

	checkAuthorize() {
		if (!cc.MyPlat) {
			return;
		}

		cc.MyPlat.getSetting({
			success(res) {
				if (!res.authSetting['scope.userInfo']) {
					cc.MyPlat.authorize({
						scope: "scope.userInfo",
						success() {
							// 用户同意授权用户信息
							cc.MyPlat.getUserInfo({
								success(userInfo) {
									cc.ttUserInfo = userInfo;
									//cc.Utils.postMessage({message: 'avatar',url: userInfo.userInfo.avatarUrl});
									console.log('success', cc.ttUserInfo);
								},

								fail(res) {
									console.log('fail', res);
								},
							});
						}
					});
				} else {
					cc.MyPlat.getUserInfo({
						success(userInfo) {
							cc.ttUserInfo = userInfo;
							//cc.Utils.postMessage({message: 'avatar',url: userInfo.userInfo.avatarUrl});
							console.log('success', cc.ttUserInfo);
						},

						fail(res) {
							console.log('fail', res);
						},
					});
				}
			},
		});
	},

	checkSession() {
		if (!cc.MyPlat) {
			return;
		}

		let self = this;
		cc.MyPlat.checkSession({
			success() {
				cc.IsLogin = true;
				self.scheduleOnce(() => {
					self.checkAuthorize();
				}, 0.5);
			},

			fail() {
				cc.MyPlat.login({
					force: false,
					success(res) {
						cc.IsLogin = true;
						self.scheduleOnce(() => {
							self.checkAuthorize();
						}, 0.5);
					},

					fail() {
						cc.IsLogin = false;
					}
				});
			}
		});
	},

	checkLogin() {
		if (cc.IsLogin == false) {
			cc.MyPlat.login({
				force: true,
				success(res) {
					cc.IsLogin = true;
				},

				fail() {
					cc.IsLogin = false;
				}
			});
		}
	},

	initSharePic() {
		if (!cc.MyPlat) {
			return;
		}

		this.sharePicPath = cc.url.raw('resources/pic/share.png');
		this.sharePicPath = cc.loader.md5Pipe.transformURL(this.sharePicPath)
	},

	initUserInfo() {
		sqSdk.getDyb().getDybUserInfo((res) => {
			console.log('获取到用户信息:' + JSON.stringify(res));

			let param = {
				server_id: 1101,
				server_name: '召唤师峡谷',
				nickname: '玩家',
				role_id: res.user.openid,
			}

			sqSdk.getDyb().roleData(param, (res) => {
				console.log('上报用户反馈信息:' + JSON.stringify(res));
			});
		});
	},

	initParam() {
		cc.SceneCode = 0;
		cc.RecorderCount = 1;
		cc.LocalLayerIndex = cc.DataMgr.getValue('layerIndex');
		cc.LocalMinLayerIndex = cc.DataMgr.getValue('minLayerIndex');
		cc.IsMusic = cc.DataMgr.getValue('isMusic');
		cc.IsSound = cc.DataMgr.getValue('isSound');

		cc.UseLocalLayerIndex = cc.LocalLayerIndex;

		this.skillData = cc.DataMgr.getValue('skill');
		cc.IsMoreJump = this.skillData.moreJump;
		cc.IsPower = this.skillData.power;
		cc.IsImmune = this.skillData.immune;
		cc.IsMoreJumpTemp = this.skillData.moreJumpTemp;
		cc.IsPowerTemp = this.skillData.powerTemp;
		cc.IsImmuneTemp = this.skillData.immuneTemp;

		this.maxStrength = cc.GameConfig.CONSTANT.BASE_STRENGTH;
		this.baseLotterTicket = cc.GameConfig.CONSTANT.BASE_LOTTER_TICKET;
		this.basePassTimes = cc.GameConfig.CONSTANT.BASE_PASS_TIMES;
		this.rate = cc.GameConfig.CONSTANT.TIME_RATE;

		this.coin = cc.DataMgr.getValue('coin');
		this.star = cc.DataMgr.getValue('star');
		this.strength = cc.DataMgr.getValue('strength');
		this.lotterTicket = cc.DataMgr.getValue('lotterTicket');
		this.passTimes = cc.DataMgr.getValue('passTimes');

		this.prop = cc.DataMgr.getValue('prop');
		this.starIds = cc.DataMgr.getValue('starIds');

		this.checkSession();
		this.showShareMenu();
		this.initRecorder();

		this.initSharePic();

		this.initStrengthParam();
		this.initOnline();

		//this.initSdk();
		//this.submitFirst();
		//this.initSprite();
	},

	initLoaclData() {
		this.data = cc.DataMgr.getAll();

		let isInitLocal = false;
		let date = new Date();
		if (!(date.getFullYear() == this.data.date.year
			&& date.getMonth() + 1 == this.data.date.month
			&& date.getDate() == this.data.date.day)) {
			isInitLocal = true;

			this.data.date['year'] = date.getFullYear();
			this.data.date['month'] = date.getMonth() + 1;
			this.data.date['day'] = date.getDate();
		}

		if (isInitLocal) {
			this.data.isDayFirstShare = false;
			this.data.strengthBuyTimes = 0;
			if (this.strength < this.maxStrength) {
				this.strength = this.maxStrength;
				this.data.strength = this.maxStrength;
			}

			if (this.data.lotterTicket <= 0) {
				this.lotterTicket = this.baseLotterTicket;
				this.data.lotterTicket = this.baseLotterTicket;
			}

			this.passTimes = this.basePassTimes;
			this.data['passTimes'] = this.basePassTimes;

			for (let key in this.data.prop) {
				this.data.prop[key].useTimes = 0;
			}

			for (let key in this.data.dayTask) {
				this.data.dayTask[key].count = 0;
				this.data.dayTask[key].receive = false;
				this.data.dayTask[key].finish = false;
			}

			cc.DataMgr.save();
		}
	},

	addStarId(id) {
		this.starIds.push(id);
		cc.DataMgr.setValue('starIds', this.starIds);
	},

	checkStarId(id) {
		for (let key in this.starIds) {
			if (this.starIds[key] == id) {
				return true;
			}
		}

		return false;
	},

	checkCollectStar() {
		cc.Star = 0;
		if (cc.LayerIndex < 10) {
			this.tempStr = `layerStar0${cc.LayerIndex}`;
		} else {
			this.tempStr = `layerStar${cc.LayerIndex}`;
		}

		for (let key in this.starIds) {
			if (this.starIds[key].indexOf(this.tempStr) != -1) {
				cc.Star++;
			}
		}

		//cc.log(cc.Star,this.starIds)
	},

	useProp(key, cb) {
		if (this.prop[key].value >= 1) {
			this.updateValue(key, -1);
			cb && cb(true);
		} else {
			cc.usePropCB = null;
			cc.usePropCB = cb;
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.PROPPANEL, cc.UILayer.panel, { key: key });
		}
	},

	updateValue(key, value) {
		switch (key) {
			case 'coin':
				this.coin += value;
				cc.DataMgr.setValue('coin', this.coin);
				cc.wholeUI.showPropValue();
				break;

			case 'strength':
				this.strength += value;
				cc.DataMgr.setValue('strength', this.strength);
				cc.wholeUI.showPropValue();
				break;

			case 'star':
				this.star += value;
				cc.DataMgr.setValue('star', this.star);
				cc.wholeUI.showPropValue();
				break;

			case 'lotterTicket':
				this.lotterTicket += value;
				cc.DataMgr.setValue('lotterTicket', this.lotterTicket);
				//cc.wholeUI.showPropValue();
				break;
			case 'layerIndex':
				cc.LocalLayerIndex = value;
				cc.DataMgr.setValue('layerIndex', value);
				break;
			case 'minLayerIndex':
				cc.LocalMinLayerIndex = value;
				cc.DataMgr.setValue('minLayerIndex', value);
				break;

			case 'blood':
				this.prop.blood.value += value;
				cc.DataMgr.setValue('prop', this.prop);
				break;

			case 'liquid':
				this.prop.liquid.value += value;
				cc.DataMgr.setValue('prop', this.prop);
				break;
			case 'bloodr':
				this.prop.bloodr.value += value;
				cc.DataMgr.setValue('prop', this.prop);
				break;
			case 'power':
				this.skillData.power = value;
				cc.IsPower = value;
				cc.DataMgr.setValue('skill', this.skillData);
				break;
			case 'moreJump':
				this.skillData.moreJump = value;
				cc.IsMoreJump = value;
				cc.DataMgr.setValue('skill', this.skillData);
				break;
			case 'immune':
				this.skillData.immune = value;
				cc.IsImmune = value;
				cc.DataMgr.setValue('skill', this.skillData);
				break;
			case 'powerTemp':
				this.skillData.powerTemp = value;
				cc.IsPowerTemp = value;
				cc.DataMgr.setValue('skill', this.skillData);
				break;
			case 'moreJumpTemp':
				this.skillData.moreJumpTemp = value;
				cc.IsMoreJumpTemp = value;
				cc.DataMgr.setValue('skill', this.skillData);
				break;
			case 'immuneTemp':
				this.skillData.immuneTemp = value;
				cc.IsImmuneTemp = value;
				cc.DataMgr.setValue('skill', this.skillData);
				break;
			case 'skillData':
				this.skillData.immuneTemp = false;
				this.skillData.moreJumpTemp = false;
				this.skillData.powerTemp = false;
				cc.IsImmuneTemp = false;
				cc.IsMoreJumpTemp = false;
				cc.IsPowerTemp = false;
				cc.DataMgr.setValue('skill', this.skillData);
				break;
			case 'passTimes':
				this.passTimes += value;
				cc.DataMgr.setValue('passTimes', this.passTimes);
				//cc.wholeUI.showPassInfo();
				break;

			default:
				break;
		}


	},

	initStrengthParam() {
		this.isRecover = false;
		this.recoverCount = 0;
		this.recoverTime = 0;
		this.recoverRate = cc.GameConfig.CONSTANT.STRENGTH_RECOVER_LIMMIT;
	},

	checkRecoverST(isClick) {
		if (this.isRecover) {
			cc.wholeUI.recoverSTText.node.active = true;
			return;
		} else {
			if (isClick) {
				this.lastRecoverTime = Date.now();
				cc.DataMgr.setValue('lastRecoverTime', this.lastRecoverTime)
			} else {
				this.lastRecoverTime = cc.DataMgr.getValue('lastRecoverTime') || 0;
			}
		}

		if (this.strength >= this.maxStrength) {
			this.isRecover = false;
			cc.wholeUI.recoverSTText.node.active = false;
			return;
		}

		this.isRecover = true;
		this.recoverCount = 0;
		if (this.lastRecoverTime == 0) {
			this.recoverTime = this.recoverRate;
			cc.wholeUI.recoverSTText.string = `${cc.Utils.conversionTime(this.recoverTime)}`;
			cc.DataMgr.setValue('lastRecoverTime', Date.now());
		} else {
			let now = Date.now();
			if (now < this.lastRecoverTime) {
				cc.wholeUI.recoverSTText.node.active = false;
				this.isRecover = false;
				return;
			}

			let s = Math.round((now - this.lastRecoverTime) / 1000);
			let v = Math.floor(s / this.recoverRate);
			if (v > 0) {
				if (this.strength + v < this.maxStrength) {
					this.updateValue('strength', v);
					this.recoverTime = this.recoverRate - s;
					cc.wholeUI.recoverSTText.string = `${cc.Utils.conversionTime(this.recoverTime)}`;
					cc.wholeUI.recoverSTText.node.active = true;
				} else {
					this.isRecover = false;
					this.strength = this.maxStrength;
					cc.DataMgr.setValue('strength', this.maxStrength);
					cc.DataMgr.setValue('lastRecoverTime', Date.now());
					cc.wholeUI.recoverSTText.node.active = false;
				}
			} else {
				this.recoverTime = this.recoverRate - s;
				cc.wholeUI.recoverSTText.string = `${cc.Utils.conversionTime(this.recoverTime)}`;
				cc.wholeUI.recoverSTText.node.active = true;
			}
		}
	},

	recoverStrength() {
		if (!this.isRecover) {
			return;
		}

		this.recoverCount++;
		if (this.recoverCount >= this.rate) {
			if (this.recoverTime <= 0) {
				this.updateValue('strength', 1);
				cc.DataMgr.setValue('lastRecoverTime', Date.now());
				this.isRecover = false;
				this.checkRecoverST();
			} else {
				this.recoverTime--;
			}


			cc.wholeUI.recoverSTText.string = `${cc.Utils.conversionTime(this.recoverTime)}`;
			this.recoverCount = 0;
		}

	},

	initOnline() {
		this.localOnlineTime = 0;
		this.passSaveTime = 5;
		this.passTimeCount = 0;
		this.onlineTimeCount = 0;
		this.date = new Date();
		this.onlineLimmit = cc.GameConfig.CONSTANT.ONLINE_TIME;
		this.onlineData = cc.DataMgr.getValue('online2') || {};

		if (!(this.date.getFullYear() == this.onlineData.year && this.date.getMonth() + 1 == this.onlineData.month && this.date.getDate() == this.onlineData.day)) {
			this.onlineData.time = 0;
			this.onlineData.review = [false, false, false];
			this.onlineData.year = this.date.getFullYear();
			this.onlineData.month = this.date.getMonth() + 1;
			this.onlineData.day = this.date.getDate();

			cc.DataMgr.setValue('online2', this.onlineData);
		} else {
			this.localOnlineTime = this.onlineData.time;
		}

		this.checkInitOnline();
		//cc.log(this.onlineData);
	},

	reviewOnlineReward(key) {
		this.onlineData.review[key] = true;
		cc.DataMgr.setValue('online2', this.onlineData);
	},

	checkInitOnline() {
		if (this.onlineData.time >= this.onlineLimmit[3]) {
			this.isAddOnlineTime = false;
		} else {
			this.isAddOnlineTime = true;
		}
	},

	checkOnline() {
		if (!this.isAddOnlineTime) {
			return;
		}

		this.passTimeCount++;
		if (this.passTimeCount >= this.rate) {
			this.onlineTimeCount++;
			if (this.onlineTimeCount >= this.passSaveTime) {
				this.localOnlineTime += this.onlineTimeCount;
				this.onlineData.time = this.localOnlineTime;
				this.checkOnlineReview();
				cc.DataMgr.setValue('online2', this.onlineData);
				//cc.log(this.onlineData);
				this.onlineTimeCount = 0;
			}

			this.passTimeCount = 0;
		}
	},

	checkOnlineReview() {
		if ((this.localOnlineTime >= this.onlineLimmit[0] && !this.onlineData.review[0]) ||
			(this.localOnlineTime >= this.onlineLimmit[1] && !this.onlineData.review[1]) ||
			(this.localOnlineTime >= this.onlineLimmit[2] && !this.onlineData.review[2])) {
			this.canReviewOnline = true;
		} else {
			this.canReviewOnline = false;
		}

		if (cc.SceneCode == 1) {
			cc.Main.runOnlineAction(this.canReviewOnline);
		}
	},

	/*initSprite(){
		cc.ResMgr.loadSpriteAtlas('pic/bitmap/player', (res) => {
			cc.PlayerSprite = res;
		});
	},*/

	/*addOnlineTimes(){
		this.onlineData.count ++;
		this.onlineData.lastTime = 0;
		this.onlineData.canReview = false;
		cc.DataMgr.setValue('online',this.onlineData);
		
		this.checkInitOnline();
		if(cc.SceneCode == 1){
			cc.Main.checkOnline();
		}
	},
	
	initOnline(){
		this.canOnline = true;
		this.isOnline = true;
		this.onlineCount = 0;
		this.passSaveCount = 0;
		this.passSaveTime = 5;
		this.passTimeCount = 0;
		this.date = new Date();
		this.onlineData = cc.DataMgr.getValue('online') || {};
		
		if(!(this.date.getFullYear() == this.onlineData.year && this.date.getMonth() + 1 == this.onlineData.month && this.date.getDate() == this.onlineData.day)){
			this.onlineTime = 3 * 60;
			this.onlineData.count = 0;
			this.onlineData.lastTime = 0;
			this.onlineData.canReview = false;
			this.onlineData.year = this.date.getFullYear();
			this.onlineData.month = this.date.getMonth() + 1;
			this.onlineData.day = this.date.getDate();
			
			cc.DataMgr.setValue('online',this.onlineData);
		}else{
			this.checkInitOnline();
		}
		cc.log(this.onlineData);
	},
	
	checkInitOnline(){
		if(this.onlineData.count == 0){
			this.isOnline = !this.onlineData.canReview;
			this.onlineTime = 3 * 60 - this.onlineData.lastTime;
		}else{
			if(this.onlineData.count < 3){
				this.isOnline = !this.onlineData.canReview;
				this.onlineTime = 5 * 60 - this.onlineData.lastTime;
			}else{
				this.canOnline = false;
			}
		}
	},
	
	checkOnline(){
		if(!this.isOnline || !this.canOnline || !cc.Main){
			return;
		}
		
		this.onlineCount ++;
		if(this.onlineCount >= this.rate){
			this.passSaveCount ++;
			if(this.passSaveCount >= this.passSaveTime){
				this.onlineData.lastTime = this.passTimeCount;
				cc.DataMgr.setValue('online',this.onlineData);
				this.passSaveCount = 0;
			}
			
			this.onlineTime --;
			if(this.onlineTime <= 0){
				this.isOnline = false;
				this.onlineData.canReview = true;
				this.onlineData.lastTime = 0;
				cc.OnlinePanel && cc.OnlinePanel.checkState();
				if(cc.SceneCode == 1){
					cc.Main.checkOnline();
				}
				cc.DataMgr.setValue('online',this.onlineData);
			}else{
				this.passTimeCount ++;
			}
			
			if(cc.SceneCode == 1){
				cc.Main.onlineTimeLabel.string = cc.Utils.conversionTime(this.onlineTime);
				cc.OnlinePanel && (cc.OnlinePanel.time.string = cc.Utils.conversionTime(this.onlineTime));
			}
			this.onlineCount = 0;
		}
	},*/

	submitFirst() {
		let tag = cc.DataMgr.getValue('isFristRank') || false;
		if (!tag) {
			let chapterIndex = cc.DataMgr.getValue('chapterIndex');
			let chapterTime = cc.DataMgr.getValue('chapterTime');
			let realChapter = chapterIndex > 0 ? chapterIndex - 1 : chapterIndex;
			let time = chapterTime[realChapter] ? chapterTime[realChapter].time : 0;
			cc.Utils.postMessage({ message: 'post', chapter: realChapter, time: time, scoreD: cc.ClassicDValue, scoreJ: cc.ClassicJValue });
			cc.DataMgr.setValue('isFristRank', true);
		}
	},

	showShareMenu() {
		if (!cc.MyPlat) {
			return;
		}

		cc.MyPlat.showShareMenu();
		cc.MyPlat.onShareAppMessage(
			() => {
				return {
					title: '单手也能秀出操作!',
					//query : 'source=yqlist&inviterId=' + PlayerId + '',         
					imageUrl: this.sharePicPath,
				}
			});
	},

	passChapter() {
		if (cc.SceneCode != 2 || !cc.EndPanel) {
			return;
		}

		if (cc.MyPlat) {
			cc.WxAdMgr.ShowVideoAd((tag) => {
				if (tag) {
					cc.IsNext = true;
					cc.IsPassChapter = true;
					cc.EndPanel.updateLocalChapterData();
					cc.EndRewardPanel && cc.EndRewardPanel.review(1);
					cc.EndPanel.checkNext();
					this.updateValue('passTimes', -1);
				}
			});
		} else {
			cc.IsNext = true;
			cc.IsPassChapter = true;
			cc.EndPanel.updateLocalChapterData();
			cc.EndRewardPanel && cc.EndRewardPanel.review(1);
			cc.EndPanel.checkNext();
			this.updateValue('passTimes', -1);
		}
	},

	initRecorder() {
		if (!cc.MyPlat) {
			return;
		}

		this.recorder = cc.MyPlat.getGameRecorderManager();
		this.recorder.onStart(res => {
			this.isRecord = true;
			this.recordTime = new Date().getTime();
			cc.MyPlat.showToast({
				title: '录屏开始了~',
				icon: 'none'
			});
		});

		this.recorder.onPause((res) => {
			cc.MyPlat.showToast({
				title: '录屏暂停了~',
				icon: 'none'
			});
		});

		this.recorder.onResume((res) => {
			cc.MyPlat.showToast({
				title: '录屏恢复了~',
				icon: 'none'
			});
		});

		this.recorder.onStop((res) => {
			this.isRecord = false;
			let dtTime = new Date().getTime() - this.recordTime;
			if (dtTime < 3000) {
				this.canShareVedio = false;
				cc.MyPlat.showToast({
					title: '录屏失败,录屏时长低于3秒~',
					icon: 'none'
				});
			} else {
				this.videoPath = res.videoPath;
				this.canShareVedio = true;

				cc.MyPlat.showToast({
					title: '录屏结束了~',
					icon: 'none'
				});
			}
		});
	},



	startRecorder() {
		if (!this.recorder || this.isRecord) {
			return;
		}

		this.recorder.start({
			duration: 255,
		});
	},

	pauseRecorder() {
		if (!this.recorder) {
			return;
		}

		this.recorder.pause();
	},

	resumeRecorder() {
		if (!this.recorder) {
			return;
		}

		this.recorder.resume();
	},

	stopRecorder() {
		if (!this.recorder || !this.isRecord) {
			return;
		}

		this.recorder.stop();
	},
});
