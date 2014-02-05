<?php
	/*
		Gibt eine Liste aller Events zurück
		[für den Benutzer mit der UID $SSUID => Besitzer]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		$dbh = new DBHandler();
		
		$UID 	= $SSUID;
		
		$oStatement = $dbh->prepare('
			SELECT 	e.eid		as "eid", 
					e.ename		as "ename",
					UNIX_TIMESTAMP(e.edate) as "edate"
					
			FROM `event` e 
			WHERE e.uid = ?

			ORDER BY e.edate DESC
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