var SCC;
(function(){
var SlowbirdsContentsController;
  SlowbirdsContentsController = function () {
  if (typeof($) == "undefined") {
    return false;
  }
  this.config = {
    domain: "slowbirds.org",
    base: "/",
    api: "/",
    script: ["scraps"],
    scriptPath: "/shared/js/SlowbirdsContentsController.",
    imageBusy: "/shared/images/icon_loading.gif",
    index: "top",
    content: "#contents"
  };
  this.init();
  this.entire = false;
  return this;
};
SlowbirdsContentsController.prototype = {
  /* utility */
  init: function() {
    if(location.pathname == "/") {
      this.loaded = "top";
    }else {
      this.loaded = location.pathname.replace(/^\//,"");
    }
    this.content = $(this.config.content);
    this.events();
    this.statusMake();
    this.statusBusy();
    this.loadScript(this.loaded);
    return this;
  },
  events: function() {
    var par = this;
    $(window).bind('popstate',function(e) {
      e.preventDefault();
      par.getContent(location.pathname.replace(/^\//,""),false)
    });
    return this;
  },
  scrollto: function() {
    var target = location.hash ? location.hash:false;
    var position = 0;
    if(target) {
      position = $(target).offset().top;
      position = position-50;
    }
    $($.browser.safari ? 'body' : 'html').animate({scrollTop:position}, 400, 'swing');
    return this;
  },
  isScript: function(content) {
    for(var i=0;i<this.config.script.length;i++) {
      if(this.config.script[i] === content) {
        return true;
      }
    }
    return false;
  },
  isPushstate: function() {
    return typeof(history.pushState) !== "undefined";
  },
  unhash: function(string) {
    return string.replace(/\#[a-zA-Z_0-9]+$/,"");
  },
  unslash: function(string) {
    if(string.match(/^\/(.+)$/)) {
      string =  RegExp.$1;
    }
    if(string.match(/^(.+)\/$/)) {
      string = RegExp.$1;
    }
    return string;
  },
  addClass: function(func) {
    this.entire = func;
    this.entire.init();
  },
  scriptLoader: function(script,callback) {
    $.ajax({
      url: script,
      dataType: "script",
      
      success: function(){
        callback();
      },
      
      error: function(xhr,message) {
        alert("script:"+message);
      }
    });
    return this;
  },
  /* trigger */
  getContent: function(content,urlchange) {
    content = this.unslash(content);
    if(!this.isPushstate()) {
      location.href = content;
      return false;
    }
    if(!content || content == "") {
      content = this.config.index;
    }
    if(urlchange) {
      history.pushState(content,content,this.config.base+content);
    }
    if(this.loaded == this.unhash(content)) {
      this.scrollto();
      return this;
    }
    this.statusBusy();
    this.loaded = this.unhash(content);
    var par = this;
    this.content.slideUp("slow",function(){
      par.removeContent();
      par.getTemplate(par.setPage,content);
    });
    return this;
  },
  /* busy */
  statusBusy: function() {
    $("#loading").fadeIn("fast");
  },
  statusAllow: function() {
    $("#loading").fadeOut("fast");
  },
  statusMake: function() {
    var html='<div id="loading"><img src="'+this.imageBusy+'"></div>';
    $("body").append(html);
    $("#loading").hide();
  },
  /* finish */
  finish: function() {
    var par = this;
    this.content.slideDown("fast",function(){
      par.scrollto()
    });
    this.statusAllow();
  },
  /* scripts */
  loadScript: function(content) {
    if(this.isScript(content)) {
      this.getScript(this.fireScript,content);
    }else {
      this.finish();
    }
    return this;
  },
  getScript: function(callback,content) {
    var par = this;
    $.ajax({
      url: par.config.scriptPath+content+".js",
      dataType: "script",
      
      success: function(){
        callback(content,par);
      },
      
      error: function(xhr,message) {
        par.setError("script",message);
      }
    });
    return this;
  },
  fireScript: function(content,par) {
    par.finish();
    return this;
  },
  /* pages */
  setPage: function(data,content,par) {
    par.content.html(data);
    par.loadScript(content);
  },
  setError: function(type,message) {
    this.content.html('<p class="errorMessage">'+type+" unloaded:"+message+'</p>');
    return this;
  },
  getTemplate: function(callback,content) {
    content = this.unhash(content);
    var par = this;
    $.ajax({
      type: "GET",
      url: par.config.api,
      timeout: 30000,
      async: true,
      dataType: "html",
      data: {'page':content,'X-PJAX':true},
      
      success: function(data){
        callback(data,content,par);
      },
      
      error: function(xhr,message) {
        par.setError("template",message);
      }
    });
    return this;
  },
  /* removing */
  removeContent: function() {
    this.content.html("");
    this.removeScript();
    return this;
  },
  removeScript: function() {
    if(this.isScript(this.content)) {
      this.entire.remove();
      this.entire = null;
    }
    return this;
  }
};
$(function(){
  //contents controller
  SCC = new SlowbirdsContentsController();
  //global navigation
  $("#asyncNavigation").find("a").click(function(e){
    e.preventDefault();
    if($(this).attr("rel") === "no-async") {/* not async contents */
      location.href=$(this).attr("href");
    }else {
      SCC.getContent($(this).attr("href"),true);
    }
  });
  //logo->top page
  $("#identityLogo>a").click(function() {
    e.preventDefault();
    SCC.getContent("/",true);
  });
});
})();