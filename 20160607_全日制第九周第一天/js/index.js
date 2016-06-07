//->计算MATCH区域的高度
var $match = $(".match"),
    winH = document.documentElement.clientHeight || document.body.clientHeight;
$match.css("height", winH - 40 - 82);

//->当屏幕窗口的尺寸发生改变的时候:让MATCH区域的高度也随之变化
$(window).on("resize", function () {
    winH = document.documentElement.clientHeight || document.body.clientHeight;
    $match.css("height", winH - 40 - 82);
});

