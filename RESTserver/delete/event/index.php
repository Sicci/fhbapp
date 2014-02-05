<?php
	/*
		Löscht ein Event mit der EventID $_GET['eid']
		[von dem Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['eid'])) {
			$dbh = new DBHandler();
		
			$UID 			= $SSUID;
			$EID 			= $_GET['eid'];
		
			#####################################################################
			
			$oStatement = $dbh->prepare('
				SELECT e.eid
				
				FROM `event` e
				
				WHERE e.eid = ?
				AND e.uid = ?
				');
			
			$aContent = array($EID, $UID);
			$aResult = $dbh->query($oStatement, $aContent);

			#####################################################################
		
			if(count($aResult)>0) {
				
				#################################################################
				
				$oStatement = $dbh->prepare('
					DELETE FROM `event`
					WHERE `eid` = ?
					AND `uid` = ?
					');
				
				$aContent = array($EID, $UID);
				$aResult = $dbh->query($oStatement, $aContent);
				
				#################################################################
		
				JSONHelper::generateSuccess($sResult);
			} else {
				JSONHelper::generateError($sResult, 'NoAccess');
			}
		} else {
			JSONHelper::generateError($sResult, 'BadRequest');
		}
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	
	JSONHelper::doRequestSplit($sResult);