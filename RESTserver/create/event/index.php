<?php
	/*
		Erstellt ein Event mit dem Namen $_GET['ename'] am Datum $_GET['edate'] 
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);

	if(!is_null($SSUID)) { // Session
		if(isset($_GET['ename'])&&isset($_GET['edate'])) { // Request
			$dbh = new DBHandler();
		
			$UID 			= $SSUID;
			$ENAME 			= $_GET['ename'];
			$EDESCRIPTION	= (isset($_GET['edescription']))?$_GET['edescription']:"Keine Beschreibung vorhanden";
			$EDATE 			= date("Y-m-d H:i:s",$_GET['edate']);
			$EQRCONTENT 	= uniqid();
				
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
				INSERT INTO `event`(`uid`,`ename`, `edescription`, `edate`, `eqrcontent`)
				VALUES(?,?,?,?,?);
				');
			
			$aContent = array($UID, $ENAME, $EDESCRIPTION, $EDATE, $EQRCONTENT);
			$aResult = $dbh->query($oStatement, $aContent);
			
			#####################################################################
			
			$oStatement = $dbh->prepare('
				SELECT 	e.eid 	as "eid"
		
				FROM `event` e 
				
				WHERE e.uid = ?
				
				ORDER BY e.ecreationdate DESC
				LIMIT 1
				');
				
			$aContent = array($UID);
			$aSubResult = $dbh->query($oStatement, $aContent);
			
			if(count($aSubResult)>0)
				$aSubResult = $aSubResult[0];
			else 
				throw new Exception("That shouldn't have happened!"); 
			
			$EID = $aSubResult['eid'];
			
			#####################################################################
			
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
			
			#####################################################################
			if(!$err && $EID>0) {
				$addParams = array (
					"eid" 		=> $EID
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