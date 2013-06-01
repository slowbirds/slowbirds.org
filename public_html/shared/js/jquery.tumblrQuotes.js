/***********************************************************
* showTumblrQuotes(Async loading) with jQuery
* editor : slowbirds@gmail.com
* since : 2012-01-04
***********************************************************/
$(function() {
jQuery.fn.showTumblrQuotes = function(config) {
  config = jQuery.extend({
    acount: "slowbirds",
    width: "580px"
  },config);
  
  var $wrapperHTML;
  var $target = $(this);
  var flag = false;

  var _const = function(){
    $target.hide();
    $target.html('<ul id="showTumblrQuotesList"></ul>');
    $wrapperHTML = $("#showTumblrQuotesList");
    $.ajax({
      url: 'http://' + config.acount + '.tumblr.com/api/read/json?type=quote&num=50',
      dataType: "script",
      success: function(){
        getItem();
        showItem();
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
    var html="";
      html += '<li><div class="showTumblrQuotesItemInner"><blockquote>';
      html += tumblr_api_read.posts[i]['quote-text'];
      html += '<cite>';
      html += tumblr_api_read.posts[i]['quote-source'];
      html += '</cite></blockquote></div></li>';
      $wrapperHTML.append(html);
  };
  
  var setPos = function(e) {
    var $viewer = $("#showTumblrQuotesItem");
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
  
  var setRemove = function() {
    $("#showTumblrQuotesItem").click(function(){
      $(this).remove();
      flag = false;
    });
  };
  
  var showItem = function() {
    $("#showTumblrQuotesList > li").each(function(i){
      $(this).mouseover(function(e) {
        if(flag) return false;
        $("body").append('<div id="showTumblrQuotesItem"></div>');
        var $viewer = $("#showTumblrQuotesItem");
        $viewer
          .css("position","absolute")
          .css("width",config.width)
          .html($(this).html());
        setPos(e);
        
        $(this)
          .mousemove(function(e){
            if(flag) return false;
            setPos(e);
          })
          .click(function(){
            flag = true;
            setRemove();
          });
      });
      $(this).mouseout(function() {
        if(flag) return false;
        $("#showTumblrQuotesItem").remove();
      });
    });
  };
  _const();
}
});
