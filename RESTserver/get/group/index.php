<?php
	/*
		Gibt Detailinformationen für eine globable Gruppe mit der GruppenID $_GET['gid'] 
		einschließlich aller ihrer Mitglieder zurück
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['gid'])) { // Request
			$dbh = new DBHandler();
			
			$GID 	= $_GET['gid'];

			$oStatement = $dbh->prepare('
				SELECT 	g.gid 			as "gid", 
						g.gname 		as "gname",
						u.uid 			as "uid", 
						u.firstname 	as "firstname", 
						u.lastname 		as "lastname"
						
				FROM `group` g 
				JOIN `user2group` u2g ON (g.gid = u2g.gid)
				JOIN `user` u ON (u2g.uid = u.uid)
				
				WHERE g.gid = ?
				
				ORDER BY u.firstname
				');
			
			$aContent = array($GID);
			$aResult = $dbh->query($oStatement, $aContent);
			
			JSONHelper::setHandler($handler);
			
			JSONHelper::addLB($sResult);
			JSONHelper::addKey($sResult,$handler);
			JSONHelper::addLB($sResult);
			
			if(count($aResult)>0) {
				$aUsers = array();
				foreach($aResult as $aRow) { // get all users
					$user = array (
						"uid"		=> $aRow['uid'],
						"firstname" => $aRow['firstname'],
						"lastname"	=> $aRow['lastname']
					);
					array_push($aUsers, $user);
				}
				$aUsers = (is_null($aUsers[0]))? null : $aUsers;
				
				$aResult = $aResult[0]; // use only first result for group details
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