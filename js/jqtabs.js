/**
 * Created by qiucheng on 2017/8/2.
 */

$(document).ready(function () {
    var titleName = $(".tab-title li");
    var tabContent = $(".tab-content div");

    if(titleName.length != tabContent.length){
        return;
    }
    titleName.mouseover(function () {
        var index = $(this).index();
        $(this).addClass("select").siblings().removeClass("select");
        tabContent.eq(index).show().siblings().hide();
    });
});