//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
       
    },
	
	start(){
		cc.WxAdMgr.ShowInterstitialAd();
	},

    onShow () {
		cc.isPause = true;
		cc.WxAdMgr.ShowBannerAd();
		cc.whole.pauseRecorder();
        this.init();
    },
	
	init(){
		cc.GameEvent.send('暂停游戏',{'game_pause': '暂停游戏'});
		this.skinKey = cc.DataMgr.getValue('skinKey') || 'a';
	},
	
	onClick(event,tag){
		cc.AudioMgr.playSound('button');
		switch(tag){
			case 'home':
			    //cc.AudioMgr.stopAll();
				cc.WxAdMgr.HideBannerAd();
				cc.whole.stopRecorder();
			    this.toMain();
			    break;
				
            case 'restart':
			    //cc.AudioMgr.stopAll();
				cc.SkinKey = this.skinKey;
			    cc.Game.restart();
				this.dead();
			    break;	
			
			case 'rank':
				cc.Utils.showWxRank({
					score: cc.UILayer && cc.UILayer.score ? cc.UILayer.score : 0,
					time: cc.Game && cc.Game.useTime ? cc.Game.useTime : 0,
					chapter: cc.LayerIndex || 0,
				});
			    break
				
            case 'continue':
			    cc.isPause = false;
				cc.whole.resumeRecorder();
				this.dead();
			    break;	
			default:
			    break;
		}
	},
	
	toMain(){
		cc.AudioMgr.stopAll();
		this.scheduleOnce(() => {
            cc.Player = null;
			cc.UILayer = null;
			cc.Game = null;
			cc.director.loadScene('main');
        },0.1);
		
		setTimeout(() => {
			cc.WxAdMgr.ShowInterstitialAd();
		},2000);
	},
	
	dead(){
	   cc.WxAdMgr.HideBannerAd();
       this.node.destroy();
	},
});
