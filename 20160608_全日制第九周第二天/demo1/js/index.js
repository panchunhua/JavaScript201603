function getCss(curEle, attr) {
    if (window.getComputedStyle) {
        return parseFloat(window.getComputedStyle(curEle, null)[attr]);
    }
    var winW = document.documentElement.clientWidth || document.body.clientWidth;
    if (winW <= 720) {
        return parseFloat(winW * 0.92);
    }
    return parseFloat(winW * 0.92 * 0.33 * 0.94);
}

var content = document.getElementById("content"),
    divList = content.getElementsByTagName("div"),
    imgList = content.getElementsByTagName("img");

//->IE6~8下,屏幕宽度小于960PX,导航栏显示不一样的
function auto() {
    var winW = document.documentElement.clientWidth || document.body.clientWidth;
    var navFir = document.getElementById("navFir"),
        navTwo = document.getElementById("navTwo");
    if (winW <= 960) {
        navFir.style.display = "none";
        navTwo.style.display = "block";
    } else {
        navFir.style.display = "block";
        navTwo.style.display = "none";
    }
}

//->图片的高度会跟着宽度进行自适应调整（所有浏览器）
function autoImg() {
    var scale = 360 / 284;
    for (var i = 0; i < imgList.length; i++) {
        var curImg = imgList[i];
        var curImgW = getCss(curImg, "width");
        curImg.style.height = curImgW / scale + "px";
    }
}

//->当宽度小于720PX的时候IE6~8下的处理
function autoImg2() {
    var winW = document.documentElement.clientWidth || document.body.clientWidth;
    if (winW > 720) {
        return;
    }
    for (var i = 0; i < divList.length; i++) {
        var curDiv = divList[i];
        curDiv.style.margin = "10px 0";
        curDiv.style.width = "100%";

        var curChild = curDiv.getElementsByTagName("*");
        for (var k = 0; k < curChild.length; k++) {
            curChild[k].style.marginLeft = "0";
            curChild[k].style.width = "100%";
        }
    }
}


//->在IE6~8浏览器中
if (/MSIE (6|7|8)/i.test(window.navigator.userAgent)) {
    auto();
    autoImg2();
}
autoImg();

window.onresize = function () {
    autoImg();
    if (/MSIE (6|7|8)/i.test(window.navigator.userAgent)) {
        auto();
        autoImg2();
    }
};


