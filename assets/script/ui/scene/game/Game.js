//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
	    uiLayerNode: cc.Node,
	    cameraNode: cc.Node,
		bgCamera: cc.Node,
        layerNode: cc.Node,
		load: cc.Node,
		bg: cc.Node,
		cloudNode: cc.Node,
		
		timeText: cc.Label,
    },
	
    start () {
		cc.Game = this;
		cc.Star = 0;
		cc.MaxScore = 0;
		cc.ContinueTimes = 3;
		cc.SceneCode = 2;
		cc.LayerNodes = {};
		//cc.BgNode = this.bg;
		//cc.UILayerNode = this.uiLayerNode;
        cc.CameraNode = this.cameraNode;
		cc.BGCamera = this.bgCamera;
		cc.CameraMgr.init();
		
        this.init();
		cc.WxAdMgr.HideBannerAd();
    },
	
	update (dt) {
		if(cc.isPause){
			return;
		}
		
		this.checkTime();
	},
	
	init(){
		this.useTime = 0;
		this.bgs = this.bg.children;
		this.layerUrl = cc.GameConfig.LAYER_TYPE.LAYER;
		this.layerConf = cc.ObjConfig.LAYERCONF;
		this.timeRate = cc.GameConfig.CONSTANT.TIME_RATE;
		
		cc.GameEvent.stageStart({
			stageId   : `${cc.ChapterCode}.${cc.LayerIndex}`,     //关卡ID 该字段必传
            stageName : `${cc.ChapterModelName}第${cc.LayerIndex + 1}关`, //关卡名称  该字段必传
		});
		
		this.checkModel();
	},
	
	checkModel(){
		if(cc.ChapterModel == 'risk'){
			this.useMap = cc.Map;
			this.useMaps = cc.Maps;
			cc.UseMapMax = cc.MapMax;
			//this.useLocalIndex = cc.LocalLayerIndex;
		}else{
			this.useMap = cc.MinMap;
			this.useMaps = cc.MinMaps;
			cc.UseMapMax = cc.MinMapMax;
			//this.useLocalIndex = cc.LocalMinLayerIndex;
		}
		
		this.layerName = this.useMaps[cc.LayerIndex];
		this.load.active = true;
		this.scheduleOnce(() => {
		    this.addLayer(false,this.layerName)
		},1);
	},
	
	initGameTime(){
		this.timeCount = 0;
		this.isCheckTime = false;
		this.scheduleOnce(() => {
			this.isCheckTime = true;
		},0.8);
		
		this.time = this.chapterTime;
		//this.time = 10;
		//this.allTime = this.time;
		this.timeText.string = cc.Utils.conversionTime(this.time);
	},
	
	checkBg(name){
		this.curConf = this.layerConf[name];
		this.bgIndex = this.curConf.bgIndex;
		if(this.lastBgIndex && this.lastBgIndex != this.bgIndex){
			this.bgs[this.lastBgIndex].active = false;
		}
		this.lastBgIndex = this.bgIndex;
	    
		this.mapData = null;
		if(this.curConf.isExtra){
			this.mapData = cc.ExtraMap[name];
		} else{ 
		    this.chapterTime = this.curConf.time;
		    this.mapData = this.useMap[name];
		}
		
		
		this.bgs[this.bgIndex].active = true;
		this.bg.width = this.mapData.width;
		this.bg.height = this.mapData.height;
		this.curBgNode = this.bgs[this.bgIndex];
		this.curBgNode.width = this.mapData.width;
		this.curBgNode.height = this.mapData.height;
	},
	
	addLayer(isExtra,name,targetDoorId){
		this.load.active = true;
		this.checkBg(name);
	    cc.GameUI.setLayer(this.layerUrl,this.layerNode, (item) => {
			let script = item.getComponent('Layer');
			cc.Layer = null;
			cc.Layer = script;
			
			this.curLayerName = name;
		    cc.LayerNodes[this.curLayerName] = {};
			cc.LayerNodes[this.curLayerName]['Script'] = script;
			cc.LayerNodes[this.curLayerName]['Node'] = item;
			
			if(isExtra){
				script.initExtraMap(name,targetDoorId);
			}else{
				script.initMap();
				this.scheduleOnce(() => {
				    cc.AudioMgr.playMusic('bg',true);
					cc.whole.startRecorder();
					this.initGameTime();
			    },0.5);
			}
		});
	},
	
	switchLayer(name,targetDoorId,closeDoorId){
		cc.isPause = true;
		cc.AudioMgr.pause('bg');
		if(this.curLayerName == name){
			this.load.active = true;
		    this.scheduleOnce(() => {
			     this.load.active = false;
		    },1.5);
			this.checkBg(name);
			this.cloudNode.opacity = this.layerConf[name].showCloud ? 255 : 0;
		    cc.AudioMgr.resume('bg');
			cc.Layer.usePlayer(targetDoorId,closeDoorId);
			cc.Layer.applyRect(); 
			return;
		}
		
		
		this.cloudNode.opacity = this.layerConf[name].showCloud ? 255 : 0;
		cc.LayerNodes[this.curLayerName]['Node'].active = false;
		if(cc.LayerNodes[name]){
			this.load.active = true;
		    this.scheduleOnce(() => {
			    this.load.active = false;
		    },1.5);
			this.checkBg(name);
			this.curLayerName = name;  
			    cc.LayerNodes[this.curLayerName]['Node'].active = true;
		        cc.Layer = null;
			    cc.Layer = cc.LayerNodes[this.curLayerName]['Script'];
			    cc.Layer.usePlayer(targetDoorId,closeDoorId);
		        cc.Layer.applyRect();
		}else{
			this.load.active = true;
		    this.scheduleOnce(() => {
			    this.addLayer(true,name,targetDoorId);
			},1);
		}       
	    
	},
	
	checkTime(){
		if(!this.isCheckTime){
			return;
		}
		
        this.timeCount ++;
        if(this.timeCount >= this.timeRate){
			this.useTime ++;
            this.time --;
			if(this.time < 0){
				this.time =0;
				this.isCheckTime = false;
				if(cc.FinishGuide){
					cc.Player.isHurtDead = true;
					cc.Player.setDead();
				}
			}
           
		   
		    this.timeText.string = cc.Utils.conversionTime(this.time);
            this.timeCount = 0;
        }
    },
	
	showFinishPanel(){
		if(cc.IsWin){
		    if(cc.whole.canShareVedio){
			    cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.VEDIOSHAREPANEL,cc.UILayer.panel);
		    }else{
			    cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.ENDPANEL,cc.UILayer.panel);
		    }
		}else{
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.ENDPANEL,cc.UILayer.panel);
		}
	},

	end(){
		cc.isPause = true;
		this.scheduleOnce(() => {
		    this.showFinishPanel();
		},0.2);
	},
	
	dead(){
		cc.log(cc.ContinueTimes);
		cc.isPause = true;
		this.scheduleOnce(() => {
			if(cc.ContinueTimes <= 0){
				this.showFinishPanel();
			}else{
				cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.DEADPANEL,cc.UILayer.panel);
			}
		},0.4);
	},
	
	restart(){
		this.load.active = true;
		this.cloudNode.removeAllChildren(true);
		this.useTime = 0;
		cc.Star = 0;
		cc.MaxScore = 0;
		cc.isPause = true;
		cc.Layer = null;
	    cc.ContinueTimes = 3;
		cc.UILayer.restart();
		
		cc.GameEvent.stageStart({
			stageId   : `${cc.ChapterCode}.${cc.LayerIndex}`,     //关卡ID 该字段必传
            stageName : `${cc.ChapterModelName}第${cc.LayerIndex + 1}关`, //关卡名称  该字段必传
		});
		
		for(let key in cc.LayerNodes){
			cc.LayerNodes[key]['Script'].dead();
		}
		cc.LayerNodes = {};
		
		cc.CameraMgr.reset();      
		
		if(cc.ChapterModel == 'risk'){
			this.layerName = cc.Maps[cc.LayerIndex];
		}else{
			this.layerName = cc.MinMaps[cc.LayerIndex];
		}
		this.scheduleOnce(() => {
			this.addLayer(false,this.layerName);
		},1);
	},
	
	continuePlay(){
		this.initGameTime();
		cc.UILayer.continuePlay();
	},
});
