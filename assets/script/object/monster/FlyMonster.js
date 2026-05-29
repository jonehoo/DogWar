//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',
        frames: [cc.SpriteFrame],
		IsCollision: true,
        IsCollisionUp:false,
        IsCollisionLeft:false,
        IsCollisionDown:false,
        IsCollisionRight:false,
        IsCollisionMiddle:true,
		IsCheckUp:true,
        IsCheckLeft:true,
        IsCheckDown:true,
        IsCheckRight:true,
    },
	
	setConfig(conf){
		this.blood = conf.Num;
		this.attackLimmt = conf.Limmit;
		this.limmitX = conf.Num2;
		this.limmitY = conf.Num3;
		if(conf.OtherType1 == 'TIME_X'){
			this.isDirectX = true;
			this.direct = conf.DirectionX;
		}else{
			this.isDirectX = false;
			this.direct = conf.DirectionY;
		}
		
		if(conf.IsDirectPlayer){
			this.checkDirect();
		}
		
		switch (this.Type) {
            case cc.GameConfig.PREFAB_TYPE.BIRD[3]:
			case cc.GameConfig.PREFAB_TYPE.BIRD2[3]:
			case cc.GameConfig.PREFAB_TYPE.OWT[3]:
				this.realMoveSpeed = conf.MoveSpeed;
				this.moveSpeed = this.realMoveSpeed;
				this.timeLimmit = conf.Limmit;
                break;
		    case cc.GameConfig.PREFAB_TYPE.BEE[3]:
			case cc.GameConfig.PREFAB_TYPE.BAT2[3]:
			    this.realMoveSpeed = conf.MoveSpeed;
				this.moveSpeed = this.realMoveSpeed;
                break;

            default:
                break;
        }

		this.isReady = true;
	},

    start () {
        this.node.Script = this;
        this.init();
    },
    
    init(){
		this.isActive = true;
        this.conf = cc.ObjConfig.FLYMONSTER[this.Type];
		this.deadIncrement = this.conf.DEAD_INCREMENT;

        this.bg = this.node.getChildByName('bg');
        this.sprite = this.bg.getComponent(cc.Sprite);
        this.anim = this.bg.getComponent(cc.Animation);
		
		this.initBaseParam();

        this.colorIndex = 0;
        this.color = cc.Color.BLACK;
		this.colorLimmit = cc.GameConfig.CONSTANT.COLOR_RATE;
		this.flickerLimmit = cc.GameConfig.CONSTANT.FLICKER_RATE;
		this.blastUrl = cc.GameConfig.PREFAB_TYPE.MONSTERBLAST;

		this.clockCount = 0;
		this.clockTime = 0;
        this.flickerCount = 0;
        this.isColor = false;
		this.isFlicker = false;
		this.isClock = false;
        this.isScaleX = this.conf.SCALEX;
        this.isTurn = this.conf.TURN;

        this.fmScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.FLYMONSTER);
        //this.rScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.ROAD);
        this.pScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.POINT);
		
		this.iceDebris = cc.GameConfig.PREFAB_TYPE.ICEDEBRIS;

        switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.OWT[3]:
				this.isMove = true;
				this.isAttack = false;
				this.timeCount = 0;
				this.stopCount = 0;
				this.fireCount = 0;
				this.stopLimmit = this.conf.STOP_LIMMIT;
				this.stopLimmitP = Math.round(this.stopLimmit / 3);
				this.fireLimmit = this.conf.FIRE_LIMMIT;
				this.bulletUrl = cc.GameConfig.PREFAB_TYPE.CHESTBULLET;
				break;
            case cc.GameConfig.PREFAB_TYPE.BIRD[3]:
				this.isMove = true;
				this.timeCount = 0;
				break;
			case cc.GameConfig.PREFAB_TYPE.BIRD2[3]:
			    this.isMove = true;
				this.timeCount = 0;
			    this.timeLimmit = this.conf.MIN_TIME + Math.round(Math.random() * (this.conf.MAX_TIME - this.conf.MIN_TIME));
			    this.isAttack = false;
                break;
			case cc.GameConfig.PREFAB_TYPE.BEE[3]:
				this.isMove = true;
				this.fireCount = 0;
				this.moveSpeedY = this.conf.MOVE_SPEED_Y;
				this.bulletUrl = cc.GameConfig.PREFAB_TYPE.BEEBULLET;
				this.fireLimmit = this.conf.START_FIRE_LIMMIT;
                break;
			case cc.GameConfig.PREFAB_TYPE.BAT2[3]:
				this.isMove = true;
				this.stopCount = 0;
				this.fireCount = 0;
				this.stopLimmit = this.conf.STOP_LIMMIT;
				this.stopLimmitP = Math.round(this.stopLimmit / 3);
				this.moveSpeedX = this.conf.MOVE_SPEED_X;
				this.bulletUrl = cc.GameConfig.PREFAB_TYPE.BATBULLET;
				this.fireLimmit = this.conf.START_FIRE_LIMMIT;
                break;
			case cc.GameConfig.PREFAB_TYPE.BAT[3]:
			    this.startX = this.node.x;
				this.startY = this.node.y;
                break;
			case cc.GameConfig.PREFAB_TYPE.DUCK[3]:
			    this.startY = this.node.y;
			    this.isDrop = false;
				this.isRise = false;
				this.isCheck = true;
			    this.jumpSpeed = 0;
				this.waitCount = 0;
				this.riseSpeed = this.conf.RISE_SPEED;
		        this.jumpIncrement = this.conf.JUMP_INCREMENT;
				this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
				this.waitTime = this.conf.WAIT_TIME;
				this.rScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.ROAD);
                break;
				
		    case cc.GameConfig.PREFAB_TYPE.EATFLOWER[3]:
			    this.isRise = false;
				this.directY = true;
				this.stopCount = 0;
                this.bg = this.node.getChildByName('bg');
                this.sleepLimmit = this.conf.SLEEP_LIMMIT;
                this.holdLimmit = this.conf.HOLD_LIMMIT;
				this.riseSpeed = this.conf.RISE_SPEED;
				this.useLimmit = this.sleepLimmit;
                this.limmitHeight1 = this.node.y + this.bg.height;
                this.limmitHeight2 = this.node.y;
                break;
			case cc.GameConfig.PREFAB_TYPE.TRACKBEE[3]:
			    this.bg = this.node.getChildByName('bg');
			    this.isAttack = false;
				this.isRise = true;
				this.isTrackBee = true;
				this.riseSpeed = this.conf.RISE_SPEED;
				this.riseLimmitY = this.node.y - this.bg.height;
				this.p = Math.round(Math.random() * 30) / 10 + 1.5;
				this.pScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.BOSS);
                break;
			case cc.GameConfig.PREFAB_TYPE.NORMALBEE[3]:
			    this.bg = this.node.getChildByName('bg');
			    this.isAttack = false;
				this.isRise = true;
				this.timeX = 0;
				this.timeY = 0;
				this.directX = Math.round(Math.random() * 100) % 2 == 1;
				this.directY = Math.round(Math.random() * 100) % 2 == 1;
				this.directLimmitX = this.conf.DIRECT_LIMMIT_BASE + Math.round(Math.random() * this.conf.DIRECT_LIMMIT_RANDOM);
				this.directLimmitY = this.conf.DIRECT_LIMMIT_BASE + Math.round(Math.random() * this.conf.DIRECT_LIMMIT_RANDOM);
				this.riseSpeed = this.conf.RISE_SPEED;
				this.riseLimmitY = this.node.y - this.bg.height;
				this.realMoveSpeed = this.conf.MOVE_SPEED_BASE + Math.round(Math.random() * this.conf.MOVE_SPEED_RANDOM);
				this.moveSpeed = this.realMoveSpeed;
				this.pScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.BOSS);
                break;

            default:
                break;
        }
        
    },
	
	logic(){
		if(!this.isReady || !cc.Player){
			return;
		}
		
	    if(this.isDeadDrop){
			 this.deadDrop();
		}else{
			if(this.isClock){
			    this.clock();
			    return;
		    }
			
			this.slow();
            this.changeColor();
			this.flicker();
              
            switch (this.Type) {
				case cc.GameConfig.PREFAB_TYPE.EATFLOWER[3]:
			        this.flowerFun();
                    break;
                case cc.GameConfig.PREFAB_TYPE.OWT[3]:
				    this.stop();
					this.checkBirdTime();
					this.checkFire();
				    if(this.isDirectX){
				        this.moveX();
			        }else{
				        this.moveY();
			        }
					break;
				case cc.GameConfig.PREFAB_TYPE.BIRD[3]:
					this.checkBirdTime();
				    if(this.isDirectX){
				        this.moveX();
			        }else{
				        this.moveY();
			        }
					break;
			    case cc.GameConfig.PREFAB_TYPE.BIRD2[3]:
					this.checkBirdTime2();
				    this.birdMoveX();
					this.birdAttack();
                    break;
				case cc.GameConfig.PREFAB_TYPE.BEE[3]:
				    this.beeMoveX();
					this.checkBeeDistance();
					this.checkBeeFire();
                    break;
				case cc.GameConfig.PREFAB_TYPE.BAT2[3]:
				    this.stop();
				    this.batMoveY();
					this.checkBatDistance();
					this.checkBatFire();
                    break;
				case cc.GameConfig.PREFAB_TYPE.BAT[3]:
					this.checkBatAttack();
					this.batAttack();
                    break;
				case cc.GameConfig.PREFAB_TYPE.DUCK[3]:
					this.checkDuckCollision();
					this.checkObj();
					this.checkDuckAttack();
					this.drop();
					this.rise();
					this.wait();
                    break;
				case cc.GameConfig.PREFAB_TYPE.TRACKBEE[3]:
					this.beeRise();
					this.checkBeeObj();
					this.checkBeeCollision();
					this.beeTrack();
                    break;
				case cc.GameConfig.PREFAB_TYPE.NORMALBEE[3]:
					this.beeRise();
					this.beeMove();
                    break;
						
                default:
                   break;
            } 
        }
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
	
	setClock(tag,time){
		if(tag && this.isClock){
			this.clockCount = 0;
			return;
		}
		
		this.isClock = tag;
		if(!tag){
			this.iceBlast(this.iceDebris);
		}else{
			this.clockCount = 0;
			this.clockTime = time;
		    cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE.ICE,this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) =>{
			    this.ice = item;
			    let p = 1;
				let value = this.bg.width;
			    if(this.bg.width > this.bg.height){
					value = this.bg.width * 3 / 2;
			        item.width =  value
			        item.height = value;
		        }else{
					value = this.bg.height * 3 / 2;
			        item.height =  value;
			        item.width = value;
		        }
				
				item.x = this.node.x + this.node.width / 2 - item.width / 2;
				item.y = this.node.y + this.node.height / 2 - item.height / 2;
	        });
		}
	},
	
	setSlow(tag,conf){
		if(tag && this.isSlow){
			this.slowCount = 0;
			return;
		}
		
		this.isSlow = tag;
		if(!tag){
			if(this.conf.MOVE_SPEED){
				this.moveSpeed = this.conf.MOVE_SPEED;
			}else{
				this.moveSpeed = this.realMoveSpeed;
			}
			
			this.jumpSpeed = this.conf.JUMP_MAX_SPEED;
			this.bg.color = this.color.fromHEX('#FFFFFF');
		}else{
			this.slowCount = 0;
			this.slowTime = conf.SLOW_TIME;
			this.moveSpeed = this.moveSpeed / 2;
			this.jumpSpeed = this.conf.JUMP_MAX_SPEED / 2;
			this.bg.color = this.color.fromHEX(conf.COLOR);
		}
	},
	
	iceBlast(debris){
		this.addFragment({speedX: -2, speedY: 15, rotate: -30, type: 1},debris);
        this.addFragment({speedX: 2, speedY: 15, rotate: 30, type: 2},debris);
        this.addFragment({speedX: -3, speedY: 8, rotate: -60, type: 3},debris);
        this.addFragment({speedX: 3, speedY: 8, rotate: 60, type: 4},debris);
		this.ice && this.ice.destroy();
		this.ice = null;
	},
	
	addFragment(conf,debris) {
        cc.GameUI.addObj(
		    debris,
		    {'width': this.ice.width,'height': this.ice.height,'x': this.ice.x,'y': this.ice.y},
			cc.GameConfig.POS_TYPE.MIDDLE,
			(item) => {
			    let script = item.getComponent('Debris');
                script.setConf(conf);
		    }
		);
    },
	
	beeRise(){
		if(!this.isRise){
			return;
		}
		
		this.node.y -= this.riseSpeed;
		if(this.node.y <= this.riseLimmitY){
			this.isAttack = true;
			this.isRise = false;
			this.node.zIndex = 53;
		}
	},
	
	beeTrack(){
		if(!this.isAttack){
			return;
		}
		
		this.ox = cc.Player.getRect(5).x - this.getRect(5).x;
		this.oy = cc.Player.getRect(5).y - this.getRect(5).y;
		
		this.bg.scaleX = this.ox > 0 ? 1 : -1;
		this.distance = Math.sqrt(Math.pow(this.ox,2) + Math.pow(this.oy,2));
		this.speedX = this.ox / (this.distance / this.p);
		this.speedY = this.oy / (this.distance / this.p);
		
		if(this.speedX > 0){
			if(this.preRightMonster){
				if(this.node.x + this.width + this.speedX <= this.preRightMonster.x){
					this.node.x += this.speedX;
			    }else{
					this.node.x = this.preRightMonster.x - this.width;
				}
			}else{
				this.node.x += this.speedX;
			}
		}else if(this.speedX < 0){
			if(this.preLeftMonster){
				if(this.node.x + this.speedX >= this.preLeftMonster.x + this.preLeftMonster.width){
					this.node.x += this.speedX;
			    }else{
					this.node.x = this.preLeftMonster.x + this.preLeftMonster.width;
				}
			}else{
				this.node.x += this.speedX;
			}
		}
		
		if(this.speedY > 0){
			if(this.preShakeMonster){
				if(this.node.y + this.height + this.speedY <= this.preShakeMonster.y){
					this.node.y += this.speedY;
			    }else{
					this.node.y = this.preShakeMonster.y - this.height;
				}
			}else{
				this.node.y += this.speedY;
			}
		}else{
			if(this.preStandMonster){
				if(this.node.y + this.speedY >= this.preStandMonster.y + this.preStandMonster.height){
					this.node.y += this.speedY;
			    }else{
					this.node.y = this.preStandMonster.y + this.preStandMonster.height;
				}
			}else{
				this.node.y += this.speedY;
			}
		}
	},
	
	beeMove(){
		if(!this.isAttack){
			return;
		}
		
		this.bg.scaleX = this.directX > 0 ? 1 : -1;
		
		this.timeX ++;
		if(this.timeX >= this.directLimmitX){
			this.directX = !this.directX;
			this.directLimmitX = this.conf.DIRECT_LIMMIT_BASE + Math.round(Math.random() * this.conf.DIRECT_LIMMIT_RANDOM);
			this.timeX = 0;
		}
		
		this.timeY ++;
		if(this.timeY >= this.directLimmitY){
			this.directY = !this.directY;
			this.directLimmitY = this.conf.DIRECT_LIMMIT_BASE + Math.round(Math.random() * this.conf.DIRECT_LIMMIT_RANDOM);
			this.timeY = 0;
		}
	
		
		if(this.directX){
			if(this.node.x + this.width + this.moveSpeed <= cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width){
				this.node.x += this.moveSpeed;
			}else{
				this.node.x = cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width - this.width;
				this.directX = false;
			}
		}else{
			if(this.node.x - this.moveSpeed >= cc.CameraMgr.getDrawRect().x){
				this.node.x -= this.moveSpeed;
			}else{
				this.node.x = cc.CameraMgr.getDrawRect().x;
				this.directX = true;
			}
		}
		
		if(this.directY){
			if(this.node.y + this.height + this.moveSpeed <= cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height){
				this.node.y += this.moveSpeed;
			}else{
				this.node.y = cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height - this.height;
				this.directY = false;
			}
		}else{
			if(this.node.y - this.moveSpeed >= cc.CameraMgr.getDrawRect().y){
				this.node.y -= this.moveSpeed;
			}else{
				this.node.y = cc.CameraMgr.getDrawRect().y;
				this.directY = true;
			}
		}
	},
	
	flowerFun(){
        if(this.isRise){
            if(this.directY){
                if(this.node.y < this.limmitHeight1){
                    this.node.y += this.riseSpeed;
                }else{
                    this.useLimmit = this.holdLimmit;
					this.isRise = false;
                }
            }else{
                if(this.node.y > this.limmitHeight2){
                    this.node.y -= this.riseSpeed;
                }else{
                    this.useLimmit = this.sleepLimmit;
					this.isRise = false;
                }
            }
        }else{
		    this.stopCount ++;
            if(this.stopCount >= this.useLimmit){
                this.stopCount = 0
			    this.directY = !this.directY;
				this.isRise = true;
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
	
	flicker() {
        if (!this.isFlicker) {
            return;  
        }
		
		this.flickerCount ++;
        if (this.flickerCount >= this.flickerLimmit) {
            this.isFlicker = false;
            this.flickerCount = 0;
        }
    },
	
	checkBatAttack(){
		if(Math.abs(this.getRect(5).y - cc.Player.getRect(5).y) <= this.limmitY 
		    && Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.limmitX){
				if(!this.isMove){
					this.anim.play('bat2');
					this.isBack = false;
					this.isMove = true;
				}
			
        }else{
			this.isBack = true;
			this.isMove = true;
		}
    },
	
	batAttack(){
		if(!this.isMove){
			return;
		}
	
	    this.targetX = this.isBack ? this.startX : cc.Player.getRect(5).x;
		this.targetY = this.isBack ? this.startY : cc.Player.getRect(5).y;
		this.ox = this.targetX - this.getRect(5).x;
		this.oy = this.targetY - this.getRect(5).y;
		
		
		this.distance = Math.sqrt(Math.pow(this.ox,2) + Math.pow(this.oy,2));
		this.speedX = this.ox / (this.distance / 3);
		this.speedY = this.oy / (this.distance / 3);
		
		this.bg.scaleX = this.ox > 0 ? -1 : 1;
		
		if(this.ox > 0){
			if(this.getRect(5).x + this.speedX <= this.targetX){
				this.node.x += this.speedX;
				this.isBackX = false;
			}else{
				this.isBackX = true;
				this.node.x = this.targetX - this.widthP;
			}
		}else{
			if(this.getRect(5).x + this.speedX >= this.targetX){
				this.node.x += this.speedX;
				this.isBackX = false;
			}else{
				this.isBackX = true;
				this.node.x = this.targetX - this.widthP;;
			}
		}
		
		if(this.oy > 0){
			if(this.getRect(5).y + this.speedY <= this.targetY){
				this.node.y += this.speedY;
				this.isBackY = false;
			}else{
				this.isBackY = true;
				this.node.y = this.targetY - this.heightP;
			}
		}else{
			if(this.getRect(5).y + this.speedY >= this.targetY){
				this.isBackY = false;
				this.node.y += this.speedY;
			}else{
				this.isBackY = true;
				this.node.y = this.targetY - this.heightP;;
			}
		}
		
		if(this.isBackX && this.isBackY){
			this.isMove = false;
			if(this.isBack){
				this.anim.play('bat');
			}
		}
	},
	
	checkFire(){
		this.fireCount ++;
		if(this.fireCount >= this.fireLimmit){
			this.isStop = true;
			this.isMove = false;
			this.fireLimmit = this.conf.START_FIRE_LIMMIT + Math.round(Math.random()* this.conf.FIRE_LIMMIT);
			this.fireCount = 0;
		}
	},
	
    stop(){
		if(!this.isStop){
			return;
		}
		
		this.stopCount ++;
		if(this.stopCount == this.stopLimmitP){
			switch (this.Type) {
			    case cc.GameConfig.PREFAB_TYPE.OWT[3]:
				    this.addOwtBullet();
				    break;
           
			    case cc.GameConfig.PREFAB_TYPE.BAT2[3]:
				    this.anim.enabled = false;
					this.sprite.spriteFrame = this.frames[0];
			        this.addBatBullet(this.fireDirect);
				    break;
	
                default:
                    break;
            }
		}
		
		if(this.stopCount >= this.stopLimmit){
			this.isStop = false;
			this.isMove = true;
			this.anim.enabled = true;
			this.stopCount = 0;
		}
	},
	
	checkBeeFire(){
		this.fireCount ++;
		if(this.fireCount >= this.fireLimmit){
			this.addBeeBullet();
			this.fireLimmit = this.conf.START_FIRE_LIMMIT + Math.round(Math.random()* this.conf.FIRE_LIMMIT);
			this.fireCount = 0;
		}
	},
	
	checkBatFire(){
		this.fireCount ++;
		if(this.fireCount >= this.fireLimmit){
			this.isStop = true;
			this.isMove = false
			this.fireLimmit = this.conf.START_FIRE_LIMMIT + Math.round(Math.random()* this.conf.FIRE_LIMMIT);
			this.fireCount = 0;
		}
	},
	
	checkDirect(){
        if(!cc.Player){
            this.direct = false;
        }else{
            this.direct = cc.Player.node.x + cc.Player.node.width / 2 >= this.node.x + this.node.width / 2;
        }
    },
	
	checkBirdTime(){
		if(this.isStop){
			return;
		}
		
		this.timeCount ++;
		if(this.timeCount >= this.timeLimmit){
			this.direct = !this.direct;
			this.timeCount = 0;
		}
	},
	
	checkBirdTime2(){
		if(this.isAttack){
			return;
		}
		
		this.timeCount ++;
		if(this.timeCount >= this.timeLimmit){
			this.isAttack = true;
		    this.checkSpeed();
			this.timeCount = 0;
		}
	},
	
	checkSpeed(){
		this.moveSpeed = this.conf.FAST_MOVE_SPEED;
		this.distanceX = this.getRect(5).x- cc.Player.getRect(5).x;
		this.distanceY = this.getRect(5).y- cc.Player.getRect(5).y;
		this.angle = Math.atan(this.distanceY / this.distanceX);
		if(this.distanceX > 0){
			this.bg.scaleX = 1;
			this.moveSpeedX = -this.moveSpeed * Math.cos(this.angle);
		    this.moveSpeedY = -this.moveSpeed * Math.sin(this.angle);
		}else{
		    this.bg.scaleX = -1;
			this.moveSpeedX = this.moveSpeed * Math.cos(this.angle);
			this.moveSpeedY = this.moveSpeed * Math.sin(this.angle);
		}
	},
	
	addBeeBullet(){
	    cc.GameUI.addObj(this.bulletUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y - item.height;
			item.getComponent(this.bulletUrl[1]).setConf({});
        });   
	},
	
	addBatBullet(code){
	    cc.GameUI.addObj(this.bulletUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y;
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

    addOwtBullet(){
	    cc.GameUI.addObj(this.bulletUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y + item.height;
			item.x = this.getRect(5).x - this.heightP;
           
            item.getComponent(this.bulletUrl[1]).setConf({
                'DirectX': true,
            });
        });
		
		cc.GameUI.addObj(this.bulletUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y + item.height;
			item.x = this.getRect(5).x - this.heightP;
			
            item.getComponent(this.bulletUrl[1]).setConf({
                'DirectX': false,
            });
        });   
	},
	
    hurt(conf,uuid){
		if(this.isFlicker){
			return;
		}
		
		this.isFlicker = conf.HURT > 0;
        this.blood -= conf.HURT;
        if(this.blood <= 0){
			cc.AudioMgr.playSound('monsterDead');
			cc.Utils.addScore(this.getRect(4),this.conf.SCORE);
            if(conf.BLAST){
				this.blast();
            }else{
                this.setDeadDrop();
            }
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
	
	birdMoveX(){
		if(this.isAttack){
            return;
        }
		
        if (this.isScaleX) {
            this.bg.scaleX = this.direct ? -1 : 1;
        }
	
        if(this.direct){
            if(this.node.x + this.width + this.moveSpeed <= cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width){
				this.node.x += this.moveSpeed;
			}else{
				this.node.x = cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width - this.width;
				this.direct = false;
			}				
        }else{
            if(this.node.x - this.moveSpeed >= cc.CameraMgr.getDrawRect().x){
				this.node.x -= this.moveSpeed;
			}else{
				this.node.x = cc.CameraMgr.getDrawRect().x;
				this.direct = true;
			}		
        }
	},
	
    birdAttack(){
		if(!this.isAttack){
            return;
        }
		
		this.node.x += this.moveSpeedX;
        this.node.y += this.moveSpeedY; 
		if(this.node.y < -this.height){
             this.dead();
        }
	},
	
	beeMoveX(){
		if(!this.isMove){
            return;
        }
	
        if(this.direct){
            if(this.node.x + this.width + this.moveSpeed <= cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width){
				this.node.x += this.moveSpeed;
			}else{
				this.node.x = cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width - this.width;
				this.direct = false;
			}				
        }else{
            if(this.node.x - this.moveSpeed >= cc.CameraMgr.getDrawRect().x){
				this.node.x -= this.moveSpeed;
			}else{
				this.node.x = cc.CameraMgr.getDrawRect().x;
				this.direct = true;
			}		
        }
	},
	
	batMoveY(){
		if(!this.isMove){
            return;
        }
		
        if(this.direct){
            if(this.node.y + this.height + this.moveSpeed <= cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height - this.height){
				this.node.y += this.moveSpeed;
			}else{
				this.node.y = cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height - 2 * this.height;
				this.direct = false;
			}				
        }else{
            if(this.node.y - this.moveSpeed >= cc.CameraMgr.getDrawRect().y + this.height){
				this.node.y -= this.moveSpeed;
			}else{
				this.node.y = cc.CameraMgr.getDrawRect().y + this.height;
				this.direct = true;
			}		
        }
	},
	
	checkBatDistance(){
		this.fireDirect = cc.Player.getRect(5).x > this.getRect(5).x ? 1 : -1;
		this.bg.scaleX = this.fireDirect;
		this.targetX = cc.Player.getRect(4).x + this.attackLimmt;
		this.maxTargetX = cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width - this.width;
		this.minTargetX = cc.CameraMgr.getDrawRect().x;
		if(this.targetX > this.maxTargetX){
			this.targetX = this.maxTargetX;
		}else if(this.targetX < this.minTargetX){
			this.targetX = this.minTargetX;
		}
		
		this.isMoveX = this.node.x != this.targetX;
		this.directX = this.node.x < this.targetX;
		if(this.isMoveX){
			if(this.directX){
				if(this.node.x + this.moveSpeedX <= this.targetX){
					this.node.x += this.moveSpeedX;
				}else{
					this.node.x = this.targetX;
				}
			}else{
				if(this.node.x - this.moveSpeedX >= this.targetX){
					this.node.x -= this.moveSpeedX;
				}else{
					this.node.x = this.targetX;
				}
			}
		}
	},
	
	
	checkBeeDistance(){
		this.targetY = cc.Player.getRect(4).y + this.attackLimmt;
		this.maxTargetY = cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height - this.height;
		if(this.targetY > this.maxTargetY){
			this.targetY = this.maxTargetY;
		}
		
		this.isMoveY = this.node.y != this.targetY;
		this.directY = this.node.y < this.targetY;
		if(this.isMoveY){
			if(this.directY){
				if(this.node.y + this.moveSpeedY <= this.targetY){
					this.node.y += this.moveSpeedY;
				}else{
					this.node.y = this.targetY;
				}
			}else{
				if(this.node.y - this.moveSpeedY >= this.targetY){
					this.node.y -= this.moveSpeedY;
				}else{
					this.node.y = this.targetY;
				}
			}
		}
	},
	
	moveX() {
        if(!this.isMove){
            return;
        }
		
        if (this.isScaleX) {
            this.bg.scaleX = this.direct ? -1 : 1;
        }
	
        if(this.direct){
            this.node.x += this.moveSpeed;   
        }else{
            this.node.x -= this.moveSpeed;
            
        }
    },
	
	moveY() {
        if(!this.isMove){
            return;
        }
		
        if (this.isScaleX) {
            this.bg.scaleX = cc.Player.getRect(5).x > this.getRect(5).x ? -1 : 1;
        }
	
        if(this.direct){
            this.node.y += this.moveSpeed;   
        }else{
            this.node.y -= this.moveSpeed;
            
        }
    },
	
	checkDuckAttack(){
		if(!this.isCheck){
			return;
		}
		
		if(cc.Player.getRect(5).y >= this.getRect(5).y){
			return;
		}
		
		if(Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.limmitX){
			this.anim.enabled = false;
			this.jumpSpeed = 0;
			this.sprite.spriteFrame = this.frames[0];
			this.isRise = false;
			this.isCheck = false;
			this.isDrop = true;
        }
    },
	
	rise(){
		if(!this.isRise){
            return;
        }
		
		if(this.node.y + this.riseSpeed <= this.startY){
			this.node.y += this.riseSpeed;
		}else{
			this.node.y = this.startY;
			this.anim.play('duck2');
			this.isRise = false;
			this.isCheck = true;
		}
	},
	
	drop(){
        if(!this.isDrop){
            return;
        }
		
        if(this.jumpSpeed < this.jumpMaxSpeed){
            this.jumpSpeed += this.jumpIncrement;
        }else{
            this.jumpSpeed = this.jumpMaxSpeed;
		}
		
        if(this.preStandRoad){
            if(this.node.y - this.jumpSpeed >= this.preStandRoad.y +this.preStandRoad.height ){
                this.node.y -= this.jumpSpeed;
            }else{
				this.isDrop = false;
				this.isWait = true;
				this.anim.enabled = true;
			    this.anim.play('duck');
				this.waitCount = 0;
			}
        }else{
            if(this.node.y > -this.height){
                this.node.y -= this.jumpSpeed;   
            }else{
                this.dead();
            }
        }
    },
	
	wait(){
		if(!this.isWait){
			return;
		}
		
	    this.waitCount ++;
		if(this.waitCount >= this.waitTime){
			this.isRise = true;
			this.isWait = false;
			this.waitCount = 0;
		}
	},
	
	checkBox(){
		if(this.isDeadDrop){
			return;
		}
		
		if (this.preShakeRoad && this.preShakeRoad.isValid ){
			if(!this.preShakeRoad.Script.isBox || this.preShakeRoad.Script.isBullet){
				return;
			}
			
			if(!this.preShakeRoad.Script.isDrop){
				return;
			}
			
			if(this.node.y + this.height >= this.preShakeRoad.y){
				this.setDeadDrop();
			}
		}
	},
	
	checkDuckCollision() {
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
                    this.preStandRoad = this.rScripts[key].node;
                    continue;
                }	
            }
        }
    },
	
	checkBeeCollision() {
        for(let key in this.fmScripts){
            if(this.node.uuid == this.fmScripts[key].node.uuid){
                continue;
            }
			
			if(!this.fmScripts[key].isTrackBee){
                continue;
            }

            if (!cc.MathUtil.pointDistance(this.getRect(5), this.fmScripts[key].getRect(5), this.getRect(5).r + this.fmScripts[key].getRect(5).r)) {
                continue;
            }
            
            if(!this.preStandMonster){
	            if(cc.MathUtil.rectInRect(this.getRect(4), this.fmScripts[key].getRect(0))){
                    this.preStandMonster = this.fmScripts[key].node;
				    continue;
                }
		    }	
            

            if(!this.preLeftMonster){
                if (cc.MathUtil.rectInRect(this.getRect(4), this.fmScripts[key].getRect(1))) {
                    this.preLeftMonster = this.fmScripts[key].node;
                    continue;
                }
			}
            

           
		    if(!this.preShakeMonster){
                if (cc.MathUtil.rectInRect(this.getRect(4), this.fmScripts[key].getRect(2))) {
                    this.preShakeMonster = this.fmScripts[key].node;
                    continue;
                }
			}
            

            if(!this.preRightMonster){
				if (cc.MathUtil.rectInRect(this.getRect(4), this.fmScripts[key].getRect(3))) {
                    this.preRightMonster = this.fmScripts[key].node;
                    continue;
                }
			}
           
            
        }
    },
	
	checkBeeObj(){
        if (this.preStandMonster) {
            if (!this.preStandMonster || !this.preStandMonster.isValid) {
                this.preStandMonster = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preStandMonster.Script.getRect(0))) {
                    this.preStandMonster = null;
                }
            }
        }

        if (this.preShakeMonster) {
            if (!this.preShakeMonster || !this.preShakeMonster.isValid) {
                this.preShakeMonster = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preShakeMonster.Script.getRect(2))) {
                    this.preShakeMonster = null;
                }
            }
        }

        if (this.preLeftMonster) {
            if (!this.preLeftMonster || !this.preLeftMonster.isValid) {
                this.preLeftMonster = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preLeftMonster.Script.getRect(1))) {
                    this.preLeftMonster = null;
                }
            }
        }

        if (this.preRightMonster) {
            if (!this.preRightMonster || !this.preRightMonster.isValid) {
                this.preRightMonster = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.getRect(4),this.preRightMonster.Script.getRect(3))) {
                    this.preRightMonster = null;
                }
            }
        }
    },

    checkObj(){
        if (this.preStandRoad) {
            if (!this.preStandRoad || !this.preStandRoad.isValid || this.preStandRoad.Script.isBullet) {
                this.preStandRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.node,this.preStandRoad.Script.getRect(0))) {
                    this.preStandRoad = null;
                }
            }
        }

        if (this.preShakeRoad) {
            if (!this.preShakeRoad || !this.preShakeRoad.isValid || this.preShakeRoad.Script.isBullet) {
                this.preShakeRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.node,this.preShakeRoad.Script.getRect(2))) {
                    this.preShakeRoad = null;
                }
            }
        }

        if (this.preLeftRoad) {
            if (!this.preLeftRoad || !this.preLeftRoad.isValid || this.preLeftRoad.Script.isBullet) {
                this.preLeftRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.node,this.preLeftRoad.Script.getRect(1))) {
                    this.preLeftRoad = null;
                }
            }
        }

        if (this.preRightRoad) {
            if (!this.preRightRoad || !this.preRightRoad.isValid || this.preRightRoad.Script.isBullet) {
                this.preRightRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.node,this.preRightRoad.Script.getRect(3))) {
                    this.preRightRoad = null;
                }
            }
        }
    },


    blast(){
        cc.GameUI.loadNode(this.blastUrl,cc.Layer.node,this.getRect(4),cc.GameConfig.POS_TYPE.MIDDLE);
		this.dead();
    },
	
	setDeadDrop(){
        this.isActive = false;
        this.isDeadDrop = true;
        this.bg.color = this.color.fromHEX('#FFFFFF');
        this.jumpSpeed = this.conf.DEAD_MAX_SPEED;
        this.moveSpeed = this.conf.DEAD_MOVE_SPEED;
        this.anim && (this.anim.enabled = false);
        this.bg.scaleY = - 1;
		this.bg.y += this.bg.height;
		this.node.zIndex = 100;
        this.deadDirectY = true;
    },

    deadDrop() {
        if(!this.direct){
            this.node.x += this.moveSpeed;
        }else{
            this.node.x -= this.moveSpeed;
        }
       
        if (this.deadDirectY) {
            if (this.jumpSpeed > 0) {
                this.jumpSpeed -= this.deadIncrement;
                this.node.y += this.jumpSpeed;
            } else {
                this.deadDirectY = false;
                this.jumpSpeed = 0;
            }
        } else {
            this.jumpSpeed += this.deadIncrement;
            if(this.node.y > -this.node.height){
                this.node.y -= this.jumpSpeed;   
            }else{
                this.dead();
            }
        }   
    },

    dead(){
        this.isActive = false;
        for(let key in this.pScripts){
            if(this.pUid == this.pScripts[key].node.uuid){
                this.pScripts[key].reduce(1);
                break;
            }
        }
        this.ice && this.ice.destroy();
        delete this.fmScripts[this.node.uuid];
        this.node.destroy();
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
