<?php
	/*
		Gibt eine Liste aller globalen Gruppen zurück
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		$dbh = new DBHandler();

		$oStatement = $dbh->prepare('
			SELECT 	g.gid		as "gid", 
					g.gname		as "gname"
					
			FROM `group` g 

			ORDER BY g.gname
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
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);