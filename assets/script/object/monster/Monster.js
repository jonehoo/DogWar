//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',
        frames: [cc.SpriteFrame],
		IsCollision:true,
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
		this.collisionDis = conf.CollisionDis || 300;
		//this.collisionDisP = Math.round(this.collisionDis / 3);
		this.limmitX = conf.Num2;
		this.limmitY = conf.Num3;
		if(conf.OtherType1 == 'MOVE_Y'){
			this.direct = conf.DirectionY;
		}else{
			this.direct = conf.DirectionX;
		}
		
		if(conf.IsDirectPlayer){
			this.checkDirect();
		}
		
		this.isReady = true;
	},

    start () {
        this.node.Script = this;
        this.init();
    },
    
    init(){
		this.isActive = true;
        this.conf = cc.ObjConfig.MONSTER[this.Type];

        this.bg = this.node.getChildByName('bg');
        this.sprite = this.bg.getComponent(cc.Sprite);
        this.anim = this.bg.getComponent(cc.Animation);

        this.flickerCount = 0;
        this.jumpSpeed = 0;
		this.moveSpeed = this.conf.MOVE_SPEED;
		this.normalMoveSpeed = this.conf.MOVE_SPEED;
		this.fastMoveSpeed = this.conf.FAST_MOVE_SPEED;
		this.jumpIncrement = this.conf.JUMP_INCREMENT;
		this.dropIncrement = this.conf.DROP_INCREMENT;
		this.dropMaxSpeed = this.conf.DROP_MAX_SPEED;
		this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
		this.deadIncrement = this.conf.DEAD_INCREMENT;
		this.rotateSpeed = this.conf.ROTATE_SPEED;
		
		this.initBaseParam();

		this.clockCount = 0;
		this.clockTime = 0;
        this.colorIndex = 0;
        this.color = cc.Color.BLACK;
		this.colorLimmit = cc.GameConfig.CONSTANT.COLOR_RATE;
		this.flickerLimmit = cc.GameConfig.CONSTANT.FLICKER_RATE;
		this.minDirectWidth = cc.GameConfig.CONSTANT.MIN_DIRECT_WIDTH;
		this.blastUrl = cc.GameConfig.PREFAB_TYPE.MONSTERBLAST;

        this.isClock = false;
        this.isFlicker = false;
        this.isColor = false;
		this.isBlast = true;
        this.isDrop = true;
        this.isJump = false;
        this.isScaleX = this.conf.SCALEX;
        this.isTurn = this.conf.TURN;

       
        this.mScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.MONSTER);
        this.pScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.POINT);
		this.rScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.ROAD);
		this.iceDebris = cc.GameConfig.PREFAB_TYPE.ICEDEBRIS;

        switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.SNAKE[3]:
                this.isMove = true;
                break;
			case cc.GameConfig.PREFAB_TYPE.BIGSNAKE[3]:
                this.isMove = true;
				this.isImmuneWood = true;
                break;
			case cc.GameConfig.PREFAB_TYPE.BIGSNAKE2[3]:
                this.isMove = true;
				this.isImmuneWood = true;
                break;
			case cc.GameConfig.PREFAB_TYPE.RINO[3]:
                this.isMove = true;
				this.isRino = true;
				this.isMoveX = true;
                break;
			case cc.GameConfig.PREFAB_TYPE.INSECT[3]:
                this.isMove = true;
				this.isDrop = false;
				this.inJump = false;
				this.isJump = true;
				this.jumpSpeed = this.jumpMaxSpeed;
                break;
			case cc.GameConfig.PREFAB_TYPE.ATTACKFLOWER[3]:
			    this.isDrop= true;
				this.frameTime = 0;
			    this.frameIndex = 0;
				this.frameSize = this.frames.length;
				this.frameUpdateRate = cc.GameConfig.CONSTANT.FRAME_RATE;
				this.confOffsetW = cc.GameConfig.CONSTANT.DIRECT_OFFSET_WIDTH;
				this.bulletUrl = cc.GameConfig.PREFAB_TYPE.PLANTBULLET;
                break;
			case cc.GameConfig.PREFAB_TYPE.WOLF[3]:
			    this.isTurn = true;
			    this.isMove = true;
                break;
		    case cc.GameConfig.PREFAB_TYPE.RADISH[3]:
				this.timeCount = 0;
			    this.isFly = true;
			    this.isDrop= false;
				this.isMove = false;
				this.isRadish = true;
				this.moveSpeed = this.fastMoveSpeed;
                break;
			case cc.GameConfig.PREFAB_TYPE.PIG[3]:
			    this.isPig = true;
                this.isMove = true;
                break;
            case cc.GameConfig.PREFAB_TYPE.FROG[3]: 
			    this.isDrop = true;
                this.isMove = false;
                this.isJump = false;
                this.inJump = false;
                this.jumpTime = 0;
                this.jumpLimmit = this.conf.START_LIMMIT + Math.round(Math.random()* this.conf.JUMP_LIMMIT);
                break;
			case cc.GameConfig.PREFAB_TYPE.FROG2[3]: 
			    this.isDrop = true;
                this.isMove = false;
                this.isJump = false;
                this.inJump = false;
                this.jumpTime = 0;
                this.jumpLimmit = this.conf.START_LIMMIT + Math.round(Math.random()* this.conf.JUMP_LIMMIT);
				this.confOffsetW = cc.GameConfig.CONSTANT.DIRECT_OFFSET_WIDTH;
                break;
		    case cc.GameConfig.PREFAB_TYPE.SCORPION[3]:
            case cc.GameConfig.PREFAB_TYPE.ANT[3]: 
                this.isMove = true;
                this.isJump = false;
                this.confOffsetW = cc.GameConfig.CONSTANT.DIRECT_OFFSET_WIDTH;
                break;
			case cc.GameConfig.PREFAB_TYPE.REDPIG[3]:
			    this.isPig = true;
                this.isMove = true;
				this.isDrop = true;
				this.isJump = false;
				this.isJumpPig = true;
                break;
            case cc.GameConfig.PREFAB_TYPE.GREENPIG[3]:
			    this.isTurn = true;
			    this.isPig = true;
                this.isMove = true;
				this.isDrop = true;
				this.isJump = false;
				this.isJumpPig = true;
				this.jumpTime = 0;
                this.jumpLimmit = this.conf.START_LIMMIT + Math.round(Math.random()* this.conf.JUMP_LIMMIT);
				this.confOffsetW = cc.GameConfig.CONSTANT.DIRECT_OFFSET_WIDTH;
                break;				
            default:
                break;
        }
        
    },
	
	logic(){
		if(!this.isReady || !this.isActive){
			return;
		}
		
	    if(this.isDeadDrop){
			 this.deadDrop();
		}else{
			this.checkBox();
			if(this.isClock){
			    this.clock();
			    return;
		    }
				
			this.slow();
			this.checkObj();
			this.checkStandRoad();
			this.drop();
			this.jump();
			
			
            this.move();
            this.changeColor();
			this.flicker();
              
            switch (this.Type) {
		        case cc.GameConfig.PREFAB_TYPE.SNAKE[3]:
				case cc.GameConfig.PREFAB_TYPE.INSECT[3]:
				    this.checkCollision();
                    break;
				case cc.GameConfig.PREFAB_TYPE.PIG[3]:
				    this.checkPigCollision();
					break;
                case cc.GameConfig.PREFAB_TYPE.RINO[3]:
				case cc.GameConfig.PREFAB_TYPE.WOLF[3]:
				    this.checkCollision();
				    this.checkMoveDirect2();
                    break;				
				case cc.GameConfig.PREFAB_TYPE.BIGSNAKE[3]:
				    this.checkSnakeCollision();
				    this.checkHitRoad();
                    break;
                case cc.GameConfig.PREFAB_TYPE.BIGSNAKE2[3]:
				    this.checkSnakeCollision();
				    this.checkHitRoad();
					this.checkMoveDirect2();
                    break;					
                case cc.GameConfig.PREFAB_TYPE.RADISH[3]:
					if(this.isFly){
						this.checkTime();
						this.flyX();
					}else{
						this.checkCollision();
						this.checkMoveDirect();
					}
                    break; 						
		        case cc.GameConfig.PREFAB_TYPE.FROG[3]:
				    this.checkCollision();
				    this.checkFrogJump();
                    break;
				case cc.GameConfig.PREFAB_TYPE.REDPIG[3]:
				    this.checkPigCollision();
				    this.checkPigJump();
                    break;
				case cc.GameConfig.PREFAB_TYPE.GREENPIG[3]:
				    this.checkPigCollision();
				    this.checkMoveDirect();
				    this.checkFrogJump();
                    break;
                case cc.GameConfig.PREFAB_TYPE.FROG2[3]:
				    this.checkCollision();
				    this.checkCrazy();
				    this.checkFrogJump();
                    break;					
                case cc.GameConfig.PREFAB_TYPE.SCORPION[3]: 						
                case cc.GameConfig.PREFAB_TYPE.ANT[3]: 
				    this.checkCollision();
                    this.checkCrazy();
                    this.checkMoveDirect2();
                    break;
		        case cc.GameConfig.PREFAB_TYPE.ATTACKFLOWER[3]:
				    this.checkFlowerCollision();
			        this.checkPlantCrazy();
                    this.attack();
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
		this.bigRect = {};
		
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
        this.rectR['y'] = this.node.y  + this.offsetY;

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
	setDrop(){
		this.jumpSpeed = 0;
		this.isDrop = true;
		this.isFly = false;
		this.isMove = true;
		this.anim.play('radish2');
	},
	
	setMaxJump() {
		this.isJump = true;
        this.isDrop = false;
        this.jumpSpeed = this.conf.SPRING_JUMP_SPEED;    	
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
			this.moveSpeed = this.conf.MOVE_SPEED;
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
	
	checkTime(){
		this.timeCount ++;
		if(this.timeCount >= this.attackLimmt){
			this.direct = !this.direct;
			this.timeCount = 0;
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
	
	checkDirect(){
        if(!cc.Player){
            this.direct = false;
        }else{
            this.direct = cc.Player.node.x + cc.Player.node.width / 2 >= this.node.x + this.node.width / 2;
        }
    },

    checkCrazy(){
		this.moveSpeed = this.normalMoveSpeed;
        if(cc.Player.isFlicker || cc.Player.inJump || cc.Player.isHide){
			this.isCrazy = false;
            return
        }
		
         if(Math.abs(this.getRect(5).y - cc.Player.getRect(5).y) <= this.confOffsetW 
		    && Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.attackLimmt){
			switch (this.Type) {
                case cc.GameConfig.PREFAB_TYPE.ANT[3]: 
                    if(this.direct){
                        if(cc.Player.getRect(5).x >= this.getRect(5).x){
							this.isCrazy = true;
                            this.moveSpeed = this.fastMoveSpeed;
                        }
                    }else{
                        if(cc.Player.getRect(5).x <= this.getRect(5).x){
							this.isCrazy = true;
                            this.moveSpeed = this.fastMoveSpeed;
                        } 
                    }
                    break;
			    case cc.GameConfig.PREFAB_TYPE.SCORPION[3]: 
				    this.isCrazy = true;
                    this.direct = cc.Player.getRect(5).x >= this.getRect(5).x;
					this.moveSpeed = this.fastMoveSpeed;
                    break;
				case cc.GameConfig.PREFAB_TYPE.FROG2[3]:
                    if(!this.inJump && !this.isCrazy){
						this.jumpSpeed = this.jumpMaxSpeed;
						this.isDrop = false;
						this.isJump = true;
                        this.sprite.spriteFrame = this.frames[0];
						this.anim.enabled = false;
					}	
					
				    this.isCrazy = true;
					this.isMove = true;
                    this.direct = cc.Player.getRect(5).x >= this.getRect(5).x;
                    break;
                default:
                    break;
            }
        }else{
			this.isCrazy = false;
		}
        
    },
	
	checkPlantCrazy(){
		if(Math.abs(this.getRect(5).y - cc.Player.getRect(5).y) <= this.limmitY && Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.limmitX){
			if(!this.isCrazy){
				this.isCrazy = true;
				this.frameIndex = 0;
				this.frameTime = 0;
				this.anim.enabled = false;
				this.sprite.spriteFrame = this.frames[this.frameIndex];
		    }
				    
            this.bg.scaleX = cc.Player.getRect(5).x > this.getRect(5).x ? -1 : 1;
            this.directCode = cc.Player.getRect(5).x >= this.getRect(5).x ? 1 : 2;
        }else{
			if(this.isCrazy){
				this.anim.enabled = true;
				this.isCrazy = false;
			}
		}
    },
	
	checkHitRoad(){
		for(let key in this.rScripts){
		    if(!this.rScripts[key].IsCollision){
                continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue
			}
			
			if(!this.rScripts[key].isWood){
				continue
			}
			
			if(cc.MathUtil.rectInRect(this.getRect(4),this.rScripts[key].getRect(16))){
				this.rScripts[key].crush();
			}			
        }
	},
	
	checkMaxDirectRoad(){
		for(let key in this.rScripts){
		    if(!this.rScripts[key].IsCollisionUp){
                continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue
			}
			
			if(this.standRoad.uuid == key){
				continue;
			}
			
			if(this.rScripts[key].getRect(5).x <= this.standRoad.Script.getRect(5).x){
				continue
			}
			
			if(cc.MathUtil.rectInRect(this.standRoad.Script.getRect(16),this.rScripts[key].getRect(16))){
				this.maxRoad = this.rScripts[key].node;
			}			
        }
	},
	
	checkMinDirectRoad(){
		for(let key in this.rScripts){
		    if(!this.rScripts[key].IsCollisionUp){
                continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue
			}
			
			if(this.standRoad.uuid == key){
				continue;
			}
			
			if(this.rScripts[key].getRect(5).x >= this.standRoad.Script.getRect(5).x){
				continue
			}
			
			if(cc.MathUtil.rectInRect(this.standRoad.Script.getRect(16),this.rScripts[key].getRect(16))){
				this.minRoad = this.rScripts[key].node;
			}			
        }
	},

    checkMoveDirect(){
        if(this.inJump || this.isDrop || this.isCrazy){
		//if(this.inJump || this.isDrop ){
            return;
        }
		
		if(!this.standRoad || !this.standRoad.isValid){
			return;
		}
		
		if(!this.maxRoad || !this.maxRoad.isValid){
			this.maxRoad = this.standRoad;
			this.checkMaxDirectRoad();
		}
		
		if(!this.minRoad || !this.minRoad.isValid){
			this.minRoad = this.standRoad;
			this.checkMinDirectRoad();
		}
		
		this.isChangeDirect = false;
		if(this.standRoad == this.maxRoad && this.standRoad == this.minRoad){
			if(this.standRoad.width > this.collisionWidth){
				if(this.direct){
				    if(this.node.x + this.width >= this.standRoad.x + this.standRoad.width){
					    this.isChangeDirect = true;
				    }
			   
			        if(this.isChangeDirect){
                        this.direct = false;
                    }
                }else{
				    if(this.node.x <= this.standRoad.x){
					    this.isChangeDirect = true;
				    }
			  
                    if(this.isChangeDirect){
                        this.direct = true;
                    }
                }
			}
		}else{
			if(this.direct){
			    if(this.maxRoad && this.maxRoad.isValid){
				    if(this.node.x + this.width >= this.maxRoad.x + this.maxRoad.width){
					    this.isChangeDirect = true;
				    }
			    }
            
			    if(this.isChangeDirect){
                    this.direct = false;
                }
            }else{
			    if(this.minRoad && this.minRoad.isValid){
				    if(this.node.x <= this.minRoad.x){
					    this.isChangeDirect = true;
				    }
			    }

                if(this.isChangeDirect){
                    this.direct = true;
                }
            }
		}
    },
	
	checkMoveDirect2(){
        if(this.inJump || this.isDrop || this.isCrazy){
            return;
        }
		
		if(this.standRoad && this.standRoad.isValid){
			if(this.standRoad.width <= this.minDirectWidth && !this.haveMoreStandRoad){
				return;
			}
		}
		
        if(this.direct){
            this.isChangeDirect = true;
            for(let key in this.rScripts){
				if(this.rScripts[key].isSpring){
					continue;
				}
				
				if(this.rScripts[key].IsCollisionUp){
                    if(cc.MathUtil.pointInRect({x:this.node.x + this.width,y:this.node.y - this.offsetWidth},this.rScripts[key].getRect(17))){
						this.isChangeDirect = false;
						break;
					}
                   
                }
            }
            if(this.isChangeDirect){
                this.direct = false;
            }
        }else{
            this.isChangeDirect = true;
            for(let key in this.rScripts){
				if(this.rScripts[key].isSpring){
					continue;
				}
				
				if(this.rScripts[key].IsCollisionUp){
                    if(cc.MathUtil.pointInRect({x:this.node.x,y:this.node.y - this.offsetWidth},this.rScripts[key].getRect(17))){
						this.isChangeDirect = false;
						break;
					}
                }
            }
            if(this.isChangeDirect){
                this.direct = true;
            }
        }  	
    },
	
	/*checkTurn(){
		this.moveSpeed = this.conf.MOVE_SPEED;
        if(Math.abs(cc.Player.getRect(4).y - this.getRect(4).y) <= 10 &&
            Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.attackLimmt){
				this.direct =  cc.Player.getRect(5).x > this.getRect(5).x;
				this.bg.scaleX = this.direct ? -1 : 1;
                this.moveSpeed = this.fastMoveSpeed;
        }
    },*/
	
	checkPigJump(){
		//cc.log(this.jumpSpeed);
        if(this.inJump || this.isDrop){
            return;
        }
		
       
        this.isChangeDirect = true;
        for(let key in this.rScripts){
		    if(!this.rScripts[key].IsCollisionUp){
                continue;
            }
			
			if(cc.MathUtil.pointInRect({x:this.node.x + this.width / 2,y:this.node.y - this.offsetWidth},this.rScripts[key].getRect(4))){
				this.isChangeDirect = false;
				break;
			}
        }
		
        if(this.isChangeDirect){
			this.moveSpeed = this.fastMoveSpeed;
			this.isJump = true;
        } 	
    },

    checkFrogJump (){
        if(this.inJump || this.isDrop || this.isCrazy){
            return;
        }
		
		this.jumpTime ++;
        if(this.jumpTime >= this.jumpLimmit){
			this.isJump = true;
            this.isDrop = false;
            this.isMove = true;
            this.anim.enabled = false;
            this.sprite.spriteFrame = this.frames[0];
            this.jumpLimmit = this.conf.START_LIMMIT + Math.round(Math.random()* this.conf.JUMP_LIMMIT);
            this.jumpSpeed = this.jumpMaxSpeed;
            this.jumpTime = 0;
			if(this.isPig){
				this.moveSpeed = this.fastMoveSpeed;
			}
        }
    },
	
	/*rotateFun(){
        if(this.direct){
            if(this.rotate < 360){
                this.rotate += this.rotateSpeed;
            }else {
                this.rotate = 0;
            }
        }else{
            if(this.rotate > 0){
                this.rotate -= this.rotateSpeed;
            }else {
                this.rotate = 360;
            }
        }
        
        this.bg.angle = this.rotate;
    },*/
	
	attack(){
        if(!this.isCrazy){
            return;
        }
		
		this.frameTime++;
        if (this.frameTime >= this.frameUpdateRate) {
			this.frameIndex ++;
			if(this.frameIndex == 5){
				this.addBullet();
			}
			
            if(this.frameIndex >= this.frameSize){
				this.frameIndex = 0;
			}
            
			this.sprite.spriteFrame = this.frames[this.frameIndex];
            this.frameTime = 0;
        }
    },
	
	addBullet(){
	    cc.GameUI.addObj(this.bulletUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y + this.node.height * 2 / 3;
            if(this.directCode == 1){
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
		        this.jumpSpeed = this.isJumpPig ? this.jumpMaxSpeed : 0;
			    this.isDrop = false;
                this.node.y = this.standRoad.y +this.standRoad.height;
            }
			
		    return;
		}else{
		    if(!this.isJump){
		        this.jumpSpeed = this.isJumpPig ? this.jumpMaxSpeed : 0;
			    this.isDrop = false;
                this.node.y = this.standRoad.y +this.standRoad.height;
            }
		}
          
		if(this.standRoad.Script.isMoveX){
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
			if(this.isRadish){
				this.setDrop();
			}
			
            this.isColor = true;
            this.colorIndex = 0;
            this.bg.color = this.color.fromHEX(conf.COLOR || '#F35252');
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

    changeColor(){
        if(!this.isColor){
			return;
		}
            
        this.colorIndex ++;
        if(this.colorIndex >= this.colorLimmit){
            this.bg.color = this.color.fromHEX('#FFFFFF');
            this.isColor = false;
            this.colorIndex = 0;
        }
    },
	
	flyX() {
        if (this.isScaleX) {
            this.bg.scaleX = this.direct ? -1 : 1;
        }
	
        if(this.direct){
            this.node.x += this.moveSpeed;   
        }else{
            this.node.x -= this.moveSpeed;
        }
    },
	
	move() {
        if(!this.isMove){
            return;
        }
        if (this.isScaleX) {
            this.bg.scaleX = this.direct ? -1 : 1;
        }
	
        if(this.direct){
            if(this.preRightRoad){
				if(this.isPig){
					//cc.log(this.preRightRoad.x,this.preRightRoad.Script.getRect(3).x);
					if(!this.inJump && !this.isDrop){
						this.isJump = true;
					    this.jumpSpeed = this.jumpMaxSpeed;
					}
				}
						
				//}else{
					if(this.node.x + this.width + this.moveSpeed <= this.preRightRoad.x){
                        this.node.x += this.moveSpeed;
                    }else{
                        this.direct = false; 
                    }
				//}
				
                
            }else{
                this.node.x += this.moveSpeed;   
            }
        }else{
            if(this.preLeftRoad){
				if(this.isPig){
					if(!this.inJump && !this.isDrop){
						this.isJump = true;
					    this.jumpSpeed = this.jumpMaxSpeed;
					}
				}
					
				//}else{
					if(this.node.x - this.moveSpeed >= this.preLeftRoad.x + this.preLeftRoad.width){
                        this.node.x -= this.moveSpeed;
                    }else{
                        this.direct = true;
                    }
				//}
				
            }else{
                this.node.x -= this.moveSpeed;
            }
        }
    },
	
	checkBox(){
		if(this.isDrop || this.isJump || this.isDeadDrop){
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
				this.setDeadDrop();
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
        }else{
			this.jumpSpeed = 0;
            this.isDrop = true;
            this.isJump = false;
        }
		
        if (this.preShakeRoad) {
            if (this.node.y + this.node.height + this.jumpSpeed < this.preShakeRoad.y) {
                this.node.y += this.jumpSpeed;
            } else {
				this.jumpSpeed = 0;
                this.isDrop = true;
                this.isJump = false;
            }
        } else {
            this.node.y += this.jumpSpeed;
        }
    },

    drop(){
        if(!this.isDrop){
            return;
        }
		
        if(this.jumpSpeed < this.dropMaxSpeed){
            this.jumpSpeed += this.dropIncrement;
        }else{
            this.jumpSpeed = this.dropMaxSpeed;
		}
		
        if(this.preStandRoad){
            if(this.node.y - this.jumpSpeed >= this.preStandRoad.y +this.preStandRoad.height ){
                this.node.y -= this.jumpSpeed;
            }else{
				
				if(this.preStandRoad.Script.isSpring){
					if(!cc.isPause){
						this.setMaxJump();
						this.preStandRoad.Script.setSpring();
					}
				}else{
				this.standRoad = this.preStandRoad;
				this.checkRoad();
				
				if(this.isTurn){
					this.roadMax = Object.keys(this.rScripts).length;
					this.minRoad = this.preStandRoad;
				    this.maxRoad = this.preStandRoad;
					this.maxFinishCount = 0; 
					this.minFinishCount = 0;
					this.checkMaxDirectRoad();
					this.checkMinDirectRoad();
				}
				
                switch (this.Type) {
					case cc.GameConfig.PREFAB_TYPE.GREENPIG[3]:
					    this.anim.enabled = true;
						if(!this.isJump){
							this.moveSpeed = this.normalMoveSpeed;
                            this.node.y = this.preStandRoad.y +this.preStandRoad.height;
                            this.jumpSpeed = 0;
                            this.isDrop = false;
							this.isJump = false;
							this.inJump = false;
                        }
					    break;
                    case cc.GameConfig.PREFAB_TYPE.FROG[3]:
					    this.anim.enabled = true;
						if(!this.isJump){
                            this.node.y = this.preStandRoad.y +this.preStandRoad.height;
                            this.jumpSpeed = 0;
							this.isMove = false;
                            this.isDrop = false;
							this.isJump = false;
							this.inJump = false;
                        }
					    break;
					case cc.GameConfig.PREFAB_TYPE.FROG2[3]:
					    this.bg.scaleX = this.direct ? -1 : 1;
						if(this.isCrazy){
						    this.jumpSpeed = this.jumpMaxSpeed;
							this.isDrop = false;
							this.isJump = true;
                            this.sprite.spriteFrame = this.frames[0];
							this.anim.enabled = false;
						}else{
							this.anim.enabled = true;
						    if(!this.isJump){
                                this.node.y = this.preStandRoad.y +this.preStandRoad.height;
                                this.jumpSpeed = 0;
							    this.isMove = false;
                                this.isDrop = false;
							    this.isJump = false;
							    this.inJump = false;
                            }
						}
					    break;
					case cc.GameConfig.PREFAB_TYPE.REDPIG[3]:
					    if(!this.isJump){ 
						    this.moveSpeed = this.normalMoveSpeed;
						    this.node.y = this.preStandRoad.y +this.preStandRoad.height;
                            this.jumpSpeed = this.jumpMaxSpeed;
                            this.isDrop = false;
							this.isJump = false;
						    this.inJump = false;
						}
						break;
				    case cc.GameConfig.PREFAB_TYPE.ANT[3]:
					case cc.GameConfig.PREFAB_TYPE.SCORPION[3]:
					case cc.GameConfig.PREFAB_TYPE.RINO[3]:
					case cc.GameConfig.PREFAB_TYPE.WOLF[3]:
					    this.checkStandCollection();
					    this.moveSpeed = this.normalMoveSpeed;
                        if(!this.isJump){
                            this.node.y = this.preStandRoad.y +this.preStandRoad.height;
                            this.jumpSpeed = 0;
                            this.isDrop = false;
							this.isJump = false;
							this.inJump = false;
                        }
					    break;
					case cc.GameConfig.PREFAB_TYPE.SNAKE[3]:
					case cc.GameConfig.PREFAB_TYPE.INSECT[3]:
			        case cc.GameConfig.PREFAB_TYPE.PIG[3]:
					case cc.GameConfig.PREFAB_TYPE.GREENPIG[3]:
					case cc.GameConfig.PREFAB_TYPE.ATTACKFLOWER[3]:
					case cc.GameConfig.PREFAB_TYPE.RADISH[3]:
					    this.moveSpeed = this.normalMoveSpeed;
                        if(!this.isJump){
                            this.node.y = this.preStandRoad.y +this.preStandRoad.height;
                            this.jumpSpeed = 0;
                            this.isDrop = false;
							this.isJump = false;
							this.inJump = false;
                        }
                        break;
                
                    default:
                        break;
                }
            }
			}
        }else{
            if(this.node.y > -this.height){
                this.node.y -= this.jumpSpeed;   
            }else{
                this.dead();
            }
        }
    },
	
	checkPigCollision(){
		for (let key in this.rScripts) {
            if (!this.rScripts[key].isActive) {
                continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue;
			}
			
			if (!cc.MathUtil.pointDistance(this.getRect(5), this.rScripts[key].getRect(5), this.getRect(5).r + this.rScripts[key].getRect(5).r)) {
                continue;
            }
            
			if (this.rScripts[key].IsCollisionUp) {
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
        }
	},
	
	checkFlowerCollision(){
		if(this.preStandRoad){
			return;
		}
		
		for (let key in this.rScripts) {
            if (!this.rScripts[key].isActive) {
                continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue;
			}
            
			if (this.rScripts[key].IsCollisionUp) {
				if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(0))) {
					if(this.getRect(4).y >=  this.rScripts[key].getRect(4).y + this.rScripts[key].signHeight){
						this.preStandRoad = this.rScripts[key].node;
                        continue;
				    }
                }	
            }
        }
	},
	
	checkSnakeCollision(){
		if(!this.standRoad){
			for (let key in this.rScripts) {
            if (!this.rScripts[key].isActive) {
                continue;
            }
			
			if(this.rScripts[key].isBullet){
				continue;
			}
			
			if(this.rScripts[key].isWood){
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

            //if (this.rScripts[key].IsCollisionDown && this.IsCheckUp && !this.preShakeRoad) {
			if (this.rScripts[key].IsCollisionDown) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(2))) {
                    this.preShakeRoad = this.rScripts[key].node;
                    continue;
                }
            } 

            //if (this.rScripts[key].IsCollisionRight && this.IsCheckLeft && !this.preLeftRoad) {
			if (this.rScripts[key].IsCollisionRight) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(1))) {
					this.preLeftRoad = this.rScripts[key].node;
					continue;
                }
            }

            //if (this.rScripts[key].IsCollisionLeft && this.IsCheckRight && !this.preRightRoad) {
			if (this.rScripts[key].IsCollisionLeft) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(3))) {
					this.preRightRoad = this.rScripts[key].node;	
				    continue;
                }
            } 
            }
		}else{
			for (let key in this.curRoads) {
            if (!this.curRoads[key].isActive) {
                continue;
            }
			
			if(this.curRoads[key].isBullet){
				continue;
			}
			
			if(this.curRoads[key].isWood){
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

            //if (this.curRoads[key].IsCollisionDown && this.IsCheckUp && !this.preShakeRoad) {
			if (this.curRoads[key].IsCollisionDown) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.curRoads[key].getRect(2))) {
                    this.preShakeRoad = this.curRoads[key].node;
                    continue;
                }
            } 

            //if (this.curRoads[key].IsCollisionRight && this.IsCheckLeft && !this.preLeftRoad) {
			if (this.curRoads[key].IsCollisionRight) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.curRoads[key].getRect(1))) {
					this.preLeftRoad = this.curRoads[key].node;
					continue;
                }
            }

            //if (this.curRoads[key].IsCollisionLeft && this.IsCheckRight && !this.preRightRoad) {
			if (this.curRoads[key].IsCollisionLeft) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.curRoads[key].getRect(3))) {
					this.preRightRoad = this.curRoads[key].node;	
				    continue;
                }
            } 
            }
		}
	},
	
	checkCollision(){
		if(!this.standRoad){
			for (let key in this.rScripts) {
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

            //if (this.rScripts[key].IsCollisionDown && this.IsCheckUp && !this.preShakeRoad) {
			if (this.rScripts[key].IsCollisionDown) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(2))) {
                    this.preShakeRoad = this.rScripts[key].node;
                    continue;
                }
            } 

            //if (this.rScripts[key].IsCollisionRight && this.IsCheckLeft && !this.preLeftRoad) {
			if (this.rScripts[key].IsCollisionRight) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(1))) {
					this.preLeftRoad = this.rScripts[key].node;
					continue;
                }
            }

            //if (this.rScripts[key].IsCollisionLeft && this.IsCheckRight && !this.preRightRoad) {
			if (this.rScripts[key].IsCollisionLeft) {
                if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(3))) {
					this.preRightRoad = this.rScripts[key].node;	
				    continue;
                }
            } 
            }
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
	
	checkStandCollection(){
		this.haveMoreStandRoad = false;
		for (let key in this.rScripts) {
            if (!this.rScripts[key].isActive) {
                continue;
            }
			    
			if(this.rScripts[key].isBullet){
				 continue;
			}
			
			if(this.rScripts[key].node.uuid == this.standRoad.uuid){
				 continue;
			}
			
			if(this.rScripts[key].getRect(4).y != this.standRoad.Script.getRect(4).y){
				continue;
			}
			
			if (cc.MathUtil.rectInRect(this.standRoad.Script.getRect(4), this.rScripts[key].getRect(4))) {
				this.haveMoreStandRoad = true;
				continue;
            }  
        }
	},

    checkObj(){
		if (this.standRoad) {
            if (!this.standRoad || !this.standRoad.isValid || this.standRoad.Script.isBullet) {
                if (!this.isJump) {
                    this.isDrop = true;
                }
                this.standRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.node,this.standRoad.Script.getRect(0))) {
                    if (!this.isJump) {
                        this.isDrop = true;
                    }
                    this.standRoad = null;
                }
            }
        }
		
        if (this.preStandRoad) {
            if (!this.preStandRoad || !this.preStandRoad.isValid || this.preStandRoad.Script.isBullet) {
                if (!this.isJump) {
                    this.isDrop = true;
                }
                this.preStandRoad = null;
            } else {
                if (!cc.MathUtil.rectInRect(this.node,this.preStandRoad.Script.getRect(0))) {
                    if (!this.isJump) {
                        this.isDrop = true;
                    }
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
        delete this.mScripts[this.node.uuid];
        this.node.destroy();
    },

    getRect(type) {
		if(!this.isReady || !this.isActive){
			return {};
		}
		
		this.initRectPosition();
        switch (type) {
            case 0:return this.rectU;
            case 1:return this.rectL;
            case 2:return this.rectD;
            case 3:return this.rectR;
            case 4:return this.rectM;
            case 5:return this.rectP;
			case 8: return this.rectM2;
		    case 10: return this.rectT;

            default:
                break;
        }
    },
});
