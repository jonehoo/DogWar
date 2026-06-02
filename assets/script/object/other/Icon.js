//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		Type: '',
	},

	setConfig(config) {
		this.config = config;
		//this.Id = config.Id;
	},

	start() {
		this.conf = cc.ObjConfig.OTHER[this.Type];
		this.jumpSpeed = this.conf.JUMP_MAX_SPEED;
		this.increment = this.conf.JUMP_INCREMENT;

		this.isFly = false;
		this.isMagnet = false;

		if (this.Type == "starIcon") {
			this.isStar = true;
		} else if (this.Type == "shieldIcon") {
			this.isShield = true;
		} else if (this.Type == "clockIcon") {
			this.isClock = true;
			this.clockCount = 0;
			this.clockTime = this.conf.STOP_TIME;
			this.mScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.MONSTER);
			this.fmScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.FLYMONSTER);
		} else if (this.Type == "waterIcon") {
			this.isWater = true;
			this.mScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.MONSTER);
			this.fmScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.FLYMONSTER);
		} else if (this.Type == "magnetIcon") {
			this.isMagnetIcon = true;
			this.mScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.MONSTER);
			this.fmScript = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.FLYMONSTER);
		} else if (this.Type == "noteIcon") {
			this.isNoteIcon = true;
		}

		this.bg = this.node.getChildByName('bg');
		this.bg.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.6, 1.2), cc.scaleTo(0.8, 1))));
		this.pScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.POINT);
	},

	update(dt) {
		//if(this.isFly){
		//this.fly();
		//}else{
		this.checkPlayer();
		this.checkmagnet();
		//}
	},

	/*fly(){
		this.jumpSpeed -= this.increment;
		if(this.jumpSpeed <= 0){
			this.dead();
		}else{
			this.node.y += this.jumpSpeed;
		}
	},*/

	checkmagnet() {
		if (!cc.Player || !cc.Player.isMagnet) {
			return;
		}

		this.distance = Math.sqrt(Math.pow(cc.Player.getRect(5).x - this.node.x, 2) + Math.pow(cc.Player.getRect(5).y - this.node.y, 2));
		this.isMagnet = this.distance <= cc.Player.magnetLimmit;

		this.magnet();
	},

	checkPlayer() {
		if (!cc.Player || cc.Player.isFly) {
			return;
		}

		if (cc.MathUtil.rectInRect(this.node, cc.Player.getRect(4))) {
			//cc.AudioMgr.playSound('eatIcon');
			this.setFly();
		}
	},

	magnet() {
		if (!this.isMagnet) {
			return;
		}


		this.speedX = (cc.Player.getRect(5).x - this.node.x) / (this.distance / 20);
		this.speedY = (cc.Player.getRect(5).y - this.node.y) / (this.distance / 20);
		this.node.x += this.speedX;
		this.node.y += this.speedY;
	},

	setClockMonster() {
		for (let key in this.mScript) {
			if (this.mScript[key].isDead) {
				continue;
			}

			this.mScript[key].setClock(true, this.clockTime);
		}

		for (let key in this.fmScript) {
			if (this.fmScript[key].isDead) {
				continue;
			}

			this.fmScript[key].setClock(true, this.clockTime);
		}
	},

	setSlow() {
		this.clockCount = 0;
		for (let key in this.mScript) {
			if (this.mScript[key].isDead) {
				continue;
			}

			this.mScript[key].setSlow(true, this.conf);
		}

		for (let key in this.fmScript) {
			if (this.fmScript[key].isDead) {
				continue;
			}

			this.fmScript[key].setSlow(true, this.conf);
		}
	},

	setFly() {
		if (this.isStar) {
			cc.Player.setInvincible(this.conf);
		} else if (this.isShield) {
			cc.Player.setShield(this.conf);
		} else if (this.isClock) {
			this.setClockMonster();
		} else if (this.isWater) {
			this.setSlow();
		} else if (this.isMagnetIcon) {
			cc.Player.setMagnet(this.conf);
		} else if (this.isNoteIcon) {
			cc.Player.setNote(this.conf, this.config.Num);
		}

		for (let key in this.pScripts) {
			if (this.pUid == this.pScripts[key].node.uuid) {
				this.pScripts[key].reduce(1);
				break;
			}
		}

		cc.AudioMgr.playSound('eatFood');
		cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE.COLLECTBLAST, { x: this.node.x, y: this.node.y, width: this.node.width, height: this.node.height }, cc.GameConfig.POS_TYPE.MIDDLE);
		this.dead();
	},

	dead() {
		this.node.destroy();
	},
});
