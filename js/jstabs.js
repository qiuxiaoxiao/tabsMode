/**
 * Created by qiucheng on 2017/8/1.
 */
function $(id) {
    return typeof id == "string"?document.getElementById(id):id;
}

window.onload = function () {
    var titleName = $("tab-title").getElementsByTagName("li");
    var tabContent = $("tab-content").getElementsByTagName("div");
    if(titleName.length != tabContent.length){
        return;
    }
    for(var i = 0;i < titleName.length;i++){
        titleName[i].id = i;
        titleName[i].onmouseover = function () {
            for(var j = 0;j<titleName.length;j++){
                titleName[j].className = "";
                tabContent[j].style.display = "none";
            }
            this.className = "select";
            tabContent[this.id].style.display = "block";
        }
    }
} ;