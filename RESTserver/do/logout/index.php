<?php
	/*
		Führt LogOut durch und zerstört die Session 
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
	
		session_regenerate_id(true);
		session_unset();
		session_destroy();

		JSONHelper::generateSuccess($sResult);
		
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	
	JSONHelper::doRequestSplit($sResult);