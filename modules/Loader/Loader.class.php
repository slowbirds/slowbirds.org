<?php
CLASS Loader {
  public function __construct() {
  }
  public function publish() {
    if(isset($_GET['page'])) {
      $page = htmlspecialchars($_GET['page']);
      if($page == "index") {
        $page = "top";
      }
    }else {
      $page = "top";
    }
    $template = $this->getTemplate($page);
    if($template == "") {
      $this->setError($template);
    }else {
      $this->setPage($page);
    }
  }
  private function isFile($file) {
    if(file_exists($file)) {
      return true;
    }else {
      return false;
    }
  }
  private function isPjax() {
    if(isset($_GET['X-PJAX'])) {
      return true;
    }else {
      return false;
    }
  }
  private function setError($code) {
    if($code == 404) {
      header("HTTP/1.0 404 Not Found");
    }
    $this->setPage(PATH_ERROR.$code.".html");
  }
  private function setPage($page) {
    if($this->isPjax()) {
      print($this->getTemplate($page));
    }else {
      print($this->makePage($page));
    }
    return;
  }
  private function makePage($page) {
    $dir = PATH_TEMPLATE;
    
    $meta_path   = $dir."meta".".html";
    $header_path = $dir."header".".html";
    $bottom_path = $dir."bottom".".html";
    
    $meta   = file_get_contents($meta_path);
    $header = file_get_contents($header_path);
    $bottom = file_get_contents($bottom_path);
    
    $content = $this->getTemplate($page);
    
    $page = $meta.$header.$content.$bottom;
    
    return $page;
  }
  private function getTemplate($page) {
    $dir = PATH_TEMPLATE;
    $template_path = $dir.$page.".html";
    if($this->isFile($template_path)) {
      $template = file_get_contents($template_path);
    }else {
      $template = "";
    }
    return $template;
  }
}
?>
