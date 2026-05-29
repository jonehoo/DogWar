//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  
function DataManager() {
    this.init = function(){
        let str = cc.sys.localStorage.getItem('SQUIRREL_WAR_DATA');
        if(str){
            this.data = JSON.parse(str);
        }else{
            this.data = {
				finishStep: 0,
				finishGuide: false,
				coin: 0,
				star: 0,
				strength: 0,
				lotterTicket: 0,
				
				level: 1,
				lastRecoverTime: 0,
				strengthBuyTimes: 0,
				passTimes: 0,
				
				skinKey: 'a',
				skinIds: [],
				unLockAllSkin: false,
				
				layerIndex: 0,
				minLayerIndex: 0,
				chapterData: [],
				starIds: [],
               
				isMusic: true,
				isSound: true,
				isFristRank: false,
				isCompletePlot: false,
				
				skill:{
				    moreJump: false,
					power: false,
					immune: false,
					moreJumpTemp: false,
					powerTemp: false,
					immuneTemp: false,
			    },
				
				prop:{
					blood: {
						value: 0,
						useTimes: 0,
					},
			        liquid: {
						value: 0,
						useTimes: 0,
					},
					bloodr: {
						value: 0,
						useTimes: 0,
					},
				},
				
				date:{
					year: 0,
                    month: 0,
                    day: 0,
				},
				
				online: {
					count: 0,
					lastTime: 0,
					canReview: false,
					year: 0,
                    month: 0,
                    day: 0,
				},

				online2: {
					time: 0,
					review: [false,false,false],
					year: 0,
                    month: 0,
                    day: 0,
				},
				
			    skin:{
				   a: {
					   key: 'a',
					   isHave: true,
					   haveDebris: 0,
				   },
				   b: {
					   key: 'b',
					   isHave: false,
					   haveDebris: 0,
				   },
				   c: {
					   key: 'c',
					   isHave: false,
					   haveDebris: 0,
				   },
				   d: {
					   key: 'd',
					   isHave: false,
					   haveDebris: 0,
				   },
				   e: {
					   key: 'e',
					   isHave: false,
					   haveDebris: 0,
				   },
			    },
				dayTask: {
                    share: {
                        finish: false,
                        receive: false,
                        count: 0, 
                    },
                    vedio: {
                        finish: false,
                        receive: false,
                        count: 0, 
                    },
                    kill: {
                        finish: false,
                        receive: false,
                        count: 0,
                    },
                    use: {
                        finish: false,
                        receive: false,
                        count: 0,
                    },
                    fruit: {
                        finish: false,
                        receive: false,
                        count: 0, 
                    },
                },
				sign:{
				    year: 0,
					month: 0,
					day: 0,
					count: 0,
					isCompelet7: false
			    }
            }
			
            cc.sys.localStorage.setItem('SQUIRREL_WAR_DATA',JSON.stringify(this.data));  
        }
    };

    this.setValue = function(key,value){
        if(value instanceof Object){
            if(Array.isArray(value)){
                this.data[key] = [];
            }else{
                this.data[key] = {};
            }

            for(let a in value){
                this.data[key][a] = value[a];
            }
        }else{
            this.data[key] = value;
        }
        
        cc.sys.localStorage.setItem('SQUIRREL_WAR_DATA',JSON.stringify(this.data));
    };

    this.getValue = function(key){
        if(!key){
            return;
        }

        if(!this.data){
            this.init();
        }

        return this.data[key];
    };
	
	this.getAll = function(){
        return this.data;
    };
	
	this.save = function(){
        cc.sys.localStorage.setItem('SQUIRREL_WAR_DATA',JSON.stringify(this.data));
    };
}

module.exports = DataManager;