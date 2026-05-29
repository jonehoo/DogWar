//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type:'player',
        frames:[cc.SpriteFrame],
        frames2:[cc.SpriteFrame],
		frames3:[cc.SpriteFrame],

		DirectionX: true,
        DirectionY: true,

        IsCollision: true,
        IsCollisionUp: true,
        IsCollisionLeft: true,
        IsCollisionDown: true,
        IsCollisionRight: true,
        IsCollisionMiddle: true,

		IsUpMoreCollision: false,
        IsLeftMoreCollision: true,
        IsRightMoreCollision: true,
        IsDownMoreCollision: false,
		
		IsCheckUp:true,
        IsCheckLeft:true,
        IsCheckDown:true,
        IsCheckRight:true,
    },
	
	setConfig(conf,targetDoorId){
		this.init();
		if(targetDoorId){
			this.use(targetDoorId);
		}
	},


	use(targetDoorId,closeDoorId){
		//cc.log(this.isFire);
		cc.Player = null;
        cc.Player = this;
		this.stateActive = true;
		this.isFire = false;
		this.isJump = false;
		this.isDrop = false;
		this.noLeft();
		this.noRight();
		this.noUp();
		this.noDown();
		this.checkEnterTargetDoor(targetDoorId);
		
		//cc.Game.load.active = false;
		cc.isPause = false;
		//cc.log(this.isEnter,targetDoorId);
	},

    start () {
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
		
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);

        cc.Player = null;
        cc.Player = this;
        
		cc.isPause = false;
        //this.init();

        //cc.Layer.isStart = true;
    },

    update(){
        this.updateFrame();
    },

    logic(){
		if(!this.stateActive){
			return;
		}
		
		if(this.isOut){
			if(this.isOutLayerWait){
				this.outLayerWait();
			}else{
			    this.outLayer();
			}
			return;
		}
		
		if(this.isEnter){
			if(this.isEnterLayerWait){
				this.enterLayerWait();
			}else{
				this.enterLayer();
			}
			return;
		}
		
        this.invincible();
	    this.checkObj();
		this.springMove();
	    /*if(this.isPass){
            this.moveR();
		    this.drop();
	    }else{*/
			this.checkBox();
			this.checkMonster();
			this.checkFlyMonster();
			this.note();
			this.slow();
			this.shield();
		    this.speed();
            this.checkStandRoad();			
			if(!this.isDizziness ){
				this.moveD();
                this.moveU();
                this.moveL();
                this.moveR();
            }
			
            this.drop();
            this.jump();
			//this.jumpMove();
            this.flicker();
	    //}
    },

    init(){
        this.conf = cc.ObjConfig.MONSTER[this.Type];
       
        this.bg = this.node.getChildByName('bg');
		this.sprite = this.bg.getComponent(cc.Sprite);
		
		this.dizzinessNode = this.node.getChildByName('dizziness');
		this.shieldNode = this.node.getChildByName('shield');
       
        this.frameSize = 7;
		this.frameSize2 = 2;
		

        this.stateActive = true;
        this.isActive = true;
        /*this.blood = cc.GameConfig.CONSTANT.PLAYER_BLOOD;
		if(cc.MoreBlood){
			this.blood = this.blood * 2;
		}*/
		
		this.blood = cc.UILayer.bloodSize;

        this.speedR = 0;
		this.speedL = 0;
        this.jumpSpeed = 0;
		this.fixSpeed = this.conf.FIX_SPEED;
		this.moveIncrement = this.conf.MOVE_INCREMENT;
		this.moveStopIncrement = this.conf.MOVE_STOP_INCREMENT;
		this.ladderSpeed = this.conf.LADDER_SPEED;
		this.dropMaxSpeed = this.conf.DROP_MAX_SPEED;
		this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
		this.jumpMaxSpeed2 = this.conf.JUMP_MAX_SPEED2;
		this.jumpIncrement = this.conf.JUMP_INCREMENT;
        this.moveSpeed = this.conf.MOVE_SPEED;
		this.enterSpeed = this.conf.ENTER_SPEED;
		this.curMoveSpeed = this.moveSpeed;
		this.curMoveSpeedP = this.moveSpeed / 2;
		this.enterLayerLimmit = this.conf.ENTER_LAYER_LIMMIT;
		this.outLayerLimmit = this.conf.OUT_LAYER_LIMMIT;

        this.rate = cc.GameConfig.CONSTANT.FRAME_RATE;
        this.frameTime = this.rate;
		this.frameTime2 = this.rate;
        this.frameIndex = 2;
		this.frameIndex2 = 0;
		
		this.jumpCount = 0;
		this.enterWaitCount = 0;
		this.outWaitCount = 0;
		this.noteCount = 0;
		this.noteIndex = 0;
		this.noteMax = 0;
        this.hurtTime = 0;
		this.fireTime = 0;
        this.flickerTime = 0;
		this.dizzinessTime = 0;
		

       
        this.hurtLimmit = this.conf.HURT_LIMMIT;
		this.fireLimmit = this.conf.FIRE_LIMMIT;
        this.flickerLimmit = this.conf.FLICKER_LIMMIT;
		this.dizzinessLimmit = this.conf.DIZZINESS_LIMMIT;
		this.dizzinessLimmit = this.conf.DIZZINESS_LIMMIT;
		
        this.directCode = 1;
		
		this.curFrames = this.frames;

        this.sw = cc.winSize.width;
        this.sh = cc.winSize.height;
        this.smallWidth = this.sw / 2 - 50;
        this.smallHeight = this.sh / 4;
        this.maxWidth = this.sw / 2 + 50;
        this.maxHeight = this.sh * 4 / 5;

        //this.isEnter = false;
		this.isStopL = false;
		this.isStopR = false;
		this.isStoping = false;
		this.isOutLayerWait = false;
		this.isEnterLayerWait = false;
		this.isOut = false;
        this.isLadder = false;
		this.inLadder = false;
		this.isLadderMove = false;
        this.isDizziness = false;
        this.isDrop = true;
        this.isJump = false;
        this.isMove = false;
        this.canMove = true;
        this.inJump = false;
        this.isFire = false;
		this.isFireFrame = false;
        this.isFlicker = false;
        this.isLight = true;
        this.isHurt = false;
		
		this.haveBullet = false;
		
		this.color = cc.Color.BLACK;
		this.colorArr = ['#FFFFFF','#F5404F','#FF0000'];
		this.colorSize = this.colorArr.length;

        
        this.width = this.node.width;
		this.height = this.node.height;
		this.realWidth = this.bg.width;
		this.realHeight = this.bg.height;
        this.widthP = this.width / 2;
		this.heightP = this.height / 2;
		//this.setCameraPos();
		
		this.curHeight = this.height;
		this.signHeight = this.height * 4 / 5;
		
		this.offsetX = cc.GameConfig.CONSTANT.OFFSET_X;
		this.offsetY = cc.GameConfig.CONSTANT.OFFSET_Y;
		this.offsetWidth = cc.GameConfig.CONSTANT.OFFSET_WIDTH;
		this.offsetHeight = cc.GameConfig.CONSTANT.OFFSET_HEIGHT;
		this.collisionWidth = cc.GameConfig.CONSTANT.COLLISION_RECT_WIDTH;
        
        this.rectU = {};
        this.rectL = {};
        this.rectD = {};
        this.rectR = {};
        this.rectM = {};
		this.rectSM1 = {};
		this.rectT = {};
        this.rectP = {};
		this.springRect = {};
        this.initRect();
		
		if(this.IsLeftMoreCollision){
			this.preLeftRoads = {};
		}
		
		if(this.IsRightMoreCollision){
			this.preRightRoads = {};
		}
		
		this.mScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.MONSTER);
		this.fmScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.FLYMONSTER);
		
		//cc.Game.load.active = false;
		this.checkMoreJump();
    },
	
	checkMoreJump(){
		if(cc.IsMoreJump){
			this.isMoreJump = true;
		}else{
			this.isMoreJump = cc.IsMoreJumpTemp;
		}
	},

    initRect() {
        this.rectU['width'] = this.width - this.offsetWidth;
        this.rectU['height'] = this.collisionWidth;

        this.rectL['width'] = this.collisionWidth;
        this.rectL['height'] = this.curHeight - this.offsetHeight;

        this.rectD['width'] = this.width - this.offsetWidth;
        this.rectD['height'] = this.collisionWidth;

        this.rectR['width'] = this.collisionWidth;
        this.rectR['height'] = this.curHeight - this.offsetHeight;

        this.rectM['width'] = this.width;
        this.rectM['height'] = this.curHeight ;
		
		this.rectT['width'] = this.node.width;
        this.rectT['height'] = this.node.height / 5;
		
		this.rectSM1['width'] = this.width;
        this.rectSM1['height'] = this.height * 2 / 3 ;

        this.rectP['r'] = this.widthP + this.heightP;
		
		this.springRect['x'] = 0;
	    this.springRect['y'] = 0;
		this.springRect['width'] = 0;
	    this.springRect['height'] = 0;
    },
	
	continuePlay(){
		this.isPass = false;
		this.noLeft();
		this.noRight();
		this.noUp();
		this.noDown();
		this.resetBlood();
		if(!this.isHurtDead){
			if(this.getRect(5).x >= this.normalPointRect.x){
			    this.node.x = this.normalRect.x + this.normalRect.width - this.width;
		    }else{
			    this.node.x = this.normalRect.x;
		    }
		
		    this.node.y = this.normalRect.y + this.normalRect.height;
		    this.setCameraPos();
		}else{
			this.isDrop = true;
			this.isJump = false;
			this.jumpSpeed = 0;
		}
	},
	
	setPass(isWin){
		cc.IsWin = isWin;
		this.bulletDead();
		this.isPass = true;
		this.isJump = false
		this.isLeft = false;
		this.isRight = false;
		cc.Game.end();
	},
	
	setDead(){
		cc.IsWin = false;
		this.bulletDead();
		this.isPass = true;
		this.isJump = false
		this.isLeft = false;
		this.isRight = false;
		cc.Game.dead();
	},
	
	setCameraPos(){
		cc.CameraMgr.setCameraPos(this.node.x + this.node.width / 2 - cc.winSize.width / 2,this.node.y + this.node.height / 2 - cc.winSize.height / 2);
	},
	
	checkBullet(){
		if(!cc.PlayerBulletKey){
			this.setSpeed(1);
			return;
		}
		
		cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE[cc.PlayerBulletKey],this.getRect(4),cc.GameConfig.POS_TYPE.LEFT_DOWN,(item) =>{
			item.opacity = 0;
			this.bulletRoad = item;
			this.curFrames = this.frames2;
			this.haveBullet = true;
			cc.PlayerBulletKey = null;
			cc.PlayerBulletUuid = item.uuid;
	    });
	},
	
	checkEnterTargetDoor(targetDoorId){
		if(!targetDoorId){
			return;
		}
		
		if(!this.rScript){
			this.rScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.ROAD);
		}
		
		for(let key in this.rScript){
			if(!this.rScript[key].Id){
				continue;
			}
			
			if(this.rScript[key].Id == targetDoorId){
				this.setEnterLayer(this.rScript[key]);
				break;
			}
		}
	},
	
	setEnterLayer(door){
		this.isJump = false;
		if(door.Type == cc.GameConfig.PREFAB_TYPE.CONDUITUP[3]){
			this.setUpEnterLayer(door);
		}else if(door.Type == cc.GameConfig.PREFAB_TYPE.CONDUITRIGHT[3]){
			this.setRightEnterLayer(door);
		}else if(door.Type == cc.GameConfig.PREFAB_TYPE.CONDUITDOWN[3]){
			this.setDownEnterLayer(door);
		}else if(door.Type == cc.GameConfig.PREFAB_TYPE.CONDUITLEFT[3]){
			this.setLeftEnterLayer(door);
		}
	},
	
	setUpEnterLayer(door){
		this.isEnter = true;
		this.isEnterLayerWait = true;
		this.enterCode = 0;
		this.enterlimmit = door.getRect(4).y + door.getRect(4).height;
		this.node.x = door.getRect(5).x - this.widthP;
		this.node.y = this.enterlimmit - this.realHeight;
	},
	
	setRightEnterLayer(door){
		this.isEnter = true;
		this.isEnterLayerWait = true;
		this.enterCode = 1;
		this.enterlimmit = door.getRect(4).x + door.getRect(4).width;
		this.node.x = this.enterlimmit - this.realWidth;
		this.node.y = door.getRect(4).y;
	},
	
	setDownEnterLayer(door){
		this.isEnter = true;
		this.isEnterLayerWait = true;
		this.enterCode = 2;
		this.enterlimmit = door.getRect(4).y - this.realHeight;
		this.node.x = door.getRect(5).x - this.widthP;
		this.node.y = door.getRect(4).y;
	},
	
	setLeftEnterLayer(door){
		this.isEnter = true;
		this.isEnterLayerWait = true;
		this.enterCode = 3;
		this.enterlimmit = door.getRect(4).x - this.realWidth;
		this.node.x = door.getRect(5).x;
		this.node.y = door.getRect(4).y;
	},
	
	setDownOutLayer(){
		this.bulletDead();
		this.isOut = true;
		this.isOutLayerWait = false;
		this.outCode = 2;
		this.node.x = this.conduitDoor.Script.getRect(5).x - this.widthP;
		this.outlimmit = this.node.y - this.realHeight;
	},
	
	setLeftOutLayer(){
		this.bulletDead();
		this.isOut = true;
		this.isOutLayerWait = false;
		this.outCode = 1;
		this.outlimmit = this.conduitDoor.x ;
		this.node.x = this.outlimmit - this.realWidth;
		this.node.y = this.conduitDoor.y;
	},
	
	outLayerWait(){
		this.outWaitCount ++;
		if(this.outWaitCount >= this.outLayerLimmit){
			this.isOut = false;
			this.isOutLayerWait = false;
			this.stateActive = false;
			this.outWaitCount = 0;
			this.conduitDoor.Script.upDoorGoLayer();
		}
	},
	
	enterLayerWait(){
		this.enterWaitCount ++;
		if(this.enterWaitCount >= this.enterLayerLimmit){
			this.isEnterLayerWait = false;
			this.node.opacity = 255;
			this.enterWaitCount = 0;
		}
	},
	
	enterLayer(){
		if(this.enterCode == 0){
			this.node.y += this.enterSpeed;
			if(this.node.y >= this.enterlimmit){
			    this.jumpSpeed = 0;
				this.isDrop = true;
				this.isEnter = false;
				this.checkBullet();
			}
		}else if(this.enterCode == 1){
			this.node.x += this.enterSpeed;
			if(this.node.x >= this.enterlimmit){
				this.isEnter = false;
				this.checkBullet();
			}
		}else if(this.enterCode == 2){
		    this.node.y -= this.enterSpeed;
			if(this.node.y <= this.enterlimmit){
				this.jumpSpeed = 0;
				this.isDrop = true;
				this.isEnter = false;
				this.checkBullet();
			}
		}else if(this.enterCode == 3){
			this.node.x -= this.enterSpeed;
			if(this.node.x <= this.enterlimmit){
				this.isEnter = false;
				this.checkBullet();
			}
		}
	},
	
	outLayer(){
		if(this.outCode == 0){
			this.node.y += this.enterSpeed;
			if(this.node.y >= this.outlimmit){
				this.isOutLayerWait = true;
				this.node.opacity = 0;
				
			}
		}else if(this.outCode == 1){
			this.node.x += this.enterSpeed;
			if(this.node.x >= this.outlimmit){
				this.isOutLayerWait = true;
				this.node.opacity = 0;
			}
		}else if(this.outCode == 2){
			this.node.y -= this.enterSpeed;
			if(this.node.y <= this.outlimmit){
				this.isOutLayerWait = true;
				this.node.opacity = 0;
			}
		}else if(this.outCode == 3){
			this.node.x -= this.enterSpeed;
			if(this.node.x <= this.outlimmit){
				this.isOutLayerWait = true;
				this.node.opacity = 0;
			}
		}
	},
	
	setLadder(){
		if(this.isJump){
			return;
		}
		
		this.isLadder = true;
        this.isDrop = false;
        this.isJump = false;   
        this.inJump = false;
	    this.jumpSpeed = 0;
		//this.noDown();
		
		if(!this.isLadderMove){
			this.frameIndex2 = 0;
            this.frameTime2 = 0;
            this.sprite.spriteFrame = this.frames3[0];
		}
       
    },
	
	setDoorLeft(rect){
		this.bulletDead();
		this.node.x = rect.x - this.width * 2;
	},
	
	setDizziness(){
		/*if(this.isHide){
            return;
        }*/
		
	
	    cc.UILayer.liquidFinger.active = true;
		this.dizzinessTime = 0;
		this.dizzinessNode.opacity = 255;
		this.jumpSpeed = 0;
		this.isDrop = true;
		this.isJump = false;
		this.isFireFrame = false;
		this.noLeft();
		this.noRight();
		this.noUp();
		this.noDown();
		this.isDizziness = true;
	},
	
	setInvincible(conf){
		this.bg.opacity = 255;
        this.flickerTime = 0;
        this.isLight = true;
        this.isFlicker = false;
		this.isInvincible = true;
		this.colorIndex = 0;
		this.invincibleLimmit = conf.INVINCIBLE_TIME;
        this.invincibleIndex = 0;
	},
	
	setNote(conf,num){
		this.isNote = true;
		this.noteMax += num;
		this.noteRate = conf.ADD_RATE;
		this.noteLimmitX = conf.LIMMIT_X;
		this.noteLimmitY = conf.LIMMIT_Y;
	},
	
	setShield(conf){
		this.isShield = true;
		this.shieldNode.active = true;
		this.shieldLimmit = conf.SHIELD_TIME;
        this.shieldIndex = 0;
	},
	
	setSlow(conf){
		this.isSlow = true;
		this.slowIndex = 0;
		this.slowLimmit = conf.SLOW_TIME;
		this.jumpSpeed = conf.PLAYER_JUMP_MAX_SPEED * this.jumpSpeed / this.jumpMaxSpeed;
		this.jumpMaxSpeed = conf.PLAYER_JUMP_MAX_SPEED;
		this.jumpIncrement = conf.PLAYER_JUMP_INCREMENT;
        this.moveSpeed = conf.PLAYER_MOVE_SPEED;
		this.curMoveSpeed = this.moveSpeed;
		this.curMoveSpeedP = this.moveSpeed / 2;
	},
	
	setHide(conf){
		this.isFlicker = true;
		this.flickerLimmit = conf.HIDE_TIME;
        this.flickerTime = 0;
	},
	
	setSpeed(type){
		switch(type){
			case 0: 
			    this.moveSpeed = this.curMoveSpeed * 2 / 3;
				this.jumpMaxSpeed = this.conf.JUMP_SLOW_SPEED;
				this.jumpIncrement = this.conf.JUMP_INCREMENT;
			    break;
			case 1: 
			    this.moveSpeed = this.curMoveSpeed;
				this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
				this.jumpIncrement = this.conf.JUMP_INCREMENT;
			    break;
			default:
			    break;
		}
	},
	
	checkBox(){
		if(this.isDrop || this.isJump || this.isFlicker || this.isInvincible || this.isHide || this.isShield){
			return;
		}
		
		if (this.preShakeRoad && this.preShakeRoad.isValid ){
			if(!this.preShakeRoad.Script.isWeight || this.preShakeRoad.Script.isBullet){
				return;
			}
			
			if(!this.preShakeRoad.Script.isDrop){
				return;
			}
			
			if(this.node.y + this.height >= this.preShakeRoad.y){
				this.hurt(this.preShakeRoad.Script.conf.HURT);
			}
		}
	},
	
	note(){
		if(!this.isNote){
			return;
		}
		
		this.noteIndex ++;
		if(this.noteIndex >= this.noteRate){
			if(this.noteCount >= this.noteMax){
				this.noteCount = 0;
				this.noteMax = 0;
				this.isNote = false;
			}else{
				
				cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE.NOTECOIN,this.getRect(4),cc.GameConfig.POS_TYPE.MIDDLE, (item) => {
			        item.x = (this.node.x + this.width / 2 - this.noteLimmitX) + Math.random() * 2 * this.noteLimmitX;
					item.y = this.node.y + this.height + this.noteLimmitY;
					item.active = true;
		        });
				
				this.noteCount ++;
			}
			
			this.noteIndex = 0;
		}
	},
	
	slow(){
		if(!this.isSlow){
			return;
		}
		
		this.slowIndex ++;
		if(this.slowIndex >= this.slowLimmit){
			this.setParam(this.isLighten);
			this.isSlow = false;
			this.slowIndex = 0;
		}
	},
	
	shield(){
		if(!this.isShield){
			return;
		}
		
		this.shieldIndex ++;
		if(this.shieldIndex >= this.shieldLimmit){
			this.isShield = false;
			this.shieldNode.active = false;
			this.shieldIndex = 0;
		}
	},
	
	invincible(){
		if(this.isInvincible){
			this.bg.color = this.color.fromHEX(this.colorArr[this.colorIndex]);
			if(this.invincibleIndex % 4 == 0){
				this.colorIndex ++;
			if(this.colorIndex == this.colorSize){
				this.colorIndex = 0;
			}
			}
			
			this.invincibleIndex ++;
			if(this.invincibleIndex >= this.invincibleLimmit){
				this.colorIndex = 0;
				this.bg.color = this.color.fromHEX(this.colorArr[this.colorIndex]);
				this.isInvincible = false;
				this.invincibleIndex = 0;
			}
		}
	},
	
	speed(){
		if(this.isSpeed){
			this.speedIndex ++;
			if(this.speedIndex >= this.speedTime){
				this.setParam(this.isLighten);
				this.isSpeed = false;
				this.speedIndex = 0;
			}
		}
	},
	
	setParam(isLighten){
		this.isLighten = isLighten;
		if(isLighten){
			this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED3;
		    this.jumpIncrement = this.conf.JUMP_INCREMENT3;
            this.moveSpeed = this.conf.MOVE_SPEED3;
			this.curMoveSpeed = this.moveSpeed;
		    this.curMoveSpeedP = this.moveSpeed / 2;
		}else{
			this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
		    this.jumpIncrement = this.conf.JUMP_INCREMENT;
            this.moveSpeed = this.conf.MOVE_SPEED;
			this.curMoveSpeed = this.moveSpeed;
		    this.curMoveSpeedP = this.moveSpeed / 2;
		}
	},
	
	wake(){
		this.dizzinessNode.opacity = 0;
		this.isDizziness = false;
		this.isFlicker = true;
		this.flickerTime = 0;
	},

    resetBlood(){
		/*this.blood = cc.GameConfig.CONSTANT.PLAYER_BLOOD;
		if(cc.MoreBlood){
			this.blood = this.blood * 2;
		}*/
		
		this.blood = cc.UILayer.bloodSize;
        this.isFlicker = true;
        this.flickerTime = 0;
    },
	
    hurt(blood){
		if(this.isPass){
			return;
		}
		
        this.blood -= blood;
        this.flickerTime = 0;
		this.fireTime = 0;
		this.isHurt = true;
		this.isFlicker = true;
		this.isFireFrame = false;
           
		
		
		if(this.isLighten){
			this.setParam(false);
		}
		
        if(this.blood <= 0){
			this.isHurtDead = true;
			this.setDead();
        }else{
		    this.hurtTime = 0;
		}
		
		cc.AudioMgr.playSound('hurt');
		cc.UILayer.hideBlood(this.blood);
    },
	
	setMaxJump() {
		this.isJump = true;
        this.isDrop = false;
        this.jumpSpeed = this.conf.SPRING_JUMP_SPEED;    	
    },
	
	setSpringJump(code,rect){
		this.isJump = true;
        this.isDrop = false;
		this.isSpringMove = true;
		this.isSpringCheck = false;
		this.springMoveCode = code;
		this.springRect['x'] = rect['x'];
		this.springRect['y'] = rect['y'];
		this.springRect['width'] = rect['width'];
		this.springRect['height'] = rect['height'];
        this.jumpSpeed = this.conf.SPRINGLR_JUMP_SPEED;
		this.springMoveSpeed = this.conf.SPRING_MOVE_SPEED;
	},

    flicker() {
        if (this.isFlicker) {
            if (this.isLight) {
                if (this.bg.opacity > 84) {
                    this.bg.opacity -= 12;
                } else {
                    this.bg.opacity = 84;
                    this.isLight = false;
                }

            } else {
                if (this.bg.opacity < 255) {
                    this.bg.opacity += 12;
                } else {
                    this.bg.opacity = 255;
                    this.isLight = true;
                }
            }
            this.flickerTime++;
            if (this.flickerTime == this.flickerLimmit) {
                this.bg.opacity = 255;
                this.flickerTime = 0;
                this.flickerLimmit = this.conf.FLICKER_LIMMIT;
                this.isLight = true;
                this.isFlicker = false;
            }
        }
    },

    checkObj(){
		if(!(cc.MathUtil.rectInRect(this.getRect(4), this.springRect))){
			this.isSpringCheck = true;
		}
		
		if (this.conduitDoor) {
            if (!cc.MathUtil.rectInRect(this.getRect(4),this.conduitDoor.Script.getRect(4))) {
                this.conduitDoor = null;
            }  
        }
		
		if (this.ladder) {
            if (!cc.MathUtil.rectInRect(this.getRect(4),this.ladder.Script.getRect(4))) {
                this.isLadder = false;
                if(!this.isJump){
                    this.isDrop = true;
                    this.frameIndex = 2;
                }
             
                this.ladder = null;
            }  
        }
		
		if (this.standRoad) {
            if (!this.standRoad.isValid || !this.standRoad.Script.IsCollision || this.standRoad.Script.isBullet) {
                if (!this.isJump && !this.isLadder) {
                    this.isDrop = true;
                }
                this.standRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.standRoad.Script.getRect(0))) {
                    if (!this.isJump && !this.isLadder) {
                        this.isDrop = true;
                    }
                    this.standRoad = null;
                }
            }
        }
		
        if (this.preStandRoad) {
            if (!this.preStandRoad.isValid || !this.preStandRoad.Script.IsCollision || this.preStandRoad.Script.isBullet) {
                if (!this.isJump && !this.isLadder) {
                    this.isDrop = true;
                }
                this.preStandRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preStandRoad.Script.getRect(0))) {
                    if (!this.isJump && !this.isLadder) {
                        this.isDrop = true;
                    }
                    this.preStandRoad = null;
                }
            }
        }

        if (this.preShakeRoad) {
            if (!this.preShakeRoad.isValid || !this.preShakeRoad.Script.IsCollision || this.preShakeRoad.Script.isBullet) {
                this.preShakeRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preShakeRoad.Script.getRect(2))) {
                    this.preShakeRoad = null;
                }
            }
        }
		
		for(let key in this.preLeftRoads){
			if  (!this.preLeftRoads[key].isValid || !this.preLeftRoads[key].Script.IsCollision || this.preLeftRoads[key].Script.isBullet) {
                    delete this.preLeftRoads[this.preLeftRoads[key].uuid] ;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preLeftRoads[key].Script.getRect(1))) {
                    delete this.preLeftRoads[this.preLeftRoads[key].uuid] ;
                }
            }
		}
		
		for(let key in this.preRightRoads){
			if  (!this.preRightRoads[key].isValid || !this.preRightRoads[key].Script.IsCollision || this.preRightRoads[key].Script.isBullet) {
                    delete this.preRightRoads[this.preRightRoads[key].uuid] ;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preRightRoads[key].Script.getRect(3))) {
                    delete this.preRightRoads[this.preRightRoads[key].uuid] ;
                }
            }
		}

        /*if (this.preLeftRoad) {
            if (!this.preLeftRoad.Script.IsCollision) {
                this.preLeftRoad = null;
            } else {
				if (!cc.MathUtil.rectInRect(this.getRect(4),this.preLeftRoad.Script.getRect(1))) {
                    this.preLeftRoad = null;
                }
            }
        }

        if (this.preRightRoad) {
            if (!this.preRightRoad.Script.IsCollision) {
                this.preRightRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preRightRoad.Script.getRect(3))) {
                    this.preRightRoad = null;
                }
            }
        }*/
		
		if (this.preLeftBulletRoad) {
            if (!this.preLeftBulletRoad.isValid || !this.preLeftBulletRoad.Script.IsCollision) {
                this.preLeftBulletRoad = null;
            } else {
				if (!cc.MathUtil.rectInRect(this.getRect(4),this.preLeftBulletRoad.Script.getRect(1))) {
                    this.preLeftBulletRoad = null;
                }
            }
        }
		if (this.preRightBulletRoad) {
            if (!this.preRightBulletRoad.isValid || !this.preRightBulletRoad.Script.IsCollision) {
                this.preRightBulletRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preRightBulletRoad.Script.getRect(3))) {
                    this.preRightBulletRoad = null;
                }
            }
        }

    },

    updateFrame() {
        if(this.isHurt){
            this.sprite.spriteFrame = this.frames[10];
            this.hurtTime ++;
            if(this.hurtTime >= this.hurtLimmit){
                this.isHurt = false;
                this.hurtTime = 0;
            }
        }else{
			if(this.isDizziness){
				this.sprite.spriteFrame = this.frames[1];
                this.dizzinessTime ++;
                if(this.dizzinessTime >= this.dizzinessLimmit){
                    this.isDizziness = false;
					cc.UILayer.liquidFinger.active = false;
					this.dizzinessNode.opacity = 0;
                    this.dizzinessTime = 0;
                }
			}else{
			    if(this.isFireFrame){
				    this.sprite.spriteFrame = this.curFrames[9];
				    this.fireTime ++;
                    if(this.fireTime >= this.fireLimmit){
                        this.isFireFrame = false;
                        this.fireTime = 0;
                    }
			    }else{
					
				    if(this.inJump) {
					    this.sprite.spriteFrame = this.curFrames[8];
                    }else{
						if(this.isLadder){
                            if (this.isLadderMove) {
                                this.frameTime2 ++;
                                if (this.frameTime2 >= this.rate) {
                                    this.frameIndex2 ++;
                                    if (this.frameIndex2 >= this.frameSize2) {
                                        this.frameIndex2 = 0;
                                    }
            
                                    this.sprite.spriteFrame = this.frames3[this.frameIndex2];
                                    this.frameTime2 = 0;
                                }
                            }    
                        }else{
							if(this.isDown){
							    this.sprite.spriteFrame = this.curFrames[7];
                            }else{
			                    if (this.isLeft || this.isRight || this.isStopingR || this.isStopingL) {
                                    this.frameTime++;
                                    if (this.frameTime >= this.rate) {
                                        this.frameIndex++;
    
                                        if (this.frameIndex >= this.frameSize) {
                                           this.frameIndex = 2;
                                        }
                                        this.sprite.spriteFrame = this.curFrames[this.frameIndex];
                                        this.frameTime = 0;
                                    }
                                }else{
					                this.sprite.spriteFrame = this.curFrames[0];
					            }
                            }
			            }
					}
                }
			}
		}
            
    },
	
	checkStandRoad(){
		if(!this.standRoad){
			this.isRoadMove = false;
			return;
		}
		
		if(!this.standRoad.isValid){
			return;
		}
		
		this.roadDirect = this.standRoad.Script.direct;
		this.roadSpeed = this.standRoad.Script.moveSpeed;
		if(this.standRoad.Script.isDropRoad){
			if(!this.standRoad.Script.isDrop){
				if(!this.isJump){
		            this.jumpSpeed = 0;
			        this.isDrop = false;
                    this.jumpCount = 0;
                    this.inJump = false;
                    this.node.y = this.standRoad.y +this.standRoad.height;
                }
			}
			
			this.standRoad.Script.setCheckDrop();
		    return;
		}
		
		if(this.standRoad.Script.isMoveRoad){
			this.standRoad.Script.setMove();
		}
		
		//if(!this.isJump){
		if(!this.isJump && !this.isLadder){
		    this.jumpSpeed = 0;
			this.isDrop = false;
            this.jumpCount = 0;
            this.inJump = false;
            this.node.y = this.standRoad.y +this.standRoad.height;
        }

		if(this.standRoad.Script.isMoveX){
			this.isRoadMove = this.standRoad.Script.isMove;
			if (this.roadDirect) {	
                this.realMoveR(this.roadSpeed);				
            }else {
                this.realMoveL(this.roadSpeed);				
            }
			
		    return;
		}
		
		if(this.standRoad.Script.isMoveY){
			if (this.roadDirect) {
                this.checkCamera(cc.GameConfig.CAMERA_CODE.UP, this.roadSpeed);						
            }else{
				this.checkCamera(cc.GameConfig.CAMERA_CODE.DOWN, this.roadSpeed);			
            }
			return;
		}
	},
	
	moveU() {
		if(this.isJump){
		//if(this.inJump){
			return;
		}
		
        if( this.isUp && this.isLadder){
			if(this.preShakeRoad && this.ladder.y + this.ladder.height < this.preShakeRoad.y + this.preShakeRoad.height){
			    if(this.node.y + this.height + this.ladderSpeed <= this.preShakeRoad.y){
					this.node.y += this.ladderSpeed;
                    this.checkCamera(cc.GameConfig.CAMERA_CODE.UP,this.ladderSpeed);
				}else{
					this.node.y = this.preShakeRoad.y - this.height;
			    }
			}else{
				if(this.node.y + this.heightP + this.ladderSpeed <= this.ladder.y + this.ladder.height){
					this.node.y += this.ladderSpeed;
                    this.checkCamera(cc.GameConfig.CAMERA_CODE.UP,this.ladderSpeed);
				}
			}
        }
    },
	
    moveD() {
		if(this.isJump){
		//if(this.inJump){
			return;
		}
		
        if( this.isDown && this.isLadder){
			if(this.preStandRoad && this.ladder.y > this.preStandRoad.y){
				if(this.node.y -  this.ladderSpeed >= this.preStandRoad.y + this.preStandRoad.height){
					this.node.y -= this.ladderSpeed;
					this.checkCamera(cc.GameConfig.CAMERA_CODE.DOWN,this.ladderSpeed);
				}else{
					this.node.y = this.preStandRoad.y + this.preStandRoad.height;
				}
			}else{
				this.node.y -= this.ladderSpeed;
				this.checkCamera(cc.GameConfig.CAMERA_CODE.DOWN,this.ladderSpeed);
			}
        }
    },
	
	moveR(){
        if(this.isRight){
			/*if(this.isRoadMove){
				if (this.roadDirect) {
                    this.realMoveR(this.moveSpeed);
                } else{
                    this.realMoveR(this.moveSpeed + this.roadSpeed);
                }
			}else{*/
			
			    if(this.speedR < this.moveSpeed){
					this.speedR += this.moveIncrement;
			    }else{
					this.speedR = this.moveSpeed;
				}
			     
				if(this.isLadder){
					this.speedRealR = this.moveSpeed;
				}else{
					this.speedRealR = this.fixSpeed + this.speedR - this.speedL;
				}
				
				if(this.isSpringMove){
					this.realMoveR(this.speedRealR / 2);
				}else{
					this.realMoveR(this.speedRealR);
				}
			//}
			
        }else{
			if(!this.isLadder && this.rightRoadSize == 0){
				//if(this.isStopR){
					if(this.speedR > 0){
				        this.isStopingR = true;
				        this.speedR -= this.moveStopIncrement;
						this.realMoveR(this.speedR);
			        }else{
				        this.speedR = 0;
					    this.isStopR = false;
				        this.isStopingR = false;
			        }
				//}
				
			}else{
				this.isStopingR = false;
				this.speedR = 0;
			}
			
		}
    },
	
	moveL(){
        if(this.isLeft){
			    if(this.speedL < this.moveSpeed){
					this.speedL += this.moveIncrement;
			    }else{
					this.speedL = this.moveSpeed;
				}
				
				if(this.isLadder){
					this.speedRealL = this.moveSpeed;
				}else{
					this.speedRealL = this.fixSpeed + this.speedL - this.speedR;
				}
				
				if(this.isSpringMove){
					this.realMoveL(this.speedRealL / 2);
				}else{
					this.realMoveL(this.speedRealL);
				}
			//}
        }else{
			if(!this.isLadder && this.leftRoadSize == 0){
				//if(this.isStopL){
					if(this.speedL > 0){
				        this.isStopingL = true;
				        this.speedL -= this.moveStopIncrement;
						this.realMoveL(this.speedL);
			        }else{
				        this.speedL = 0;
						this.isStopL = false;
				        this.isStopingL = false;
			        }
				//}
			    
			}else{
				this.isStopingL = false;
				this.speedL = 0;
			}
		}
    },
	
	/*moveR(){
        if(this.isRight){
			    if(this.speedR < this.moveSpeed){
					this.speedR += 0.2;
			    }else{
					this.speedR = this.moveSpeed;
				}
			     
				if(this.isLadder){
					this.speedRealR = this.moveSpeed;
				}else{
					this.speedRealR = 2 + this.speedR;
				}
				
				if(this.isSpringMove){
					this.realMoveR(this.speedRealR / 2);
				}else{
					this.realMoveR(this.speedRealR);
				}
			
			
        }else{
			if(!this.isLadder){
				if(this.speedRealR > 0){
				this.isStopingR = true;
				this.speedRealR -= 0.1;
				this.realMoveR(this.speedRealR);
			    }else{
				this.speedR = 0;
				this.speedRealR = 0;
				this.isStopingR = false;
			    }
			}else{
				this.speedR = 0;
				this.speedRealR = 0;
			}
			
		}
    },
	
	moveL(){
        if(this.isLeft){
		
			    if(this.speedL < this.moveSpeed){
					this.speedL += 0.2;
			    }else{
					this.speedL = this.moveSpeed;
				}
				
				if(this.isLadder){
					this.speedRealL = this.moveSpeed;
				}else{
					this.speedRealL = 2 + this.speedL;
				}
				
				if(this.isSpringMove){
					this.realMoveL(this.speedRealL / 2);
				}else{
					this.realMoveL(this.speedRealL);
				}
			
        }else{
			if(!this.isLadder){
			if(this.speedRealL > 0){
				this.isStopingL = true;
				this.speedRealL -= 0.1;
				this.realMoveL(this.speedRealL);
			}else{
				this.speedL = 0;
				this.speedRealL = 0;
				this.isStopingL = false;
			}
			}else{
				this.speedL = 0;
				this.speedRealL = 0;
			}
		}
    },*/
	
	/*moveR(){
        if(this.isRight){
			if(this.isRoadMove){
				if (this.roadDirect) {
                    this.realMoveR(this.moveSpeed);
                } else{
                    this.realMoveR(this.moveSpeed + this.roadSpeed);
                }
			}else{
				if(this.isSpringMove){
					this.realMoveR(this.moveSpeed / 2);
				}else{
					this.realMoveR(this.moveSpeed);
				}
			}
			
        }
    },
	
	moveL(){
        if(this.isLeft){
			if(this.isRoadMove){
			    if (this.roadDirect) {
				    this.realMoveL(this.moveSpeed + this.roadSpeed);
                } else {
                    this.realMoveL(this.moveSpeed);
                }
			}else{
				if(this.isSpringMove){
					this.realMoveL(this.moveSpeed / 2);
				}else{
					this.realMoveL(this.moveSpeed);
				}
			}
        }
    },*/
	
	springMove(){
		if(!this.isSpringMove){
			return;
		}
		
		if(this.springMoveSpeed > 0){
			this.springMoveSpeed -= 1;
		}else{
			this.isSpringMove = false;
			this.springMoveSpeed = 0;
		}
		
		if(this.springMoveCode == 1){
			this.realSpringMoveL(this.springMoveSpeed);
		}else{
			this.realSpringMoveR(this.springMoveSpeed);
		}
	},
	
	realSpringMoveR(speed){
		this.rightRoadSize = Object.keys(this.preRightRoads).length;
	    this.isRightRoad = false;
		if(this.rightRoadSize > 0){	
        
			for(let key in this.preRightRoads){
				if (this.node.x + this.width + speed > this.preRightRoads[key].x) {
					if(this.preRightRoads[key].Script.isBox ){
					    this.preRightRoads[key].Script.checkCanMove('U','MOVE');
					    if(this.preRightRoads[key].Script.canUD && this.preRightRoads[key].Script.canRight && !this.inJump){
							this.node.x += speed / 2;
						    this.preRightRoads[key].Script.moveSpeed = speed / 2;
                            this.preRightRoads[key].Script.isMove = this.isRight;
                        }else{
                            this.node.x = this.preRightRoads[key].x - this.width;  
                        }
                    }else{
                        this.node.x = this.preRightRoads[key].x - this.width;
                    }	
				    this.isRightRoad = true;
				}
			}
			
			if(!this.isRightRoad){
				this.node.x += speed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveX(speed);
				}
			}
        } else {
            if (this.node.x + speed <= cc.Layer.width - this.width) {
                this.node.x += speed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveX(speed);
				}
            } else {
                this.node.x =  cc.Layer.width - this.width;
            }
        }
    },
	
	realSpringMoveL(speed){
		this.leftRoadSize = Object.keys(this.preLeftRoads).length;
	    this.isLeftRoad = false;
		if(this.leftRoadSize > 0){	
			for(let key in this.preLeftRoads){
				if (this.node.x - speed < this.preLeftRoads[key].x + this.preLeftRoads[key].width) {
					if(this.preLeftRoads[key].Script.isBox){
					    this.preLeftRoads[key].Script.checkCanMove('U','MOVE');
                        if(this.preLeftRoads[key].Script.canUD && this.preLeftRoads[key].Script.canLeft && !this.inJump){
							this.node.x -= speed / 2;
						    this.preLeftRoads[key].Script.moveSpeed = - speed / 2;
                            this.preLeftRoads[key].Script.isMove = this.isLeft;
                        }else{
                            this.node.x = this.preLeftRoads[key].x + this.preLeftRoads[key].width;
                        }  
                    }else{
                        this.node.x = this.preLeftRoads[key].x + this.preLeftRoads[key].width;
				    }	
				    this.isLeftRoad = true;
				}
			}
			
			if(!this.isLeftRoad){
				this.node.x -= speed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveX(-speed);
				}
			}
        } else {
            if (this.node.x - speed >= 0) {
                this.node.x -= speed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveX(-speed);
				}
            } else {
                this.node.x = 0;
            }
        }
    },
	
	realMoveR(speed){
		this.rightRoadSize = Object.keys(this.preRightRoads).length;
	    this.isRightRoad = false;
		if(this.rightRoadSize > 0){	
        
			for(let key in this.preRightRoads){
				if (this.node.x + this.width + speed > this.preRightRoads[key].x) {
					if(this.preRightRoads[key].Script.isBox){
						
					    if(!this.isFireFrame){
							this.preRightRoads[key].Script.checkCanMove('U','MOVE');
					        if(this.preRightRoads[key].Script.canUD && this.preRightRoads[key].Script.canRight && !this.inJump){
							    this.node.x += speed / 2;
						        this.preRightRoads[key].Script.moveSpeed = speed / 2;
                                this.preRightRoads[key].Script.isMove = this.isRight;
                                this.checkCamera(cc.GameConfig.CAMERA_CODE.RIGHT, speed / 2);
                            }else{
                                this.node.x = this.preRightRoads[key].x - this.width;  
                            }
						}
                    }else{
                        this.node.x = this.preRightRoads[key].x - this.width;
                    }	
				    this.isRightRoad = true;
				}
			}
			
			if(!this.isRightRoad){
				this.node.x += speed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveX(speed);
				}
                this.checkCamera(cc.GameConfig.CAMERA_CODE.RIGHT,speed);
			}
        } else {
            if (this.node.x + speed <= cc.Layer.width - this.width) {
                this.node.x += speed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveX(speed);
				}
                this.checkCamera(cc.GameConfig.CAMERA_CODE.RIGHT,speed);
            } else {
                this.node.x =  cc.Layer.width - this.width;
            }
        }
    },

    realMoveL(speed){
		this.leftRoadSize = Object.keys(this.preLeftRoads).length;
	    this.isLeftRoad = false;
		if(this.leftRoadSize > 0){	
			for(let key in this.preLeftRoads){
				if (this.node.x - speed < this.preLeftRoads[key].x + this.preLeftRoads[key].width) {
					if(this.preLeftRoads[key].Script.isBox ){
					   if(!this.isFireFrame){
							this.preLeftRoads[key].Script.checkCanMove('U','MOVE');
                            if(this.preLeftRoads[key].Script.canUD && this.preLeftRoads[key].Script.canLeft && !this.inJump){
						        this.preLeftRoads[key].Script.moveSpeed = - speed / 2;
                                this.node.x -= speed / 2;
                                this.preLeftRoads[key].Script.isMove = (this.isLeft && !this.isFireFrame);
                                this.checkCamera(cc.GameConfig.CAMERA_CODE.LEFT, speed / 2);
                            }else{
                                this.node.x = this.preLeftRoads[key].x + this.preLeftRoads[key].width;
                            }  
						}
                    }else{
                        this.node.x = this.preLeftRoads[key].x + this.preLeftRoads[key].width;
				    }	
				    this.isLeftRoad = true;
				}
			}
			
			if(!this.isLeftRoad){
				this.node.x -= speed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveX(-speed);
				}
                this.checkCamera(cc.GameConfig.CAMERA_CODE.LEFT,speed);
			}
        } else {
            if (this.node.x - speed >= 0) {
                this.node.x -= speed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveX(-speed);
				}
                this.checkCamera(cc.GameConfig.CAMERA_CODE.LEFT,speed);
            } else {
                this.node.x = 0;
            }
        }
    },

    jump(){
        if(!this.isJump){
            return;
        }

        this.inJump = true;
        if(this.jumpSpeed > 0){
            this.jumpSpeed -= this.jumpIncrement;
            if (this.preShakeRoad) {
                if (this.node.y + this.height + this.jumpSpeed <= this.preShakeRoad.y) {
                    this.node.y += this.jumpSpeed;
					if(this.haveBullet){
					    this.bulletRoad.Script.bulletMoveY(this.jumpSpeed);
				    }
                    this.checkCamera(cc.GameConfig.CAMERA_CODE.UP,this.jumpSpeed);
                } else {
                    this.isJump = false;
                    this.isDrop = true;
                    this.jumpSpeed = this.conf.COLLISION_SPEED2;
                }
            } else {
                this.node.y += this.jumpSpeed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveY(this.jumpSpeed);
				}
                this.checkCamera(cc.GameConfig.CAMERA_CODE.UP,this.jumpSpeed);
            }
        }else{
            this.jumpSpeed = this.conf.COLLISION_SPEED1;
            this.isDrop = true;
            this.isJump = false;
        }
    },

    drop(){
        if(!this.isDrop){
            return;
        }
		
		if(this.jumpSpeed < this.dropMaxSpeed){
            this.jumpSpeed += this.jumpIncrement;
        }else{
			this.jumpSpeed = this.dropMaxSpeed;
		}
       
        if(this.preStandRoad){
            if(this.node.y - this.jumpSpeed >= this.preStandRoad.y +this.preStandRoad.height ){
                this.node.y -= this.jumpSpeed;
				if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveY(-this.jumpSpeed);
				}
                this.checkCamera(cc.GameConfig.CAMERA_CODE.DOWN,this.jumpSpeed);
            }else{
				if(this.preStandRoad.Script.isSpring){
					if(!cc.isPause){
						//cc.whole.playSound(14);
						this.setMaxJump();
						this.preStandRoad.Script.setSpring();
					}
				}else{
					this.jumpCount = 0;
					this.standRoad = this.preStandRoad;
					this.normalPointRect = this.standRoad.Script.getRect(5);
					if(!this.standRoad.Script.isDropRoad){
						this.normalRect = this.standRoad.Script.getRect(4);
					}
				}
            }
        }else{
            if(this.node.y > -this.height){
                this.node.y -= this.jumpSpeed; 
                if(this.haveBullet){
					this.bulletRoad.Script.bulletMoveY(-this.jumpSpeed);
				}				
                this.checkCamera(cc.GameConfig.CAMERA_CODE.DOWN,this.jumpSpeed);
            }else{
				this.isHurtDead = false;
				this.setDead();
            }
        }
    },
	
	checkFlyMonster(){
		for(let key in this.fmScript){
			if(this.fmScript[key].isDeadDrop){
                return;
            }
			
			if(this.isFlicker || this.isHide || this.isShield){
				return;	
			}
			
			if (cc.MathUtil.rectInRect(this.fmScript[key].getRect(4), this.getRect(4))) {
		        if(this.isInvincible){
				    this.fmScript[key].setDeadDrop();
			    }else{
				    this.hurt(this.fmScript[key].conf.HURT);
		        }   
            }
		}
	},
	
	checkMonster(){
		for(let key in this.mScript){
			if(this.mScript[key].isDeadDrop){
                break;
            }
			
			if(this.mScript[key].isRino){
				if (cc.MathUtil.rectInRect(this.getRect(10), this.mScript[key].getRect(10))) {
				    this.standRoad = this.mScript[key].node;
					continue
                }else{
					if(this.isFlicker || this.isHide || this.isShield){
				        //return;
					    continue;
			        }
					
					if (cc.MathUtil.rectInRect( this.getRect(4),this.mScript[key].getRect(8))) {
		                if(this.isInvincible){
				            this.mScript[key].setDeadDrop();
			            }else{
				            this.hurt(this.mScript[key].conf.HURT);
		                }   
                    }
				}
			}else{
				if(this.isFlicker || this.isHide || this.isShield){
				    //return;
					continue;
			    }
			
			    if (cc.MathUtil.rectInRect(this.mScript[key].getRect(4), this.getRect(4))) {
		            if(this.isInvincible){
				        this.mScript[key].setDeadDrop();
			        }else{
				        this.hurt(this.mScript[key].conf.HURT);
		            }   
                }
			}
		}
	},

    checkCamera(directCode,speed) {
        switch (directCode) {
            case cc.GameConfig.CAMERA_CODE.UP:
                if (this.node.y + this.height >= this.maxHeight + cc.CameraMgr.getDrawRect().y) {
                    cc.CameraMgr.move(cc.GameConfig.CAMERA_MOVE_TYPE.MOVE_Y, speed);
                }
                break;
            case cc.GameConfig.CAMERA_CODE.RIGHT:
                if (this.node.x + this.width >= this.maxWidth + cc.CameraMgr.getDrawRect().x ) {
                    cc.CameraMgr.move(cc.GameConfig.CAMERA_MOVE_TYPE.MOVE_X, speed);
                }
                break;
            case cc.GameConfig.CAMERA_CODE.DOWN:
                if (this.node.y <= this.smallHeight + cc.CameraMgr.getDrawRect().y) {
                    cc.CameraMgr.move(cc.GameConfig.CAMERA_MOVE_TYPE.MOVE_Y, -speed);
                }
                break;
            case cc.GameConfig.CAMERA_CODE.LEFT:
                if (this.node.x <= this.smallWidth + cc.CameraMgr.getDrawRect().x) {
                    cc.CameraMgr.move(cc.GameConfig.CAMERA_MOVE_TYPE.MOVE_X, -speed);
                }
                break;
        
            default:
                break;
        }   
    },
	
	bulletDead(){
		if(!this.bulletRoad){
			return;
		}
		
		cc.PlayerBulletKey = this.bulletRoad.Script.conf.KEY;
		this.haveBullet = false;
		this.bulletRoad.Script.dead();
		this.bulletRoad = null;
		this.curFrames = this.frames;
	},

    bulletReset(){
		if(this.isHide){
			this.haveBullet = false;
		    this.bulletRoad = null;
		    this.node.opacity = 255;
			this.curFrames = this.frames;
		    this.isHide = false;
			this.setSpeed(1);
		}
	},

    setJump() {
        if(this.isPass || this.isHide || this.isDizziness || this.isOut || this.isEnter || !this.stateActive){
            return;
        }
		
		
		if(this.isDown && this.standRoad && this.standRoad.isValid && this.standRoad.Script.canDownJump){
			this.jumpSpeed = 0;
			this.isJump = false;
			this.isDrop = true;
			this.isDown = false;
			this.standRoad = null;
			this.preStandRoad = null;
			this.node.y = this.node.y - 15;
			cc.AudioMgr.playSound('jump');
		}else{
			if(this.isLadder){
				cc.AudioMgr.playSound('jump');
                this.isJump = true;
                this.isDrop = false;
			    this.isDown = false;
				this.jumpSpeed = this.jumpMaxSpeed;
			}else{
			    if(this.isMoreJump){
					if(this.jumpCount <= 1){  
				        if(this.jumpCount == 1){
					        this.jumpSpeed = this.jumpMaxSpeed2;  
				        }else{
					        this.jumpSpeed = this.jumpMaxSpeed;
				        }
				
				       cc.AudioMgr.playSound('jump');
                       this.isJump = true;
                       this.isDrop = false;
				       this.jumpCount ++;
                   }		
			    }else{
					if(!this.inJump){
					    cc.AudioMgr.playSound('jump');
                        this.isJump = true;
                        this.isDrop = false;
				        this.jumpSpeed = this.jumpMaxSpeed;
				    }
			    }
			}
		}
    },

    setFire() {
		if(this.isDizziness || this.isOut || this.isEnter || !this.stateActive){
			return;
		}
		
		
		if(this.bulletRoad){
			cc.AudioMgr.playSound('short');
			this.setSpeed(1);
			if(!this.isHide){
				if(this.isUp){
					this.bulletRoad.Script.setFire(3,this.directCode);
				}else{
					this.bulletRoad.Script.setFire(this.directCode);
				}
				
				this.bulletRoad = null;
				this.fireTime = 0;
		        this.isFireFrame = true;
				this.curFrames = this.frames;
			    this.haveBullet = false;
			}
		}else{
			if(this.directCode == 2){
				if(this.preLeftBulletRoad && this.preLeftBulletRoad.isValid 
				    && this.preLeftBulletRoad.Script.canBullet && !this.preLeftBulletRoad.Script.isBullet){
					this.preLeftBulletRoad.Script.checkCanMove('U','BULLET');
					if(this.preLeftBulletRoad.Script.canUD){
						cc.AudioMgr.playSound('juqi');
						this.bulletRoad = this.preLeftBulletRoad;
					    this.preLeftBulletRoad.Script.setPlayerBullet();
						this.curFrames = this.frames2;
					    this.haveBullet = true;
						
						if(this.isDown && !this.isLadder){
							if(this.bulletRoad.Script.noDown){
				                this.bulletRoad.Script.setDown();
			                }else{
				                this.node.opacity = 0;
			                    this.bulletRoad.Script.setHold(false);
			                    this.isHide = true;
			                }
						}
					}
				}
		    }else if(this.directCode == 1){
				if(this.preRightBulletRoad && this.preRightBulletRoad.isValid 
				    && this.preRightBulletRoad.Script.canBullet && !this.preRightBulletRoad.Script.isBullet){
					this.preRightBulletRoad.Script.checkCanMove('U','BULLET');
					if(this.preRightBulletRoad.Script.canUD){
						cc.AudioMgr.playSound('juqi');
						this.bulletRoad = this.preRightBulletRoad;
					    this.preRightBulletRoad.Script.setPlayerBullet();
						this.curFrames = this.frames2;
					    this.haveBullet = true;
						
						if(this.isDown && !this.isLadder){
							if(this.bulletRoad.Script.noDown){
				                this.bulletRoad.Script.setDown();
			                }else{
				                this.node.opacity = 0;
			                    this.bulletRoad.Script.setHold(false);
			                    this.isHide = true;
			                }
						}
					}
				}
			}
		}
    },

    setLeft() {
		if(this.isDizziness || this.isOut || this.isEnter || !this.stateActive || cc.isPause){
            return;
        }
		
		this.bg.scaleX = -1;
		this.directCode = 2;
		this.isRight = false;
        this.isLeft = true;
        this.isMove = true;
		this.isLadderMove = true;
		if(!this.isLadder){
			this.isStopR = false;
			this.noDown();
		    this.noUp();
		}
		
    },
	
	setRight() {
        if(this.isDizziness || this.isOut || this.isEnter || !this.stateActive || cc.isPause){
            return;
        }
		
		this.bg.scaleX = 1;
		this.directCode = 1;
        this.isLeft = false;
        this.isRight = true;
        this.isMove = true;
		this.isLadderMove = true;
		if(!this.isLadder){
			this.isStopL = false;
		    this.noDown();
		    this.noUp();
		}
    },

    setUp(){
		if(this.isDizziness || this.isOut || this.isEnter || !this.stateActive || cc.isPause){
			return;
		}
		
		this.isLadderMove = true;
        this.isUp = true;
    },

    setDown(){
        if(this.inJump || this.isDizziness || this.isOut || this.isEnter || !this.stateActive || cc.isPause){
            return;
        }
		
		
		if(this.conduitDoor){
			this.setDownOutLayer();
			return;
		}
		
		this.isLeft = false;
        this.isRight = false;
        this.isMove = false;
		this.isLadderMove = true;
		this.isDown = true;
		if(this.haveBullet && !this.isLadder){
			if(this.bulletRoad.Script.noDown){
				this.bulletRoad.Script.setDown();
			}else{
				this.node.opacity = 0;
			    this.bulletRoad.Script.setHold(false);
			    this.isHide = true;
			}
		}
    },

    

    onKeyPressed(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.setLeft();
                break;
            case cc.macro.KEY.d:
                this.setRight();
                break;
            case cc.macro.KEY.s:
                this.setDown();
                break;
            case cc.macro.KEY.w:
                this.setUp();
                break;

            case cc.macro.KEY.j:
                this.setJump();
                break;

            case cc.macro.KEY.k:
                this.setFire();
                break;
            default:
                break;
        }
    },

    onKeyReleased( event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.noLeft();
                break;
            case cc.macro.KEY.d:
                this.noRight();
                break;
            case cc.macro.KEY.s:
                this.noDown();
                break;
            case cc.macro.KEY.w:
                this.noUp();
                break;
            default:
                break;
        }
    },

    noLeft() {
        if(this.isHide || this.isDizziness || !this.stateActive || cc.isPause){
            return;
        }
		
		//this.speedL = 0;
		this.isStopL = true;
		this.isLadderMove = false;
        this.isLeft = false;
        this.isMove = false;
        this.isPress = false;
    },

    noRight() {
        if(this.isHide || this.isDizziness || !this.stateActive || cc.isPause){
            return;
        }
		
		//this.speedR = 0;
		this.isStopR = true;
		this.isLadderMove = false;
        this.isRight = false;
        this.isMove = false;
        this.isPress = false;
    },

    noUp(){
		if(this.isDizziness || cc.isPause){
			return;
		}
		
		this.isLadderMove = false;
        this.isUp = false;
    },

    noDown(){
        if(this.inJump || this.isDizziness || !this.stateActive || cc.isPause){
            return;
        }

        this.isLadderMove = false;
        this.isDown = false;
		if(this.haveBullet){
			this.bulletRoad.Script.setHold(true);
			this.isHide = false;
			this.node.opacity = 255;
		}
    },


    getRect(type) {
		if(!this.rectM){
			return {};
		}
		
        switch (type) {
            case 0:
                this.rectU['x'] = this.node.x + this.offsetX;
                this.rectU['y'] = this.node.y + this.height;
                return this.rectU;

            case 1:
                this.rectR['x'] = this.node.x + this.width;
                this.rectR['y'] = this.node.y + this.offsetY;

                return this.rectL;

            case 2:
                this.rectD['x'] = this.node.x + this.offsetX;
                this.rectD['y'] = this.node.y - this.offsetHeight;

                return this.rectD;
            case 3:
                this.rectL['x'] = this.node.x - this.collisionWidth;;
                this.rectL['y'] = this.node.y + this.offsetY;
                return this.rectR;
            case 4:
				if(this.isDown && !this.isLadder){
					this.rectSM1['x'] = this.node.x;
                    this.rectSM1['y'] = this.node.y;
					return this.rectSM1;
				}else{
					this.rectM['x'] = this.node.x ;
                    this.rectM['y'] = this.node.y ;
					return this.rectM;
				}
                
            case 5:
                this.rectP['x'] = this.node.x + this.widthP;
                this.rectP['y'] = this.node.y + this.heightP;
                return this.rectP;
			case 10:
                this.rectT['x'] = this.node.x;
                this.rectT['y'] = this.node.y;
				
                return this.rectT;

            default:
                break;
        }
    },
});
