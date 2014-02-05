<?php
	/*
		Löscht eine Kontaktgruppe mit der KontaktgruppenID $_GET['cgid']
		[von dem Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['cgid'])) {
			$dbh = new DBHandler();
		
			$UID 			= $SSUID;
			$CGID 			= $_GET['cgid'];
		
			#####################################################################
			
			$oStatement = $dbh->prepare('
				SELECT cg.cgid
				
				FROM `contactgroup` cg
				
				WHERE cg.cgid = ?
				AND cg.uid = ?
				');
			
			$aContent = array($CGID, $UID);
			$aResult = $dbh->query($oStatement, $aContent);

			#####################################################################
		
			if(count($aResult)>0) {
			
				#################################################################
			
				$oStatement = $dbh->prepare('
					DELETE FROM `contactgroup`
					WHERE `cgid` = ?
					AND `uid` = ?
					');
				
				$aContent = array($CGID, $UID);
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