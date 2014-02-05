<?php
	/*
		Aktualisiert die Mitgliederliste einer Kontaktgruppe
		[für den Benutzer mit der UID $SSUID => Besitzer]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['cgid'])&&isset($_GET['cgname'])) { // Request
			$dbh = new DBHandler();
			
			$UID 			= $SSUID;
			$CGID			= $_GET['cgid'];
			$CGNAME 		= $_GET['cgname'];
			
			if(is_array($_GET['contactlist'])) {
				$CONTACTLIST = $_GET['contactlist'];
			} else {
				if($_GET['contactlist']!="") {
					$CONTACTLIST = json_decode($_GET['contactlist']);
				} else {
					$CONTACTLIST = array();
				}
			}

			$oStatement = $dbh->prepare('
				SELECT 	cg.cgid 	as "cgid"
		
				FROM `contactgroup` cg 
				
				WHERE cg.cgid = ?
				AND cg.uid = ?
				');
				
			$aContent = array($CGID, $UID);
			$aResult  = $dbh->query($oStatement, $aContent);
			
			$CGID = (isset($aResult[0]))?$aResult[0]['cgid']:null;
				
			#####################################################################
			if(!is_null($CGID)) { // ACCESSS
			
				$oStatement = $dbh->prepare('
					UPDATE `contactgroup`
					
					SET `cgname` = ?
					
					WHERE `cgid` = ?
					AND `uid` = ?
					');
				
				$aContent = array($CGNAME, $CGID, $UID);
				$aResult = $dbh->query($oStatement, $aContent);
				
				#################################################################
				
				$oStatement = $dbh->prepare('
					DELETE FROM `contact2contactgroup`
					WHERE `cgid` = ?
					');
				
				$aContent = array($CGID);
				$aResult = $dbh->query($oStatement, $aContent);

				#################################################################
				
				$aContacts = $CONTACTLIST;
				$err=false;
				if(count($aContacts)>0) {
					foreach($aContacts as $uid)
						if(!is_numeric($uid)||$uid==0)
							$err=true;
					if(!$err) {
						$query = "INSERT INTO `contact2contactgroup`(`uid`,`cgid`) VALUES ";
						foreach($aContacts as $uid)
							$query.= "($uid,$CGID), "; 
						$query = substr($query,0, -2);
						
						$oStatement = $dbh->prepare($query);
						$aResult = $dbh->query($oStatement);
					}
				}
				
				#################################################################
				if(!$err && $CGID>0) {
					$addParams = array (
						"cgid" 		=> $CGID
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