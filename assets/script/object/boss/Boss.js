//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
       Type: '',
	   
	   bloodBar: cc.ProgressBar,
    },

    setConfig(conf){
		this.maxBlood = conf.Num;
		this.blood = this.maxBlood;
		
		switch (this.Type) {
            case cc.GameConfig.PREFAB_TYPE.BEENEST[3]:
			    this.monsterMaxNum = conf.Num2;
				this.prefabConf = cc.GameConfig.PREFAB_TYPE[conf.OtherType1];
                break;

            default:
                break;
        }
		
		this.isReady = true;
	},
	
    start () {
       this.init();
    },
	
	init(){
		this.conf = cc.ObjConfig.BOSS[this.Type];
		this.bg = this.node.getChildByName('bg');
		this.initBaseParam();

        this.colorIndex = 0;
        this.color = cc.Color.BLACK;
		this.colorLimmit = cc.GameConfig.CONSTANT.COLOR_RATE;
		this.blastUrl = cc.GameConfig.PREFAB_TYPE.BOSSBLAST;

		this.clockCount = 0;
		this.clockTime = 0;
        this.isColor = false;
		this.isClock = false;
		
		switch (this.Type) {
            case cc.GameConfig.PREFAB_TYPE.BEENEST[3]:
			    this.time = 0;
				this.monsterCount = 0;
			    this.isAdd = true;
				this.timeLimmit = this.conf.ADD_TIME_BASE;
                break;

            default:
                break;
        }
		
		this.bScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.BOSS);
	},
	
	initBaseParam(){
		this.offsetX = cc.GameConfig.CONSTANT.OFFSET_X;
		this.offsetY = cc.GameConfig.CONSTANT.OFFSET_Y;
		this.offsetWidth = cc.GameConfig.CONSTANT.OFFSET_WIDTH;
		this.offsetHeight = cc.GameConfig.CONSTANT.OFFSET_HEIGHT;
		this.collisionWidth = cc.GameConfig.CONSTANT.COLLISION_RECT_WIDTH;
		
		this.width = this.node.width;
		this.height = this.node.height;
        this.widthP = this.width / 2;
		this.heightP = this.height / 2;
		this.signHeight = this.height * 4 / 5;
		this.rectU = {};
        this.rectL = {};
        this.rectD = {};
        this.rectR = {};
        this.rectM = {};
        this.rectP = {};
		this.rectT = {};
		this.rectM2 = {};
		
        this.initRectPosition();
        this.initRectSize();
	},

    initRectSize() {
        this.rectU['width'] = this.width - this.offsetWidth;
        this.rectU['height'] = this.collisionWidth;

        this.rectL['width'] = this.collisionWidth;
        this.rectL['height'] = this.height - this.offsetHeight;
        
        this.rectD['width'] = this.width - 2 * this.offsetWidth;
        this.rectD['height'] = this.collisionWidth;

        this.rectR['width'] = this.collisionWidth;
        this.rectR['height'] = this.height - this.offsetHeight;

        this.rectM['width'] = this.width;
        this.rectM['height'] = this.height;
		
		this.rectM2['width'] = this.node.width;
        this.rectM2['height'] = this.node.height / 3;
		
		this.rectT['width'] = this.node.width;
        this.rectT['height'] = this.node.height / 5;

        this.rectP['r'] = this.width / 2 + this.height / 2;
    },
	
	initRectPosition() {
        this.rectU['x'] = this.node.x + this.offsetX;
        this.rectU['y'] = this.node.y + this.height;

        this.rectR['x'] = this.node.x + this.width;
        this.rectR['y'] = this.node.y + this.offsetY;

        this.rectD['x'] = this.node.x  + 2 * this.offsetX;
        this.rectD['y'] = this.node.y - this.offsetHeight;

        this.rectL['x'] = this.node.x - this.collisionWidth;;
        this.rectL['y'] = this.node.y + this.offsetY;

        this.rectM['x'] = this.node.x ;
        this.rectM['y'] = this.node.y ;

        this.rectP['x'] = this.node.x + this.widthP;
        this.rectP['y'] = this.node.y + this.heightP;
		
		this.rectT['x'] = this.node.x;
        this.rectT['y'] = this.node.y + this.node.height * 4 / 5;
		
		this.rectM2['x'] = this.node.x;
        this.rectM2['y'] = this.node.y + this.height / 3;
    },
	
	update(){
		if(!this.isReady){
			return;
		}
		
	    if(this.isDeadDrop){
			 //this.deadDrop();
		}else{
			if(this.isClock){
			    this.clock();
			    return;
		    }
			
			this.slow();
            this.changeColor();
              
            switch (this.Type) {
				case cc.GameConfig.PREFAB_TYPE.BEENEST[3]:
			        this.ckeckAddBee();
                    break;
						
                default:
                   break;
            } 
        }
    },
	
	hurt(conf){
        this.blood -= conf.HURT;
		this.bloodBar.progress = this.blood / this.maxBlood;
        if(this.blood <= 0){
			//cc.whole.playSound(8);
			cc.Utils.addScore(this.getRect(4),this.conf.SCORE);
            this.blast();
        }else{
            this.isColor = true;
            this.colorIndex = 0;
            this.bg.color = this.color.fromHEX(conf.COLOR || '#F35252');
        }
    },
	
	changeColor(){
        if(this.isColor){
            this.colorIndex ++;
            if(this.colorIndex >= this.colorLimmit){
                this.bg.color = this.color.fromHEX('#FFFFFF');
                this.isColor = false;
                this.colorIndex = 0;
            }
        }
    },
	
	clock(){
		if(!this.isClock){
			return;
		}
		
		this.clockCount ++;
		if(this.clockCount >= this.clockTime){
			this.setClock(false);
		}
	},
	
	slow(){
		if(!this.isSlow){
			return;
		}
		
		this.slowCount ++;
		if(this.slowCount >= this.slowTime){
			this.setSlow(false);
		}
	},
	
	ckeckAddBee(){
		this.isAdd = this.monsterCount < this.monsterMaxNum;
		if(!this.isAdd){
			return
		}
		
		this.time ++;
		if(this.time >= this.timeLimmit){
		    this.time = 0;
			this.addBee();
		    this.timeLimmit = this.conf.ADD_TIME_BASE + Math.round(Math.random() * this.conf.ADD_TIME_RANDOM);
		}
	},
	
	addBee(){
		cc.GameUI.addObj(this.prefabConf,this.node,cc.GameConfig.POS_TYPE.LEFT_DOWN,(item) =>{
		    let script = item.getComponent(this.prefabConf[1]);
		    script.pUid = this.node.uuid;
			script.setConfig({Num: 1});
			item.x = this.node.x + this.node.width / 2 - item.width / 2;
			item.y = this.node.y - 27;
			
			this.monsterCount ++;
        });
	},
	
	reduce(){
		this.monsterCount --;
		this.isAdd = this.monsterCount < this.monsterMaxNum;
	},
	
	blast(){
        cc.GameUI.loadNode(this.blastUrl,cc.Layer.node,this.getRect(4),cc.GameConfig.POS_TYPE.MIDDLE);
		this.dead();
    },
	
	dead(){
        delete this.bScripts[this.node.uuid];
		this.checkEnd();
        this.node.destroy();
    },
	
	checkEnd(){
		cc.BossNum --;
		if(cc.BossNum == 0){
			this.isPass = true;
			cc.Player.setPass(true);
		}
	},
	
	getRect(type) {
		this.initRectPosition();
        switch (type) {
            case 0:return this.rectU;
            case 1:return this.rectR;
            case 2:return this.rectD;
            case 3:return this.rectL;
            case 4:return this.rectM;
            case 5:return this.rectP;
			case 8: return this.rectM2;
		    case 10: return this.rectT;

            default:
                break;
        }
    },
});
