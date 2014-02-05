<?php
	/*
		Gibt eine Liste der letzten 10 eigenen Statuses zurück.
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		$dbh = new DBHandler();
		
		$UID = $SSUID;

		$oStatement = $dbh->prepare('
			SELECT  s.sid as "sid",
					s.sdescription as "sdescription",
					UNIX_TIMESTAMP(s.screationdate) as "screationdate"
			
			FROM `status` s
			
			WHERE s.uid = ?
			
			ORDER BY s.screationdate DESC
			LIMIT 10;
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