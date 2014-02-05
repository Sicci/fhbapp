<?php
	/*
		Gibt die Position eines gesuchten Nutzers mit der UserID $_GET['uid']
		und den Pfad zu ihm zurück, falls er Nutzer (Anfragensteller) sich in der FH befindet
		[für den Benutzer mit der UID $SSUID]
	*/
	include_once('../../config.php');
	SESSIONHelper::init($SSUID);
	
	if(!is_null($SSUID)) { // Session
		if(isset($_GET['uid'])&&isset($_GET['infh'])) { // Request
			$dbh = new DBHandler();
			
			$UID = $SSUID;
			$TARGETUID = $_GET['uid'];
			$INFH = ($_GET['infh']!=1)?0:1;
			
			$aLastPositionSender["geolat"] = 0.0;
			$aLastPositionSender["geolng"] = 0.0;

			$aLastPositionTarget["geolat"] = 0.0;
			$aLastPositionTarget["geolng"] = 0.0;
			
			#####################################################################
			if($INFH) {
				$oStatement = $dbh->prepare('
					SELECT 	u.uid as "uid", 
							u.firstname as "firstname",
							r.rname as "rname", 
							r.floor as "floor",
							r.building as "building",
							r.geolat as "geolat",
							r.geolng as "geolng"
							
					FROM `status` s
					JOIN `user` u ON (s.uid = u.uid)
					JOIN `room` r ON (s.rid = r.rid)
					
					WHERE u.uid = ?
					
					ORDER BY s.screationdate DESC
					LIMIT 1
					');
				
				$aContent = array($UID);
				$aResult = $dbh->query($oStatement, $aContent);
				
				
				$aLastPositionSender = (isset($aResult[0]))?$aResult[0]:null;
			}
			#####################################################################
			
			$oStatement = $dbh->prepare('
				SELECT 	u.uid as "uid", 
						u.firstname as "firstname",
						u.lastname as "lastname",
						r.rname as "rname", 
						r.floor as "floor",
						r.building as "building",
						r.geolat as "geolat",
						r.geolng as "geolng"
						
				FROM `status` s
				JOIN `user` u ON (s.uid = u.uid)
				JOIN `room` r ON (s.rid = r.rid)
				
				WHERE u.uid = ?
				
				ORDER BY s.screationdate DESC
				LIMIT 1
				');
			
			$aContent = array($TARGETUID);
			$aResult = $dbh->query($oStatement, $aContent);
			
			
			$aLastPositionTarget = (isset($aResult[0]))?$aResult[0]:null;
			
			#####################################################################
			
			$err = false;
			if((is_null($aLastPositionSender["geolat"]))
			 ||(is_null($aLastPositionSender["geolng"]))
			 ||(is_null($aLastPositionTarget["geolat"]))
			 ||(is_null($aLastPositionTarget["geolng"]))) { 
				$err = true; 
			 };
			
			if(!$err) {
				$geopath = "";
				$inSameBuilding = false;
				if($INFH) {
				
					// Du befindest dich ...
					$geopath.= sprintf("Du befindest dich im %s.", $aLastPositionSender["building"]);	
					
					if($aLastPositionSender["building"]==$aLastPositionTarget["building"]) {
						$geopath.= sprintf(" Die gesuchte Person ist ebenfalls hier.");
						$inSameBuilding = true;
						
						if($aLastPositionSender["floor"]==$aLastPositionTarget["floor"]) {
							if($aLastPositionSender["rname"]==$aLastPositionTarget["rname"]) {
								$geopath.= sprintf(" Ihr seid beide im selben Raum.");
							} else {
								$geopath.= sprintf(" Ihr seid im selben Stockwerk.");
								$geopath.= sprintf(" Begib dich in %s.", $aLastPositionTarget["rname"]);
							}
						}
					} else {
						// Verlasse ... in Richtung ...
						$geopath .= sprintf(" Verlasse dieses durch den Haupteingang in Richtung ");
						switch ($aLastPositionSender["building"]) {
							default: $geopath.= sprintf("Süden"); break;
						}


					
						switch($aLastPositionSender['building']) {

							case "Technikgebäude":
								switch($aLastPositionTarget['building']) {

									case "Informatikgebäude":
										$geopath.= sprintf(" und wende dich nach Osten.");
										$geopath.= sprintf(" Folge dem Weg 30m bis zum großen, gelben Gebäude (links).");
										break;
										
									case "Wirtschaftsgebäude":
										$geopath.= sprintf(" und wende dich nach Osten.");
										$geopath.= sprintf(" Folge dem Weg etwa 20m.");
										$geopath.= sprintf(" Biege nun links ab und gehe 50m in nördliche Richtung auf das rote Gebäude zu.");
										break;
								}
								break;
								
							case "Informatikgebäude":
								switch($aLastPositionTarget['building']) {
									case "Technikgebäude":
										$geopath.= sprintf(" und wende dich nach Westen.");
										$geopath.= sprintf(" Folge dem Weg 30m bis zum gelben Gebäude (rechts).");
										break;
										
									case "Wirtschaftsgebäude":
										$geopath.= sprintf(" und wende dich nach Westen.");
										$geopath.= sprintf(" Folge dem Weg 10m.");
										$geopath.= sprintf(" Biege nun rechts ab und gehe 50m in nördliche Richtung auf das rote Gebäude zu.");
										break;
								}
								break;
								
							case "Wirtschaftsgebäude":
								switch($aLastPositionTarget['building']) {
									case "Technikgebäude":
										$geopath.= sprintf(" und folge dem sich anschließenden Weg etwa 50m.");
										$geopath.= sprintf(" Biege nun rechts ab und gehe weitere 20m bis zum gelben Gebäude(rechts).");
										break;
										
									case "Informatikgebäude":
										$geopath.= sprintf(" und folge dem sich anschließenden Weg etwa 50m.");
										$geopath.= sprintf(" Biege nun rechts ab und gehe weitere 10m bis zum gelben Gebäude(links).");
										break;
								}
								break;
						}
					}
				}
				
				if(!$inSameBuilding) {
					$geopath.= sprintf(" Du befindest dich nun vor dem %s. Gehe hinein.", $aLastPositionTarget["building"]);
					if($aLastPositionTarget["floor"]!=0)
						$geopath.= sprintf(" Begib dich in den %s. Stock. Dort", $aLastPositionTarget["floor"]);
					else 
						$geopath.= sprintf(" Im Erdgeschoss");
					$geopath.= sprintf(" findest du %s in %s.", $aLastPositionTarget["firstname"], $aLastPositionTarget["rname"]);
				}

				#####################################################################
				
				JSONHelper::setHandler($handler);
				
				JSONHelper::addLB($sResult);
				JSONHelper::addKey($sResult,$handler);
				JSONHelper::addLB($sResult);
				
				JSONHelper::addKey($sResult,'sender');
				JSONHelper::addLB($sResult);
				$aResult = array (
					'geolat' => $aLastPositionSender["geolat"],
					'geolng' => $aLastPositionSender["geolng"]
				);
				JSONHelper::addKeyValues($sResult, $aResult);
				JSONHelper::addRB($sResult);
				JSONHelper::addC($sResult);

				JSONHelper::addKey($sResult,'target');
				JSONHelper::addLB($sResult);
				$aResult = array (
					'geolat' => $aLastPositionTarget["geolat"],
					'geolng' => $aLastPositionTarget["geolng"],
					'firstname' => $aLastPositionTarget["firstname"],
					'lastname' => $aLastPositionTarget["lastname"]
				);
				JSONHelper::addKeyValues($sResult, $aResult);
				JSONHelper::addRB($sResult);
				JSONHelper::addC($sResult);
				
				JSONHelper::addKey($sResult,'geopath');
				JSONHelper::addValue($sResult,$geopath);
				JSONHelper::trimLast($sResult);
				
				JSONHelper::addRB($sResult);
				JSONHelper::addRB($sResult);
			} else {
				JSONHelper::generateError($sResult, 'BadDatabase');
			}
			
			$dbh = null;
		} else {
			JSONHelper::generateError($sResult, 'BadRequest');
		}
	} else {
		JSONHelper::generateError($sResult, 'NoSession');
	}
	JSONHelper::doRequestSplit($sResult);