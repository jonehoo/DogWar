//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  
const GameConfig = {};

GameConfig.CONSTANT = {
	PLAYER_BLOOD: 3,
	BUY_MAX_BLOODR: 3,
	UNLOCK_CHAPTER: 4,
    TIME_RATE: 62,
	FRAME_RATE: 10,
	PLAYER_FRAME_RATE: 2,
	COLOR_RATE: 15,
	FLICKER_RATE: 50,
	BLOOD_ANIMATION_RATE: 20,
	COLOR_CHANGE_RATE: 12,
	
	COLLISION_RECT_WIDTH: 15,
	BG_ITEM_WIDTH: 64,
	
	TIP_HOLD_TIME: 0.5,
	CONTINUE_TIME: 10,
    
	BASE_BLOOD: 3,
	BASE_LOTTER_TICKET: 3,
	BASE_PASS_TIMES: 3,
	BASE_STRENGTH: 5,
	STRENGTH_RECOVER_LIMMIT: 300, //单位s
	
	MAX_PLAY_TIMES: 3,
	MAX_SHARE_TIMES: 5,
	MIN_DIRECT_WIDTH: 100,

    OFFSET_X: 3,
	OFFSET_Y: 2,
    OFFSET_WIDTH: 6,
    OFFSET_HEIGHT: 4,
	DIRECT_OFFSET_WIDTH: 40,
	ONLINE_TIME: [300,600,1200],
};

// 微信开放数据域排行榜开关
GameConfig.ENABLE_WX_OPEN_DATA_RANK = true;

//分享成功失败概率
GameConfig.SHARE_PROBABILITY = {
	'1': {
		'p1': [90,10], //小于2秒失败/成功
		'p2': [30,70], //2秒-3.5秒失败/成功
		'p3': [10,90], //3.5秒-5秒失败/成功
		'p4': [0,100], //大于5秒失败/成功
	},
	'2': {
		'p1': [75,25], //小于2秒失败/成功
		'p2': [20,80], //2秒-3.5秒失败/成功
		'p3': [5,95], //3.5秒-5秒失败/成功
		'p4': [0,100], //大于5秒失败/成功
	},
	'3': {
		'p1': [50,50], //小于2秒失败/成功
		'p2': [10,90], //2秒-3.5秒失败/成功
		'p3': [0,100], //3.5秒-5秒失败/成功
		'p4': [0,100], //大于5秒失败/成功
	}
}

GameConfig.CAMERA_CODE = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
};

GameConfig.CAMERA_MOVE_TYPE = {
    MOVE_X: 1,
    MOVE_Y: 2,
};

GameConfig.POS_TYPE = {
    MIDDLE: 'MIDDLE',
    LEFT_DOWN: 'LEFT_DOWN',
    LEFT_UP: 'LEFT_UP',
    RIGHT_DOWN: 'RIGHT_DOWN',
    RIGHT_UP: 'RIGHT_UP',
};

GameConfig.OBJ_TYPE = {
    PLAYER: 'PLAYER',
    ROAD: 'ROAD',
    MONSTER: 'MONSTER',
    FLYMONSTER: 'FLYMONSTER',
    BOSS: 'BOSS',
    OTHER: 'OTHER',
    THORN: 'THORN',
    POINT: 'POINT',
};

