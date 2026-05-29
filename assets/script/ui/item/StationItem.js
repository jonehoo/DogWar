//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
		nameText: cc.Label,
        iconArea: cc.Node,
    },

    onShow (data) {
		this.key = data.key;
        this.data = cc.ObjConfig.SHOP[this.key];
        this.icons = this.iconArea.children;

        this.show();
    },
	
	show(){
        this.nameText.string = this.data.name;
		this.iconArea.getChildByName(`${this.data.iconIndex}`).active = true;
    },



    onClick(event,tag){
		cc.AudioMgr.playSound('button');
		this.use();
    },
	
	use(){
		if(this.data.bigKey == 'skill'){
			cc.WxAdMgr.ShowVideoAd((tag) => {
				if(tag){
					this.updateVedioSkill();
				}
		    });
		}else{
			cc.WxAdMgr.ShowVideoAd((tag) => {
				if(tag){
					this.updateVedioProp();
				}
		    });
		}
	},

    updateVedioProp(){
		if(this.key == 'strength'){
			cc.whole.updateValue('strength',3);
			cc.whole.checkRecoverST();
			cc.Utils.showTip({name: this.data.name,value: 3,iconIndex: this.data.iconIndex});
		}else{
			cc.whole.updateValue(this.key,1);
			cc.Utils.showTip({name: this.data.name,value: 1,iconIndex: this.data.iconIndex});
		}
		
		this.scheduleOnce(() => {
           cc.Station.dead();
        },0.2);
	},
	
	updateVedioSkill(){
		cc.whole.updateValue(this.data.tempKey,true);
		cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.UNLOCKPANEL,cc.wholeUI.panel,{temp: true,name: this.data.name,cb: () => {
			this.scheduleOnce(() => {
               cc.Station.dead();
            },0.2);
		}});
	},
});
