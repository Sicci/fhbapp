<?php
	/*
		Gibt eine Liste aller möglichen Kontakte zurück
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		$dbh = new DBHandler();

		$oStatement = $dbh->prepare('
			SELECT 	u.uid			as "uid",
					u.firstname		as "firstname", 
					u.lastname		as "lastname"
					
			FROM `user` u 

			ORDER BY u.firstname
			');

		$aResult = $dbh->query($oStatement);

		JSONHelper::setHandler($handler);
		
		JSONHelper::addLB($sResult);
		JSONHelper::addKey($sResult,$handler);
		JSONHelper::addLAB($sResult);
		
		if(count($aResult)>0) {
			JSONHelper::addArrayObjects($sResult,$aResult);
		}
		JSONHelper::addRAB($sResult);
		JSONHelper::addRB($sResult);
		$dbh = null;
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);