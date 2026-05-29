//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
    },
	
	usePlayer(targetDoorId,closeDoorId){
		cc.Eye && cc.Eye.dead();
		cc.GameUI.loadNode(cc.GameConfig.PREFAB_TYPE.EYE,this.node,null,null, (item) => {          
			item.opacity = 0; 
        });
		
		for (let key in this.scripts['PLAYER']) {
            this.scripts['PLAYER'][key].use(targetDoorId,closeDoorId);
			this.scripts['PLAYER'][key].setCameraPos();
        }
		
		cc.UILayer.isCheckTime = true;
	},//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999

	
	applyRect(){
		for (let key in this.scripts['ROAD']) {
            this.scripts['ROAD'][key].applyRect();
        }
		
		for (let key in this.scripts['OTHER']) {
			if(this.scripts['OTHER'][key].applyRect){
				this.scripts['OTHER'][key].applyRect();
			}else{
				cc.log(key);
			}
        }
	},

    initMap() {
		this.isExtra = false;
        this.initBase();
		this.initMapData();
    },
	
	initExtraMap(layerId,targetDoorId) {
		this.isExtra = true;
		this.extraLayerId = layerId;
		this.playerTargetDoorId = targetDoorId;
        this.initBase();
		this.initExtraMapData();
    },
	
	initBase(){
		 this.scripts = {
            'PLAYER': {},
            'ROAD': {},
            'MONSTER': {},
            'OTHER': {},
            'BULLET': {},
            'POINT': {},
            'FLYMONSTER': {},
			'BOSS': {},
        };
	},
	
	initMapData(){
		this.checkModel();
		this.initLayerParam();
	},
	
	checkModel(){
		cc.log(cc.LayerIndex);
		if(cc.ChapterModel == 'risk'){
			this.layerData = cc.Map[cc.Maps[cc.LayerIndex]];
		}else{
			this.layerData = cc.MinMap[cc.MinMaps[cc.LayerIndex]];
		}
	},
	
	initExtraMapData(){
		this.layerData = cc.ExtraMap[this.extraLayerId];
		this.initLayerParam();
	},
	
	initLayerParam(){
		this.width = this.layerData.width;
		this.height = this.layerData.height;
        this.widthP = this.width / 2;
		this.heightP = this.height / 2;
		this.node.width = this.width;
		this.node.height = this.height;
		
		this.childs = this.layerData.childs;
		this.points = this.childs.point;
		
		this.pointCount = 0;
		this.pointMax = Object.keys(this.points).length - 1;
		
		cc.isPause = true;
		cc.GameUI.loadNode(cc.GameConfig.PREFAB_TYPE.EYE,this.node,null,null, (item) => {          
			item.opacity = 0; 
			this.addStaticNodes();
        });
	},
	
	addStaticNodes(){
		for(let key in this.childs){
			if(key == 'point'){
				continue;
			}
			
			this.t = this.childs[key];
			this.c = cc.GameConfig.PREFAB_TYPE[key];
			if(this.c){
				if(this.c[2] == 'BG'){
					for(let k in this.t){
				        cc.GameUI.loadNode(this.c,cc.Game.cloudNode,null,null,(item) =>{
							item.x = this.t[k].x;
				            item.y = this.t[k].y;
						    item.width = this.t[k].width;
				            item.height = this.t[k].height;
			            });
			        } 
				}else{
					this.score = cc.ObjConfig.SCORE[this.c[3]] || 0; 
				    for(let k in this.t){
					    cc.MaxScore += this.score;
				        cc.GameUI.addObj(this.c,null,null,(item) =>{
				            let script = item.getComponent(cc.GameConfig.PREFAB_TYPE[key][1]);
						    if(script){
							    if(script.setRect){
								    script.setRect(this.t[k]);
							    }else{
								    item.x = this.t[k].x;
				                    item.y = this.t[k].y;
						            item.width = this.t[k].width;
				                    item.height = this.t[k].height;
							    }
						    }else{
							    item.x = this.t[k].x;
				                item.y = this.t[k].y;
						        item.width = this.t[k].width;
				                item.height = this.t[k].height;
						    }
			            });
			        } 
				}
				
			}else{
				//cc.log(key);
			}
			
		}
		
		//cc.log(this.scripts)
		this.addPoint();
	},
	
	addPoint(){
		for(let key in this.points){
			if(this.points[key].Type == 'PLAYER'){
			    this.playerData = this.points[key];
				if(this.pointMax == 0){
					this.scheduleOnce(() => {
			            this.addPlayer();
			        },0.5);
				}
			}else{
				if(this.points[key].Type == 'CHEST'){
					if(this.points[key].OtherType1 == 'NOTEICON'){
						this.score = this.points[key].Num * 100;
					}else if(this.points[key].OtherType1 == 'INSECT'){
						this.score = 100;
					}else{
						 this.score = 0;
					}
				}else{
					this.c = cc.GameConfig.PREFAB_TYPE[this.points[key].Type];
				    this.n = cc.ObjConfig[this.c[2]];
				    if(this.n){
					    this.score = this.n[this.c[3]].SCORE || 0; 
				    }else{
					    this.score = 0;
				    }
				}
				cc.MaxScore += this.score;
	
				cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE.POINT,null,null,(item) =>{
				    let script = item.getComponent('Point');
				    item.x = this.points[key].x;
				    item.y = this.points[key].y;
					//item.width = this.points[key].width;
				    //item.height = this.points[key].height;
				
				    script.setConf(this.points[key]);
					
					this.pointCount ++;
					if(this.pointCount >= this.pointMax){
						cc.CameraMgr.setCameraPos(this.playerData.x + this.playerData.width / 2 - cc.winSize.width / 2
						    ,this.playerData.y + this.playerData.height / 2 - cc.winSize.height / 2);
							
						this.scheduleOnce(() => {
			                 this.addPlayer();
			            },0.5);
						
						this.pointCount = 0;
					}
			    });
			}
		}
	},
	
	addPlayer(){
		cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE.PLAYER,null,null,(item) =>{
			let script = item.getComponent('Player');
		    item.x = this.playerData.x;
		    item.y = this.playerData.y;
			script.setConfig(this.playerData,this.playerTargetDoorId);
			cc.Game.load.active = false;
			this.checkStrength();
	    });
	},
	
	checkStrength(){
		if(this.isExtra){
			return;
		}
		
		if(cc.LayerIndex == cc.UseLocalLayerIndex){
			cc.whole.updateValue('strength',-cc.NeedStrength);
	        cc.whole.checkRecoverST(true);
			cc.Utils.showTip({holdTime: 0.7,name: '体力' ,value: -cc.NeedStrength,iconIndex: 4});
		}
	},

    update(dt){
        if(cc.isPause){
            return;
        }

        this.logic(dt);
    },

    logic(dt) {
        for (let key in this.scripts['ROAD']) {
            this.scripts['ROAD'][key].logic(dt);
        }

        for (let key in this.scripts['MONSTER']) {
            this.scripts['MONSTER'][key].logic(dt);
        }
		
		for (let key in this.scripts['FLYMONSTER']) {
            this.scripts['FLYMONSTER'][key].logic(dt);
        }

        for (let key in this.scripts['PLAYER']) {
            this.checkPlayerCollision(this.scripts['PLAYER'][key], this.scripts['ROAD']);
            this.scripts['PLAYER'][key].logic(dt);
        }
    },
	
	checkPlayerCollision(targerScript, arr) {
		if (!targerScript.isActive) {
            return;
        }
		
        for (let key in arr) {
            if (!arr[key].isActive) {
                continue;
            }
			
			if(arr[key].isBullet){
				continue;
			}
			
			if(!arr[key].IsCollision){
				continue;
			}

            if (!cc.MathUtil.pointDistance(targerScript.getRect(5), arr[key].getRect(5), targerScript.getRect(5).r + arr[key].getRect(5).r)) {
                continue;
            }

			if (arr[key].IsCollisionUp) {
                if (cc.MathUtil.rectInRect(targerScript.getRect(4), arr[key].getRect(0))) {
					if(targerScript.getRect(4).y >=  arr[key].getRect(4).y + arr[key].signHeight){
						targerScript.preStandRoad = arr[key].node;
                        continue;
					}
                }
            } 

            if (arr[key].IsCollisionDown) {
                if (cc.MathUtil.rectInRect(targerScript.getRect(4), arr[key].getRect(2))) {
                    targerScript.preShakeRoad = arr[key].node;
                    continue;
                }
            } 

            if (arr[key].IsCollisionRight) {
                if (cc.MathUtil.rectInRect(targerScript.getRect(4), arr[key].getRect(1))) {
					targerScript.isLeftPush = true;
					for(let item in targerScript.preLeftRoads){
						if(targerScript.preLeftRoads[item].uuid == arr[key].node.uuid){
							targerScript.isLeftPush = false;
						    break;
						}
					}
						
					if(targerScript.isLeftPush){
						targerScript.preLeftRoads[arr[key].node.uuid] = arr[key].node;
					}
						
		            if(!targerScript.haveBullet && arr[key].canBullet){
						if(targerScript.preLeftBulletRoad && targerScript.preLeftBulletRoad.isValid){
					        if(arr[key].node.y > targerScript.preLeftBulletRoad.y){
						        targerScript.preLeftBulletRoad = arr[key].node;
					        }
				        }else{
					        targerScript.preLeftBulletRoad = arr[key].node;
				        }
				    }
					
					
					continue;
                }
            }

            if (arr[key].IsCollisionLeft) {
                if (cc.MathUtil.rectInRect(targerScript.getRect(4), arr[key].getRect(3))) {
					targerScript.isRightPush = true;
					for(let item in targerScript.preRightRoads){
						if(targerScript.preRightRoads[item].uuid == arr[key].node.uuid){
							targerScript.isRightPush = false;
							break;
						}
					}
						
					if(targerScript.isRightPush){
						targerScript.preRightRoads[arr[key].node.uuid] = arr[key].node;
					}
						
				    if(!targerScript.haveBullet && arr[key].canBullet){
						if(targerScript.preRightBulletRoad && targerScript.preRightBulletRoad.isValid){
					        if(arr[key].node.y > targerScript.preRightBulletRoad.y){
						        targerScript.preRightBulletRoad = arr[key].node;
					        }
				        }else{
					        targerScript.preRightBulletRoad = arr[key].node;
				        }
					}
					
				    continue;
                }
            } 
        }
    },
	
	dead(){
		this.node.destroy();
	},

    getObjArray(type) {
        return this.scripts[type];
    },
});
