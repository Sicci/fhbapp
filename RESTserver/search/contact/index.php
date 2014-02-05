<?php
	/*
		Gibt eine Liste aller Nutzernamen zurück, die das Suchmuster $_GET['request'] enthalten
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['request'])) { // Request
			$dbh = new DBHandler();
			
			$REQUEST = '%'.$_GET['request'].'%';

			#####################################################################
			
			$oStatement = $dbh->prepare('
				SELECT 	u.uid as "uid", 
						u.firstname as "firstname", 
						u.lastname as "lastname"
						
				FROM `user` u
				
				WHERE CONCAT( u.firstname, " ", u.lastname ) LIKE ?
				AND uid <> ?
				
				ORDER BY u.firstname DESC
				');
			
			$aContent = array($REQUEST, $SSUID);
			$aResult = $dbh->query($oStatement, $aContent);
			
			#####################################################################
			
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
			JSONHelper::generateError($sResult, 'BadRequest');
		}
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);