GameConfig.PREFAB_TYPE = {
	GUIDE1: ['prefab/object/guide/guide1', 'Guide', 'NO', 'guide1', 9],
	GUIDE2: ['prefab/object/guide/guide2', 'Guide', 'NO', 'guide2', 9],
	GUIDE3: ['prefab/object/guide/guide3', 'Guide', 'NO', 'guide3', 9],
	GUIDE4: ['prefab/object/guide/guide4', 'Guide', 'NO', 'guide4', 9],
	GUIDE5: ['prefab/object/guide/guide5', 'Guide', 'NO', 'guide5', 8],
	GUIDE6: ['prefab/object/guide/guide6', 'Guide', 'NO', 'guide6', 99],
	GUIDE7: ['prefab/object/guide/guide7', 'Guide', 'NO', 'guide7', 99],
	GUIDE8: ['prefab/object/guide/guide8', 'Guide', 'NO', 'guide8', 99],
	GUIDE9: ['prefab/object/guide/guide9', 'Guide', 'NO', 'guide9', 99],
	GUIDE10: ['prefab/object/guide/guide10', 'Guide', 'NO', 'guide10', 99],
	GUIDE11: ['prefab/object/guide/guide11', 'Guide', 'NO', 'guide11', 99],
	GUIDE12: ['prefab/object/guide/guide12', 'Guide', 'NO', 'guide12', 99],
	GUIDE13: ['prefab/object/guide/guide13', 'Guide', 'NO', 'guide13', 99],
	
	PLAYER: ['prefab/object/monster/player', 'Player', 'PLAYER', 'player', 18,18],
	POINT: ['prefab/object/point', 'Point', 'POINT', 'point', 1],
	
	SNAKE: ['prefab/object/monster/snake', 'Monster', 'MONSTER', 'snake', 11,11],
	BIGSNAKE: ['prefab/object/monster/bigSnake', 'Monster', 'MONSTER', 'bigSnake', 11,11],
	BIGSNAKE2: ['prefab/object/monster/bigSnake2', 'Monster', 'MONSTER', 'bigSnake2', 11,11],
	WOLF: ['prefab/object/monster/wolf', 'Monster', 'MONSTER', 'wolf', 11,11],
	PIG: ['prefab/object/monster/pig', 'Monster', 'MONSTER', 'pig', 11,11],
	REDPIG: ['prefab/object/monster/redPig', 'Monster', 'MONSTER', 'redPig', 11,11],
	GREENPIG: ['prefab/object/monster/greenPig', 'Monster', 'MONSTER', 'greenPig', 11,11],
    FROG: ['prefab/object/monster/frog', 'Monster', 'MONSTER', 'frog', 11,11],
	FROG2: ['prefab/object/monster/frog2', 'Monster', 'MONSTER', 'frog2', 11,11],
	ANT: ['prefab/object/monster/ant', 'Monster', 'MONSTER', 'ant', 11,11],
	SCORPION: ['prefab/object/monster/scorpion', 'Monster', 'MONSTER', 'scorpion', 11,11],
    ATTACKFLOWER: ['prefab/object/monster/attackFlower', 'Monster', 'MONSTER', 'attackFlower', 11,11],
	RINO: ['prefab/object/monster/rino', 'Monster', 'MONSTER', 'rino', 12,12],
	RADISH: ['prefab/object/monster/radish', 'Monster', 'MONSTER', 'radish', 53,53],
	INSECT: ['prefab/object/monster/insect', 'Monster', 'MONSTER', 'insect', 12,12],
	
	BIRD: ['prefab/object/monster/bird', 'FlyMonster', 'FLYMONSTER', 'bird', 12,12],
	BIRD2: ['prefab/object/monster/bird2', 'FlyMonster', 'FLYMONSTER', 'bird2', 12,12],
	BEE: ['prefab/object/monster/bee', 'FlyMonster', 'FLYMONSTER', 'bee', 12,12],
	BAT: ['prefab/object/monster/bat', 'FlyMonster', 'FLYMONSTER', 'bat', 12,12],
	DUCK: ['prefab/object/monster/duck', 'FlyMonster', 'FLYMONSTER', 'duck', 12,12],
	BAT2: ['prefab/object/monster/bat2', 'FlyMonster', 'FLYMONSTER', 'bat2', 12,12],
	OWT: ['prefab/object/monster/owt', 'FlyMonster', 'FLYMONSTER', 'owt', 12,12],
	EATFLOWER: ['prefab/object/monster/eatFlower', 'FlyMonster', 'FLYMONSTER', 'eatFlower', 12,12],
	TRACKBEE: ['prefab/object/monster/trackBee', 'FlyMonster', 'FLYMONSTER', 'trackBee', 15,17],
	NORMALBEE: ['prefab/object/monster/normalBee', 'FlyMonster', 'FLYMONSTER', 'normalBee', 15,17],
	
	BEENEST: ['prefab/object/boss/beeNest', 'Boss', 'BOSS', 'beeNest', 16],
	
	TREE1: ['prefab/object/ornament/tree1', 'No', 'NO', 'tree1', 1],
	TREE2: ['prefab/object/ornament/tree2', 'No', 'NO', 'tree2', 1],
	TREE3: ['prefab/object/ornament/tree3', 'No', 'NO', 'tree3', 1],
	BUSH: ['prefab/object/ornament/bush', 'Other', 'OTHER', 'bush', 2],
	FLOWER: ['prefab/object/ornament/flower', 'Other', 'OTHER', 'flower', 3],
	MUSHROOM1: ['prefab/object/ornament/mushroom1', 'No', 'NO', 'mushroom1', 3],
	MUSHROOM2: ['prefab/object/ornament/mushroom2', 'No', 'NO', 'mushroom2', 3],
	GRASS: ['prefab/object/ornament/grass', 'Other', 'OTHER', 'grass', 4],
	CLOUD1: ['prefab/object/ornament/cloud1', 'No', 'BG', 'cloud1', 0],
	CLOUD2: ['prefab/object/ornament/cloud2', 'No', 'BG', 'cloud2', 0],
	
	APPLE: ['prefab/object/food/apple', 'Food', 'NO', 'apple', 7],
	BANANA: ['prefab/object/food/banana', 'Food', 'NO', 'banana', 7],
	MELON: ['prefab/object/food/melon', 'Food', 'NO', 'melon', 7],
	ORANGE: ['prefab/object/food/orange', 'Food', 'NO', 'orange', 7],
	PINEAPPLE: ['prefab/object/food/pineapple', 'Food', 'NO', 'pineapple', 7],
	STRAWBERRY: ['prefab/object/food/strawberry', 'Food', 'NO', 'strawberry', 7],
  
	BOX: ['prefab/object/road/box', 'Road', 'ROAD', 'box', 9],
	BALL: ['prefab/object/road/ball', 'Road', 'ROAD', 'ball', 9],
	IROLBALL: ['prefab/object/road/irolBall', 'Road', 'ROAD', 'irolBall', 9],
	WOODEN: ['prefab/object/road/wooden', 'Road', 'ROAD', 'wooden', 52],
	BOMB: ['prefab/object/road/bomb', 'Road', 'ROAD', 'bomb', 9],
	STONE: ['prefab/object/road/stone', 'Road', 'ROAD', 'stone', 16],
	TILE1: ['prefab/object/road/tile1', 'Road', 'ROAD', 'tile1', 52],
	TILE2: ['prefab/object/road/tile2', 'Road', 'ROAD', 'tile2', 10],
	TILE3: ['prefab/object/road/tile3', 'Road', 'ROAD', 'tile3', 9],
	TILE4: ['prefab/object/road/tile4', 'Road', 'ROAD', 'tile4', 9],
	WOODROAD: ['prefab/object/road/woodRoad', 'Road', 'ROAD', 'woodRoad', 9],
	STONEROAD: ['prefab/object/road/stoneRoad', 'Road', 'ROAD', 'stoneRoad', 9],
	BRICK1: ['prefab/object/road/brick1', 'Road', 'ROAD', 'brick1', 9],
	BRICK2: ['prefab/object/road/brick2', 'Road', 'ROAD', 'brick2', 9],
	BRICK3: ['prefab/object/road/brick3', 'Road', 'ROAD', 'brick3', 9],
	BRICK4: ['prefab/object/road/brick4', 'Road', 'ROAD', 'brick4', 9],
	BRICK5: ['prefab/object/road/brick5', 'Other', 'OTHER', 'brick5', 8],
	BRICK6: ['prefab/object/road/brick6', 'Road', 'ROAD', 'brick6', 9],
	BRICK7: ['prefab/object/road/brick7', 'Road', 'ROAD', 'brick7', 9],
	BRICK8: ['prefab/object/road/brick8', 'Road', 'ROAD', 'brick8', 8],
	BRICK9: ['prefab/object/road/brick9', 'Road', 'ROAD', 'brick9', 9],
	BRICK10: ['prefab/object/road/brick10', 'Road', 'ROAD', 'brick10', 9],
	BRICK11: ['prefab/object/road/brick11', 'Road', 'ROAD', 'brick11', 9],
	BRICK12: ['prefab/object/road/brick12', 'Road', 'ROAD', 'brick12', 9],
	BRICK13: ['prefab/object/road/brick13', 'Road', 'ROAD', 'brick13', 9],
	BRICK14: ['prefab/object/road/brick14', 'Road', 'ROAD', 'brick14', 9],
	BRICK15: ['prefab/object/road/brick15', 'NO', 'NO', 'brick15', 9],
	BRICK16: ['prefab/object/road/brick16', 'NO', 'NO', 'brick16', 9],
	DROPROAD: ['prefab/object/road/dropRoad', 'Road', 'ROAD', 'dropRoad', 9],
	//HIDROAD: ['prefab/object/road/hideRoad', 'Road', 'ROAD', 'hideRoad', 9],
	FIREROAD: ['prefab/object/road/fireRoad', 'Road', 'ROAD', 'fireRoad', 9],
	MOVEROAD: ['prefab/object/road/moveRoad', 'Road', 'ROAD', 'moveRoad', 9],
	TURRET: ['prefab/object/road/turret', 'Road', 'ROAD', 'turret', 9],
	TURRET2: ['prefab/object/road/turret2', 'Road', 'ROAD', 'turret2', 9],
	HEADROAD: ['prefab/object/road/headRoad', 'Road', 'ROAD', 'headRoad', 9],
	SPIKEHEADROAD: ['prefab/object/road/spikeHeadRoad', 'Road', 'ROAD', 'spikeHeadRoad', 9],
	PALMTREE: ['prefab/object/road/palmTree', 'Road', 'ROAD', 'palmTree', 9],
	CONDUITUP: ['prefab/object/road/conduitUp', 'Road', 'ROAD', 'conduitUp', 19],
	CONDUITRIGHT: ['prefab/object/road/conduitRight', 'Road', 'ROAD', 'conduitRight', 19],
	CONDUITDOWN: ['prefab/object/road/conduitDown', 'Road', 'ROAD', 'conduitDown', 19],
	CONDUITLEFT: ['prefab/object/road/conduitLeft', 'Road', 'ROAD', 'conduitLeft', 19],
	CONDUITUP2: ['prefab/object/road/conduitUp2', 'Road', 'ROAD', 'conduitUp2', 19],
	CONDUITDOWN2: ['prefab/object/road/conduitDown2', 'Road', 'ROAD', 'conduitDown2', 19],
	CONDUITBODY1: ['prefab/object/road/conduitBody1', 'Road', 'ROAD', 'conduitBody1', 19],
	CONDUITBODY2: ['prefab/object/road/conduitBody2', 'Road', 'ROAD', 'conduitBody2', 19],
	SPRING: ['prefab/object/road/spring', 'Road', 'ROAD', 'spring', 9],
	SPRINGL: ['prefab/object/road/springL', 'Road', 'ROAD', 'springL', 16],
	SPRINGR: ['prefab/object/road/springR', 'Road', 'ROAD', 'springR', 16],
	SPRINGLR: ['prefab/object/road/springLR', 'Road', 'ROAD', 'springLR', 16],
	
	AXE: ['prefab/object/thorn/axe', 'Thorn', 'NO', 'axe', 7],
	THORN: ['prefab/object/thorn/thorn', 'Thorn', 'OTHER', 'thorn', 52],
	SAW: ['prefab/object/thorn/saw', 'Thorn', 'NO', 'saw', 7],
	SAW2: ['prefab/object/thorn/saw2', 'Thorn', 'NO', 'saw2', 7],
	THORNBALL: ['prefab/object/thorn/thornBall', 'Thorn', 'NO', 'thornBall', 60],
	THORN1: ['prefab/object/thorn/thorn1', 'Thorn', 'OTHER', 'thorn', 10],
	THORN2: ['prefab/object/thorn/thorn2', 'Thorn', 'OTHER', 'thorn', 10],
	THORN3: ['prefab/object/thorn/thorn3', 'Thorn', 'OTHER', 'thorn', 10],
	THORN4: ['prefab/object/thorn/thorn4', 'Thorn', 'OTHER', 'thorn', 10],
	FIRETHORN1: ['prefab/object/thorn/fireThorn1', 'Thorn', 'NO', 'fireThorn1', 10],
	FIRETHORN2: ['prefab/object/thorn/fireThorn2', 'Thorn', 'NO', 'fireThorn2', 10],
	FIRETHORN3: ['prefab/object/thorn/fireThorn3', 'Thorn', 'NO', 'fireThorn3', 10],
	FIRETHORN4: ['prefab/object/thorn/fireThorn4', 'Thorn', 'NO', 'fireThorn4', 10],
	//MOVETHORN1: ['prefab/object/thorn/moveThorn1', 'Thorn', 'NO', 'moveThorn1', 7],
	//MOVETHORN2: ['prefab/object/thorn/moveThorn2', 'Thorn', 'NO', 'moveThorn2', 7],
	//MOVETHORN3: ['prefab/object/thorn/moveThorn3', 'Thorn', 'NO', 'moveThorn3', 7],
	//MOVETHORN4: ['prefab/object/thorn/moveThorn4', 'Thorn', 'NO', 'moveThorn4', 7],
	
	PLANTBULLET: ['prefab/object/bullet/plantBullet', 'Bullet', 'NO', 'plantBullet', 65],
	CHESTBULLET: ['prefab/object/bullet/chestBullet', 'Bullet', 'NO', 'chestBullet', 65],
	TURRETBULLET: ['prefab/object/bullet/turretBullet', 'Bullet', 'NO', 'turretBullet', 65],
	BEEBULLET: ['prefab/object/bullet/beeBullet', 'Bullet', 'NO', 'beeBullet', 65],
	BATBULLET: ['prefab/object/bullet/batBullet', 'Bullet', 'NO', 'batBullet', 65],
	
	ICE: ['prefab/object/other/ice', 'NO', 'NO', 'ice', 51],
	EYE: ['prefab/object/other/eye', 'Eye', 'NO', 'eye', 70],
	COIN: ['prefab/object/other/coin', 'Coin', 'NO', 'coin', 51],
	STAR: ['prefab/object/other/star', 'Star', 'NO', 'star', 51],
	DOOR: ['prefab/object/other/door', 'Door', 'NO', 'door', 10],
	SCORE: ['prefab/object/other/score', 'Score', 'NO', 'score', 53],
	CHEST: ['prefab/object/other/chest', 'Chest', 'NO', 'chest', 12],
	//ARROW: ['prefab/object/other/arrow', 'Arrow', 'NO', 'arrow', 51],
	DIAMOND: ['prefab/object/other/diamond', 'Prop', 'NO', 'diamond', 15],
	ENDARROW: ['prefab/object/other/endArrow', 'EndArrow', 'NO', 'endArrow', 12],
	LADDER: ['prefab/object/other/ladder', 'Ladder', 'OTHER', 'ladder', 17],
	NOTECOIN: ['prefab/object/other/noteCoin', 'Coin', 'NO', 'noteCoin', 51],
	ICEDEBRIS: ['prefab/object/other/iceDebris', 'Debris', 'NO', 'iceDebris', 64],
	TILEDEBRIS: ['prefab/object/other/tileDebris', 'Debris', 'NO', 'tileDebris', 64],
	TILEDEBRIS2: ['prefab/object/other/tileDebris2', 'Debris', 'NO', 'tileDebris2', 64],
	WOODDEBRIS: ['prefab/object/other/woodDebris', 'Debris', 'NO', 'woodDebris', 64],
	BOMBBLAST: ['prefab/object/other/bombBlast', 'Blast', 'NO', 'bombBlast', 65],
	COLLECTBLAST: ['prefab/object/other/collectBlast', 'Blast', 'NO', 'collectBlast', 65],
	MONSTERBLAST: ['prefab/object/other/collectBlast', 'Blast', 'NO', 'collectBlast', 65],
	BOSSBLAST: ['prefab/object/other/bossBlast', 'Blast', 'NO', 'collectBlast', 65],
	POINTBLAST: ['prefab/object/other/pointBlast', 'Blast', 'NO', 'collectBlast', 65],
	
	CLOCKICON: ['prefab/object/other/clockIcon', 'Icon', 'NO', 'clockIcon', 52],
	WATERICON: ['prefab/object/other/waterIcon', 'Icon', 'NO', 'waterIcon', 52],
	SHIELDICON: ['prefab/object/other/shieldIcon', 'Icon', 'NO', 'shieldIcon', 52],
	STARICON: ['prefab/object/other/starIcon', 'Icon', 'NO', 'starIcon', 52],
	NOTEICON: ['prefab/object/other/noteIcon', 'Icon', 'NO', 'noteIcon', 52],
	
	
	BAGPANEL: ['prefab/ui/panel/bagPanel', 'BagPanel', 'NO', 'bagPanel', 2],
	ENDPANEL: ['prefab/ui/panel/endPanel', 'EndPanel', 'NO', 'endPanel', 1],
    DEADPANEL: ['prefab/ui/panel/deadPanel2', 'DeadPanel', 'NO', 'deadPanel2', 1],
	SHOPPANEL: ['prefab/ui/panel/shopPanel', 'ShopPanel', 'NO', 'shopPanel', 1],
	PROPPANEL: ['prefab/ui/panel/propPanel', 'PropPanel', 'NO', 'propPanel', 1],
	SKILLPANEL: ['prefab/ui/panel/skillPanel', 'SkillPanel', 'NO', 'skillPanel', 1],
	PAUSEPANEL: ['prefab/ui/panel/pausePanel', 'PausePanel', 'NO', 'pausePanel', 1],
	GUIDEPANEL: ['prefab/ui/panel/guidePanel', 'GuidePanel', 'NO', 'guidePanel', 2],
	UNLOCKPANEL: ['prefab/ui/panel/unlockPanel', 'UnlockPanel', 'NO', 'unlockPanel', 2],
	//ONLINEPANEL: ['prefab/ui/panel/onlinePanel', 'OnlinePanel', 'NO', 'onlinePanel', 1],
	ONLINEPANEL: ['prefab/ui/panel/onlinePanel2', 'OnlinePanel2', 'NO', 'onlinePanel2', 1],
	//DOUBLEPANEL: ['prefab/ui/panel/doublePanel', 'DoublePanel', 'NO', 'doublePanel', 2],
	DOUBLEPANEL: ['prefab/ui/panel/stationPanel', 'StationPanel', 'NO', 'stationPanel', 3],
	LOTTERPANEL: ['prefab/ui/panel/lotterPanel', 'LotterPanel', 'NO', 'lotterPanel', 1],
	AUTHORPANEL: ['prefab/ui/panel/authorPanel', 'AuthorPanel', 'NO', 'authorPanel', 1],
	//STATIONPANEL: ['prefab/ui/panel/stationPanel', 'StationPanel', 'NO', 'stationPanel', 1],
	CHAPTERPANEL: ['prefab/ui/panel/chapterPanel', 'ChapterPanel', 'NO', 'chapterPanel', 1],
	STRENGTHPANEL: ['prefab/ui/panel/strengthPanel', 'StrengthPanel', 'NO', 'strengthPanel', 2],
	ENDREWARDPANEL: ['prefab/ui/panel/endRewardPanel', 'EndRewardPanel', 'NO', 'endRewardPanel', 2],
	VEDIOSHAREPANEL: ['prefab/ui/panel/vedioSharePanel', 'VedioSharePanel', 'NO', 'vedioSharePanel', 2],
	CHAPTERINFOPANEL: ['prefab/ui/panel/chapterInfoPanel', 'ChapterInfoPanel', 'NO', 'chapterInfoPanel', 2],
	LOTTERRESULTPANEL: ['prefab/ui/panel/lotterResultPanel', 'LotterResultPanel', 'NO', 'lotterResultPanel', 2],
	
	PROPTIP: ['prefab/ui/item/propTip', 'PropTip', 'NO', 'propTip', 5],
	STARANIM: ['prefab/ui/item/starAnim', 'No', 'NO', 'starAnim', 1],
	BLOODITEM: ['prefab/ui/item/bloodItem', 'NO', 'NO', 'bloodItem', 1],
	TIMEOVER: ['prefab/ui/item/timeOver', 'TimeOver', 'NO', 'timeOver', 100],

	PROPITEM: ['prefab/ui/item/propItem', 'PropItem', 'NO', 'propItem', 1],
	//SHOPITEM: ['prefab/ui/item/shopItem', 'ShopItem', 'NO', 'shopItem', 1],
	//ONLINEITEM: ['prefab/ui/item/onlineItem', 'OnlineItem', 'NO', 'onlineItem', 1],
	CHAPTERITEM: ['prefab/ui/item/chapterItem', 'ChapterItem', 'NO', 'chapterItem', 1],
	STATIONITEM: ['prefab/ui/item/stationItem', 'StationItem', 'NO', 'stationItem', 1],
}

GameConfig.LAYER_TYPE = {
	LAYER: ['prefab/layer/layer', 'Layer', 0],
	LAYER01: ['prefab/layer/layer01', 'Layer', 0],
	LAYER02: ['prefab/layer/layer02', 'Layer', 0],
}

GameConfig.LAYER_BACKGROUND = {
	'layer0': 'LAYERT',
}

module.exports = GameConfig;
