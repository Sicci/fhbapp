<?php
	/*
		Erstellt eine Kontaktgruppe mit dem Namen $_GET['cgname']
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['cgname'])) { // Request
			$dbh = new DBHandler();
			
			$UID 			= $SSUID;
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

			#####################################################################
			
			$oStatement = $dbh->prepare('
				INSERT INTO `contactgroup`(`uid`,`cgname`)
				VALUES(?,?);
				');
			
			$aContent = array($UID, $CGNAME);
			$aResult = $dbh->query($oStatement, $aContent);
			
			#####################################################################
			
			$oStatement = $dbh->prepare('
				SELECT 	cg.cgid 	as "cgid"
		
				FROM `contactgroup` cg 
				
				WHERE cg.uid = ?
				
				ORDER BY cg.cgcreationdate DESC
				LIMIT 1
				');
				
			$aContent = array($UID);
			$aSubResult = $dbh->query($oStatement, $aContent);
			
			if(count($aSubResult)>0)
				$aSubResult = $aSubResult[0];
			else 
				throw new Exception("That shouldn't have happened!"); 
			
			$CGID = $aSubResult['cgid'];
			
			#####################################################################
			
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
			
			#####################################################################
			if(!$err && $CGID>0) {
				$addParams = array (
					"cgid" 		=> $CGID
				);
				JSONHelper::generateSuccess($sResult, $addParams);
			} else {
				JSONHelper::generateError($sResult, 'BadRequest');
			}
			$dbh = null;
		} else {
			JSONHelper::generateError($sResult, 'BadRequest');
		}
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);