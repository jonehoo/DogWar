//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',
    },
	//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999

	setConfig (conf) {
	    if(conf.OtherType1 == 'VARIABLE_WIDTH'){
		    this.node.width = conf.Width;
		    this.initBaseParam();
	    }else if(conf.OtherType1 == 'VARIABLE_HEIGHT'){
		    this.node.height = conf.Height;
			this.initBaseParam();
		}
		
	    switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.THORNBALL[3]:
				this.timeLImmit = conf.Limmit;
				this.moveSpeed = conf.MoveSpeed;
				if(conf.OtherType1 == 'TIME_X'){
					this.moveType = 0;
					this.direct = conf.DirectionX;
				}else{
					this.moveType = 1;
					this.direct = conf.DirectionY;
				}
				
				this.isReady = true;
                break;
			
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN1[3]:
				this.attackLimmitX = conf.Num;
				this.attackLimmitY = conf.Num2;
				this.fireIncrement = conf.JumpIncrement;
				this.fireSpeed = conf.JumpSpeed;
				
				this.isReady = true;
                break;
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN2[3]:
				this.attackLimmitX = conf.Num;
				this.attackLimmitY = conf.Num2;
				this.fireIncrement = conf.JumpIncrement;
				this.fireSpeed = conf.JumpSpeed;
				
				this.isReady = true;
                break;
            case cc.GameConfig.PREFAB_TYPE.FIRETHORN3[3]:
				this.attackLimmitX = conf.Num;
				this.attackLimmitY = conf.Num2;
				this.fireIncrement = conf.JumpIncrement;
				this.fireMaxSpeed = conf.JumpSpeed;
				
				this.isReady = true;
                break;
				
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN4[3]:
				this.attackLimmitX = conf.Num;
				this.attackLimmitY = conf.Num2;
				this.fireIncrement = conf.JumpIncrement;
				this.fireSpeed = conf.JumpSpeed;
				
				this.isReady = true;
				break;
			case cc.GameConfig.PREFAB_TYPE.SAW2[3]:
				this.timeLImmit = conf.Limmit;
				this.moveSpeed = conf.MoveSpeed;
				if(conf.OtherType1 == 'TIME_X'){
					this.moveType = 0;
					this.direct = conf.DirectionX;
				}else{
					this.moveType = 1;
					this.direct = conf.DirectionY;
				}
				
				this.isReady = true;
                break;
			case cc.GameConfig.PREFAB_TYPE.AXE[3]:
				this.direct = conf.DirectionX;
                break;

            default:
                break;
        }
    },
	
	start(){
		this.init();
	},
	
	update() {
		if(cc.isPause || !cc.Player){
			return;
		}
		
		this.checkPlayer();
		switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN1[3]:
			    if(!this.isReady){
					return;
			    }
				
			    this.checkFire(1);
                this.fireMove(1);
                break;
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN2[3]:
			    if(!this.isReady){
					return;
			    }
				
			    this.checkFire(2);
                this.fireMove(2);
                break;
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN3[3]:
			    if(!this.isReady){
					return;
			    }
				
			    this.checkFire(3);
                this.fireMove(3);
                break;
            case cc.GameConfig.PREFAB_TYPE.FIRETHORN4[3]:
			    if(!this.isReady){
					return;
			    }
				
			    this.checkFire(4);
                this.fireMove(4);
                break;
				
			case cc.GameConfig.PREFAB_TYPE.AXE[3]:
			    this.checkTime();
                break;
				
			case cc.GameConfig.PREFAB_TYPE.THORNBALL[3]:
			    this.timeMove();
				this.shake();
                break;
			case cc.GameConfig.PREFAB_TYPE.SAW[3]:
			    this.rotate();
                break;
			case cc.GameConfig.PREFAB_TYPE.SAW2[3]:
			    if(!this.isReady){
					return;
			    }
				
				this.timeMove();
			    this.rotate();
                break;

            default:
                break;
        }
	},
	
	init(){
		this.conf = cc.ObjConfig.THORN[this.Type];
		//cc.log(this.Type,this.conf);
		if(!this.conf.IS_POINT){
			this.initBaseParam();
		}
		
		switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.THORNBALL[3]:
			    this.direct2 = true;
		        this.direct3 = false;
				this.timeCount = 0;
				this.shakeMaxSpeed = this.conf.SHAKE_MAX_SPEED;
				this.shakeIncrement = this.conf.SHAKE_INCREMENT;
				this.shakeSpeed = this.shakeMaxSpeed;
                break;
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN1[3]:
			    this.isFire = false;
				//this.fireSpeed = 0;
                break;
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN2[3]:
			    this.isFire = false;
				//this.fireSpeed = 0;
                break;
            case cc.GameConfig.PREFAB_TYPE.FIRETHORN3[3]:
			    this.isFire = false;
				this.fireSpeed = 0;
                break;
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN4[3]:
			    this.isFire = false;
				//this.fireSpeed = 0;
                break;
			case cc.GameConfig.PREFAB_TYPE.AXE[3]:
			    this.bg = this.node.getChildByName('bg');
			    this.directCode = 0;
			    this.timeCount = 0;
				this.timeLimmit = this.conf.TIME_LIMMIT;
			    this.rScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.ROAD);
				this.checkParentRoad();
                break;
			case cc.GameConfig.PREFAB_TYPE.SAW[3]:
			    this.bg = this.node.getChildByName('bg');
			    this.isRotate = true;
			    this.directCode = 0;
			    this.rotateSpeed = this.conf.ROTATE_SPEED;
                break;
			case cc.GameConfig.PREFAB_TYPE.SAW2[3]:
			    this.bg = this.node.getChildByName('bg');
			    this.isRotate = true;
			    this.directCode = 0;
			    this.rotateSpeed = this.conf.ROTATE_SPEED;
			    this.timeCount = 0;
                break;

            default:
                break;
        }
	},
	
	initBaseParam(){
		this.offsetX = cc.GameConfig.CONSTANT.OFFSET_X;
		this.offsetY = cc.GameConfig.CONSTANT.OFFSET_Y;
		this.offsetWidth = cc.GameConfig.CONSTANT.OFFSET_WIDTH;
		this.offsetHeight = cc.GameConfig.CONSTANT.OFFSET_HEIGHT;
		
		this.width = this.node.width;
		this.height = this.node.height;
		this.widthP = this.width / 2;
		this.heightP = this.height / 2;
		
        this.rectM = {};
		this.rectP = {};
		this.initRectPosition();
		this.initRectSize();
	},
	
	initRectPosition(){
		this.rectM['x'] = this.node.x + this.offsetY;
		this.rectM['y'] = this.node.y + this.offsetX;
		
		this.rectP['x'] = this.node.x + this.widthP;
        this.rectP['y'] = this.node.y + this.heightP;
	},
	
	initRectSize(){
		this.rectM['width'] = this.width - this.offsetHeight;
		this.rectM['height'] = this.height - this.offsetWidth;
		
		this.rectP['r'] = this.width / 2 + this.height / 2;
	},
	
	checkParentRoad(){
		for(let key in this.rScripts){
			if(!this.rScripts[key].isStoneRoad){
				continue;
			}
			
			if(cc.MathUtil.rectInRect(this.rScripts[key].getRect(17), this.getRect(4))) {
			     this.parentRoadScript = this.rScripts[key];
				 break;
		    }
		}
	},
	
	checkTime(){
		this.timeCount ++;
		if(this.timeCount >= this.timeLimmit){
			this.changePos();
			this.timeCount = 0;
		}
	},
	
	changePos(){
		if(this.direct){
			this.directCode ++;
			if(this.directCode == 1){
				this.direct = false;
			}
		}else{
			this.directCode --;
			if(this.directCode == -1){
				this.direct = true;
			}
		}
		
		if(this.directCode == -1){
			this.bg.angle = 90;
			this.node.x = this.parentRoadScript.getRect(4).x - this.width;
			this.node.y = this.parentRoadScript.getRect(5).y - this.heightP;
		}else if(this.directCode == 0){
			this.bg.angle = 0;
			this.node.x = this.parentRoadScript.getRect(5).x - this.widthP;
			this.node.y = this.parentRoadScript.getRect(4).y + this.parentRoadScript.getRect(4).height;
		}else if(this.directCode == 1){
			this.bg.angle = -90;
			this.node.x = this.parentRoadScript.getRect(4).x + this.parentRoadScript.getRect(4).width;
			this.node.y = this.parentRoadScript.getRect(5).y - this.heightP;
		}
		
		this.initRectPosition();
	},
	
	checkFire(code){
		if(this.isFire){
			return;
		}
		
		if(code == 1){
			if(cc.Player.getRect(5).y < this.getRect(5).y){
				return;
			}
			
			if(Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.attackLimmitX  && cc.Player.getRect(5).y - this.getRect(5).y <= this.attackLimmitY){
				this.isFire = true;
			}else{
				this.isFire = false;
			}
			
			return;
		} 
		
		if(code == 2){
			if(cc.Player.getRect(5).x < this.getRect(5).x){
				return;
			}
			
			if(Math.abs(cc.Player.getRect(5).y - this.getRect(5).y) <= this.attackLimmitY  && cc.Player.getRect(5).x - this.getRect(5).x <= this.attackLimmitX){
				this.isFire = true;
			}else{
				this.isFire = false;
			}
			
			return;
		} 
		
		if(code == 3){
			if(cc.Player.getRect(5).y > this.getRect(5).y){
				return;
			}
			
			if(Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.attackLimmitX  && this.getRect(5).y - cc.Player.getRect(5).y <= this.attackLimmitY){
				this.isFire = true;
			}else{
				this.isFire = false;
			}
			
			return;
		}
		
		if(code == 4){
			if(cc.Player.getRect(5).x > this.getRect(5).x){
				return;
			}
			
			if(Math.abs(cc.Player.getRect(5).y - this.getRect(5).y) <= this.attackLimmitY  && this.getRect(5).x - cc.Player.getRect(5).x <= this.attackLimmitX){
				this.isFire = true;
			}else{
				this.isFire = false;
			}
			
			return;
		}
	},
	
	fireMove(code){
		if(!this.isFire){
			return;
		}
		
		if(code == 1){
			this.node.y += this.fireSpeed;
			if(this.node.y > cc.CameraMgr.getDrawRect().y + cc.CameraMgr.getDrawRect().height){
				this.dead();
			}
	
			return;
		} 
		
		if(code == 2){
			this.node.x += this.fireSpeed;
			if(this.node.x > cc.CameraMgr.getDrawRect().x + cc.CameraMgr.getDrawRect().width){
				this.dead();
			}
			
			return;
		} 
		
		if(code == 3){
			if(this.fireSpeed <= this.fireMaxSpeed){
				this.fireSpeed += this.fireIncrement;
			}else{
				this.fireSpeed = this.fireMaxSpeed;
			}
			
			this.node.y -= this.fireSpeed;
			if(this.node.y < cc.CameraMgr.getDrawRect().y){
				this.dead();
			}
			
			return;
		}
		
		if(code == 4){
			this.node.x -= this.fireSpeed;
			if(this.node.x < cc.CameraMgr.getDrawRect().x){
				this.dead();
			}
			
			return;
		}
	},
	
	checkPlayer(){
	    if(cc.Player.isFlicker || cc.Player.isHide || cc.Player.isShield || cc.Player.isInvincible){
            return;
        }
		
		if(cc.MathUtil.rectInRect(cc.Player.getRect(4), this.getRect(4))) {
			cc.Player.hurt(this.conf.HURT);
		}
    },
	
	timeMove(){
		this.timeCount ++;
		if(this.timeCount >= this.timeLImmit){
			this.direct = !this.direct;
			this.timeCount = 0;
		}
		
		if(this.direct){
			if(this.moveType == 0){
				this.node.x += this.moveSpeed;
			}else{
				this.node.y += this.moveSpeed;
			}
		}else{
			if(this.moveType == 0){
				this.node.x -= this.moveSpeed;
			}else{
				this.node.y -= this.moveSpeed;
			}
		}
	},
	
	shake(){
		if(this.direct2){
			if(this.direct3){
				if(this.shakeSpeed < this.shakeMaxSpeed){
				    this.shakeSpeed += this.shakeIncrement;
		        }else{
				    this.shakeSpeed = this.shakeMaxSpeed;
					this.direct3 = false;
			    }
			}else{
				if(this.shakeSpeed > 0){
				    this.shakeSpeed -= this.shakeIncrement;
		        }else{
				    this.shakeSpeed = 0;
					this.direct3 = true;
					this.direct2 = false;
			    }
			}
			
			if(this.moveType == 0){
				this.node.y += this.shakeSpeed;
			}else{
                this.node.x += this.shakeSpeed; 				
			}
		}else{
			
			if(this.direct3){
				if(this.shakeSpeed < this.shakeMaxSpeed){
				    this.shakeSpeed += this.shakeIncrement;
		        }else{
				    this.shakeSpeed = this.shakeMaxSpeed;
					this.direct3 = false;
			    }
			}else{
				if(this.shakeSpeed > 0){
				    this.shakeSpeed -= this.shakeIncrement;
		        }else{
				    this.shakeSpeed = 0;
					this.direct3 = true;
					this.direct2 = true;
			    }
			}
			
			if(this.moveType == 0){
				this.node.y -= this.shakeSpeed;
			}else{
                this.node.x -= this.shakeSpeed; 				
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
	
	dead(){
		this.node.destroy();
	},
	
	getRect(type) {
        switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN1[3]:
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN2[3]:
			case cc.GameConfig.PREFAB_TYPE.FIRETHORN3[3]:
            case cc.GameConfig.PREFAB_TYPE.FIRETHORN4[3]:
			case cc.GameConfig.PREFAB_TYPE.THORNBALL[3]:
                this.initRectPosition();
                break;

            default:
                break;
        }

        switch (type) {
            case 4: return this.rectM;
			case 5: return this.rectP;
            default:
                break;
        }
    },
});
