<?php
	/*
		Gibt eine Liste aller Events zurück, zu denen der Nutzer
		eingeschrieben ist, und, die noch nicht 3h abgelaufen sind
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);
	
	if(!is_null($SSUID)) { // Session
		$dbh = new DBHandler();
		
		$UID 	= $SSUID;
		
		#####################################################################
		
		$oStatement = $dbh->prepare('
			SELECT 	e.eid			as "eid", 
					e.ename			as "ename",
					e.edescription 	as "edescription",
					UNIX_TIMESTAMP(e.edate) as "edate",
					e.uid			as "ecreator"
					
			FROM `event` e 
			JOIN `user2event` u2e ON (e.eid = u2e.eid)
			
			WHERE edate > (now() - INTERVAL 3 HOUR)
			AND u2e.uid = ?
			
			ORDER BY e.edate ASC
			');

		$aContent = array($UID);
		$aResult = $dbh->query($oStatement, $aContent);
		
		#####################################################################
		
		$oStatement = $dbh->prepare('
			SELECT 	u.uid as "uid", 
					CONCAT(u.firstname, " ", u.lastname) as "uname"
			
			FROM `event` e
			JOIN `user` u ON (e.uid = u.uid)
			
			GROUP BY uname
			ORDER BY u.uid
			');
			
		$aSubResult = $dbh->query($oStatement);
		
		if(count($aSubResult)>0) {
			#$aSubResult = $aSubResult[0];
			
			foreach($aResult as $key => $row) {
				foreach($aSubResult as $creator) {
					if($aResult[$key]['ecreator']==$creator['uid'])
						$aResult[$key]['ecreator'] = $creator['uname'];
				}
			}
		}
		// else 
			// throw new Exception("That shouldn't have happened!"); 


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
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);