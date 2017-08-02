## tabsMode 主要总结两种tabs切换的实现方式：JavaScript / jQuery；并最后实现一个jQuery的组件化开发

## 总体设计

* 整个tab设计可设计为一个大盒子(div)里面嵌套着两个小盒子(div)
* 上面的盒子(div)，主要放置导航栏的，类似于分类的
* 上盒子我们主要设计为由ul和若干个li标签，设计成一个导航栏
* 下面的盒子（div），主要是放置每个分类下面的主要内容
* 在下盒子里面，又增加了跟（li）数量相等的更小的盒子（div），用来放置相应的主题主体内容

```
    <div class="tab" id="tab">
        <ul class="tab-title" id="tab-title">
            <li class="select"><a href="#">公告</a></li>
            <li><a href="#">规则</a></li>
            <li><a href="#">论坛</a></li>
            <li><a href="#">安全</a></li>
            <li><a href="#">公益</a></li>
        </ul>

        <div class="tab-content" id="tab-content">
            <div class="tab-ct" style="display: block">ct1</div>
            <div class="tab-ct" style="display: none;">ct2</div>
            <div class="tab-ct" style="display: none;">ct3</div>
            <div class="tab-ct" style="display: none;">ct4</div>
            <div class="tab-ct" style="display: none;">ct5</div>
        </div>
    </div>
```
## JavaScript开发模式
* 主要代码，如下：

```
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
```
1、判断一下ul li的数量和tab-ct的数量是否相等
2、根据我们的鼠标触发的事件（mouseover，click。。。）来进行相应的操作
3、通过两个嵌套的遍历循环，来实现tab-title和tab-content两部分之间操作同步
4、因为tab-content部分设计的时候，每次只显示相对应位置的tab-ct，所以在页面构造的时候，预先设计了只显示第一个tab-ct，其余的都隐藏
5、当我们的鼠标事件移动到第几个位置的时候，分别给相应的title添加我们想要的样式，并且显示相应的content内容


## jQuery开发模式
* 主要代码如下：
```
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
```
1、判断一下ul li的数量和tab-ct的数量是否相等
2、根据我们的鼠标触发的事件（mouseover，click。。。）来进行相应的操作
3、jquery通过触发事件来进行相应的操作，稍微比JavaScript简洁一点
4、因为tab-content部分设计的时候，每次只显示相对应位置的tab-ct，所以在页面构造的时候，预先设计了只显示第一个tab-ct，其余的都隐藏
5、当我们的鼠标事件移动到第几个位置的时候，分别给相应的title添加我们想要的样式，并且显示相应的content内容

## 实现一个jQuery的组件化开发
* 因为实现组件化开发，需要把公共部分提取出来，以参数配置的形式进行展示
* 页面部分
```
<div class="js-tab tab" data-config='{
                                "triggerType":"mouseover",
                                "effect":"fade",
                                "invoke":1,
                                "auto":2000}'>
        <ul class="tab-nav">
            <li class="actived"><a href="javascript:void(0)">新闻</a></li>
            <li><a href="#">电影</a></li>
            <li><a href="#">娱乐</a></li>
            <li><a href="#">科技</a></li>
        </ul>

        <div class="content-wrap">
            <div class="content-item current">
                A
            </div>
            <div class="content-item">
                B
            </div>
            <div class="content-item">
                C
            </div>
            <div class="content-item">
                D
            </div>
        </div>
    </div>
```
* 页面部分需要一个调用组件化js的函数
```angular2html
<script type="text/javascript">
$(function () {
    var tab1 = new Tab($(".js-tab").eq(0));
});
</script>
```
* js组件化部分是通过闭包的形式来实现的
代码如下：
```angular2html
;(function () {
    var Tab = function (tab) {
        var _this_ = this;

        //保存单个tab组件
        this.tab = tab;

        //默认配置参数
        this.config = {
            //用来定义鼠标的触发类型，是click还是mouseover
            "triggerType":"click",
            //用来定义内容切换效果，是直接切换，还是淡入淡出切换效果
            "effect":"fade",
            //默认展示第几个Tab
            "invoke":1,
            //用来定义tab是否自动切换，当制定了时间间隔，就表示自动切换，并且切换时间为指定时间间隔
            "auto":false
        };
        //如果配置参数存在，就扩展换掉默认的配置参数
        if(this.getConfig()){
            $.extend(this.config,this.getConfig());
        }

        //保存tab标签列表，对应的内嵌列表
        this.tabItems = this.tab.find("ul.tab-nav li");
        this.contentItems = this.tab.find("div.content-wrap div.content-item");

        //保存配置参数
        var config = this.config;

        if(config.triggerType === "click"){
            this.tabItems.bind(config.triggerType,function () {
                _this_.invoke($(this));
            });
        }else if(config.triggerType === "mouseover" || config.triggerType != "click"){
            this.tabItems.bind("mouseover",function (event) {
                var self = $(this);
                this.timer = window.setTimeout(function () {
                    _this_.invoke(self);
                },300);
                event.stopPropagation();
            }).bind("mouseout",function (event) {
                window.clearTimeout(this.timer);
                event.stopPropagation();
            })
        }

        //自动切换功能，当配置了时间，我们就根据时间间隔执行自动切换
        if(config.auto){
            //定义一个全局的定时器
            this.timer = null;
            //计数器
            this.loop = 0;
            this.autoPlay();

            this.tab.hover(function () {
                window.clearInterval(_this_.timer);
            },function () {
                _this_.autoPlay();
            });
        }


        //设置默认显示第几个tab
        if(config.invoke > 1){
            this.invoke(this.tabItems.eq(config.invoke - 1));
        }

    };

    Tab.prototype = {
        //自动间隔时间切换
        autoPlay:function () {
          var _this_ = this;
          var tabItems = this.tabItems;//临时保存tab列表
          var tabLength = tabItems.length;//tab的个数
          var config = this.config;

          this.timer = window.setInterval(function () {
              _this_.loop++;
              if(_this_.loop >= tabLength){
                  _this_.loop = 0;
              }

              tabItems.eq(_this_.loop).trigger(config.triggerType);
          },config.auto);
        },
        
        //事件驱动函数
        invoke:function (currentTab) {
            var _this_ = this;
            /***
             * 要执行Tab的选中状态，当前选中的加上actived（标记为白底）
             * 切换对应的tab内容，要根据配置参数的effect是default还是fade
             **/
            var index = currentTab.index();
            //tab选中状态
            currentTab.addClass("actived").siblings().removeClass("actived");
            //切换对应的内容区域
            var effect = this.config.effect;
            var contItems = this.contentItems;
            if(effect === "default"){
                contItems.eq(index).addClass("current").siblings().removeClass("current");
            }else if(effect === "fade"){
                contItems.eq(index).fadeIn().siblings().fadeOut();
            }


            //注意：如果配置了自动切换，记得把当前的loop的值设置成当前的tab的index
            if(this.config.auto){
                this.loop = index;
            }
        },


        //获取配置参数
        getConfig:function () {
            //拿一下tab elem节点上的data-config
            var config = this.tab.attr("data-config");
            // console.log(config);

            //确保有配置参数
            if(config && config!= ""){
                return $.parseJSON(config);
            }else {
                return null;
            }
        }
    };
    window.Tab = Tab;
})(jQuery);
```
1、jquery原型的知识
2、阻止冒泡事件发生

* 代码见github地址：https://github.com/qiuxiaoxiao/tabsMode