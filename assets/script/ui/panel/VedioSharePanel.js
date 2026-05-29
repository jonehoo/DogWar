//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
	    content: cc.Node,
		noShareBtn: cc.Node,
    },

    onShow () {
		cc.WxAdMgr.ShowBannerAd();
		cc.whole.stopRecorder();
		cc.RecorderCount = 0;
        this.init();
    },
	
	onClick(event,tag){
		cc.AudioMgr.playSound('button');
		switch(tag){
			case 'close':
			    this.dead();
			    break;
            case 'share':
			    this.ttShare();
			    break;				
			default:
			    break;
		}
	},
	
	ttShare(){
		let self = this;
		if(cc.MyPlat){
			cc.MyPlat.shareVideo({
                videoPath: `${cc.whole.videoPath}`,
                success (){
					setTimeout(() => {
						cc.MyPlat.showToast({
                            title: '分享成功,恭喜获得',
                            icon: 'none'
                        });
						
						self.reward();
					},500);
                    
                },
                fail (e) {
					setTimeout(() => {
					    cc.MyPlat.showToast({
                            title: '分享失败!',
                            icon: 'none'
                        });
					},500);
				}
            });
		}else{
			self.reward();
		}
	},
	
	reward(){
		let i = 1;
		let realBlood = 2;
		let realStar = 3;
		let realStrength = 2;
		
		cc.whole.updateValue('blood',realBlood);
		cc.Utils.showTip({name: '大血瓶' ,value: realBlood,iconIndex: 1});
		
		cc.whole.updateValue('star',realStar);
		setTimeout(() => {
			cc.Utils.showTip({name: '星星' ,value: realStar,iconIndex: 5});
		},200 * i);
		i ++;
		
	    cc.whole.updateValue('strength',realStrength);
		cc.whole.checkRecoverST();
		setTimeout(() => {
			cc.Utils.showTip({name: '体力' ,value: realStrength,iconIndex: 4});
	    },200 * i);
		i ++;
		
		this.dead();
	},
	
	
	init(){
		this.animCtrl = this.content.getComponent(cc.Animation);
	    this.show();
    },
	
    show(){
		this.scheduleOnce(() => {
			this.noShareBtn.active = true;
        },1.5);
	},
	
	dead(){
		//cc.WxAdMgr.HideBannerAd();
		cc.UILayer.showProp();
		this.animCtrl.play('panelClose');
        this.scheduleOnce(() => {
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.ENDPANEL,cc.UILayer.panel);
			setTimeout(() => {
				cc.WxAdMgr.ShowInterstitialAd();
			},2000);
            this.node.destroy();
        },0.18);
	},
});
