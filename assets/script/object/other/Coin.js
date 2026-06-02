//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		Type: '',
		textLabel: cc.Label,
	},

	setConfig() { },

	start() {
		this.conf = cc.ObjConfig.OTHER[this.Type];
		this.width = this.node.width;
		this.height = this.node.height;

		this.bg = this.node.getChildByName('bg');
		this.bg2 = this.node.getChildByName('bg2');
		//this.sprite = this.bg.getComponent(cc.Sprite);
		//this.anim = this.bg.getComponent(cc.Animation);
		this.initBaseParam();

		if (this.Type == "coin") {
			this.isCoin = true;
			this.startY = this.node.y + this.node.height;
			this.jumpSpeed = this.conf.JUMP_MAX_SPEED;
			this.increment = this.conf.JUMP_INCREMENT;
		} else if (this.Type == "noteCoin") {
			this.isNote = true;
			this.isDrop = true;
			this.jumpMaxSpeed = this.conf.DROP_MAX_SPEED;
			this.jumpSpeed = this.conf.DROP_START_SPEED;
			this.increment = this.conf.DROP_INCREMENT;
		}
	},

	initBaseParam() {
		this.offsetX = cc.GameConfig.CONSTANT.OFFSET_X;
		this.offsetY = cc.GameConfig.CONSTANT.OFFSET_Y;
		this.offsetWidth = cc.GameConfig.CONSTANT.OFFSET_WIDTH;
		this.offsetHeight = cc.GameConfig.CONSTANT.OFFSET_HEIGHT;

		this.width = this.node.width;
		this.height = this.node.height;
		this.widthP = this.width / 2;
		this.heightP = this.height / 2;

		this.rectM = {};
		this.initRectPosition();
		this.initRectSize();
	},

	initRectPosition() {
		this.rectM['x'] = this.node.x + this.offsetY;
		this.rectM['y'] = this.node.y + this.offsetX;
	},

	initRectSize() {
		this.rectM['width'] = this.width - this.offsetHeight;
		this.rectM['height'] = this.height - this.offsetWidth;
	},

	setFly(value) {
		if (this.isFly) {
			return;
		}

		cc.AudioMgr.playSound('eatFood');
		this.textLabel.node.active = true;
		this.textLabel.string = `+${value}`;

		this.bg.active = false;
		this.bg2.active = true;

		if (this.isCoin) {
			this.jumpSpeed = this.conf.JUMP_MAX_SPEED;
		} else if (this.isNote) {
			this.isDrop = false;
			this.jumpSpeed = this.conf.JUMP_MAX_SPEED;
			this.increment = this.conf.JUMP_INCREMENT;
		}

		cc.UILayer.updateValue('coin', value);
		cc.Utils.addScore(this.getRect(4), this.conf.SCORE);

		if (!cc.Player.isMagnet) {
			//cc.AudioMgr.playSound('eatFood');
		}

		this.isMagnet = false;
		this.isDrop = false;
		this.node.zIndex = cc.GameConfig.PREFAB_TYPE.COIN[5];

		this.isFly = true;
	},

	update(dt) {
		if (cc.isPause) {
			return;
		}

		if (this.isFly) {
			this.fly();
		} else {
			this.checkPlayer();
			this.checkMagnet();


			if (this.isNote) {
				this.drop();
			}

		}
	},

	checkMagnet() {
		if (!cc.Player || !cc.Player.isMagnet) {
			this.isMagnet = false;
			this.isDrop = !this.isMagnet;
			return;
		}

		this.distance = Math.sqrt(Math.pow(cc.Player.getRect(5).x - this.node.x, 2) + Math.pow(cc.Player.getRect(5).y - this.node.y, 2));
		this.isMagnet = this.distance <= cc.Player.magnetLimmit;
		this.isDrop = !this.isMagnet;

		this.magnet();
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

	drop() {
		if (!this.isDrop) {
			return;
		}

		if (this.jumpSpeed < this.jumpMaxSpeed) {
			this.jumpSpeed += this.increment;
		} else {
			this.jumpSpeed = this.jumpMaxSpeed;
		}

		this.node.y -= this.jumpSpeed;
		if (this.node.y + this.height < cc.CameraMgr.getDrawRect().y) {
			this.dead();
		}
	},

	/*move(){
		if(!this.isMove){
			return;
		}
		
		this.timeX ++;
		if(this.timeX >= this.limmitX){
			this.random = Math.round(Math.random() * 1000);
			this.directX = this.random % 3 > 1;
			this.limmitX = this.conf.LIMMIT + Math.round(Math.random() * this.conf.RANDOM_LIMMIT);
			this.timeX = 0;
		}
		
		this.timeY ++;
		if(this.timeY >= this.limmitY){
			this.random = Math.round(Math.random() * 1000);
			this.directY = this.random % 3 > 1;
			this.limmitY = this.conf.LIMMIT + Math.round(Math.random() * this.conf.RANDOM_LIMMIT);
			this.timeY = 0;
		}
		
		if(this.directX){
			if(this.node.x + this.bg.width + this.moveSpeedX <= cc.Layer.node.width){
				this.node.x += this.moveSpeedX;
			}else{
				this.directX = false;
			}
		}else{
			if(this.node.x - this.moveSpeedX >= 0){
				this.node.x -= this.moveSpeedX;
			}else{
				this.directX = true;
			}
		}
		
		if(this.directY){
			if(this.node.y + this.bg.height + this.moveSpeedY <= cc.Layer.node.height){
				this.node.y += this.moveSpeedY;
			}else{
				this.directY = false;
			}
		}else{
			if(this.node.y - this.moveSpeedY >= 0){
				this.node.y -= this.moveSpeedY;
			}else{
				this.directY = true;
			}
		}
		
		this.bg.scaleX = this.directX ? -1 : 1;
	},*/

	fly() {
		this.jumpSpeed -= this.increment;
		if (this.jumpSpeed <= 0) {
			this.dead();
		} else {
			this.node.y += this.jumpSpeed;
			if (this.node.y >= this.startY) {
				this.node.zIndex = 20;
			}
		}
	},

	checkPlayer() {
		if (!cc.Player) {
			return;
		}

		if (cc.MathUtil.rectInRect(this.node, cc.Player.getRect(4))) {
			this.setFly(1);
		}
	},

	dead() {
		this.node.destroy();
	},

	getRect(type) {
		if (this.Type == "noteCoin") {
			this.initRectPosition();
		}
		switch (type) {
			case 4: return this.rectM;
			default:
				break;
		}
	},
});
