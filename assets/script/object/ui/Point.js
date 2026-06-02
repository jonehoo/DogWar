//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		Type: 'NO',
		OtherType1: 'NO',
		OtherType2: 'NO',
		OtherType3: 'NO',
		Time: 0,
		MaxNum: 0,
		Num: 0,
		Num2: 0,
		Num3: 0,
		MoveSpeed: 0,
		JumpSpeed: 0,
		RotateSpeed: 0,
		MoveIncrement: 0,
		JumpIncrement: 0,
		RotateAngle: 0,
		DirectionX: true,
		DirectionY: true,
		Width: 0,
		Height: 0,
		Radius: 0,
		Range: 0,
		Limmit: 0,
		CollisionDis: 400,
		IsCheckInit: true,
		IsCheckRect: true,
		IsInfinite: false,
		IsOnce: false,
		IsConf: false,
		IsBlast: false,
		IsSkin: false,
		IsDialog: false,
		IsDirectPlayer: false,
		Auto: true,
		CanEnter: true,
		//NoWood: false,
		Id: '',
		CloseId: '',
		TargertId: '',
		TargertLayer: '',
		IsMainLayer: true,
		IsPos: false,
	},
	//电子邮件puhalskijsemen@gmail.com
	//源码网站 开vpn全局模式打开 http://web3incubators.com/
	//电报https://t.me/gamecode999

	setConf(conf) {
		this.Type = conf.Type;
		this.Time = conf.Time;
		this.MaxNum = conf.MaxNum;
		this.IsCheckInit = conf.IsCheckInit;
		this.IsCheckRect = conf.IsCheckRect;
		this.IsInfinite = conf.IsInfinite;
		this.IsOnce = conf.IsOnce;
		this.IsConf = conf.IsConf;
		this.IsBlast = conf.IsBlast;
		this.IsSkin = conf.IsSkin;
		this.IsPos = conf.IsPos;
		this.Id = conf.Id;
		this.config = {
			'Type': conf.Type,
			'OtherType1': conf.OtherType1,
			'OtherType2': conf.OtherType2,
			'OtherType3': conf.OtherType3,
			'Time': conf.Time,
			'Num': conf.Num,
			'Num2': conf.Num2,
			'Num3': conf.Num3,
			'MaxNum': conf.MaxNum,
			'MoveSpeed': conf.MoveSpeed,
			'JumpSpeed': conf.JumpSpeed,
			'RotateSpeed': conf.RotateSpeed,
			'MoveIncrement': conf.MoveIncrement,
			'JumpIncrement': conf.JumpIncrement,
			'RotateAngle': conf.RotateAngle,
			'DirectionX': conf.DirectionX,
			'DirectionY': conf.DirectionY,
			'Width': conf.Width,
			'Height': conf.Height,
			'Radius': conf.Radius,
			'Range': conf.Range,
			'Limmit': conf.Limmit,
			'CollisionDis': conf.CollisionDis,
			'IsCheckInit': conf.IsCheckInit,
			'IsCheckRect': conf.IsCheckRect,
			'IsInfinite': conf.IsInfinite,
			'IsOnce': conf.IsOnce,
			'IsConf': conf.IsConf,
			'IsBlast': conf.IsBlast,
			'IsSkin': conf.IsSkin,
			'IsDialog': conf.IsDialog,
			'IsDirectPlayer': conf.IsDirectPlayer,
			'Auto': conf.Auto,
			'CanEnter': conf.CanEnter,
			'NoWood': conf.NoWood,
			'Id': conf.Id,
			'CloseId': conf.CloseId,
			'TargertId': conf.TargertId,
			'TargertLayer': conf.TargertLayer,
			'IsMainLayer': conf.IsMainLayer,
			'IsPos': conf.IsPos,
		}

		this.init();
	},

	start() {
		/*this.config = {
			'Type' : this.Type,
			'OtherType1': this.OtherType1,
			'OtherType2' : this.OtherType2,
			'OtherType3' : this.OtherType3,
			'Time' : this.Time,
			'Num' : this.Num,
			'Num2' : this.Num2,
			'Num3' : this.Num3,
			'MaxNum': this.MaxNum,
			'MoveSpeed' : this.MoveSpeed,
			'JumpSpeed' : this.JumpSpeed,
			'RotateSpeed' : this.RotateSpeed,
			'MoveIncrement' : this.MoveIncrement,
			'JumpIncrement': this.JumpIncrement,
			'RotateAngle': this.RotateAngle,
			'DirectionX': this.DirectionX,
			'DirectionY': this.DirectionY,
			'Width': this.Width,
			'Height': this.Height,
			'Radius': this.Radius,
			'Range': this.Range,
			'Limmit': this.Limmit,
			'CollisionDis': this.CollisionDis,
			'IsCheckInit': this.IsCheckInit,
			'IsCheckRect': this.IsCheckRect,
			'IsInfinite': this.IsInfinite,
			'IsOnce': this.IsOnce,
			'IsConf': this.IsConf,
			'IsBlast': this.IsBlast,
			'IsSkin': this.IsSkin,
			'IsDialog': this.IsDialog,
			'IsDirectPlayer': this.IsDirectPlayer,
			'Auto': this.Auto,
			'CanEnter': this.CanEnter,
			'NoWood': this.NoWood,
			'Id': this.Id,
			'CloseId': this.CloseId,
			'TargertId': this.TargertId,
			'TargertLayer': this.TargertLayer,
			'IsMainLayer': this.IsMainLayer,
			'IsPos': this.IsPos,
		}
		this.init();*/
	},

	init() {
		this.count = 0;
		this.index = 0;
		this.isInit = !this.IsCheckInit;
		this.checkStar();
		if (this.isReviewStar) {
			this.prefabConf = cc.GameConfig.PREFAB_TYPE.COIN;
		} else {
			this.prefabConf = cc.GameConfig.PREFAB_TYPE[this.Type];
			this.checkBoss();
		}
	},

	checkBoss() {
		if (this.prefabConf[2] == cc.GameConfig.OBJ_TYPE.BOSS) {
			cc.BossNum++;
		}
	},

	checkStar() {
		if (this.Type != 'STAR') {
			return;
		}

		this.isReviewStar = cc.whole.checkStarId(this.Id);
	},

	update(dt) {
		if (this.IsCheckRect) {
			if (cc.MathUtil.rectInRect(this.node, cc.CameraMgr.getDrawRect())) {
				this.runFun();
			} else {
				if (!this.IsOnce) {
					if (this.count < this.MaxNum) {
						this.isInit = false;
					}
				}
			}
		} else {
			this.runFun();
		}
	},

	add() {
		this.count++;
		if (this.IsBlast) {
			cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE.POINTBLAST, this.node, cc.GameConfig.POS_TYPE.LEFT_DOWN, (item) => {
				this.scheduleOnce(() => {
					this.addObj();
				}, 0.2);
			});
		} else {
			this.addObj();
		}
	},

	addObj() {
		if (this.prefabConf) {
			cc.GameUI.addObj(this.prefabConf, this.node, cc.GameConfig.POS_TYPE.LEFT_DOWN, (item) => {
				let script = item.getComponent(this.prefabConf[1]);
				script.pUid = this.node.uuid;
				if (script.setConfig) {
					script.setConfig(this.config);
				} else {
					cc.log(this.Type, this.prefabConf)
				}

			});
		} else {
			cc.log(this.Type, this.prefabConf);
		}
	},

	runFun() {
		if (!this.isInit) {
			this.add();
			this.isInit = true;
		}

		if (this.IsInfinite) {
			this.index++;
			if (this.index >= this.Time) {
				this.add();
				this.index = 0;
			}
		} else {
			if (this.count < this.MaxNum) {
				this.index++;
				if (this.index >= this.Time) {
					this.add();
					this.index = 0;
				}

			}
		}

	},

	reduce(num) {
		if (this.IsOnce || this.IsInfinite) {
			return;
		}

		this.count -= num;
		if (this.count <= 0) {
			this.count = 0;
		}
	},
});
