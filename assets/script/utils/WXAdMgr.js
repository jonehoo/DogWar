//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

var WXAdMgr = cc.Class({
    ctor: function()
    {
        // this.EnableAd = false;
        this._VideoAdInstance = undefined;
        this._BannerAd = undefined;
        this._interstitialAd = undefined;
        this._interstitialAd2 = undefined;
        this.SystemInfo = undefined;
        this._VideoBeReady = false;
        // this._BannerAdBeReady = false;
        this._interstitialBeReady = false;
        this._interstitial2BeReady = false;
        this.CallBack = undefined;
        this._lastWatchVideoTime = 0;
        this._bannerSizeChange = false;
        this._lastPullBannerTime = 1;

        this._adList = null;
    },

    InitAd: function()
    {
		if(!cc.MyPlat){
			return;
		}
		
		this.initAdFun = false;
		this.bannerCount = 0;
		if(cc.MyPlat.createRewardedVideoAd){
			this._VideoAdInstance = cc.MyPlat.createRewardedVideoAd({ adUnitId: 'adunit-97f2841640c8e00f'});
		}
		
        this.SystemInfo = cc.MyPlat.getSystemInfoSync();
    },
	
    ShowVideoAd(cb){
		if(cc.IsLogin == false){
			cc.whole.checkLogin();
			return;
		}
		
		if(!cc.MyPlat){
			cb && cb(true);
			return;
		}

		if(!this._VideoAdInstance && cc.MyPlat.createRewardedVideoAd){
			this._VideoAdInstance = cc.MyPlat.createRewardedVideoAd({ adUnitId: 'adunit-97f2841640c8e00f'});
		}

		if(!this._VideoAdInstance){
			cc.MyPlat.showToast && cc.MyPlat.showToast({
				title: '暂无广告!',
				icon: 'none'
			});
			cb && cb(false);
			return;
		}

		this.CallBack = cb;

		if(!this.initAdFun){
            this._VideoAdInstance.onError((res) =>
            {
                cc.MyPlat.showToast({
                    title: '暂无广告!',
                    icon: 'none'
                });
                this.CallBack && this.CallBack(false);
                this.CallBack = undefined;
            })

            this._VideoAdInstance.onClose((res) =>
            {
                if (res && res.isEnded) {
                    // 正常播放结束，可以下发游戏奖励
                    this.CallBack && this.CallBack(true);
                }else{
					this.CallBack && this.CallBack(false);
				}
				
                this.CallBack = undefined;
            })
			this.initAdFun = true;
        }

		this._VideoAdInstance.load()
			.then(() => this._VideoAdInstance.show())
			.catch(err => {
				console.log(err && err.errMsg);
				cc.MyPlat.showToast && cc.MyPlat.showToast({
					title: '暂无广告!',
					icon: 'none'
				});
				this.CallBack && this.CallBack(false);
				this.CallBack = undefined;
			});
    },

    initInterstitialAd(){
		if(!cc.MyPlat.createInterstitialAd || !cc.FinishGuide){
			return;
		}
		
		let self = this;
		this._interstitialAd = null;
        this._interstitialAd = cc.MyPlat.createInterstitialAd({ adUnitId: 'adunit-bb2fea0237e9ba80'})
        this._interstitialAd.onLoad(function()
        {
            console.log("插屏广告加载成功");
        })
            
        this._interstitialAd.onError(function(err)
        {
          // self.ShowBannerAd();  
        })

        this._interstitialAd.onClose(function(res)
        {
               
         })
        
    },
	
	showGridAd(){
		
	},
	

    ShowInterstitialAd(){
		if(!cc.MyPlat || !cc.FinishGuide){
			return;
		}
		
        if(!this._interstitialAd){
			this.initInterstitialAd();
		}
		
		if(!this._interstitialAd){
			return;
		}
		
        this._interstitialAd.show();
    },

    createBannerAd(){
        this.bannerCount = 0;
        this.DestroyBanerAd();
       
        const winSize = cc.MyPlat.getSystemInfoSync();
        var targetBannerAdWidth = 150;

        // 创建一个居于屏幕底部正中的广告
        let bannerAd = cc.MyPlat.createBannerAd({
            adUnitId: 'adunit-8bda3f5a63e85e78',
            style: {
                width: targetBannerAdWidth,
                top: winSize.windowHeight - (targetBannerAdWidth / 16) * 9 // 根据系统约定尺寸计算出广告高度
            }
        });

        bannerAd.style.left = (winSize.windowWidth - targetBannerAdWidth) / 2;
        bannerAd.onResize(size => {
            if(bannerAd.style.top == winSize.windowHeight - size.height){
                return;
            }

            bannerAd.style.top = winSize.windowHeight - size.height;
            bannerAd.style.left = (winSize.windowWidth - size.width) / 2;
        });
        
        this._BannerAd = bannerAd;
		this._BannerAd && this._BannerAd.show();
    },

    ShowBannerAd: function(index)
    {
		if(!cc.MyPlat || !cc.MyPlat.createBannerAd || !cc.FinishGuide){
			return;
		}

		
        this.createBannerAd();
        this._BannerAd && this._BannerAd.show();
    },

    HideBannerAd(){
        if(!cc.MyPlat || !cc.MyPlat.createBannerAd || !cc.FinishGuide){
			return;
		}
		
	    this._BannerAd && this._BannerAd.hide();
    },

    DestroyBanerAd: function()
    {
        if(!cc.MyPlat || !cc.MyPlat.createBannerAd || !cc.FinishGuide){
			return;
		}
		
        if (this._BannerAd)
        {
            this._BannerAd.destroy()
        }
        this._BannerAd = null;
    },
});

module.exports = new WXAdMgr();