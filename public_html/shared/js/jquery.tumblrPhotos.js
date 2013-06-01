/***********************************************************
* showTumblrPhotos(Async loading) with jQuery
* editor : slowbirds@gmail.com
* since : 2012-01-13
***********************************************************/
$(function() {
jQuery.fn.showTumblrPhotos = function(config) {
  config = jQuery.extend({
    acount: "slowbirds",
    width: "580px"
  },config);
  
  var $wrapperHTML;
  var $target = $(this);
  var flag = false;
  var offset = 0;
  var loadingNext = true;

  var isWin9X = (navigator.appVersion.toLowerCase().indexOf('windows 98')+1);
  var isIE = (navigator.appName.toLowerCase().indexOf('internet explorer')+1?1:0);
  var isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0);
  if (isOpera) isIE = false;
  var isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0);
  var _const = function(){
    $(window).unbind("scroll");
    $target.html('<ul id="showTumblrPhotosList"></ul>');
    $target.hide();
    $wrapperHTML = $("#showTumblrPhotosList");
    $.ajax({
      url: 'http://' + config.acount + '.tumblr.com/api/read/json?type=photo&num=50',
      dataType: "script",
      success: function(){
        getItem();
        showItem();
        autoPager();
      }
    });
  };
  
  var getItem = function() {
    for(var i=0;i<tumblr_api_read.posts.length;i++) {
      makeHTML(i);
    }
    $target.fadeIn();
  }
  
  var makeHTML = function(i) {
    var url   = tumblr_api_read.posts[i]['url'];
    var url_s = tumblr_api_read.posts[i]['photo-url-250'];
    var url_l = tumblr_api_read.posts[i]['photo-url-500'];
    var url_o = tumblr_api_read.posts[i]['photo-url-1280'];
    var img_w = tumblr_api_read.posts[i]['width'];
    var img_h = tumblr_api_read.posts[i]['height'];
    var html="";
      html += '<li clas="item"><div class="showTumblrPhotosItemInner"><blockquote>';
      html += '<a href="'+url+'"><img src="'+url_l+'" rel="'+url_l+'" width="600"></a>';
      html += '<cite>';
      html += tumblr_api_read.posts[i]['photo-caption'];
      html += '</cite></blockquote></div></li>';
      $wrapperHTML.append(html).fadeIn();
  };
  var getScrollPosition = function() {
    var obj = new Object();
    obj.x = document.documentElement.scrollLeft || document.body.scrollLeft;
    obj.y = document.documentElement.scrollTop || document.body.scrollTop;
    return obj;
  }
  var docScrollHeight = function() {
    var obj = new Object();
    obj.x = document.documentElement.scrollWidth || document.body.scrollWidth;
    obj.y = document.documentElement.scrollHeight || document.body.scrollHeight;
    return obj;
  }
  var windowHeight = function(){
    var obj = new Object();
    if (!isSafari && !isOpera) {
      obj.x = document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth;
      obj.y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
    } else {
      obj.x = window.innerWidth;
      obj.y = window.innerHeight;
    }
    obj.mx = parseInt((obj.x)/2);
    obj.my = parseInt((obj.y)/2);
    return obj;
  }
  var autoPager = function() {
    $(window).scroll(function(){
      var total = docScrollHeight();
      var scroll = getScrollPosition();
      var screensize = windowHeight();
      if(scroll.y > (total.y-(screensize.y+500)) && !loadingNext) {
        loadingNext = true;
        offset = offset+50;
        $.ajax({
          url: 'http://' + config.acount + '.tumblr.com/api/read/json?type=photo&num=50&start='+offset,
          dataType: "script",
          success: function(){
            getItem();
            showItem();
          }
        });
      }
    });
  }
  var setPos = function(e) {
    var $viewer = $("#showTumblrPhotosItem");
    if(0 > e.clientY-($viewer.height()/2)-35) {
      $viewer.css("top",e.pageY-20+"px");
    }else {
      $viewer.css("top",e.pageY-($viewer.height()/2)-25+"px");
    }
    
    if($(window).width() < e.clientX+50+$viewer.width()) {
      $viewer.css("left",e.pageX-$viewer.width()-35+"px");
    }else {
      $viewer.css("left",e.pageX+18+"px");
    }
  };
  var makeDetailHtml = function(item) {
    var target = item.find("img");
    var large = target.attr("rel");
    var html = '<img src="'+large+'" width="500">';
    return html;
  };
  var showItem = function() {
    loadingNext = false;
    $("#showTumblrPhotosList > li").each(function(i){
      $(this).mouseover(function(e) {
        if(flag) return false;
        $("body").append('<div id="showTumblrPhotosItem"></div>');
        var $viewer = $("#showTumblrPhotosItem");
        var html = makeDetailHtml($(this));
        $viewer
          .css("position","absolute")
          .css("width",config.width)
          .html(html);
        setPos(e);
        
        $(this)
          .mousemove(function(e){
            if(flag) return false;
            setPos(e);
          });
      });
      $(this).mouseout(function() {
        if(flag) return false;
        $("#showTumblrPhotosItem").remove();
      });
    });
  };
  _const();
  return this;
}
});
