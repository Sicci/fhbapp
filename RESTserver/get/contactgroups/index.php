<?php
	/*
		Gibt eine Liste aller Kontaktgruppen des Nutzers zurück
		[für den Benutzer mit der UID $SSUID => Besitzer]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		$dbh = new DBHandler();
		
		$UID = $SSUID;

		$oStatement = $dbh->prepare('
			SELECT 	cg.cgid				as "cgid", 
					cg.cgname			as "cgname",
					UNIX_TIMESTAMP(cg.cgcreationdate) as "cgcreationdate"
					
			FROM `contactgroup` cg 
			
			WHERE cg.uid = ?
			
			ORDER BY cg.cgname
			');

		$aContent = array($UID);
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
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);