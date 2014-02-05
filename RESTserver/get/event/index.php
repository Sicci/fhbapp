<?php
	/*
		Gibt Detailinformationen für ein Event mit der EventID $_GET['eid'] zurück
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['eid'])) { // Request
			$dbh = new DBHandler();
			
			$EID 	= $_GET['eid'];

			$oStatement = $dbh->prepare('
				SELECT 	e.eid							as "eid", 
						e.edescription					as "edescription",
						e.ename							as "ename",
						UNIX_TIMESTAMP(e.edate)			as "edate",
						UNIX_TIMESTAMP(e.ecreationdate)	as "ecreationdate",
						e.eqrcontent					as "eqrcontent",
						
						u.firstname 					as "firstname", 
						u.lastname 						as "lastname"
						
				FROM `event` e 
				JOIN `user` u ON (e.uid = u.uid)
				
				WHERE e.eid = ?
				');
			
			$aContent = array($EID);
			$aResult = $dbh->query($oStatement, $aContent);
			
			JSONHelper::setHandler($handler);
			
			JSONHelper::addLB($sResult);
			JSONHelper::addKey($sResult,$handler);
			
			if(count($aResult)>0) {
				JSONHelper::addArrayObjects($sResult,$aResult);
			}
			JSONHelper::addRB($sResult);
			$dbh = null;
		} else {
			JSONHelper::generateError($sResult, 'BadRequest');
		}
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);