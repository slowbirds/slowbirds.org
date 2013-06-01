$(function(){
$(window).scroll(function(){
  var position = $("body").scrollTop();
  if(position < 100) {
    $("#asyncNavigation")
      .css("top","120px");
  }else {
    $("#asyncNavigation")
      .css("top","10px");
  }
});

});