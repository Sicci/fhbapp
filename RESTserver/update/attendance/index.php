<?php
	/*
		Nimmt die gescannten QR-Informationen $_GET['qrcontent'] entgegen und 
		verifiziert den Nutzer entweder für ein Event, oder aktualisiert seine Position.
		In beiden Fällen wird ein neuer Status angelegt.
		[für den Benutzer mit der UID $SSUID => Besitzer]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		$dbh = new DBHandler();
		
		$UID	= $SSUID;
		
		if(isset($_GET['qrcontent'])) {
			$QRCONTENT = $_GET['qrcontent'];
		} else {
			$QRCONTENT = null;
		}
		
		if(!is_null($QRCONTENT)) {
			#####################################################################
			
			$oStatement = $dbh->prepare('
				SELECT 	r.rid 	as "rid",
						r.rname as "rname"
		
				FROM `room` r 
				
				WHERE r.rqrcontent = ?
				LIMIT 1
				');
				
			$aContent = array($QRCONTENT);
			$aResult = $dbh->query($oStatement, $aContent);
			
			if(count($aResult)>0) {
				$RID = $aResult[0]['rid'];
				$RNAME = $aResult[0]['rname'];
				
			} else {
			#####################################################################
			
				$RID = null;
				
				$oStatement = $dbh->prepare('
					SELECT 	e.eid 	as "eid",
							e.ename	as "ename"

					FROM `event` e 
					
					WHERE e.eqrcontent = ?
					LIMIT 1
					');
					
				$aContent = array($QRCONTENT);
				$aResult = $dbh->query($oStatement, $aContent);
				
				if(count($aResult)>0) {
					$EID = $aResult[0]['eid'];
					$ENAME = $aResult[0]['ename'];
				} else {
					$EID = null;
				}
			}
			
			#####################################################################
			if(!is_null($RID)) {
				$oStatement = $dbh->prepare('
					INSERT INTO `status`(`uid`,`rid`,`sdescription`) VALUES (?,?,?)
					');
				$aContent = array($UID, $RID, ("Im ".$RNAME));
				$aResult = $dbh->query($oStatement, $aContent);
				
				###################################################
				$addParams = array (
					"room"		=> $RNAME
				);
				JSONHelper::generateSuccess($sResult, $addParams);
				###################################################
			} else {
				if(!is_null($EID)) {
				
					$oStatement = $dbh->prepare('
						SELECT `eid` 
						FROM `user2event`
						
						WHERE `eid` = ?
						AND `uid` = ?
						');
					
					$aContent = array($EID, $UID);
					$aResult = $dbh->query($oStatement, $aContent);
					
					if(count($aResult)>0) {
						$EID = $aResult[0]['eid'];
					} else {
						$EID = null;
					}
					
					if(!is_null($EID)) {
				
						$oStatement = $dbh->prepare('
							UPDATE `user2event`
							
							SET `hasverified` = 1
							
							WHERE `eid` = ?
							');
						
						$aContent = array($EID);
						$aResult = $dbh->query($oStatement, $aContent);
						
						$oStatement = $dbh->prepare('
							INSERT INTO `status`(`uid`,`eid`,`sdescription`) VALUES (?,?,?)
							');
						$aContent = array($UID, $EID, ("Bei ".$ENAME));
						$aResult = $dbh->query($oStatement, $aContent);
						
						###################################################
						$addParams = array (
							"event"		=> $ENAME
						);
						JSONHelper::generateSuccess($sResult, $addParams);
						###################################################
					} else {
						JSONHelper::generateError($sResult, 'NoAccess');
					}
				} else {
					JSONHelper::generateError($sResult, 'NotFound');
				}
			}
			#####################################################################
			
			$dbh = null;
		} else {
			JSONHelper::generateError($sResult, 'BadRequest');
		}
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);