//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  
module.exports =
    (function MathUtil() {
        var flag1 = false;
        var flag2 = false;
        var flag3 = false;
        function pointInRect(pObj, rObj) {
            flag1 = (pObj.x >= rObj.x && pObj.x <= rObj.x + rObj.width 
                && pObj.y >= rObj.y && pObj.y <= rObj.y + rObj.height);
            return flag1;
        };
    
        function rectInRect(pObj, rObj) {
            flag2 = (pObj.x + pObj.width >= rObj.x && pObj.x <= rObj.x + rObj.width 
                && pObj.y + pObj.height >= rObj.y && pObj.y <= rObj.y + rObj.height);
            return flag2;
        };

        function pointDistance(p1,p2,distance) {
            flag3 = Math.sqrt((p2.x - p1.x)*(p2.x - p1.x)+(p2.y - p1.y)*(p2.y - p1.y)) <= distance;
            return flag3;
        };

//         function pointInRect(pObj, rObj) {
//             return (pObj.x >= rObj.x && pObj.x <= rObj.x + rObj.width 
//                 && pObj.y >= rObj.y && pObj.y <= rObj.y + rObj.height);
//         };
    
//         function rectInRect(pObj, rObj) {
//             return (pObj.x + pObj.width >= rObj.x && pObj.x <= rObj.x + rObj.width 
//                 && pObj.y + pObj.height >= rObj.y && pObj.y <= rObj.y + rObj.height);
//         };

//         function pointDistance(p1,p2,distance) {
//             return Math.sqrt(Math.pow(Math.abs(p2.x - p1.x),2)+Math.pow(Math.abs(p2.x - p1.x),2)) <= distance;
//         };



        return {
            pointInRect: pointInRect,
            rectInRect: rectInRect,
            pointDistance: pointDistance,
        }
    })();