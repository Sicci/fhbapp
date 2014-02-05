<?php
	/*
		Gibt Detailinformationen für die Kontaktgruppe mit der KontaktgruppenID $_GET['cgid'] 
		einschließlich aller ihrer Mitglieder zurück zurück
		[für den Benutzer mit der UID $SSUID => Besitzer]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['cgid'])) { // Request
			$dbh = new DBHandler();
			
			$UID 	= $SSUID;
			$CGID 	= $_GET['cgid'];

			$oStatement = $dbh->prepare('
				SELECT 	cg.cgid 			as "cgid", 
						cg.cgname 			as "cgname",
						UNIX_TIMESTAMP(cg.cgcreationdate) as "cgcreationdate",
						
						u.uid 			as "uid", 
						u.firstname 	as "firstname", 
						u.lastname 		as "lastname"
						
				FROM `contactgroup` cg 
				LEFT OUTER JOIN `contact2contactgroup` c2cg ON (cg.cgid = c2cg.cgid)
				LEFT OUTER JOIN `user` u ON (c2cg.uid = u.uid)
				
				WHERE cg.uid = ?
				AND cg.cgid = ?
				
				ORDER BY cg.cgname
				');
			
			$aContent = array($UID, $CGID);
			$aResult = $dbh->query($oStatement, $aContent);
			
			JSONHelper::setHandler($handler);
			
			JSONHelper::addLB($sResult);
			JSONHelper::addKey($sResult,$handler);
			JSONHelper::addLB($sResult);
			
			if(count($aResult)>0) {
				$aUsers = array();
				foreach($aResult as $aRow) { // get all users
					if($aRow['uid']!=null) {
						$user = array (
							"uid"		=> $aRow['uid'],
							"firstname" => $aRow['firstname'],
							"lastname"	=> $aRow['lastname']
						);
						array_push($aUsers, $user);
					}
				}
				if(count($aUsers)<1)
					$aUsers = null;
				
				$aResult = $aResult[0]; // use only first result for contactgroup details
				unset($aResult['uid']);
				unset($aResult['firstname']);
				unset($aResult['lastname']);
				$aResult['users'] = $aUsers; // add users

				JSONHelper::addKeyValues($sResult, $aResult);
			}
			
			JSONHelper::addRB($sResult);
			JSONHelper::addRB($sResult);
			$dbh = null;
		} else {
			JSONHelper::generateError($sResult, 'BadRequest');
		}
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);