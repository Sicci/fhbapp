<?php
	/*
		Gibt Detailinformationen für den Nutzer mit der UID $_GET['uid'] zurück
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['uid'])) { // Request
			$dbh = new DBHandler();
			
			$UID 	= $_GET['uid'];

			$oStatement = $dbh->prepare('
				SELECT 	u.uid 			as "uid", 
						u.firstname 	as "firstname", 
						u.lastname 		as "lastname",
						u.email			as "email",
						u.city			as "city",
						g.gname			as "gname"
						
						
				FROM `user` u 
				LEFT OUTER JOIN `user2group` u2g ON (u.uid = u2g.uid)
				LEFT OUTER JOIN `group` g ON (u2g.gid = g.gid)
				
				WHERE u.uid = ?
				
				UNION
				
				SELECT 	u.uid 				as "uid", 
						u.firstname 		as "firstname", 
						u.lastname 			as "lastname",
						u.email				as "email",
						u.city				as "city",
						cg.cgname			as "gname"
				FROM `user` u
				LEFT OUTER JOIN `contact2contactgroup` c2cg ON (u.uid = c2cg.uid)
				LEFT OUTER JOIN `contactgroup` cg ON (cg.cgid = c2cg.cgid)
				
				WHERE u.uid = ?
				AND cg.uid = ?
				
				ORDER BY gname
				
				');
			
			$aContent = array($UID, $UID, $SSUID);
			$aResult = $dbh->query($oStatement, $aContent);
			
			$oStatement = $dbh->prepare('
				SELECT 	s.sdescription 	as "sdescription"
		
				FROM `user` u 
				JOIN `status` s ON (u.uid = s.uid)
				
				WHERE u.uid = ?
				
				ORDER BY s.screationdate DESC
				LIMIT 1
				');
				
			$aContent = array($UID);
			$aSubResult = $dbh->query($oStatement, $aContent);
			
			if(count($aSubResult)>0)
				$aSubResult = $aSubResult[0];
			else
				$aSubResult = array("sdescription" => null);
			
			JSONHelper::setHandler($handler);
			
			JSONHelper::addLB($sResult);
			JSONHelper::addKey($sResult,$handler);
			JSONHelper::addLB($sResult);
			
			if(count($aResult)>0) {
				$aGroups = array();
				foreach($aResult as $aRow) // get all groups
					if($aRow['gname']!=null)
						array_push($aGroups, $aRow['gname']);
				if(count($aGroups)<1)
					$aGroups = null;
					
				$aResult = $aResult[0]; // use only first result for user details
				unset($aResult['gname']);
				$aResult = array_merge($aResult, $aSubResult); // add description
				$aResult['groups'] = $aGroups; // add groups
				
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