//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  


cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',

        frames: [cc.SpriteFrame],
        DirectionX: true,
        DirectionY: true,

        IsCollision: true,
        IsCollisionUp: true,
        IsCollisionLeft: true,
        IsCollisionDown: true,
        IsCollisionRight: true,
        IsCollisionMiddle: true,

		IsUpMoreCollision: false,
        IsLeftMoreCollision: false,
        IsRightMoreCollision: false,
        IsDownMoreCollision: false,
		
		IsCheckUp:true,
        IsCheckLeft:true,
        IsCheckDown:true,
        IsCheckRight:true,
    },
	
	applyRect(){
		if(this.baseRect){
			this.node.x = this.baseRect.x;
	        this.node.y = this.baseRect.y;
		    this.node.width = this.baseRect.width;
		    this.node.height = this.baseRect.height;
		}
	},
	
	setRect(rect){
		this.baseRect = rect;
		this.node.x = rect.x;
	    this.node.y = rect.y;
		this.node.width = rect.width;
		this.node.height = rect.height;
	},
	
	setConfig(conf){
		//this.config = conf;
		//cc.log(this.Type,conf);
		switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.TURRET2[3]:
			case cc.GameConfig.PREFAB_TYPE.TURRET[3]:
			    this.limmitX = conf.Num2;
				this.limmitY = conf.Num3;
				this.isReady = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.FIREROAD[3]:
			    this.fireFirstLimmit = conf.Num;
				this.fireRealLimmit = conf.Num2
			    this.fireHold = conf.Num3;
				this.fireLimmit = this.fireFirstLimmit;
				this.isReady = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.MOVEROAD[3]:
			    this.moveType = conf.OtherType1;
			    if(conf.OtherType2 == 'VARIABLE_WIDTH'){
				    this.node.width = conf.Width;
					this.initBaseParam();
			    }else if(conf.OtherType2 == 'VARIABLE_HEIGHT'){
					this.node.height = conf.Height;
					this.initBaseParam();
				}
				switch (this.moveType) {
			        case 'TIME_X':
					    this.time = 0;
						this.isMoveX = true;
                        this.direct = conf.DirectionX;
						this.timeLimmit = conf.Limmit;
						this.moveSpeed = conf.MoveSpeed;
						//cc.log(conf);
			            break;
					case 'TIME_Y':
					    this.time = 0;
						this.isMoveY = true;
			            this.direct = conf.DirectionY;
						this.timeLimmit = conf.Limmit;
						this.moveSpeed = conf.MoveSpeed;
			            break;
					case 'VARIABLE_X':
					    this.moveSpeed = 0;
						this.isMoveX = true;
			            this.direct = conf.DirectionX;
						this.moveMaxSpeed = conf.MoveSpeed;
						this.moveIncrement = conf.MoveIncrement;
			            break;
					case 'VARIABLE_Y':
					    this.moveSpeed = 0;
						this.isMoveY = true;
			            this.direct = conf.DirectionY;
						this.moveMaxSpeed = conf.MoveSpeed;
						this.moveIncrement = conf.MoveIncrement;
			            break;
				
                    default:
                        break;
                }
				
				this.isMove = conf.Auto;
				this.isReady = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.SPIKEHEADROAD[3]:
			case cc.GameConfig.PREFAB_TYPE.HEADROAD[3]:
			    //this.initBaseParam();
			    this.limmitX = conf.Num2;
		        this.limmitY = conf.Num3;
				this.isReady = true;
                break;
			case cc.GameConfig.PREFAB_TYPE.CONDUITUP[3]:
			case cc.GameConfig.PREFAB_TYPE.CONDUITRIGHT[3]:
			case cc.GameConfig.PREFAB_TYPE.CONDUITDOWN[3]:
			case cc.GameConfig.PREFAB_TYPE.CONDUITLEFT[3]:
			    this.OtherType = conf.OtherType1;
	  
	            this.Id = conf.Id;
	            this.CloseId = conf.CloseId;
	            this.TargertId = conf.TargertId;
	            this.TargertLayer = conf.TargertLayer;
	            this.IsSetPos = conf.IsSetPos;
				this.canEnter = conf.CanEnter
			    break;
				
            default:
                break;
        }
    },
    
    start () {
		this.node.Script = this;
        this.init();
		
		this.rScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.ROAD);
		this.mScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.MONSTER);
		this.fmScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.FLYMONSTER);
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
		this.rectSM = {};
		this.rectMM = {};
		this.rectMM2 = {};
        this.rectP = {};
		this.rectSUD = {};
		this.rectSLR = {};
        this.initRectPosition();
        this.initRectSize();
	},
	
	init(){
		this.isActive = true;
		this.conf = cc.ObjConfig.ROAD[this.Type];
		
		if(this.conf){
			this.jumpIncrement = this.conf.JUMP_INCREMENT;
		    this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
		    this.dropIncrement = this.conf.DROP_INCREMENT;
		    this.dropMaxSpeed = this.conf.DROP_MAX_SPEED;
		    this.upFireSpeed = this.conf.UP_FIRE_SPEED;
			
			if(!this.conf.IS_POINT){
			    this.initBaseParam();
		    }
		}else{
			cc.log(this.Type);
		}
		
		
		switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.BRICK1[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK2[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK3[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK10[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK11[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK12[3]:
			case cc.GameConfig.PREFAB_TYPE.WOODROAD[3]:
			case cc.GameConfig.PREFAB_TYPE.PALMTREE[3]:
			    this.canDownJump = true;
			    this.isNoCheckWood = true;
				this.normalRoad = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.BRICK4[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK5[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK6[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK7[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK8[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK9[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK13[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK14[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK15[3]:
			case cc.GameConfig.PREFAB_TYPE.BRICK16[3]:
			case cc.GameConfig.PREFAB_TYPE.TILE4[3]:
			//case cc.GameConfig.PREFAB_TYPE.CONDUITUP[3]:
			//case cc.GameConfig.PREFAB_TYPE.CONDUITRIGHT[3]:
			//case cc.GameConfig.PREFAB_TYPE.CONDUITDOWN[3]:
			//case cc.GameConfig.PREFAB_TYPE.CONDUITLEFT[3]:
			//case cc.GameConfig.PREFAB_TYPE.CONDUITUP2[3]:
			//case cc.GameConfig.PREFAB_TYPE.CONDUITDOWN2[3]:
			//case cc.GameConfig.PREFAB_TYPE.CONDUITBODY1[3]:
			//case cc.GameConfig.PREFAB_TYPE.CONDUITBODY2[3]:
			    this.isNoCheckWood = true;
				this.normalRoad = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.TILE3[3]:
				this.normalRoad = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.STONEROAD[3]:
			    this.isStoneRoad = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.TURRET[3]:
			case cc.GameConfig.PREFAB_TYPE.TURRET2[3]:
			    this.bg = this.node.getChildByName('bg');
			    this.sprite = this.bg.getComponent(cc.Sprite);
			    this.frameTime = 0;
			    this.frameIndex = 0;
				this.attackCount = 0;
				this.attackRate = this.conf.ATTACK_RATE;
				this.frameSize = this.frames.length - 1;
				this.frameUpdateRate = cc.GameConfig.CONSTANT.FRAME_RATE;
				this.bulletUrl = cc.GameConfig.PREFAB_TYPE.TURRETBULLET;
				this.isNoCheckWood = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.TILE1[3]:
			    this.debris = cc.GameConfig.PREFAB_TYPE.TILEDEBRIS;
			    this.isTile = true;
				this.canBlast = true;
				this.haveDebris = true;
				this.canCrush =true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.TILE2[3]:
			    this.debris = cc.GameConfig.PREFAB_TYPE.TILEDEBRIS2;
				this.isTile = true;
				this.haveDebris = true;
				this.isPowTile = true;
				this.canBlast = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.BALL[3]:
			    this.isMust = true;
			    this.jumpSpeed = 0;
                this.fireSpeed = this.conf.FIRE_SPEED;
				this.fireIncrement = this.conf.FIRE_INCREMENT;
			    
				this.jumpCount = 0;
				this.jumpMaxSpeed2 = this.conf.JUMP_MAX_SPEED2;
				this.jumpMaxSpeed3 = this.conf.JUMP_MAX_SPEED3;
				this.jumpMaxSpeed4 = this.conf.JUMP_MAX_SPEED4;
				this.isMove = false;
				this.noDown = true;
				this.canBullet = true;
				this.canCrush = true;
				this.canBlast = true;
				this.isFull = true;
				this.isLight = true;
				this.isBall = true;
				this.isRotate = true;
				this.isFireDirect = true;
				this.isNoCheckWood = true;
				this.bg = this.node.getChildByName('bg');
				this.rotateSpeed = this.conf.ROTATE_SPEED;
				this.rotateIncrement = this.conf.ROTATE_INCREMENT;
				this.blastUrl = cc.GameConfig.PREFAB_TYPE.MONSTERBLAST;
				this.springRect = {};
				this.springRect['x'] = 0;
				this.springRect['y'] = 0;
				this.springRect['width'] = 0;
				this.springRect['height'] = 0;
			    break;
			case cc.GameConfig.PREFAB_TYPE.IROLBALL[3]:
			    this.isMust = true;
			    this.noDown = true;
				this.isTile = true;
				this.isPowTile = true;
			    this.jumpSpeed = 0;
				this.isIrolBall = true;
				this.isPress = true;
				this.canBullet = true;
				this.isFill = true;
				this.isFull = true;
				this.isRotate = true;
				this.isFireDirect = true;
				this.bg = this.node.getChildByName('bg');
				this.rotateSpeed = this.conf.ROTATE_SPEED;
				this.rotateIncrement = this.conf.ROTATE_INCREMENT;
				this.fireSpeed = this.conf.FIRE_SPEED;
				this.fireIncrement = this.conf.FIRE_INCREMENT;
				this.springRect = {};
				this.springRect['x'] = 0;
				this.springRect['y'] = 0;
				this.springRect['width'] = 0;
				this.springRect['height'] = 0;
			    break;
            case cc.GameConfig.PREFAB_TYPE.BOX[3]:
			    this.isMust = true;
                this.jumpSpeed = 0;
                this.moveSpeed = 0;
                this.fireSpeed = this.conf.FIRE_SPEED;
                this.bg = this.node.getChildByName('bg');
				this.isPress = true;
				this.isWeight = true;
				this.isBox = true;
                this.isLight = true;
				this.isDrop = true;
                this.isMove = false;
				this.isFill = true;
                this.canMove = true;
                this.canLeft = true;
                this.canRight = true;
                this.canShake = false;
				this.isBullet = false;
				this.isBeHold = false;
				this.isFire = false;
				this.isNoCheckWood = true;
				this.deadDirectionY = true;
				this.canUD = true;
				this.canLR = true;
				this.bigRect = {};
                break;
			case cc.GameConfig.PREFAB_TYPE.WOODEN[3]:
			    this.debris = cc.GameConfig.PREFAB_TYPE.WOODDEBRIS;
			    this.jumpSpeed = 0;
                this.fireSpeed = this.conf.FIRE_SPEED;
                this.bg = this.node.getChildByName('bg');
                this.isSmallWood = true;
				this.isLight = true;
				this.isLighten = true;
				this.isDrop = true;
				this.isBullet = false;
				this.isBeHold = false;
				this.isFire = false;
				this.canBullet = true;
				this.haveDebris = true;
				this.deadDirectionY = true;
				this.canCrush = true;
				this.canBlast = true;
				this.isNoCheckWood = true;
				this.canUD = true;
				this.canLR = true;
				this.isWood = true;
				this.bScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.BOSS);
				this.pScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.POINT);
                break;
				
			case cc.GameConfig.PREFAB_TYPE.STONE[3]:
			    this.isMust = true;
                this.fireSpeed = this.conf.FIRE_SPEED;
				this.jumpSpeed = 0;
                this.bg = this.node.getChildByName('bg');
				this.isTile = true;
				this.isPowTile = true;
                this.isFill = true;
				this.isPress = true;
				this.isStone = true;
				this.isFull = true;
				this.isMove = false;
				this.isDrop = true;
				this.isBullet = false;
				this.isBeHold = false;
				this.isFire = false;
				this.canBullet = true;
				this.deadDirectionY = true;
				this.isFireDirect = true;
				this.canUD = true;
				this.canLR = true;
				this.springRect = {};
				this.springRect['x'] = 0;
				this.springRect['y'] = 0;
				this.springRect['width'] = 0;
				this.springRect['height'] = 0;
                break;
			case cc.GameConfig.PREFAB_TYPE.BOMB[3]:
                this.fireSpeed = this.conf.FIRE_SPEED;

                this.startY = this.node.y;
                this.dropCount = 0;
                this.bg = this.node.getChildByName('bg');
				this.isRefresh = true;
				this.noDown = true;
				this.isMove = false;
				this.isLight = true;
				this.isBomb = true;
				//this.isFull = true;
				this.isDrop = true;
				this.isBullet = false;
				this.isBeHold = false;
				this.isFire = false;
				this.canBullet = true;
				this.canCrush = true;
				this.canBlast = true;
				this.isNoCheckWood = true;
				this.deadDirectionY = true;
				this.canUD = true;
				this.canLR = true;
				this.pScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.POINT);
				this.blastUrl = cc.GameConfig.PREFAB_TYPE.BOMBBLAST;
                break;
				
			case cc.GameConfig.PREFAB_TYPE.SPRING[3]:
			    this.isFrame = false;
				this.isSpring = true;
				this.isNoCheckWood = true;
                this.frameCount = 0;
				this.timeCount = 0;
				this.frameMax = this.frames.length;
				this.timeMax = cc.GameConfig.CONSTANT.FRAME_RATE;
				this.bg = this.node.getChildByName('bg');
				this.sprite = this.bg.getComponent(cc.Sprite);
				
		        //this.speed = this.conf.SPEED;
			    break;
				
			case cc.GameConfig.PREFAB_TYPE.FIREROAD[3]:
			    this.isFireRoad = true;
				this.isNoCheckWood = true;
			    this.isFire = false;
                this.fireIndex = 0;
			    this.timeCount = 0;
		        this.frameMax = this.frames.length;
			    this.timeMax = cc.GameConfig.CONSTANT.FRAME_RATE;
			    this.bg = this.node.getChildByName('bg');
			    this.sprite = this.bg.getComponent(cc.Sprite); 
			    this.fireRect = this.node.getChildByName('fireRect');
			    this.rectF = {};
			    this.rectF['x'] = this.node.x + this.fireRect.x;
                this.rectF['y'] = this.node.y + this.fireRect.height;
			    this.rectF['width'] = this.fireRect.width;
                this.rectF['height'] = this.fireRect.height;
			    break;
				
			case cc.GameConfig.PREFAB_TYPE.MOVEROAD[3]:
			    this.isMust = true;
				this.isMoveRoad = true;
				this.speedDirect = true;
				this.isNoCheckWood = true;
			    break;
			case cc.GameConfig.PREFAB_TYPE.DROPROAD[3]:
			    this.time = 0;
			    this.isDrop = false;
				this.isCheckDrop = false;
				this.isNoCheckWood = true;
				this.isRefresh = true;
				this.isDropRoad = true;
				this.waitTime = this.conf.WAIT_TIME;
				this.jumpSpeed = this.conf.DROP_START_SPEED;
				this.pScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.POINT);
				break;
				
			case cc.GameConfig.PREFAB_TYPE.HEADROAD[3]:
			    this.isMust = true;
			    this.isMoveY = false;
			    this.isHead = true;
				this.isWeight = true;
			    this.startY = this.node.y;
			    //this.isDrop = false;
				//this.isRise = false;
				this.direct = false;
				this.isCheck = true;
			    this.jumpSpeed = 0;
				this.waitCount = 0;
				//this.riseSpeed = this.conf.RISE_SPEED;
		        this.jumpIncrement = this.conf.JUMP_INCREMENT;
				this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
				this.waitTime = this.conf.WAIT_TIME;
				this.bg = this.node.getChildByName('bg');
                this.anim = this.bg.getComponent(cc.Animation);
                break;
			case cc.GameConfig.PREFAB_TYPE.SPIKEHEADROAD[3]:
			    this.isMust = true;
			    this.isMoveY = false;
			    this.isSpikeHead = true;
			    this.isHead = true;
				this.isWeight = true;
			    this.startY = this.node.y;
			    //this.isDrop = false;
				//this.isRise = false;
				this.direct = false;
				this.isCheck = true;
			    this.jumpSpeed = 0;
				this.waitCount = 0;
				//this.riseSpeed = this.conf.RISE_SPEED;
		        this.jumpIncrement = this.conf.JUMP_INCREMENT;
				this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
				this.waitTime = this.conf.WAIT_TIME;
				this.bg = this.node.getChildByName('bg');
                this.anim = this.bg.getComponent(cc.Animation);
				this.rectHM = {};
				this.rectHM['width'] = this.node.width + 10;
				this.rectHM['height'] = this.node.height + 10;
                break;
			/*case cc.GameConfig.PREFAB_TYPE.CONDUITUP[3]:
			    
			    break;
			case cc.GameConfig.PREFAB_TYPE.CONDUITRIGHT[3]:
			    this.doorRect = {};
			    break;
			case cc.GameConfig.PREFAB_TYPE.CONDUITDOWN[3]:
			    this.doorRect = {};
			    break;
			case cc.GameConfig.PREFAB_TYPE.CONDUITLEFT[3]:
			   
				
				cc.log(this.getRect(4),this.doorRect);
			    break;*/
				
            default:
                break;
        }
		
		if(this.Type == cc.GameConfig.PREFAB_TYPE.CONDUITUP[3]){
			this.doorRect = {};
		    this.doorRect['x'] = this.node.x + this.width / 5;
			this.doorRect['y'] = this.node.y + this.height;
			this.doorRect['width'] = this.width * 3 / 5;
			this.doorRect['height'] = this.conf.COLLISION_DIS;
		}else if(this.Type == cc.GameConfig.PREFAB_TYPE.CONDUITRIGHT[3]){
			this.doorRect = {};
			this.doorRect['x'] = this.node.x + this.width + this.conf.COLLISION_DIS;
			this.doorRect['y'] = this.node.y + this.height / 5;
			this.doorRect['width'] = this.conf.COLLISION_DIS;
			this.doorRect['height'] = this.height * 3 / 5;
		}else if(this.Type == cc.GameConfig.PREFAB_TYPE.CONDUITDOWN[3]){
			this.doorRect = {};
		}else if(this.Type == cc.GameConfig.PREFAB_TYPE.CONDUITLEFT[3]){
			this.doorRect = {};
			this.doorRect['x'] = this.node.x - this.conf.COLLISION_DIS;
			this.doorRect['y'] = this.node.y + this.height / 5;
			this.doorRect['width'] = this.conf.COLLISION_DIS;
			this.doorRect['height'] = this.height * 3 / 5;
		}else if(this.Type == cc.GameConfig.PREFAB_TYPE.SPRINGL[3]){
			this.isSpringMove = false;
			this.bg = this.node.getChildByName('bg');
			this.anim = this.bg.getComponent(cc.Animation);
		    this.isNoCheckWood = true;
			this.rectWidth = this.conf.RECT_WIDTH;
			this.springLRect = {};
			this.springLRect['x'] = this.node.x - this.rectWidth / 2;
			this.springLRect['y'] = this.node.y + this.height / 6;
			this.springLRect['width'] = this.rectWidth;
			this.springLRect['height'] = this.height / 3;
		}else if(this.Type == cc.GameConfig.PREFAB_TYPE.SPRINGR[3]){
			this.isSpringMove = false;
			this.bg = this.node.getChildByName('bg');
			this.anim = this.bg.getComponent(cc.Animation);
		    this.isNoCheckWood = true;
			this.rectWidth = this.conf.RECT_WIDTH;
			this.springRRect = {};
			this.springRRect['x'] = this.node.x + this.width - this.rectWidth / 2;
			this.springRRect['y'] = this.node.y + this.height / 6;
			this.springRRect['width'] = this.rectWidth;
			this.springRRect['height'] = this.height / 3;
		}else if(this.Type == cc.GameConfig.PREFAB_TYPE.SPRINGLR[3]){
			this.isSpringMove = false;
			this.bg = this.node.getChildByName('bg');
			this.anim = this.bg.getComponent(cc.Animation);
		    this.isNoCheckWood = true;
			this.rectWidth = this.conf.RECT_WIDTH;
			this.springRRect = {};
			this.springRRect['x'] = this.node.x + this.width - this.rectWidth / 2;
			this.springRRect['y'] = this.node.y+ this.height / 6;
			this.springRRect['width'] = this.rectWidth;
			this.springRRect['height'] = this.height / 3;
			this.springLRect = {};
			this.springLRect['x'] = this.node.x - this.rectWidth / 2;
			this.springLRect['y'] = this.node.y + this.height / 6;
			this.springLRect['width'] = this.rectWidth;
			this.springLRect['height'] = this.height / 3;
		}
		
		if(cc.PlayerBulletUuid == this.node.uuid){
			this.setPlayerBullet();
		}
    },
	
	setMove(){
		this.isMove = true;
	},
	
	setSpringJump(code,rect){
		this.isRotate = true;
		this.isFire = true;
	    this.isJump = true;
		this.isDrop = false;
		this.isMove = true;
		this.isSpringMove = true;
		this.directCode = code;
		this.springRect['x'] = rect['x'];
		this.springRect['y'] = rect['y'];
		this.springRect['width'] = rect['width'];
		this.springRect['height'] = rect['height'];
	
		this.rotateSpeed = this.conf.ROTATE_SPEED;
		this.fireSpeed = this.conf.SPRING_MOVE_SPEED;
		this.jumpSpeed = this.conf.SPRINGLR_JUMP_SPEED;
	},
	
	springLPlayer(){
		if(!cc.Player.isSpringCheck){
			return;
		}
		
		if (cc.MathUtil.rectInRect(this.springLRect, cc.Player.getRect(4))) {
			this.anim.play('spring');
			if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
				cc.AudioMgr.playSound('tanhuang');
			}
			
            cc.Player.setSpringJump(1,this.springLRect);
        }
	},
	
	springRPlayer(){
		if(!cc.Player.isSpringCheck){
			return;
		}
		
		if (cc.MathUtil.rectInRect(this.springRRect, cc.Player.getRect(4))) {
			this.anim.play('spring');
			if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
				cc.AudioMgr.playSound('tanhuang');
			}
            cc.Player.setSpringJump(2,this.springRRect);
        }
	},
	
	springLRoad(){
		for(let key in this.rScripts){
			if(this.rScripts[key].isSpringMove){
				continue;
			}
			
			if(!this.rScripts[key].isFull){
				continue;
			}
			
			if(!this.rScripts[key].isFire){
				continue;
			}
			
			if(cc.MathUtil.rectInRect(this.springLRect, this.rScripts[key].getRect(4))){
				this.anim.play('spring');
				if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
				    cc.AudioMgr.playSound('tanhuang');
			    }
				this.rScripts[key].setSpringJump(2,this.springLRect);
				
            }
		}
	},
	
	springRRoad(){
		for(let key in this.rScripts){
			if(this.rScripts[key].isSpringMove){
				continue;
			}
			
			if(!this.rScripts[key].isFull){
				continue;
			}
			
			if(!this.rScripts[key].isFire){
				continue;
			}
			
			if(cc.MathUtil.rectInRect(this.springRRect, this.rScripts[key].getRect(4))){
				this.anim.play('spring');
				if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
				    cc.AudioMgr.playSound('tanhuang');
			    }
				this.rScripts[key].setSpringJump(1,this.springRRect);
            }
		}
	},
	
	checkSpringRect(){
		if(!(cc.MathUtil.rectInRect(this.getRect(4), this.springRect))){
			this.isSpringMove = false;
		}
	},

	
	upDoorGoLayer(){
		cc.Player.conduitDoor = null;
		cc.Game.switchLayer(this.TargertLayer,this.TargertId);
	},
	
	/*leftDoorGoLayer(){
		cc.Player.setDoorLeft(this.getRect(4));
		cc.Game.switchLayer(this.TargertLayer,this.TargertId);
	},*/
	
	checkLeftDoor(){
		if(!this.canEnter || cc.Player.isOut || cc.Player.isEnter){
			return;
		}
		
		if (cc.MathUtil.rectInRect(this.doorRect, cc.Player.getRect(4))) {
            //this.leftDoorGoLayer();
			cc.Player.conduitDoor = this.node;
			cc.Player.setLeftOutLayer(this.getRect(4));
        }
	},
	
	checkUpDoor(){
		if(!this.canEnter || cc.Player.conduitDoor || cc.Player.isOut || cc.Player.isEnter){
			return;
		}
		
		if (cc.MathUtil.rectInRect(this.doorRect, cc.Player.getRect(4))) {
            cc.Player.conduitDoor = this.node;
        }
	},
	
	logic(){
		switch(this.Type){
			case cc.GameConfig.PREFAB_TYPE.SPRINGL[3]:
			    this.springLPlayer();
				this.springLRoad();
			    break;
			case cc.GameConfig.PREFAB_TYPE.SPRINGR[3]:
			    this.springRPlayer();
				this.springRRoad();
			    break;
            case cc.GameConfig.PREFAB_TYPE.SPRINGLR[3]:
			    this.springLPlayer();
				this.springRPlayer();
				this.springLRoad();
				this.springRRoad();
			    break;
			case cc.GameConfig.PREFAB_TYPE.CONDUITUP[3]:
			    this.checkUpDoor();
			    break;
			case cc.GameConfig.PREFAB_TYPE.CONDUITLEFT[3]:
			case cc.GameConfig.PREFAB_TYPE.CONDUITRIGHT[3]:
			    this.checkLeftDoor();
			    break;
            case cc.GameConfig.PREFAB_TYPE.BOX[3]:
				this.jump();
				this.drop();
				this.checkObj();
                this.checkBoxCollision();
				this.checkStandRoad();
				this.checkMove();
                this.boxMove();
                break;
		    case cc.GameConfig.PREFAB_TYPE.WOODEN[3]:
			    //if(this.isDeadDrop){
					//this.deadDrop();
				//}else{
					if(this.isBullet){
					    if(this.isFire){
						    this.woodFire();
							this.hitMonster();
							this.woodHitBoss();
							this.woodHitRoad();
					    }else{
							if(!this.isBeHold){
								this.checkObj();
                                this.checkStandCollision();
                                this.drop();
							    this.hitMonster();
								this.checkStandRoad();
						    }else{
								this.followPlayer();
							}
							this.checkEye();
						}
				    }
				//}
                break;
				
			case cc.GameConfig.PREFAB_TYPE.STONE[3]:
					if(this.isBullet){
					    if(this.isFire){
							this.checkObj();
							this.stoneHitRoad();
							this.checkStoneCollision();
							this.stoneFire();
							
							this.dizzinessPlayer();
							this.jump();
							this.stoneDrop();
							
							this.hitMonster();
							this.checkSpringRect();
					    }else{
							if(!this.isBeHold){
								this.checkStandCollision();
								this.checkObj();
                                this.drop();
								this.checkStandRoad();
							    this.hitMonster();
						    }else{
								this.followPlayer();
							}
							this.checkEye();
						}
				    }else{
						this.checkStandRoad();
						this.checkObj();
						this.checkCollision();
			            this.drop();
						this.stoneHitRoad();
					}
                break;
				
			case cc.GameConfig.PREFAB_TYPE.BOMB[3]:
					if(this.isBullet){
					    if(this.isFire){
							this.checkObj();
							this.bombHitRoad();
							
							this.bombFire();
							this.jump();
							this.bombDrop();
							this.hitMonster();
					    }else{
						    this.followPlayer();
						}
				    }else{
						this.checkObj();
                        this.checkStandCollision();
						this.bombDrop();
					}
						
                break;
			case cc.GameConfig.PREFAB_TYPE.BALL[3]:
					if(this.isBullet){
					    if(this.isFire){
							this.checkObj();
                            this.checkCollision();
							this.ballFire();
							this.fireEndMove();
							
						    this.rotate();
							this.jump();
							this.ballDrop();
							this.checkSpringRect();
							if(this.isCheckHit){
								this.hitPlayer();
							    this.hitMonster();
							}
					    }else{
						    this.followPlayer();
						}
				    }else{
						this.checkObj();
						this.checkStandShakeCollision();
						this.drop();
					}
                break;
			case cc.GameConfig.PREFAB_TYPE.IROLBALL[3]:
					if(this.isBullet){
					    if(this.isFire){
							this.checkObj();
                            this.checkStoneCollision();
						
							this.ballFire();
							this.fireEndMove();
						    this.rotate();
							this.jump();
							this.irolDrop();
							this.checkSpringRect();
							//if(this.isCheckHit){
							    this.hitPlayer();
								this.stoneHitRoad();
							    this.hitMonster();
							//}
					    }else{
						    this.followPlayer();
						}
				    }else{
						this.checkObj();
						this.checkStandShakeCollision();
						this.irolDrop();
						//this.checkStandRoad();
						this.stoneHitRoad();
					}
                break;
				
		    case cc.GameConfig.PREFAB_TYPE.SPRING[3]:
				this.updateFrame();
			    break;
			case cc.GameConfig.PREFAB_TYPE.TURRET[3]:
				this.checkAttack();
				this.checkAttackRate();
                this.attack(2);
			    break;
			case cc.GameConfig.PREFAB_TYPE.TURRET2[3]:
				this.checkAttack2();
				this.checkAttackRate();
                this.attack(1);
			    break;
				
			case cc.GameConfig.PREFAB_TYPE.FIREROAD[3]:
			    if(!this.isReady){
					return;
				}
				
			    this.checkFire();
			    this.updateFireFrame();
			    this.checkPlayer();
				break;
				
		    case cc.GameConfig.PREFAB_TYPE.MOVEROAD[3]:
				
				switch (this.moveType) {
			        case 'TIME_X':
                        this.timeMove(0);
			            break;
					case 'TIME_Y':
			            this.timeMove(1);
			            break;
					case 'VARIABLE_X':
					    this.variableMove(0);
			            break;
					case 'VARIABLE_Y':
					    this.variableMove(1);
			            break;
				
                    default:
                        break;
                }
			    break;
			case cc.GameConfig.PREFAB_TYPE.DROPROAD[3]:
			    this.checkDropTime();
			    this.drop();
				break;
			case cc.GameConfig.PREFAB_TYPE.HEADROAD[3]:
				if(this.isCheck){
					this.checkHeadAttack();
				}else{
					this.headHitRoad();
				    this.checkHeadCollision();
				    this.checkObj();
					this.headDrop();
				    this.rise();
				    this.wait();
				}
				
                break;
			case cc.GameConfig.PREFAB_TYPE.SPIKEHEADROAD[3]:
				if(this.isCheck){
					this.checkHeadAttack();
				}else{
					this.headHitRoad();
				    this.checkHeadCollision();
				    this.checkObj();
				    this.checkHurtPlayer();
					this.headDrop();
				    this.rise();
				    this.wait();
				}
				
                break;
			
            default:
                break;
        }
	},
	
	initRectPosition() {
        this.rectU['x'] = this.node.x + this.offsetX;
        this.rectU['y'] = this.node.y + this.height;

        this.rectR['x'] = this.node.x + this.width;
        this.rectR['y'] = this.node.y  + this.offsetY;

        this.rectD['x'] = this.node.x  + 2 * this.offsetX;
        this.rectD['y'] = this.node.y - this.offsetHeight;

        this.rectL['x'] = this.node.x - this.collisionWidth;
        this.rectL['y'] = this.node.y + this.offsetY;

        this.rectM['x'] = this.node.x ;
        this.rectM['y'] = this.node.y ;
		
		this.rectSM['x'] = this.node.x + this.width / 6;
        this.rectSM['y'] = this.node.y + this.height / 6;
		
		this.rectMM['x'] = this.node.x - this.width / 10;
        this.rectMM['y'] = this.node.y - this.height / 10;
		
		this.rectMM2['x'] = this.node.x - 12;
        this.rectMM2['y'] = this.node.y - 12;

        this.rectP['x'] = this.node.x + this.widthP;
        this.rectP['y'] = this.node.y + this.heightP;

        this.rectSUD['x'] = this.node.x + this.width / 30;
        this.rectSUD['y'] = this.node.y;
		
		this.rectSLR['x'] = this.node.x ;
        this.rectSLR['y'] = this.node.y + this.width / 30;

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
		
		this.rectSM['width'] = this.width * 2 / 3;
        this.rectSM['height'] = this.height * 2 / 3;
		
		this.rectMM['width'] = this.width * 6 / 5;
        this.rectMM['height'] = this.height * 6 / 5;
		
		this.rectMM2['width'] = this.width + 24;
        this.rectMM2['height'] = this.height + 24;

        this.rectSUD['width'] = this.width * 14 / 15;
        this.rectSUD['height'] = this.height;
		
		this.rectSLR['width'] = this.width ;
        this.rectSLR['height'] = this.height - this.height / 15;

        this.rectP['r'] = this.width / 2 + this.height / 2;
    },
	
	setCheckDrop(){
		this.isCheckDrop = true;
	},
	
	setSpring(){
		if(this.isFrame ){
			return;
		}
		
		if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
			cc.AudioMgr.playSound('tanhuang');
		}
		
		this.isFrame = true;
        this.timeCount = 0;
		this.frameCount = 0;
	},
	
	setPlayerBullet(){
        this.isBullet = true;
		this.isBeHold = true;
        this.isDrop = false;
        this.IsCollision = false;
		this.node.zIndex = 53;
		//this.node.y = cc.Player.node.y + cc.Player.height * 7 / 12;
		this.node.y = cc.Player.node.y + cc.Player.height;
		this.node.x = cc.Player.node.x + cc.Player.widthP - this.node.width / 2;
		this.node.opacity = 255;
		
		if(this.isFill){
			this.checkPlayerPower();
			if(!this.isPlayerPower){
				cc.Player.setSpeed(0);
			}
	    }
	},
	
	checkPlayerPower(){
		if(cc.IsPower){
			this.isPlayerPower = true;
		}else{
			this.isPlayerPower = cc.IsPowerTemp;
		}
	},
	
	setDown(){
		this.jumpSpeed = 0;
	    if(this.isIrolBall){
			this.node.y = cc.Player.node.y + cc.Player.height * 5 / 6 ;
	    }else{
			this.node.y = cc.Player.node.y + cc.Player.height * 5 / 6 ;
		}
	},
	
	setFire(code,code2){
		this.isFire = true;
		this.IsCollision = true;
		this.isCheckMonster = true;
		this.directCode = code;
		this.realDirectCode = code2;
        
		if(code == 3){
			this.isMove = false;
			this.jumpSpeed = this.upFireSpeed;
			switch (this.Type) {
			    case cc.GameConfig.PREFAB_TYPE.BALL[3]:
				    this.isRotate = false;
				    this.isJump = true;
					this.isCheckHit = true;
			        this.node.zIndex = 60;
					this.node.y = cc.Player.node.y + cc.Player.node.height + 5;
					this.checkStandShakeCollision();
			        break;
			    case cc.GameConfig.PREFAB_TYPE.IROLBALL[3]:
				    this.isJump = true;
					this.isRotate = false;
					this.isCheckHit = true;
					this.node.zIndex = 60;
			        this.node.y = cc.Player.node.y + cc.Player.node.height + this.height / 2;
					this.stoneHitRoad();
			        this.checkStoneCollision();
			        break;
			    case cc.GameConfig.PREFAB_TYPE.WOODEN[3]:
			        this.node.zIndex = 60;
					this.node.y = cc.Player.node.y +  cc.Player.node.height + 5;
					this.woodHitRoad();
                    break;
			    case cc.GameConfig.PREFAB_TYPE.STONE[3]:
				    this.isJump = true;
					this.node.zIndex = 60;
                    this.node.y = cc.Player.node.y + cc.Player.node.height + this.height / 2;
					this.stoneHitRoad();
			        this.checkStoneCollision();
                    break;
			    case cc.GameConfig.PREFAB_TYPE.BOMB[3]:
				    this.isJump = true;
                    //this.node.zIndex = 50;
					this.node.y = cc.Player.node.y + cc.Player.node.height + 5;
					this.bombHitRoad();
                    break;
                default:
                    break;
            }
		}else{
			this.isMove = true;
			switch (this.Type) {
			    case cc.GameConfig.PREFAB_TYPE.BALL[3]:
				    this.isJump = true;
					this.isRotate = true;
					this.jumpSpeed = this.jumpMaxSpeed;
			        this.node.zIndex = 60;
					this.node.y = cc.Player.node.y + cc.Player.node.height + 5;
					this.fireSpeed = this.conf.FIRE_SPEED;
					this.rotateSpeed = this.conf.ROTATE_SPEED;
					this.checkCollision();
			        break;
			    case cc.GameConfig.PREFAB_TYPE.IROLBALL[3]:
				    this.isJump = true;
					this.isRotate = true;
					this.jumpSpeed = this.jumpMaxSpeed;
					this.node.zIndex = 60;
			        this.node.y = cc.Player.node.y + cc.Player.node.height + 5;
					this.fireSpeed = this.conf.FIRE_SPEED;
					this.rotateSpeed = this.conf.ROTATE_SPEED;
					this.stoneHitRoad();
			        this.checkStoneCollision();
			        break;
			    case cc.GameConfig.PREFAB_TYPE.WOODEN[3]:
			        this.node.zIndex = 60;
					this.node.y = cc.Player.node.y + this.height / 3;
					this.woodHitRoad();
                    break;
			    case cc.GameConfig.PREFAB_TYPE.STONE[3]:
				    this.isJump = true;
					this.jumpSpeed = this.jumpMaxSpeed;
					this.node.zIndex = 60;
                    this.node.y = cc.Player.node.y + cc.Player.node.height + this.height / 2;
					this.stoneHitRoad();
			        this.checkStoneCollision();
                    break;
			    case cc.GameConfig.PREFAB_TYPE.BOMB[3]:
				    this.isJump = true;
					this.jumpSpeed = this.jumpMaxSpeed;
                    //this.node.zIndex = 50;
					this.node.y = cc.Player.node.y + cc.Player.node.height + 5;
					this.bombHitRoad();
                    break;
                default:
                    break;
            }
		}
	},
	
	setHold(isBeHold){
		if(this.isFire){
			return;
        }
        
		if(isBeHold){
			if(this.isBeHold){
				return;
			}
			
			//this.node.y = cc.Player.node.y + cc.Player.height * 7 / 12;
			this.node.y = cc.Player.node.y + cc.Player.height;
		    this.node.x = cc.Player.node.x + cc.Player.widthP - this.widthP;
			this.isBeHold = true;
			this.preStandRoad = null;
			this.preShakeRoad = null;
			this.preLeftRoad = null;
			this.preRightRoad = null;
			this.isCheckMonster = false;
		}else{
			if(!this.isBeHold){
				return;
			}
			
			this.isBeHold = false;
			this.isDrop = true;
			this.isCheckMonster = true;
			
			if(this.isLight){
				this.IsCollision = true;
			}
			
		}
	},
	
	setMaxJump() {
		this.isJump = true;
        this.isDrop = false;
        this.jumpSpeed = this.conf.SPRING_JUMP_SPEED;    	
    },
	
	updateFrame(){
		if(!this.isFrame){
			return;
		}
		
		this.timeCount ++;
		if(this.timeCount >= 2){
		    this.frameCount ++;
			if(this.frameCount < this.frameMax){
				this.sprite.spriteFrame = this.frames[this.frameCount];
			}else{
				this.frameCount = 0;
				this.sprite.spriteFrame = this.frames[2];
				this.isFrame = false;
			}
			this.timeCount = 0;
		}
	},
	
	checkAttack(){
		if(cc.Player.getRect(5).x >= this.getRect(5).x){
			this.isAttack = false;
			return;
		}
		
		if(Math.abs(this.getRect(5).y - cc.Player.getRect(5).y) <= this.limmitY && this.getRect(5).x - cc.Player.getRect(5).x <= this.limmitX){
			if(!this.isCrazy){
				this.isCrazy = true;
				this.isAttack = false;
				this.attackCount = this.attackRate / 2;
				this.frameIndex = 0;
				this.frameTime = 0;
		    }
        }else{
			if(this.isCrazy){
				this.sprite.spriteFrame = this.frames[4];
				this.isCrazy = false;
			}
		}
    },
	
	checkAttack2(){
		if(cc.Player.getRect(5).x <= this.getRect(5).x){
			this.isAttack = false;
			return;
		}
		
		if(Math.abs(this.getRect(5).y - cc.Player.getRect(5).y) <= this.limmitY && cc.Player.getRect(5).x - this.getRect(5).x <= this.limmitX){
			if(!this.isCrazy){
				this.isCrazy = true;
				this.isAttack = false;
				this.attackCount = this.attackRate / 2;
				this.frameIndex = 0;
				this.frameTime = 0;
		    }
        }else{
			if(this.isCrazy){
				this.sprite.spriteFrame = this.frames[4];
				this.isCrazy = false;
			}
		}
    },
	
	checkAttackRate(){
		if(!this.isCrazy || this.isAttack){
			return;
		}
		
		//cc.log(this.attackCount,this.attackRate);
		this.attackCount ++;
        if (this.attackCount >= this.attackRate) {
			this.isAttack = true;
			this.attackCount = 0;
		}
	},
	
	attack(code){
        if(!this.isAttack){
            return;
        }
		
		this.frameTime++;
        if (this.frameTime >= this.frameUpdateRate) {
			this.frameIndex ++;
			if(this.frameIndex == 1){
				this.addBullet(code);
			}
			
            if(this.frameIndex >= this.frameSize){
				this.isAttack = false;
				this.attackCount = 0;
				this.frameIndex = 0;
				this.sprite.spriteFrame = this.frames[4];
			}else{
				this.sprite.spriteFrame = this.frames[this.frameIndex];
			}
			
            this.frameTime = 0;
        }
    },
	
	addBullet(code){
	    cc.GameUI.addObj(this.bulletUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y + this.node.height / 3;
            if(code == 1){
                item.x = this.node.x + this.node.width ;
                item.getComponent(this.bulletUrl[1]).setConf({
                    'DirectX': true,
                });
            }else{
                item.x = this.node.x - item.width;
                item.getComponent(this.bulletUrl[1]).setConf({
                    'DirectX': false,
                });
            }
        });
	},
	
	checkDropTime(){
		if(!this.isCheckDrop){
			return;
		}
		
		this.time ++;
		if(this.time >= this.waitTime){
			this.isCheckDrop = false;
			this.isDrop = true;
			this.time = 0;
		}
	},
	
	timeMove(code){
		if(!this.isMove){
			return;
		}
		
		this.time ++;
		if(this.time >= this.timeLimmit){
			this.direct = !this.direct;
			this.time = 0;
		}
		
		if(code == 0){
			if(this.direct){
			    this.node.x += this.moveSpeed;
            }else{ 
                this.node.x -= this.moveSpeed;
            }
		}else{
			if(this.direct){
			    this.node.y += this.moveSpeed;
            }else{ 
                this.node.y -= this.moveSpeed;
            }
		}
		
	},
	
	variableMove(code){
		if(!this.isMove){
			return;
		}
		
		if(this.speedDirect){
		    if(this.moveSpeed < this.moveMaxSpeed){
				this.moveSpeed += this.moveIncrement;
		    }else{
				this.moveSpeed = this.moveMaxSpeed;
				this.speedDirect = !this.speedDirect;
			}
		}else{
			if(this.moveSpeed > 0){
				this.moveSpeed -= this.moveIncrement;
			}else{
				this.moveSpeed = 0;
				this.speedDirect = !this.speedDirect;
				this.direct = !this.direct;
			}
		}
		
		if(code == 0){
			if(this.direct){
			    this.node.x += this.moveSpeed;
            }else{ 
                this.node.x -= this.moveSpeed;
            }
			//cc.log(this.node.x);
		}else{
			if(this.direct){
			    this.node.y += this.moveSpeed;
            }else{ 
                this.node.y -= this.moveSpeed;
            }
			//cc.log(this.node.y);
		}
		
	},
	
	checkFire(){
		if(this.isFire){
			this.fireIndex ++;
		    if(this.fireIndex >= this.fireHold){
			    this.isFire = false;
			    this.timeCount = 0;
		        this.frameCount = 0;
				this.sprite.spriteFrame = this.frames[0];
				this.fireLimmit = this.fireRealLimmit;
			    this.fireIndex = 0;
		    }
		}else{
			this.fireIndex ++;
		    if(this.fireIndex >= this.fireLimmit){
			    this.isFire = true;
			    this.timeCount = 0;
		        this.frameCount = 0;
			    this.fireIndex = 0;
		    }
		}
	},
	
	updateFireFrame(){
		if(!this.isFire){
			return;
		}
		
		this.timeCount ++;
		if(this.timeCount >= this.timeMax){
		    this.frameCount ++;
			if(this.frameCount < this.frameMax){
				this.sprite.spriteFrame = this.frames[this.frameCount];
			}else{
				this.frameCount = 0;
			}
			this.timeCount = 0;
		}
	},
	
	checkPlayer(){
		if(!cc.Player || cc.Player.isFlicker || cc.Player.isHide || cc.Player.isShield || cc.Player.isInvincible){
            return;
        }
		
		if(!this.isFire || this.frameCount <= 0){
			return;
		}
		
		if (cc.MathUtil.rectInRect(this.rectF, cc.Player.getRect(4))) {
			cc.Player.hurt(this.conf.HURT);
        }
    },
	
	followPlayer(){
		if(cc.Player.isDown && !cc.Player.isLadder){
			return;
		}
		
		//this.node.y = cc.Player.node.y + cc.Player.height * 7 / 12;
		this.node.y = cc.Player.node.y + cc.Player.height;
		this.node.x = cc.Player.node.x + cc.Player.widthP - this.widthP;
	},
	
	checkEye(){
		if(!this.isBeHold){
			cc.Eye.node.opacity = 255;
		    cc.Eye.node.x = this.node.x + this.widthP - cc.Eye.widthP;
	        cc.Eye.node.y = this.node.y + this.heightP - cc.Eye.heightP;
		}else{
			cc.Eye.node.opacity = 0;
		}
	},
	
	dizzinessPlayer(){
		if(cc.Player.isFlicker || cc.Player.isHide || cc.Player.isShield || cc.Player.isInvincible){
			return;
		}
		
		if(cc.MathUtil.rectInRect(this.getRect(15), cc.Player.getRect(4))){
		   cc.Player.setDizziness();					   
		}
	},
	
	fireEndMove(){
		if(!this.isEndFire){
			return;
		}
		
		if(this.rotateSpeed > 0){
			this.rotateSpeed -= this.rotateIncrement;
		}else{
			this.rotateSpeed = 0;
		}
		
		if(this.fireSpeed > 0){
			this.fireSpeed -= this.fireIncrement;
		}else{
			this.node.zIndex = 9;
			this.fireSpeed = 0;
			this.jumpCount = 0;
			this.isEndFire = false;
			this.isMove = false;
			this.isFire = false;
			this.isRotate = false;
			this.isBullet = false;
		}
	},
	
	ballFire(){
		if(!this.isMove){
			return;
		}
		
		if(this.directCode == 1){
			if(this.preRightRoad){
				if(this.node.x + this.width + this.fireSpeed <= this.preRightRoad.x){
					this.node.x += this.fireSpeed;
				}else{
					this.directCode = 2;
					this.node.x = this.preRightRoad.x - this.width;	
				}
			}else{
				this.node.x += this.fireSpeed;
			}
			
		}else if(this.directCode == 2){
			if(this.preLeftRoad){
				if(this.node.x - this.fireSpeed >= this.preLeftRoad.x + this.preLeftRoad.width){
					this.node.x -= this.fireSpeed;
				}else{
					this.directCode = 1;
					this.node.x = this.preLeftRoad.x + this.preLeftRoad.width;
				}
			}else{
				this.node.x -= this.fireSpeed;
			}
		}else if(this.directCode == 3){
			/*if(!this.isFull){
				this.node.y += this.jumpSpeed;
			    if(this.node.y >= cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height){
				    this.dead();
			    }
			}*/
		}
	},
	
	woodFire(){
		if(this.directCode == 1){
			this.node.x += this.fireSpeed;
			if(this.node.x >= cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width){
			 	this.dead();
			}
		}else if(this.directCode == 2){
			this.node.x -= this.fireSpeed;
			if(this.node.x + this.width <= cc.CameraMgr.getDrawRect().x){
				this.dead();
			}
		}else if(this.directCode == 3){
			this.node.y += this.jumpSpeed;
			if(this.node.y >= cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height){
				this.dead();
			}
		}
	},
	
	irolFire(){
		if(!this.isMove){
			return;
		}
		
		if(this.directCode == 1){
			if(this.preRightRoad){
				if(this.node.x + this.width + this.fireSpeed <= this.preRightRoad.x){
					this.node.x += this.fireSpeed;
				}else{
					this.directCode = 2;
					this.node.x = this.preRightRoad.x - this.width;	
				}
			}else{
				this.node.x += this.fireSpeed;
			}
			
		}else if(this.directCode == 2){
			if(this.preLeftRoad){
				if(this.node.x - this.fireSpeed >= this.preLeftRoad.x + this.preLeftRoad.width){
					this.node.x -= this.fireSpeed;
				}else{
					this.directCode = 1;
					this.node.x = this.preLeftRoad.x + this.preLeftRoad.width;
				}
			}else{
				this.node.x -= this.fireSpeed;
			}
		}else if(this.directCode == 3){
			/*if(!this.isFull){
				this.node.y += this.jumpSpeed;
			    if(this.node.y >= cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height){
				    this.dead();
			    }
			}*/
		}
	},
	
	stoneFire(){
		if(!this.isMove){
			return;
		}
		
		if(this.directCode == 1){
			if(this.preRightRoad){
			    if(this.node.x + this.width + this.fireSpeed <= this.preRightRoad.x){
					this.node.x += this.fireSpeed;
				}else{
					this.node.x = this.preRightRoad.x - this.width;
					this.isMove = false;
				}
			}else{
				this.node.x += this.fireSpeed;
			}
	
		}else if(this.directCode == 2){
			if(this.preLeftRoad){
				if(this.node.x - this.fireSpeed >= this.preLeftRoad.x + this.preLeftRoad.width){
					this.node.x -= this.fireSpeed;
				}else{
					this.node.x = this.preLeftRoad.x + this.preLeftRoad.width;
					this.isMove = false;
				}
			}else{
				this.node.x -= this.fireSpeed;
			}
		}
	},
	
	bombFire(){
		if(this.directCode == 1){
			this.node.x += this.fireSpeed;
		}else if(this.directCode == 2){
			this.node.x -= this.fireSpeed;
		}
	},
	
	bulletMoveX(speed){
		this.node.x += speed;
	},
	
	bulletMoveY(speed){
		this.node.y += speed;
	},
	
	checkStandRoad(){
		if(!this.standRoad || !this.standRoad.isValid){
			this.isRoadMove = false;
			return;
		}
		
		if(!this.standRoad.isValid){
			return;
		}
		
		if(this.standRoad.Script.isDropRoad){
			if(!this.isJump){
		        this.jumpSpeed = 0;
			    this.isDrop = false;
                this.node.y = this.standRoad.y +this.standRoad.height;
            }
			
		    return;
		}
		
		if(!this.isJump){
		    this.jumpSpeed = 0;
			this.isDrop = false;
            this.node.y = this.standRoad.y +this.standRoad.height;
        }
          
		if(this.standRoad.Script.isMoveX && !this.isBullet){
			this.isRoadMove = this.standRoad.Script.isMove;
	        this.roadDirect = this.standRoad.Script.direct;
	        this.roadSpeed = this.standRoad.Script.moveSpeed;
			this.roadMove();
			return;
		}
	},
	
	roadMove(){
		if(!this.isRoadMove){
			return;
		}
		
		if(this.roadDirect){
			if (this.preRightRoad) {
                if (this.node.x + this.width + this.roadSpeed <= this.preRightRoad.x) {
                    this.node.x += this.roadSpeed;
                }else {
                    this.node.x = this.preRightRoad.x - this.width; 
                }
            } else {
                if (this.node.x  + this.width + this.roadSpeed <= cc.Layer.width) {
                    this.node.x += this.roadSpeed;
                } else {
                    this.node.x = cc.Layer.width - this.width;
                }
            }
		}else{
			if (this.preLeftRoad) {
                if (this.node.x - this.roadSpeed >= this.preLeftRoad.x + this.preLeftRoad.width) {
                    this.node.x -= this.roadSpeed;
                }else{
                    this.node.x = this.preLeftRoad.x + this.preLeftRoad.width;
                }
            } else {
                if (this.node.x - this.roadSpeed >=0) {
                    this.node.x -= this.roadSpeed;
                } else {
                    this.node.x = 0;
                }
            }
		}
    },
	
	hitPlayer(){
		if(cc.Player.isFlicker || cc.Player.isHide || cc.Player.isShield || cc.Player.isInvincible){
            return;
        }
		
	
		if (cc.MathUtil.rectInRect(this.getRect(4), cc.Player.getRect(4))) {
            cc.Player.hurt(this.conf.HURT);
        }
	},
	
	woodHitRoad(){
		for(let key in this.rScripts){
			if(this.rScripts[key].node.uuid == this.node.uuid){
				continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue;
			}
			
			if(this.rScripts[key].isNoCheckWood){
				continue;
			}
	
			if(cc.MathUtil.rectInRect(this.getRect(15), this.rScripts[key].getRect(4))){
				this.crush();
				if(this.rScripts[key].canCrush){
					this.rScripts[key].crush(true);
				}
				
				//if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
			        cc.AudioMgr.playSound('zhuankuai');
		        //}
            }
		}
	},
	
	headHitRoad(){
		if(this.direct){
			return;
		}
		
		this.isPlaySound = false;
		for(let key in this.rScripts){
			if(this.rScripts[key].node.uuid == this.node.uuid){
				continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue;
			}
	
			if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(4))){
				if(!this.isPlaySound && this.rScripts[key].haveDebris && this.rScripts[key].canCrush){
					if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
			           cc.AudioMgr.playSound('zhuankuai');
					   this.isPlaySound = true;
		            }
				}
				
				this.rScripts[key].stoneBlast();
				continue;
            }
		}
	},
	
	stoneHitRoad(){
		if(!(this.isFire || this.isJump || this.isDrop)){
			return;
		}
		
		this.isPlaySound = false;
		for(let key in this.rScripts){
			if(this.rScripts[key].node.uuid == this.node.uuid){
				continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue;
			}
	
			if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(4))){
				if(!this.isPlaySound && this.rScripts[key].haveDebris && this.rScripts[key].canCrush){
					if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
			           cc.AudioMgr.playSound('zhuankuai');
					   this.isPlaySound = true;
		            }
				}
				
				this.rScripts[key].stoneBlast(true);
				continue;
            }
		}
	},
	
	bombHitRoad(){
		for(let key in this.rScripts){
			if(this.rScripts[key].node.uuid == this.node.uuid){
				continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue;
			}
		
			if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(4))){
				this.blast(true);
				break;
            }
		}
	},
	
	woodHitBoss(){
		for(let key in this.bScripts){
			if(cc.MathUtil.rectInRect(this.getRect(4), this.bScripts[key].getRect(4))){
				this.bScripts[key].hurt(this.conf);
				this.crush();
				if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
			        cc.AudioMgr.playSound('zhuankuai');
		        }
            }
		}
	},
	
	hitMonster(){
		if(!this.isCheckMonster){
			return;
		}
		
		for(let key in this.mScripts){
			if(this.mScripts[key].isDeadDrop){
				continue;
			}
			
			
			if(cc.MathUtil.rectInRect(this.getRect(15), this.mScripts[key].getRect(4))){
				if(this.isBall){
					this.mScripts[key].hurt(this.conf,this.node.uuid);
					continue;
				}
				
				if(this.isIrolBall){
					this.mScripts[key].hurt(this.conf,this.node.uuid);
					continue;
				}
				
				if(this.isStone){
					this.mScripts[key].hurt(this.conf,this.node.uuid);
					if(!this.isFire && !this.isDrop){
						this.resetBullet();
					}
					continue
				}
				
				if(this.isBomb){
					this.mScripts[key].hurt(this.conf,this.node.uuid);
					this.blast();
					break;
				}
				
				if(this.isWood){
					if(!this.mScripts[key].isImmuneWood){
						this.mScripts[key].hurt(this.conf,this.node.uuid);
					}
					this.crush();
					
					if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
			            cc.AudioMgr.playSound('zhuankuai');
		            }
					break;
				}
            }
		}
		
		for(let key in this.fmScripts){
			if(this.fmScripts[key].isDeadDrop){
				continue;
			}
			
			if(cc.MathUtil.rectInRect(this.getRect(15), this.fmScripts[key].getRect(4))){
				this.fmScripts[key].hurt(this.conf,this.node.uuid);
           
				if(this.isBall){
					continue;
				}
				
				if(this.isIrolBall){
					continue;
				}
				
				if(this.isStone){
					if(!this.isFire && !this.isDrop){
						this.resetBullet();
					}
					continue
				}
				
				if(this.isBomb){
					this.blast();
					break;
				}
				
				if(this.isWood){
					this.crush();
					
					if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
			            cc.AudioMgr.playSound('zhuankuai');
		            }
					break;
				}
            }
		}
	},
	
	checkCanMove(direct,type){
		if(direct == 'U' || direct == 'D'){
			this.canUD = true;
			if(this.isWood){
				return;
			}
			
			for(let key in this.rScripts){
				if(!this.rScripts[key].isFill){
					continue;
				}
				
				if(this.rScripts[key].node.uuid == this.node.uuid){
					continue;
                }
                
				if(cc.MathUtil.rectInRect(this.getRect(6), this.rScripts[key].getRect(6))){
					if(direct == 'U'){
						if(this.rScripts[key].node.y > this.node.y ){
						    this.canUD = false;
					        break;
					    }
					}
					
					if(direct == 'D'){
						if(this.rScripts[key].node.y < this.node.y ){
						    this.canUD = false;
					        break;
					    }
					}
				}
		    }
		}else if(direct == 'L' || direct == 'R'){
			this.canLR = true;
			for(let key in this.rScripts){
				if(type == 'BULLET' && this.rScripts[key].Type != this.Type){
					continue;
				}
				
				if(this.rScripts[key].node.uuid == this.node.uuid){
					continue;
				}
				
				if(direct == 'L'){
					if(!this.rScripts[key].isCollisionRight){
					    continue;
				    }
					
				    if(cc.MathUtil.rectInRect(this.getRect(7), this.rScripts[key].getRect(7))){
						if(this.rScripts[key].node.x < this.node.x ){
						    this.canLR = false;
					        break;
					    }
					}
				}
				
				if(direct == 'R'){
					if(!this.rScripts[key].isCollisionLeft){
					    continue;
				    }
					
				    if(cc.MathUtil.rectInRect(this.getRect(7), this.rScripts[key].getRect(7))){
						if(this.rScripts[key].node.x > this.node.x ){
						    this.canLR = false;
					        break;
					    }
					}
				}
		    }
		}
	},
	
	/*checkCanMove(direct,type){
		if(direct == 'U' || direct == 'D'){
			this.canUD = true;
			for(let key in this.rScripts){
				if(!this.rScripts[key].canBullet){
					continue;
				}
				
				if(!this.rScripts[key].IsCollision){
					continue;
				}
				
				if(!this.rScripts[key].isPress){
					continue;
				}
				
				if(this.rScripts[key].isLighten){
					continue;
				}
				
				if(this.rScripts[key].node.uuid == this.node.uuid){
					continue;
                }
                
				if(cc.MathUtil.rectInRect(this.getRect(6), this.rScripts[key].getRect(6))){
					if(direct == 'U'){
						if(this.rScripts[key].node.y > this.node.y ){
						    this.canUD = false;
					        break;
					    }
					}
					
					if(direct == 'D'){
						if(this.rScripts[key].node.y < this.node.y ){
						    this.canUD = false;
					        break;
					    }
					}
				}
		    }
		}else if(direct == 'L' || direct == 'R'){
			this.canLR = true;
			for(let key in this.rScripts){
				if(type == 'BULLET' && this.rScripts[key].Type != this.Type){
					continue;
				}
				
				if(this.rScripts[key].node.uuid == this.node.uuid){
					continue;
				}
				
				if(direct == 'L'){
					if(!this.rScripts[key].isCollisionRight){
					    continue;
				    }
					
				    if(cc.MathUtil.rectInRect(this.getRect(7), this.rScripts[key].getRect(7))){
						if(this.rScripts[key].node.x < this.node.x ){
						    this.canLR = false;
					        break;
					    }
					}
				}
				
				if(direct == 'R'){
					if(!this.rScripts[key].isCollisionLeft){
					    continue;
				    }
					
				    if(cc.MathUtil.rectInRect(this.getRect(7), this.rScripts[key].getRect(7))){
						if(this.rScripts[key].node.x > this.node.x ){
						    this.canLR = false;
					        break;
					    }
					}
				}
		    }
		}
	},*/
	
	
	checkMove(){
        if(!this.isMove){
			this.moveSpeed = 0;
			return;
		}
		
		

        if(cc.Player.node.x > this.node.x - cc.Player.widthP && cc.Player.node.x  < this.node.x + this.width - cc.Player.widthP){
            this.isMove = false;
            this.moveSpeed = 0;
        }else{
            if(!cc.MathUtil.rectInRect(this.getRect(4),cc.Player.getRect(4))){
                this.isMove = false;
                this.moveSpeed = 0;
            }
        }


    },

    boxMove(){
        if(this.isMove && this.canMove){
            if(this.moveSpeed > 0){
                this.canLeft = true;
                if(this.preRightRoad){
                    if(this.node.x + this.width + this.moveSpeed <= this.preRightRoad.x){
                        this.node.x += this.moveSpeed;
                    }else{
                        this.canRight = false;
                        this.node.x = this.preRightRoad.x - this.width;
                    }
                }else{
                    if(this.node.x + this.moveSpeed <= cc.Layer.width - this.width){
                        this.node.x += this.moveSpeed;
                    }else{
                        this.canRight = false;
                        this.node.x = cc.Layer.width - this.width; 
                    }
                   
                }
            }else{
                this.canRight = true;
                if(this.preLeftRoad){
                    if(this.node.x + this.moveSpeed >= this.preLeftRoad.x + this.preLeftRoad.width){
                        this.node.x += this.moveSpeed;
                    }else{
                        this.canLeft = false;
                        this.node.x = this.preLeftRoad.x + this.preLeftRoad.width;
                    }
                }else{
                    if (this.node.x + this.moveSpeed >= 0) {
                        this.node.x += this.moveSpeed;
                    } else {
                        this.canLeft = false;
                        this.node.x = 0;
                    }
                }
            }
        }
    },
	
	checkRoad(){
		this.curRoads = [];
		if(this.standRoad && this.standRoad.isValid){
			this.bigRect['x'] = this.standRoad.x - this.width;
			this.bigRect['y'] = this.standRoad.y - this.height;
			this.bigRect['width'] = this.standRoad.width + 2 * this.width;
			this.bigRect['height'] = this.standRoad.height + 2 * this.height;
			
			for (let key in this.rScripts) {
                if (!this.rScripts[key].isActive) {
                    continue;
                }
				
			    //顺序不能变
				if(this.rScripts[key].isMust){
				    this.curRoads.push(this.rScripts[key]);
				    continue;
			    }
				
			    if(this.rScripts[key].isBullet){
				    continue;
			    }
			
			    if (cc.MathUtil.rectInRect(this.bigRect, this.rScripts[key].getRect(4))) {
					this.curRoads.push(this.rScripts[key]);
                }
            }
		}
	},
	
	rotate(){
		if(!this.isRotate){
			return;
		}
		
		if(this.directCode == 2){
			this.bg.angle -= this.rotateSpeed;
		    if(this.bg.angle <= -360){
			    this.bg.angle = 0;
		    }
		}else{
			this.bg.angle += this.rotateSpeed;
		    if(this.bg.angle >= 360){
			    this.bg.angle = 0;
		    }
		}
		
	},
	
	jump() {
        if (this.isJump) {
            if (this.jumpSpeed > 0) {
                this.jumpSpeed -= this.jumpIncrement;
				if(this.preShakeRoad){
                    if(this.node.y + this.height + this.jumpSpeed <= this.preShakeRoad.y){
                        this.node.y += this.jumpSpeed;
                    }else{
                        this.jumpSpeed = 0;
				        this.isJump = false;
				        this.isDrop = true;
                    }
                }else{
                    this.node.y += this.jumpSpeed;
                }
            } else {
                this.jumpSpeed = 0;
				this.isJump = false;
				this.isDrop = true;
            }
        }
    },
	
	irolDrop(){
		if (!this.isDrop) {
            return;
        }
		
		if (this.jumpSpeed < this.dropMaxSpeed) {
                this.jumpSpeed += this.dropIncrement;
            } else {
                this.jumpSpeed = this.dropMaxSpeed;
            }

            if(this.node.y <= -this.height){
                this.dead();
            }else{
                if(this.preStandRoad){
                    if(this.node.y - this.jumpSpeed >= this.preStandRoad.y + this.preStandRoad.height){
                        this.node.y -= this.jumpSpeed;
                    }else{
						if(this.preStandRoad.Script.isSpring){
							this.setMaxJump();
						    this.preStandRoad.Script.setSpring();
						}else{
							if(this.directCode == 3){
								/*if(this.jumpCount == 0){
							        this.isJump = true;
								    this.jumpCount ++;
								    this.jumpSpeed = this.jumpMaxSpeed2;
							    }else if(this.jumpCount == 1){
							        this.isJump = true;
								    this.jumpCount ++;
								    this.jumpSpeed = this.jumpMaxSpeed3;
							    }else{
								    this.isJump = false;
								    this.jumpSpeed = 0;
									this.isEndFire = true;
							    }*/
								this.node.zIndex = 9;
			                    this.fireSpeed = 0;
			                    this.jumpCount = 0;
			                    this.isEndFire = false;
			                    this.isMove = false;
			                    this.isFire = false;
			                    this.isRotate = false;
			                    this.isBullet = false;
							}else{
								this.isJump = false;
								this.jumpSpeed = 0;
								this.isEndFire = true;
							}
							
							this.isDrop = false;
							this.node.y = this.preStandRoad.y + this.preStandRoad.height;
						}
                    }
                }else{
                    this.node.y -= this.jumpSpeed;
                }
            }
	},
	
	ballDrop() {
        if (!this.isDrop) {
            return;
        }
		
		if (this.jumpSpeed < this.dropMaxSpeed) {
                this.jumpSpeed += this.dropIncrement;
            } else {
                this.jumpSpeed = this.dropMaxSpeed;
            }

            if(this.node.y <= -this.height){
                this.dead();
            }else{
                if(this.preStandRoad){
                    if(this.node.y - this.jumpSpeed >= this.preStandRoad.y + this.preStandRoad.height){
                        this.node.y -= this.jumpSpeed;
                    }else{
						if(this.preStandRoad.Script.isSpring){
							this.setMaxJump();
						    this.preStandRoad.Script.setSpring();
						}else{
							if(this.jumpCount == 0){
							    this.isJump = true;
								this.jumpCount ++;
								this.jumpSpeed = this.jumpMaxSpeed2;
							}else if(this.jumpCount == 1){
							    this.isJump = true;
								this.jumpCount ++;
								this.jumpSpeed = this.jumpMaxSpeed3;
							}else if(this.jumpCount == 2){
							    this.isJump = true;
								this.jumpCount ++;
								this.jumpSpeed = this.jumpMaxSpeed4;
							}else{
								this.isJump = false;
								this.jumpSpeed = 0;
								this.isCheckHit = false;
								this.isEndFire = true;
							}
							
						    this.isDrop = false;
							this.node.y = this.preStandRoad.y + this.preStandRoad.height;
						}
                    }
                }else{
                    this.node.y -= this.jumpSpeed;
                }
            }
    },
	
	bombDrop(){
		if (this.isDrop) {
            if (this.jumpSpeed < this.dropMaxSpeed) {
                this.jumpSpeed += this.dropIncrement;
            } else {
                this.jumpSpeed = this.dropMaxSpeed;
            }

            if(this.node.y <= -this.height){
                this.dead();
            }else{
                if(this.preStandRoad){
                    if(this.node.y - this.jumpSpeed >= this.preStandRoad.y + this.preStandRoad.height){
                        this.node.y -= this.jumpSpeed;
                    }else{
						this.dropCount ++;
						if(this.dropCount >= 2 && this.node.y < this.startY){
							this.blast();
						}
							
						this.jumpSpeed = 0;
                        this.isDrop = false;
                        this.node.y = this.preStandRoad.y + this.preStandRoad.height;
                    }
                }else{
                    this.node.y -= this.jumpSpeed;
                }
            }
        }
	},
	
	stoneDrop() {
        if (!this.isDrop) {
			return;
		}
        if (this.jumpSpeed < this.dropMaxSpeed) {
            this.jumpSpeed += this.dropIncrement;
        } else {
            this.jumpSpeed = this.dropMaxSpeed;
        }

        if(this.node.y <= -this.height){
            this.dead();
        }else{
            if(this.preStandRoad){
                if(this.node.y - this.jumpSpeed >= this.preStandRoad.y + this.preStandRoad.height){
                    this.node.y -= this.jumpSpeed;
                }else{
			        if(this.preStandRoad.Script.isSpring){
					    this.setMaxJump();
						this.preStandRoad.Script.setSpring();
				    }else{
						if(!cc.Player.isFlicker && !cc.Player.isHide && !cc.Player.isShield && !cc.Player.isInvincible){
			                if(cc.MathUtil.rectInRect(this.getRect(4), cc.Player.getRect(4))){
							    cc.Player.setDizziness();
						        cc.Player.node.y = this.node.y + this.height;
					        }
		                }
									
						this.isFire = false;
					    this.isBullet = false;
						//this.IsCollision = true;
						this.standRoad = this.preStandRoad;
					}
                }
            }else{
                this.node.y -= this.jumpSpeed;
            }
        }
        
    },
	
	headDrop() {
        if(this.isWait || this.direct) {
			this.isDrop = false;
			return;
		}
		
		this.isDrop = true;
        if (this.moveSpeed < this.dropMaxSpeed) {
            this.moveSpeed += this.dropIncrement;
        } else {
            this.moveSpeed = this.dropMaxSpeed;
        }

        if(this.node.y <= -this.height){
            this.dead();
        }else{
            if(this.preStandRoad){
                if(this.node.y - this.moveSpeed >= this.preStandRoad.y + this.preStandRoad.height){
                    this.node.y -= this.moveSpeed;
                }else{
				    this.isWait = true;
				    this.isMoveY = false;
					this.moveSpeed = this.conf.RISE_SPEED;
				    if(this.isSpikeHead){
						this.anim.play('spikeHeadRoad');
					}else{
						this.anim.play('headRoad');
				    }
			               
				    this.waitCount = 0;
					this.node.y = this.preStandRoad.y + this.preStandRoad.height;
                }
            }else{
                this.node.y -= this.moveSpeed;
            }
        }
    },

    drop() {
        if (!this.isDrop) {
			return;
		}
		
        if (this.jumpSpeed < this.dropMaxSpeed) {
            this.jumpSpeed += this.dropIncrement;
        } else {
            this.jumpSpeed = this.dropMaxSpeed;
        }

        if(this.node.y <= -this.height){
            this.dead();
        }else{
            if(this.preStandRoad){
                if(this.node.y - this.jumpSpeed >= this.preStandRoad.y + this.preStandRoad.height){
                    this.node.y -= this.jumpSpeed;
                }else{
					this.standRoad = this.preStandRoad;
				    if(this.preStandRoad.Script.isSpring){
						this.setMaxJump();
						this.preStandRoad.Script.setSpring();
					}else{
						if(this.preStandRoad.Script.isDropRoad){
							if(!this.preStandRoad.Script.isDrop){
								if(!this.isJump){
									this.jumpSpeed = 0;
                                    this.isDrop = false;
                                    this.node.y = this.preStandRoad.y + this.preStandRoad.height;
								}
							}
						}else{
							if(this.isBox){
								this.checkRoad();
							}
							
							if(!this.isJump){
								this.jumpSpeed = 0;
                                this.isDrop = false;
                                this.node.y = this.preStandRoad.y + this.preStandRoad.height;
							}
					    }
					}
                }
            }else{
                this.node.y -= this.jumpSpeed;
            }
        }
        
    },
	
	checkStoneCollision() {
        for(let key in this.rScripts){
			if(!this.rScripts[key].IsCollision){
				continue;
			}
			
			if(this.rScripts[key].canCrush){
				continue;
			}
			
            if(this.node.uuid == this.rScripts[key].node.uuid){
                continue;
            }
			
			

            if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }

            if (this.rScripts[key].IsCollisionUp && !this.preStandRoad) {
				if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))){
					//if(this.getRect(4).y >=  this.rScripts[key].getRect(4).y + this.rScripts[key].signHeight){
                        this.preStandRoad = this.rScripts[key].node;
                        continue;
					//}
                }	
            }

            if (this.rScripts[key].IsCollisionRight) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(1))) {
                    this.preLeftRoad = this.rScripts[key].node;
                    continue;
                }
            }

            if (this.rScripts[key].IsCollisionDown) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(2))) {
                    this.preShakeRoad = this.rScripts[key].node;
                    continue;
                }
            }

            if (this.rScripts[key].IsCollisionLeft) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(3))) {
                    this.preRightRoad = this.rScripts[key].node;
                    continue;
                }
            }
        }
    },
	
	checkStandShakeCollision(){
		for(let key in this.rScripts){
			if(this.node.uuid == this.rScripts[key].node.uuid){
                continue;
            }
			
			if(!this.rScripts[key].IsCollision){
				continue;
			}

            if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }

            if (this.rScripts[key].IsCollisionUp && !this.preStandRoad) {
				if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))){
					if(this.getRect(4).y >=  this.rScripts[key].getRect(4).y + this.rScripts[key].signHeight){
                        this.preStandRoad = this.rScripts[key].node;
                        continue;
					}
                }	
            }
			
			if (this.rScripts[key].IsCollisionDown && !this.preShakeRoad) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(2))) {
                    this.preShakeRoad = this.rScripts[key].node;
                    continue;
                }
            }
        }
	},
	checkHeadCollision() {
        for(let key in this.rScripts){
            if(this.node.uuid == this.rScripts[key].node.uuid){
                continue;
            }
			
			if(!this.rScripts[key].IsCollision){
				continue;
			}
			
			if(this.rScripts[key].canCrush){
				continue;
			}

            if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }

            if (this.rScripts[key].IsCollisionUp && !this.preStandRoad) {
				if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))){
                    this.preStandRoad = this.rScripts[key].node;
                    continue;
                }	
            }
        }
    },
	
	checkBoxCollision(){
		if(this.jump){
			for(let key in this.rScripts){
			if(this.node.uuid == this.rScripts[key].node.uuid){
                continue;
            }
			
			if(!this.rScripts[key].IsCollision){
				continue;
			}

            if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }

            if (this.rScripts[key].IsCollisionUp && !this.preStandRoad && this.isDrop) {
				if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))){
					if(this.getRect(4).y >=  this.rScripts[key].getRect(4).y + this.rScripts[key].signHeight){
                        this.preStandRoad = this.rScripts[key].node;
                        continue;
					}
                }	
            }
			
			if (this.rScripts[key].IsCollisionRight && this.isMove) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(1))) {
                    this.preLeftRoad = this.rScripts[key].node;
                    continue;
                }
            }

            if (this.rScripts[key].IsCollisionDown && this.isJump) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(2))) {
                    this.preShakeRoad = this.rScripts[key].node;
                    continue;
                }
            }

            if (this.rScripts[key].IsCollisionLeft && this.isMove) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(3))) {
                    this.preRightRoad = this.rScripts[key].node;
                    continue;
                }
            }
            }
			/*for (let key in this.rScripts) {
            if (!this.rScripts[key].isActive) {
                continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue;
			}
			
			if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }
            
			if (this.rScripts[key].IsCollisionUp && this.IsCheckDown && !this.preStandRoad) {
				if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))) {
					if(this.getRect(4).y >=  this.rScripts[key].getRect(4).y + this.rScripts[key].signHeight){
						this.preStandRoad = this.rScripts[key].node;
                        continue;
				    }
                }	
            } 

			if (this.rScripts[key].IsCollisionDown) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(2))) {
                    this.preShakeRoad = this.rScripts[key].node;
                    continue;
                }
            } 

			if (this.rScripts[key].IsCollisionRight) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(1))) {
					this.preLeftRoad = this.rScripts[key].node;
					continue;
                }
            }

			if (this.rScripts[key].IsCollisionLeft) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(3))) {
					this.preRightRoad = this.rScripts[key].node;	
				    continue;
                }
            } 
            }*/
		}else{
			for (let key in this.curRoads) {
            if (!this.curRoads[key].isActive) {
                continue;
            }
			
			if(this.curRoads[key].isBullet){
				continue;
			}
            
			if (this.curRoads[key].IsCollisionUp && this.IsCheckDown && !this.preStandRoad) {
				if (cc.MathUtil.rectInRect(this.getRect(4), this.curRoads[key].getRect(0))) {
					if(this.getRect(4).y >=  this.curRoads[key].getRect(4).y + this.curRoads[key].signHeight){
						this.preStandRoad = this.curRoads[key].node;
                        continue;
				    }
                }	
            } 

			if (this.curRoads[key].IsCollisionDown) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.curRoads[key].getRect(2))) {
                    this.preShakeRoad = this.curRoads[key].node;
                    continue;
                }
            } 

			if (this.curRoads[key].IsCollisionRight) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.curRoads[key].getRect(1))) {
					this.preLeftRoad = this.curRoads[key].node;
					continue;
                }
            }

			if (this.curRoads[key].IsCollisionLeft) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.curRoads[key].getRect(3))) {
					this.preRightRoad = this.curRoads[key].node;	
				    continue;
                }
            } 
            }
		}
		
	},
	
	/*checkBoxCollision(){
		 for(let key in this.rScripts){
			if(this.node.uuid == this.rScripts[key].node.uuid){
                continue;
            }
			
			if(!this.rScripts[key].IsCollision){
				continue;
			}

            if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }

            if (this.rScripts[key].IsCollisionUp && !this.preStandRoad && this.isDrop) {
				if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))){
					if(this.getRect(4).y >=  this.rScripts[key].getRect(4).y + this.rScripts[key].signHeight){
                        this.preStandRoad = this.rScripts[key].node;
                        continue;
					}
                }	
            }
			
			if (this.rScripts[key].IsCollisionRight && this.isMove) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(1))) {
                    this.preLeftRoad = this.rScripts[key].node;
                    continue;
                }
            }

            if (this.rScripts[key].IsCollisionDown && this.isJump) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(2))) {
                    this.preShakeRoad = this.rScripts[key].node;
                    continue;
                }
            }

            if (this.rScripts[key].IsCollisionLeft && this.isMove) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(3))) {
                    this.preRightRoad = this.rScripts[key].node;
                    continue;
                }
            }
        }
	},*/
	
	checkStandCollision() {
		if(this.preStandRoad && this.preStandRoad.isValid){
			return;
		}
		
        for(let key in this.rScripts){
			if(this.node.uuid == this.rScripts[key].node.uuid){
                continue;
            }
			
			if(!this.rScripts[key].IsCollision){
				continue;
			}

            if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }

            if (this.rScripts[key].IsCollisionUp && !this.preStandRoad) {
				if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))){
					if(this.getRect(4).y >=  this.rScripts[key].getRect(4).y + this.rScripts[key].signHeight){
                        this.preStandRoad = this.rScripts[key].node;
                        continue;
					}
                }	
            }
        }
    },
	
	checkCollision() {
        for(let key in this.rScripts){
            if(this.node.uuid == this.rScripts[key].node.uuid){
                continue;
            }
			
			if(!this.rScripts[key].IsCollision){
				continue;
			}

            if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }

            if (this.rScripts[key].IsCollisionUp && !this.preStandRoad) {
				if(cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))){
					if(this.getRect(4).y >=  this.rScripts[key].getRect(4).y + this.rScripts[key].signHeight){
                        this.preStandRoad = this.rScripts[key].node;
                        continue;
					}
                }	
            }

            if (this.rScripts[key].IsCollisionRight) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(1))) {
                    this.preLeftRoad = this.rScripts[key].node;
                    continue;
                }
            }

            if (this.rScripts[key].IsCollisionDown) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(2))) {
                    this.preShakeRoad = this.rScripts[key].node;
                    continue;
                }
            }

            if (this.rScripts[key].IsCollisionLeft) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(3))) {
                    this.preRightRoad = this.rScripts[key].node;
                    continue;
                }
            }
        }
    },
	
	checkObj(){
		if (this.standRoad) {
            if (!this.standRoad.isValid || !this.standRoad.Script.IsCollision || this.standRoad.Script.isBullet) {
				if(!this.isHead){
					if (!this.isJump) {
                        this.isDrop = true;
                    }
				}
               
				
                this.standRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.standRoad.Script.getRect(0))) {
                    if(!this.isHead){
					    if (!this.isJump) {
                            this.isDrop = true;
                        }
				    }
                    this.standRoad = null;
                }
            }
        }
		
        if (this.preStandRoad) {
            if (!this.preStandRoad.isValid || !this.preStandRoad.Script.IsCollision) {
				if(this.isHead){
				}else{
					if (!this.isJump) {
                        this.isDrop = true;
                    }
				}
				this.preStandRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preStandRoad.Script.getRect(0))) {
					if(this.isHead){
				    }else{
					    if (!this.isJump) {
                            this.isDrop = true;
                        }
				    }
					this.preStandRoad = null;
                }   
            }
        }

        if (this.preShakeRoad) {
            if (!this.preShakeRoad.isValid || !this.preShakeRoad.Script.IsCollision) {
                this.preShakeRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preShakeRoad.Script.getRect(2))) {
                    this.preShakeRoad = null;
                }
            }
        }

       

        if (this.preLeftRoad) {
            if (!this.preLeftRoad.isValid || !this.preLeftRoad.Script.IsCollision) {
				this.canLeft = true;
                this.preLeftRoad = null;
            } else {
              
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preLeftRoad.Script.getRect(3))) {
				    this.canLeft = true;
                    this.preLeftRoad = null;
                }
                
            }
        }

        if (this.preRightRoad) {
            if (!this.preRightRoad.isValid || !this.preRightRoad.Script.IsCollision) {
				this.canRight = true;
                this.preRightRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preRightRoad.Script.getRect(1))) {
				    this.canRight = true;
                    this.preRightRoad = null;
                }
            }
        }

    },
	
	resetBullet(){
		this.isBullet = false;
		this.IsCollision = true;
		this.isBeHold = true;
		//this.node.zIndex = cc.GameConfig.PREFAB_TYPE[this.Type][4];
		cc.Player.curFrames = cc.Player.frames;
	    cc.Player.bulletReset();
		cc.Player.node.y = this.node.y + this.node.height;
	},
	
	bombBlast(isScore){
		switch (this.Type) {  
		    case cc.GameConfig.PREFAB_TYPE.TILE1[3]:
			case cc.GameConfig.PREFAB_TYPE.TILE2[3]:
			case cc.GameConfig.PREFAB_TYPE.WOODEN[3]:	
			    this.crush(isScore);    
                break;
			case cc.GameConfig.PREFAB_TYPE.BALL[3]:   
			case cc.GameConfig.PREFAB_TYPE.BOMB[3]:
                this.blast(isScore);
                break;
            default:
                break;
        }
	},
	
	stoneBlast(isScore){
		switch (this.Type) {  
		    case cc.GameConfig.PREFAB_TYPE.TILE1[3]:
			case cc.GameConfig.PREFAB_TYPE.WOODEN[3]:
			    this.crush(isScore);			
                break;
			case cc.GameConfig.PREFAB_TYPE.BALL[3]:   
			case cc.GameConfig.PREFAB_TYPE.BOMB[3]:
                this.blast(isScore);
                break;
            default:
                break;
        }
	},
	
	crush(isScore){
		if(!this.haveDebris){
			return;
		}
		
		if(this.isBullet && !this.isFire && !this.isBeHold){
			this.isBeHold = true;
			cc.Player.bulletReset();
		}
		
		
		if(isScore && this.conf.SCORE){
			cc.Utils.addScore(this.getRect(4),this.conf.SCORE);
		}
		
	    this.addFragment({speedX: -2, speedY: 15, rotate: -30, type: 1});
        this.addFragment({speedX: 2, speedY: 15, rotate: 30, type: 2});
        this.addFragment({speedX: -3, speedY: 8, rotate: -60, type: 3});
        this.addFragment({speedX: 3, speedY: 8, rotate: 60, type: 4});
		this.dead();
	},
	
	blast(isScore){
		if(!this.canBlast){
			return;
		}
		
		if(isScore && this.conf.SCORE){
			cc.Utils.addScore(this.getRect(4),this.conf.SCORE);
		}
			
		cc.GameUI.loadNode(this.blastUrl,cc.Layer.node,this.getRect(4),cc.GameConfig.POS_TYPE.MIDDLE);
		this.dead();
	},
	
	addFragment(conf) {
        cc.GameUI.loadNode(
		    this.debris,
		    cc.Layer.node,
		    {'width': this.node.width,'height': this.node.height,'x': this.node.x,'y': this.node.y},
			cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
			    let script = item.getComponent('Debris');
                script.setConf(conf);
		    }
		);
    },
	
	wait(){
		if(!this.isWait){
			return;
		}
		
	    this.waitCount ++;
		if(this.waitCount >= this.waitTime){
			this.direct = true;
			this.isMoveY = true;
			this.isWait = false;
			this.waitCount = 0;
		}
	},
	
	rise(){
		if(!this.direct){
            return;
        }
		
		if(this.node.y + this.moveSpeed <= this.startY){
			this.node.y += this.moveSpeed;
		}else{
			this.node.y = this.startY;
			this.direct = false;
			this.isMoveY = false;
			this.isCheck = true;
		}
	},
	
	checkHurtPlayer(){
		if(cc.Player.isFlicker || cc.Player.isHide || cc.Player.isShield || cc.Player.isInvincible ){
            return;
        }
		
		if(cc.MathUtil.rectInRect(cc.Player.getRect(4), this.rectHM)) {
			cc.Player.hurt(this.conf.HURT);
		}
	},
	
	checkHeadAttack(){
		if(cc.Player.getRect(5).y >= this.getRect(5).y){
			return;
		}
		
		if(Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.limmitX 
		    && this.getRect(4).y + this.height - cc.Player.getRect(4).y - cc.Player.height <= this.limmitY){
			this.jumpSpeed = 0;
			this.direct = false;
			this.isMoveY = true;
			this.isCheck = false;
			this.moveSpeed = 0;
        }
    },
	
	dead(){
		this.isActive = false;
		//if(this.isRefresh){
			for(let key in this.pScripts){
                if(this.pUid == this.pScripts[key].node.uuid){
                    this.pScripts[key].reduce(1);
                    break;
                }
            }
		//}
		
        delete this.rScripts[this.node.uuid];
        this.node.destroy();
    },

    getRect(type) {
		if(!this.isActive){
			return {};
		}
		
        switch (this.Type) {
            case cc.GameConfig.PREFAB_TYPE.BOX[3]:
			case cc.GameConfig.PREFAB_TYPE.BOMB[3]:
			case cc.GameConfig.PREFAB_TYPE.WOODEN[3]:
			case cc.GameConfig.PREFAB_TYPE.STONE[3]:
			case cc.GameConfig.PREFAB_TYPE.BALL[3]:
			case cc.GameConfig.PREFAB_TYPE.IROLBALL[3]:
			case cc.GameConfig.PREFAB_TYPE.MOVEROAD[3]:
			case cc.GameConfig.PREFAB_TYPE.DROPROAD[3]:
			case cc.GameConfig.PREFAB_TYPE.HEADROAD[3]:
                this.initRectPosition();
                break;
			case cc.GameConfig.PREFAB_TYPE.SPIKEHEADROAD[3]:
			    this.rectHM['x'] = this.node.x - 5;
				this.rectHM['y'] = this.node.y - 5;
                this.initRectPosition();
                break;

            default:
                break;
        }

        switch (type) {
            case 0: return this.rectU;
            case 1: return this.rectR;
            case 2: return this.rectD;
            case 3: return this.rectL;
            case 4: return this.rectM;
            case 5: return this.rectP;
            case 6: return this.rectSUD;
			case 7: return this.rectSLR;
			case 15: return this.rectSM;
			case 16: return this.rectMM;
			case 17: return this.rectMM2;

            default:
                break;
        }
    },
});
