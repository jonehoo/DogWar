//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
		icon: cc.Node,
        content: cc.Node,
    },
	
	start(){
		cc.WxAdMgr.ShowInterstitialAd();
	},

    onShow (data) {
		cc.WxAdMgr.ShowBannerAd();
		if(cc.SceneCode == 1){
			this.layerIndex = data.index;
		}
	
        this.init();
		this.checkGuideShow();
		this.scheduleOnce(() => {
           cc.Utils.checkGuide(3,this.node); 
        },0.2);
    },
	
	checkGuideShow(){
		if(cc.LocalMinLayerIndex == 0 && !cc.FinishGuide){
			this.isGuide = true;
			this.icon.active = false;
		}else{
			this.isGuide = false;
			this.icon.active = true;
		}
	},
	
	onClick(event,tag){
		cc.AudioMgr.playSound('button');
		switch(tag){
			case 'close':
			    cc.MoreBlood = false;
			    this.dead();
			    break;
            case 'double':
			    if(this.isGuide){
					cc.MoreBlood = true;
			        this.dead();
			    }else{
					cc.GameEvent.send("点击双倍血量按钮");
					cc.WxAdMgr.ShowVideoAd((tag) => {
					    if(tag){
						    cc.MoreBlood = true
							cc.GameEvent.send("使用双倍血量成功");
			                this.dead();
					    }else{
							cc.GameEvent.send("使用双倍血量失败");
					    }
		            });
				}
			    break;				
			default:
			    break;
		}
	},
	
	init(){
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.isClick = false;
    },
	
	dead(){
		cc.WxAdMgr.HideBannerAd();
		if(this.isClick){
			return;
		}
		
		if(cc.SceneCode == 1){
			cc.IsPassChapter = false;
			this.play();
		}else{
			if(cc.IsNext){
				cc.Game.next();
			}else{
				cc.Game.restart();
			}
			
			cc.IsPassChapter = false;
			this.node.destroy();
		}
	},
	
	play(){
		cc.Guide && cc.Guide.dead();
		if(this.layerIndex == cc.LocalLayerIndex){
			if(cc.whole.strength > 0){ 
			    this.isClick = true;
			    cc.LayerIndex = this.layerIndex;
				cc.wholeUI.showUI(false);
				cc.whole.updateValue('strength',-1);
				cc.whole.checkRecoverST(true);
				cc.WxAdMgr.HideBannerAd();
			    cc.director.loadScene('game');
			}else{
			    cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.STRENGTHPANEL,cc.wholeUI.panel);
		    }
		}else{
			this.isClick = true;
			cc.LayerIndex = this.layerIndex;
			cc.wholeUI.showUI(false);
			cc.WxAdMgr.HideBannerAd();
			cc.director.loadScene('game');
		}
	},
});
