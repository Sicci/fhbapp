<?php
	/*
		Versucht die Authentifizierung eines Users mit dem 
		LoginNamen $_GET['uname'] und dem LoginPasswort $_GET['upassword'] durchzuführen 
	*/
	include_once('../../DBHandler.php');
	include_once('../../JSONHelper.php');

	if(isset($_GET['uname'])&&isset($_GET['upassword'])) {

		$dbh = new DBHandler();
		
		$UNAME = $_GET['uname'];
		$UPASSWORD = $_GET['upassword'];

		$oStatement = $dbh->prepare('
			SELECT 	l.uid 			as "uid", 
					u.firstname		as "firstname",
					u.lastname		as "lastname",
					u.istutor 		as "istutor", 
					u.email 		as "email",
					u2g.gid			as "gids"
					
			FROM `login` l 
			JOIN `user` u 			ON (l.uid = u.uid)
			JOIN `user2group` u2g 	ON (u.uid = u2g.uid)
			
			WHERE uname = ?
			AND upassword = ?
			
			');
		
		$aContent = array($UNAME, $UPASSWORD);
		$aResult = $dbh->query($oStatement, $aContent);
		
		if(count($aResult)>0) {
		
			JSONHelper::setHandler($handler);
			
			JSONHelper::addLB($sResult);
			JSONHelper::addKey($sResult,$handler);
			JSONHelper::addLB($sResult);

			$gids = array();
			array_push($gids, 0);
			
			foreach($aResult as $aRow)
				array_push($gids, $aRow['gids']);
			
			$aRow = $aResult[0];
			$aRow['gids'] = $gids;
				
			session_start();
			if(isset($_SESSION['uid'])) {
				session_unset();
				session_regenerate_id(true);
			}
			$_SESSION['uid'] = $aRow['uid'];
			
			JSONHelper::addKey($sResult,'ssid');
			JSONHelper::addValue($sResult,session_id());

			$aContent = array(
				'uid' 		=> $aRow['uid'],
				'firstname' => $aRow['firstname'],
				'lastname'  => $aRow['lastname'],
				'istutor' 	=> $aRow['istutor'],
				'email' 	=> $aRow['email'],
				'gids'		=> $aRow['gids']
			);
			
			JSONHelper::addKeyValues($sResult,$aContent);
			JSONHelper::addRB($sResult);
			JSONHelper::addRB($sResult);
		} else {
			JSONHelper::generateError($sResult, 'NotFound');
		}
		
		$dbh = null;
	} else {
		JSONHelper::generateError($sResult, 'BadRequest');
	}
	JSONHelper::doRequestSplit($sResult);