var main = document.querySelector("#main");
//容器宽/容器高<=背景图宽/背景图高  按照高来缩放
//缩放值 = 容器的高/背景图高
//容器宽/容器高>背景图宽/背景图高 按照宽来缩放
//缩放值 = 容器的宽/背景图宽
var winW = window.innerWidth; /*设备宽  -- 容器宽*/
var winH = window.innerHeight;/*设备高 --  容器高*/
var desW = 640;/*设计稿宽 ---背景图宽*/
var desH = 1136;/*设计稿高 --背景图高*/
if(winW/winH <=desW/desH){
    main.style.webkitTransform = "scale("+winH/desH+")";
}else{
    main.style.webkitTransform = "scale("+winW/desW+")"
}

var oLis = document.querySelectorAll("#main>ul>li");

[].forEach.call(oLis,function(curLi,index){
    curLi.index = index;
    curLi.addEventListener("touchstart",start,false);
    curLi.addEventListener("touchmove",move,false);
    curLi.addEventListener("touchend",end,false);
});

function start(e){
    //click点击时是会触发touchstart ,离开时会触发touchend事件 ,touchmove事件不会被触发
    this.startX = e.changedTouches[0].pageX;
    this.startY = e.changedTouches[0].pageY;

}
function move(e){
    e.preventDefault();//滑动时页面滚动是默认行为,需要阻止默认行为
    this.style.webkitTransition = "";
    var moveX = e.changedTouches[0].pageX;
    var moveY = e.changedTouches[0].pageY;
    var direction = swipeDirection(this.startX,this.startY,moveX,moveY);
    var index = this.index;
    var len = oLis.length;
    var movePos = moveY - this.startY; /*移动的距离*/
    if(/^(Down|Up)$/.test(direction)){/*上下滑动*/
        this.flag = true ;//判断是滑动
        //初始化,只有当前这张是显示的,其他的都隐藏 ,移除所有li的类名zIndex
        [].forEach.call(oLis,function(curLi,nIndex){
            if(index!=nIndex){
                curLi.style.display = "none";
            }
            curLi.className = "";
            curLi.firstElementChild.id = "";
        })

        //通过direction获得上一张或者下一张的索引和移动的距离
        if(direction == "Down"){
            this.prevsIndex = index == 0?len-1:index-1;
            var pos = -desH/2+movePos;
        }else if(direction == "Up"){
            this.prevsIndex = index == len-1?0:index+1;
            var pos = desH/2+movePos;
        }
        oLis[this.prevsIndex].style.display = "block";
        oLis[this.prevsIndex].className = "zIndex";
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,"+pos+"px)";
        //设置当前这张效果
        //Math.abs(movePos)/winH  缩放时从小到大
        //1- Math.abs(movePos)/winH  缩放时从大到小
        this.style.webkitTransform = "scale("+(1-Math.abs(movePos)/winH*1/2)+") translate(0,"+movePos*2+"px)";

    }

}
function end(e){
    if(this.flag){
        //回到起始位置
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,0)";
        oLis[this.prevsIndex].style.webkitTransition = "1s";
        var _this = this;
        oLis[this.prevsIndex].addEventListener('webkitTransitionEnd',function(e){
            //滑动效果结束之后可以做一些处理
            //相当于清除动画积累
            this.style.webkitTransition = "";
            _this.style.webkitTransform = "translate(0,0)";
            this.firstElementChild.id = "side"+this.index;

        },false)
        this.flag = false;//以便下一次再去判断

    }
}

function swipeDirection(startX,startY,moveX,moveY){
    //1.判断是上下滑还是左右滑 2.再根据changeX/changeY得出滑动的方向
    var changeX = moveX - startX;
    var changeY = moveY - startY;
    return  Math.abs(changeX)>Math.abs(changeY)?(changeX>0?"Right":"Left") : (changeY>0?"Down":"Up");
}
/**
 *
 * @param startX  按下时触摸点X坐标
 * @param startY  按下时触摸点y坐标
 * @param moveX   移动时触摸点X坐标
 * @param moveY  移动时触摸点Y坐标
 * @returns {boolean}  判断是否滑动
 */
function isSwipe(startX,startY,moveX,moveY){
    var changeX = moveX - startX;
    var changeY = moveY - startY;
    return  Math.abs(changeX)>30 || Math.abs(changeY)>30
}
