SCC.addClass(new (function() {
this.init= function(){
  var par = this;
  SCC.scriptLoader("/shared/js/jquery.tumblrPhotos.js",function(){
    $("#showTumblrPhotosList").showTumblrPhotos();
  });
}
this.remove = function() {
  this.init = null;
}
}));
