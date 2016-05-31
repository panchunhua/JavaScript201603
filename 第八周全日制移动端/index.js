(function () {
    var main = document.querySelector("#main");
    var oLis = document.querySelectorAll("#main>ul>li");
    var winW = window.innerWidth;
    /*设备的宽*/
    var winH = window.innerHeight;
    /*设备的高*/
    var desW = 640;
    /*设计稿的宽*/
    var desH = 1008;
    /*设计稿的高*/

    if (winW / winH <= desW / desH) {
        main.style.webkitTransform = "scale(" + winH / desH + ")";
    } else {
        main.style.webkitTransform = "scale(" + winW / desW + ")";
    }

    /*
     cover缩放原理:
     容器宽(设备宽)/容器高(设备高)<=背景图宽(设计稿宽)/背景图高(设计稿高)  按照高来缩放
     缩放值 = 容器的高/背景图高

     容器宽/容器高>背景图宽/背景图高  按照宽来缩放
     缩放值 = 容器的宽/背景图宽
     * */
    //实现上下滑动的效果
    [].forEach.call(oLis, function () {
        var oLi = arguments[0];
        oLi.index = arguments[1];
        oLi.addEventListener("touchstart", start, false);
        oLi.addEventListener("touchmove", move, false);
        oLi.addEventListener("touchend", end, false);
    })
    function start(e) {
        this.startY = e.changedTouches[0].pageY;
    }

    function move(e) {
        var moveY = e.changedTouches[0].pageY;
        var movePos = moveY - this.startY;//移动的距离
        var index = this.index;
        [].forEach.call(oLis,function(){
            if(arguments[1]!=index){
                arguments[0].style.display = "none";
            }
            arguments[0].className = "";
        })
        if (movePos > 0) {/*下滑*/
            //获取上一张索引
            this.prevsIndex = index == 0 ? oLis.length - 1 : index - 1;
            var duration = -desH+movePos;
        } else if (movePos < 0) {/*上滑*/
            //获取下一张索引
            this.prevsIndex = index == oLis.length - 1 ? 0 : index + 1;
            var duration = desH+movePos

        }

        oLis[this.prevsIndex].className = "zIndex";
        oLis[this.prevsIndex].style.display = "block";
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,"+duration+"px)";
    }

    function end(e) {
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,0)";
        oLis[this.prevsIndex].style.webkitTransition = "1s";
        oLis[this.prevsIndex].addEventListener("webkitTransitionEnd",function(){
            this.style.webkitTransition = "";//清除动画积累
        })
    }


})();
