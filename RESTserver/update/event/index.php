<?php
	/*
		Aktualisiert die Teilnehmerliste eines Events
		[für den Benutzer mit der UID $SSUID => Besitzer]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['eid'])&&isset($_GET['ename'])&&isset($_GET['edate'])) { // Request
			$dbh = new DBHandler();
		
			$UID 			= $SSUID;
			$EID			= $_GET['eid'];
			$ENAME 			= $_GET['ename'];
			$EDESCRIPTION	= (isset($_GET['edescription']))?$_GET['edescription']:"Keine Beschreibung vorhanden";
			$EDATE 			= date("Y-m-d H:i:s",$_GET['edate']);
				
			if(isset($_GET['attendeelist'])) {
				if(is_array($_GET['attendeelist'])) {
					$ATTENDEELIST = $_GET['attendeelist'];
				} else {
					if($_GET['attendeelist']!="") {
						$ATTENDEELIST = json_decode($_GET['attendeelist']);
					} else {
						$ATTENDEELIST = array();
					}
				}
			} else {
				$ATTENDEELIST = array();
			}
			
			#####################################################################
			
			$oStatement = $dbh->prepare('
				SELECT e.eid as "eid"
				FROM `event` e
				WHERE `eid` = ?
				AND `uid` = ?
				');
			
			$aContent = array($EID, $UID);
			$aResult = $dbh->query($oStatement, $aContent);
			
			$EID = (isset($aResult[0]))?$aResult[0]['eid']:null;
			
			#####################################################################

			if(!is_null($EID)) { // ACCESS
			
				$oStatement = $dbh->prepare('
					UPDATE `event`
					SET `ename` = ?, 
						`edescription` = ?, 
						`edate` = ?
					
					WHERE `eid` = ?
					AND `uid` = ?
					');
				
				$aContent = array($ENAME, $EDESCRIPTION, $EDATE, $EID, $UID);
				$aResult = $dbh->query($oStatement, $aContent);
				
				#################################################################
				
				$oStatement = $dbh->prepare('
					DELETE FROM `user2event`
					WHERE `eid` = ?
					');
				
				$aContent = array($EID);
				$aResult = $dbh->query($oStatement, $aContent);

				#################################################################
				
				if($EID>0) {
					$aContacts = $ATTENDEELIST;
					$err=false;
					if(count($aContacts)>0) {
						foreach($aContacts as $uid)
							if(!is_numeric($uid)||$uid==0)
								$err=true;
						if(!$err) {
							$query = "INSERT INTO `user2event`(`uid`,`eid`,`hasverified`) VALUES ";
							foreach($aContacts as $uid)
								$query.= "($uid,$EID,0), "; 
							$query = substr($query,0, -2);
							
							$oStatement = $dbh->prepare($query);
							$aResult = $dbh->query($oStatement);
						}
					}
				}
				
				#################################################################
				
				if(!$err && $EID>0) {
					$addParams = array (
						"eid" 		=> $EID
					);
					JSONHelper::generateSuccess($sResult, $addParams);
				} else {
					JSONHelper::generateError($sResult, 'BadRequest');
				}
				
			} else {
				JSONHelper::generateError($sResult, 'NoAccess');
			}

			$dbh = null;
		} else {
			JSONHelper::generateError($sResult, 'BadRequest');
		}
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);