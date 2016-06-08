//->REM响应式布局
~function (desW) {
    var winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}(640);


//->设置滑屏
var step = 0;
var mySwiper = new Swiper('.swiper-container', {
    loop: true,
    direction: 'vertical',
    lazyLoading: true,
    lazyLoadingInPrevNext: true,
    onSlidePrevEnd: function () {
        step--;
        if (step < 0) {
            step = 1;
        }
        change();
    },
    onSlideNextEnd: function () {
        step++;
        if (step > 3) {
            step = 2;
        }
        change();
    }
});

function change() {
    var divList = document.querySelectorAll(".swiper-slide");
    [].forEach.call(divList, function (curDiv, index) {
        curDiv.id = index === step ? curDiv.getAttribute("trueId") : null;
    });
}

















