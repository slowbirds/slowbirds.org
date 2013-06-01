<?php
require_once(dirname(dirname(__FILE__))"/modules/Loader/configure.php");
require_once(PATH_ROOT."modules/Loader/Loader.class.php");
$loader = new Loader();
print($loader->publish());
?>
