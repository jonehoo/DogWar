//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
//电报https://t.me/gamecode999 
//网页客服 http://web3incubators.com/kefu.html  
module.exports =
    (function Utils() {
        function init() {
            //this.onShow();
            this.initGuide();
        };

        function initGuide() {
            if (cc.FinishGuide) {
                return;
            }


            cc.GuideStep = 0;
            cc.GuideArr = cc.ObjConfig.GUIDE;
            cc.MaxGuideStep = cc.GuideArr.length;
        };

        function checkGuide(step, node) {
            if (cc.FinishGuide) {
                return;
            }

            if (step > 0 && step < cc.MaxGuideStep && step <= cc.FinishStep) {
                return;
            }

            this.callFun = () => {
                this.rect = {
                    'x': 0,
                    'y': 0,
                    'width': 0,
                    'height': 0,
                }

                this.curGuideInfo = cc.GuideArr[step];
                this.target = cc.find(this.curGuideInfo.path, node);

                if (this.target) {
                    this.rectX = this.target.x;
                    this.rectY = this.target.y;
                    this.rectW = this.target.width * 6 / 5;
                    this.rectH = this.target.height * 6 / 5;
                    this.worldPos = this.target.parent.convertToWorldSpaceAR(cc.v2(this.rectX, this.rectY));
                    this.localPos = cc.wholeUI.panel.convertToNodeSpaceAR(this.worldPos);

                    this.rect.x = this.localPos.x - this.rectW / 2;
                    this.rect.y = this.localPos.y - this.rectH / 2;
                    this.rect.width = this.rectW;
                    this.rect.height = this.rectH;
                }

                cc.Guide && cc.Guide.showContent(true);
                this.showGuide(step, this.rect);
            }

            cc.Guide && cc.Guide.showContent(false);
            setTimeout(this.callFun, 240);
        };

        function showGuide(step, rect) {
            if (cc.FinishGuide) {
                return;
            }

            if (cc.Guide) {
                cc.Guide.updateStep({ step: step, rect: rect });
            } else {
                cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.GUIDEPANEL, cc.wholeUI.panel, { step: step, rect: rect });
            }
        };

        function showToast(text) {
            if (cc.MyPlat) {
                cc.MyPlat.showToast({
                    title: text,
                    icon: 'none'
                })
            }
        };

        function showDialog(title, content, successCb, failCb) {
            if (cc.MyPlat) {
                cc.MyPlat.showModal({
                    title: title,
                    content: content,
                    success(res) {
                        if (res.confirm) {
                            successCb && successCb();
                        } else if (res.cancel) {
                            failCb && failCb();
                        }
                    }
                });
            }
        };

        function onShow() {
            if (cc.MyPlat) {
                if (cc.MyPlat.onShow) {
                    cc.MyPlat.onShow((res) => {
                        if (cc.ShareStartTime) {
                            if (cc.ShareTimes > 3) {
                                cc.ShareCb && cc.ShareCb(1);
                                cc.ShareCb = null;
                                return;
                            }

                            let t = (Date.now() - cc.ShareStartTime) / 1000;

                            let weights = null;
                            if (t < 2) {
                                weights = cc.GameConfig.SHARE_PROBABILITY[cc.ShareTimes].p1;
                            } else if (t >= 2 && t < 3.5) {
                                weights = cc.GameConfig.SHARE_PROBABILITY[cc.ShareTimes].p2;
                            } else if (t >= 3.5 && t < 5) {
                                weights = cc.GameConfig.SHARE_PROBABILITY[cc.ShareTimes].p3;
                            } else if (t >= 5) {
                                weights = cc.GameConfig.SHARE_PROBABILITY[cc.ShareTimes].p4;
                            }

                            let r = this.generateResult(weights);
                            cc.ShareCb && cc.ShareCb(r);
                            cc.ShareCb = null;
                        }
                    });
                } else {
                    this.showToast('请更新您的微信版本');
                }
            }
        };

        function checkShareReward() {
            this.isDayFirstShare = cc.DataMgr.getValue('isDayFirstShare');
            if (!this.isDayFirstShare) {
                let coin = cc.DataMgr.getValue('coin');
                cc.DataMgr.setValue('coin', coin + 400);
                cc.DataMgr.setValue('isDayFirstShare', true);

                let tipArr = [];
                tipArr.push({ name: '金币', value: 400, iconIndex: 0 });
                this.showTip(tipArr);
            }
        };

        function share(cb) {
            if (cc.MyPlat) {
                if (cc.MyPlat.shareAppMessage) {
                    cc.ShareCb = null;
                    cc.ShareCb = cb;
                    cc.ShareStartTime = Date.now();
                    cc.ShareTimes = 1;
                    cc.MyPlat.aldShareAppMessage({
                        title: '狗狗大作战2026',
                        imageUrl: cc.whole.sharePicPath,
                    });
                } else {
                    this.showToast('请更新您的微信版本');
                }
            }
        };

        function normalShare() {
            if (cc.MyPlat) {
                if (cc.MyPlat.shareAppMessage) {
                    //cc.ShareStartTime = null;
                    cc.MyPlat.aldShareAppMessage({
                        title: '狗狗大作战2026',
                        imageUrl: cc.whole.sharePicPath,
                    });
                } else {
                    this.showToast('请更新您的微信版本');
                }
            }
        };

        function cbShare() {
            if (cc.MyPlat) {
                if (cc.MyPlat.shareAppMessage) {
                    cc.ShareStartTime = Date.now();
                    cc.ShareTimes++;
                    cc.MyPlat.aldShareAppMessage({
                        title: '狗狗大作战2026',
                        imageUrl: cc.whole.sharePicPath,
                    });
                } else {
                    this.showToast('请更新您的微信版本');
                }
            }
        };

        var tips = [];
        function showTip(arr, cb) {
            if (cc.SceneCode == 2) {
                cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.PROPTIP, cc.UILayer.panel, arr, () => {
                    cb && cb();
                });
            } else {
                cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.PROPTIP, cc.Main.panel, arr, () => {
                    cb && cb();
                });
            }

            /*if(tips.length == 0){
                cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.PROPTIP,cc.wholeUI.panel,arr);
            }
        	
            tips.push(arr);*/
        };

        function deleteTip() {
            tips.splice(0, 1);

            if (tips.length == 0) {
                return;
            }

            cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.PROPTIP, cc.wholeUI.panel, tips[0]);
        };

        function conversionTime(time) {
            this.min = Math.floor(time / 60);
            this.s = time % 60;
            this.timeStr = '';
            if (this.min < 10) {
                if (this.s >= 10) {
                    this.timeStr = '0' + this.min + ':' + this.s;
                } else {
                    this.timeStr = '0' + this.min + ':' + '0' + this.s;
                }
            } else {
                if (this.s >= 10) {
                    this.timeStr = this.min + ':' + this.s;
                } else {
                    this.timeStr = this.min + ':' + '0' + this.s;
                }
            }

            return this.timeStr;
        };

        function generateResult(arr) {
            this.totalWeight = 0;
            this.weightList = [];
            for (let key in arr) {
                this.totalWeight += arr[key];
                this.weightList.push(this.totalWeight);
            }

            this.randomWeight = Math.round(Math.random() * this.totalWeight);


            for (let rwi = 0; rwi < this.weightList.length; rwi++) {
                if (this.randomWeight <= this.weightList[rwi]) {
                    return rwi;
                    break;
                }
            }

            return 0;
        };

        function dataMoney(str) {
            if (str <= 999) {
                str = Math.floor(str);
                return str;
            } else if (str > 999 && str <= 999999) {
                str = str / 1000;
                return `${str.toFixed(2)}K`;
            } else if (str > 999999 && str <= 999999999) {
                str = str / 1000000;
                return `${str.toFixed(2)}M`
            } else if (str > 999999999 && str <= 999999999999) {
                str = str / 1000000000;
                return `${str.toFixed(2)}G`
            } else if (str > 999999999999 && str <= 999999999999999) {
                str = str / 1000000000000;
                return `${str.toFixed(2)}T`
            } else if (str > 999999999999999 && str <= 999999999999999999) {
                str = str / 1000000000000000;
                return `${str.toFixed(2)}P`
            } else if (str > 999999999999999999 && str <= 999999999999999999999) {
                str = str / 1000000000000000000;
                return `${str.toFixed(2)}E`
            } else if (str > 999999999999999999999 && str <= 999999999999999999999999) {
                str = str / 1000000000000000000000;
                return `${str.toFixed(2)}Z`
            } else if (str > 999999999999999999999999) {
                str = str / 1000000000000000000000000;
                return `${str.toFixed(2)}Y`
            }
        };

        function createAndBindGameClubButton(bindNode, cb) {
            if (!window.wx || !cc.MyPlat.createGameClubButton) {
                return;
            }

            if (cc.GameClubBtn) {
                cc.GameClubBtn.destroy();
                cc.GameClubBtn = null;
            }

            var size = cc.winSize;
            var sysInfo = cc.MyPlat.getSystemInfoSync();
            var useNode = bindNode;
            var btnComp = bindNode.getComponent(cc.Button);
            var bgNode = bindNode.getChildByName('Background');
            if (bgNode) {
                useNode = bgNode;
            } else if (btnComp && btnComp.target) {
                useNode = btnComp.target;
            }

            var worldPos = useNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            // 这里的 world 坐标按左下原点处理，不能再加半屏偏移。
            var leftInDesign = worldPos.x - useNode.width * useNode.anchorX;
            var topInDesign = size.height - worldPos.y - useNode.height * (1 - useNode.anchorY);

            var scaleX = sysInfo.windowWidth / size.width;
            var scaleY = sysInfo.windowHeight / size.height;
            // 真机微调：当前机型下向左、向下轻微修正
            var debugOffsetX = -75;
            var debugOffsetY = 4;
            var finalLeft = leftInDesign * scaleX + debugOffsetX;
            var finalTop = topInDesign * scaleY + debugOffsetY;
            var finalWidth = useNode.width * scaleX;
            var finalHeight = useNode.height * scaleY;
            cc.GameClubBtn = cc.MyPlat.createGameClubButton({
                type: "text",
                text: "",
                style: {
                    left: finalLeft,
                    top: finalTop,
                    width: finalWidth,
                    height: finalHeight,
                    backgroundColor: "rgba(255, 0, 0, 0)"
                    //backgroundColor: "#000000"
                }
            });

            console.log("社区按钮定位：", {
                node: useNode.name,
                worldPos: worldPos,
                design: { left: leftInDesign, top: topInDesign, w: useNode.width, h: useNode.height },
                window: { left: finalLeft, top: finalTop, w: finalWidth, h: finalHeight },
                windowSize: { w: sysInfo.windowWidth, h: sysInfo.windowHeight }
            });
            cc.GameClubBtn.onTap(() => {
                //cc.AudioMgr.playSound('button');
                cc.GameEvent.send('点击社区', { 'chapter_multiplayer': '点击社区' });
                if (bindNode) {
                    bindNode.stopAllActions();
                    bindNode.runAction(cc.sequence(cc.scaleTo(0.05, 1.05), cc.scaleTo(0.05, 1)));
                }
                cb && cb();
            });

            //cc.GameClubBtn.hide();
        };

        function showGameClubButton() {
            cc.GameClubBtn && cc.GameClubBtn.show();
        };

        function hideGameClubButton() {
            cc.GameClubBtn && cc.GameClubBtn.hide();
        };

        function buildRankLayer() {
            if (cc.WxRankLayer && cc.isValid(cc.WxRankLayer)) {
                return cc.WxRankLayer;
            }

            let parent = cc.find('Canvas');
            if (!parent) {
                parent = cc.director.getScene();
            }
            if (!parent) {
                return null;
            }

            let layer = new cc.Node('WxRankLayer');
            layer.width = cc.winSize.width;
            layer.height = cc.winSize.height;
            layer.zIndex = 9999;
            layer.addComponent(cc.BlockInputEvents);
            parent.addChild(layer);

            let board = new cc.Node('RankBoard');
            board.width = Math.floor(cc.winSize.width * 0.84);
            board.height = Math.floor(cc.winSize.height * 0.8);
            let boardSprite = board.addComponent(cc.Sprite);
            boardSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            board.addComponent(cc.BlockInputEvents); // 拦截触摸事件，避免点击/拖拽排行榜区域时导致关闭
            layer.addChild(board);

            let title = new cc.Node('RankTitle');
            let titleLabel = title.addComponent(cc.Label);
            titleLabel.string = '';
            titleLabel.fontSize = 36;
            titleLabel.lineHeight = 40;
            title.setPosition(0, Math.floor(cc.winSize.height * 0.42));
            layer.addChild(title);

            let tip = new cc.Node('RankTip');
            let tipLabel = tip.addComponent(cc.Label);
            tipLabel.string = '点击空白处关闭';
            tipLabel.fontSize = 24;
            tipLabel.lineHeight = 28;
            tip.setPosition(0, -Math.floor(cc.winSize.height * 0.44));
            layer.addChild(tip);

            layer.on(cc.Node.EventType.TOUCH_END, () => {
                hideWxRank();
            });

            cc.WxRankLayer = layer;
            cc.WxRankBoard = board;
            cc.WxRankTexture = null;
            return layer;
        }

        function updateWxRankTexture() {
            if (!cc.WxRankBoard || !cc.MyPlat || !cc.isValid(cc.WxRankBoard)) {
                return;
            }

            let sharedCanvas = cc.MyPlat.getSharedCanvas ? cc.MyPlat.getSharedCanvas() : null;
            if (!sharedCanvas) {
                return;
            }

            if (!cc.WxRankTexture) {
                cc.WxRankTexture = new cc.Texture2D();
            }

            try {
                cc.WxRankTexture.initWithElement(sharedCanvas);
                cc.WxRankTexture.handleLoadedTexture();
                let sprite = cc.WxRankBoard.getComponent(cc.Sprite);
                if (sprite) {
                    sprite.spriteFrame = new cc.SpriteFrame(cc.WxRankTexture);
                }
            } catch (err) {
                cc.warn("[Rank] updateWxRankTexture 异常:", err);
            }
        }

        function canUseWxOpenDataRank() {
            return !!(window.wx
                && cc.MyPlat
                && cc.GameConfig
                && cc.GameConfig.ENABLE_WX_OPEN_DATA_RANK
                && cc.MyPlat.getOpenDataContext);
        }

        // 微信隐私授权检查：未授权先弹官方授权框，已授权或不支持时直接放行
        function ensurePrivacyAuthorize(cb) {
            if (!window.wx || !cc.MyPlat) {
                cb && cb(true);
                return;
            }

            if (!cc.MyPlat.getPrivacySetting || !cc.MyPlat.requirePrivacyAuthorize) {
                // 旧版本基础库没有隐私接口，直接放行
                cb && cb(true);
                return;
            }

            cc.MyPlat.getPrivacySetting({
                success: function (res) {
                    if (res && res.needAuthorization) {
                        console.log('[Privacy] 需要授权，弹出隐私协议');
                        cc.MyPlat.requirePrivacyAuthorize({
                            success: function () {
                                console.log('[Privacy] 用户已同意');
                                cb && cb(true);
                            },
                            fail: function (err) {
                                console.warn('[Privacy] 用户拒绝或失败:', err);
                                cb && cb(false);
                            },
                        });
                    } else {
                        cb && cb(true);
                    }
                },
                fail: function (err) {
                    console.warn('[Privacy] getPrivacySetting 失败:', err);
                    cb && cb(true);
                },
            });
        }

        function reportRank(data) {
            if (!canUseWxOpenDataRank()) {
                console.log('[Rank] 未启用开放数据域，跳过上报');
                return;
            }

            var payload = {
                score: data && data.score ? data.score : 0,
                time: data && data.time ? data.time : 0,
                chapter: data && data.chapter ? data.chapter : 0,
                updateAt: Date.now(),
            };

            ensurePrivacyAuthorize(function (ok) {
                if (!ok) {
                    console.log('[Rank] 用户未授权隐私，跳过上报');
                    return;
                }

                console.log('[Rank] 主域开始上报:', payload);
                try {
                    cc.MyPlat.setUserCloudStorage({
                        KVDataList: [{ key: 'rank', value: JSON.stringify(payload) }],
                        success: function () {
                            console.log('[Rank] 上报成功');
                            postMessage({
                                message: 'rankUpdated',
                                type: 'rankUpdated',
                            });
                        },
                        fail: function (err) {
                            console.warn('[Rank] 上报失败:', err);
                        },
                    });
                } catch (err) {
                    console.warn('[Rank] setUserCloudStorage 异常:', err);
                }
            });
        }

        function showWxRank(data) {
            if (!window.wx || !cc.MyPlat) {
                showToast('仅支持微信小游戏排行榜');
                return;
            }

            if (!canUseWxOpenDataRank()) {
                showToast('未配置开放数据域排行榜');
                return;
            }

            ensurePrivacyAuthorize(function (ok) {
                if (!ok) {
                    showToast('需同意隐私协议才能查看排行榜');
                    return;
                }

                var layer = buildRankLayer();
                if (!layer) {
                    showToast('排行榜加载失败');
                    return;
                }

                layer.active = true;

                postMessage({
                    message: 'showRank',
                    type: 'showFriendRank',
                });

                // 开启定期贴图渲染更新 (约30帧的更新率)，以实现滑动和数据异步加载的平滑刷新
                cc.director.getScheduler().unschedule(updateWxRankTexture, layer);
                cc.director.getScheduler().schedule(updateWxRankTexture, layer, 0.033, cc.macro.REPEAT_FOREVER, 0, false);
            });
        }

        function hideWxRank() {
            if (cc.WxRankLayer && cc.isValid(cc.WxRankLayer)) {
                cc.WxRankLayer.active = false;
                // 关闭排行榜时停止贴图更新调度
                cc.director.getScheduler().unschedule(updateWxRankTexture, cc.WxRankLayer);
            }

            if (!canUseWxOpenDataRank()) {
                return;
            }

            postMessage({
                message: 'hideRank',
                type: 'hideFriendRank',
            });

            // 再次更新贴图以清空面板内容
            updateWxRankTexture();
        }

        function postMessage(data) {
            if (!canUseWxOpenDataRank()) {
                return;
            }

            let openDataContext = null;
            try {
                openDataContext = cc.MyPlat.getOpenDataContext();
            } catch (err) {
                cc.warn('获取开放数据域失败:', err);
                return;
            }

            if (!openDataContext) {
                cc.error("获取开发数据域失败！");
                return;
            }

            try {
                openDataContext.postMessage(data);
            } catch (err) {
                cc.warn('向开放数据域发送消息失败:', err);
            }
        };

        function moveToPos(item, target, time, cb) {
            this.worldPos = target.parent.convertToWorldSpaceAR(cc.v2(target.x, target.y));
            this.localPos = cc.UILayer.node.convertToNodeSpaceAR(this.worldPos);

            item.runAction(
                cc.sequence(
                    cc.moveTo(time, cc.v2(this.localPos.x, this.localPos.y)).easing(cc.easeInOut(time)),
                    cc.callFunc(() => {
                        //cb && cb();
                    }, this)
                )
            );
        };

        function addScore(pos, value) {
            cc.UILayer.updateValue('score', value);
            cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE.COLLECTBLAST, pos, cc.GameConfig.POS_TYPE.MIDDLE);
            cc.GameUI.addObj(cc.GameConfig.PREFAB_TYPE.SCORE, pos, cc.GameConfig.POS_TYPE.LEFT_DOWN, (item) => {
                let script = item.getComponent('Score');
                script.setValue(value);
            });
        };

        return {
            init: init,
            initGuide: initGuide,
            showGuide: showGuide,
            checkGuide: checkGuide,
            addScore: addScore,
            moveToPos: moveToPos,
            normalShare: normalShare,
            showToast: showToast,
            showTip: showTip,
            share: share,
            cbShare: cbShare,
            onShow: onShow,
            showDialog: showDialog,
            deleteTip: deleteTip,
            dataMoney: dataMoney,
            conversionTime: conversionTime,
            generateResult: generateResult,
            showGameClubButton: showGameClubButton,
            hideGameClubButton: hideGameClubButton,
            buildRankLayer: buildRankLayer,
            updateWxRankTexture: updateWxRankTexture,
            canUseWxOpenDataRank: canUseWxOpenDataRank,
            ensurePrivacyAuthorize: ensurePrivacyAuthorize,
            reportRank: reportRank,
            showWxRank: showWxRank,
            hideWxRank: hideWxRank,
            createAndBindGameClubButton: createAndBindGameClubButton,
            postMessage: postMessage,
        }
    })();