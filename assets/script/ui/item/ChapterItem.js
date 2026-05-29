//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
		chapterLabel: cc.Label,
		timeLabel: cc.Label,
		levelLabel: cc.Label,
		
		lock: cc.Node,
		boss: cc.Node,
		strengthTag: cc.Node,
    },

    onShow (data) {
        this.data = data;
		this.init();
    },
	
	init(){
		this.levels = ['A','B','C','D'];
		this.checkModel();
		this.show();
	},
	
	checkModel(){
		if(cc.ChapterModel == 'risk'){
			this.layerName = cc.Maps[this.data.index];
		}else{
			this.layerName = cc.MinMaps[this.data.index];
		}
		
		this.conf = cc.ObjConfig.LAYERCONF[this.layerName];
	},
	
	show(){
		this.isMax = this.data.index == this.data.itemMax
		this.boss.active = this.conf.bossLayer;
		if(this.data.isLock){
			this.lock.active = true;
		}else{
			this.lock.active = false;
			this.chapterLabel.node.active = true;
			this.chapterLabel.string = `${this.data.index + 1}`;
			this.localData = cc.ChapterPanel.chapterData[this.data.index];
			if(this.isMax){
				if(this.localData){
					this.timeLabel.node.active = true;
			        this.levelLabel.node.active = true;
					this.timeLabel.string = cc.Utils.conversionTime(this.localData.time);
			        this.levelLabel.string = this.levels[this.localData.levelCode];
				}else{
				    this.strengthTag.active = true;
			    }
			}else{
				if(!this.data.isNow){
			        this.timeLabel.node.active = true;
			        this.levelLabel.node.active = true;
				
				    if(this.localData){
					    this.timeLabel.string = cc.Utils.conversionTime(this.localData.time);
			            this.levelLabel.string = this.levels[this.localData.levelCode];
				    }
			    }else{
				     this.strengthTag.active = true;
			    }
			}
			
		}	
	},
	
	onClick(){
		if(this.data.isLock){
			cc.Utils.showToast('关卡未解锁!');
		}else{
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERINFOPANEL,cc.Main.panel,{index: this.data.index});
		}
	    
	}
});
