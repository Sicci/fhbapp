<?php
	/*
		Klasse zur Hilfe von Session-Handling
	*/
class SESSIONHelper{

	public function __construct() {
	}
	
	public static function init(&$SSUID) {
		if(isset($_GET['ssid']) && $_GET['ssid'] != '') {
			session_id($_GET['ssid']);
			session_start();
			$SSUID = (isset($_SESSION['uid']))?$_SESSION['uid']:null;
		} else {
			$SSUID = null;
		}
	}
}