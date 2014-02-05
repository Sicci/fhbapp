<?php
	/*
		Gibt eine Liste aller Teilnehmer für das Event mit der EventID $_GET['eid']
		zurück, und ob sie sich bereits dafür verifiziert haben
		[für den Benutzer mit der UID $SSUID => Besitzer]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['eid'])) { // Request
		
			$dbh = new DBHandler();
			
			$UID = $SSUID;
			$EID = $_GET['eid'];

			$oStatement = $dbh->prepare('
				SELECT 	u.uid				as "uid", 
						u.firstname			as "firstname",
						u.lastname			as "lastname",
						u2e.hasverified		as "hasverified"
						
				FROM `user` u
				JOIN `user2event` u2e ON (u.uid = u2e.uid)
				JOIN `event` e ON (u2e.eid = e.eid)
				
				WHERE u2e.eid = ?
				AND e.uid = ?
				
				ORDER BY u.lastname
				');

			$aContent = array($EID, $UID);
			$aResult = $dbh->query($oStatement, $aContent);
			
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