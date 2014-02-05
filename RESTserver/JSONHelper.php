<?php
	/*
		Klasse zur Hilfe von JSON-Generierung
		und Annahme von AJAX-Requests
	*/
class JSONHelper{

	public function __construct() {
	}
	
	// Objekte hinzufügen, die als mehrdimensionale Arrays strukturiert sind
	public static function addArrayObjects(&$sResult, $aContent) {
		if(count($aContent)>0) {
			foreach ($aContent as $aValue) {
				JSONHelper::addLB($sResult);
				JSONHelper::addKeyValues($sResult, $aValue);
				JSONHelper::addRB($sResult);
				JSONHelper::addC($sResult);
			}
			JSONHelper::trimLast($sResult);
		}
	}
	
	// Array aus Key/Value-Paaren hinzufügen
	public static function addKeyValues(&$sResult, $aContent) {
		if(count($aContent)>0) {
			foreach ($aContent as $key => $value) {
				JSONHelper::addKey($sResult, $key);
				JSONHelper::addValue($sResult, $value);
			}
			JSONHelper::trimLast($sResult);
		}
	}
	
	// Einzelnen Key hinzufügen
	public static function addKey(&$sResult, $sKey) {
		if(strlen($sKey)>0) {
			$sResult.= sprintf("\"%s\":", $sKey);
		}
	}
	
	// Einzelnen Value hinzufügen (mit Typüberprüfung)
	public static function addValue(&$sResult, $xValue) {
		if(!is_null($xValue)) {
			if(is_numeric($xValue)) { // Number
				$sResult.= sprintf("%s",$xValue);
			} else {
				if(is_string($xValue)) { // String
					$sResult.= sprintf("\"%s\"",$xValue);
				} else {
					if(is_bool($xValue)) {
						$sResult.= sprintf("%s",($xValue!=true)?"false":"true");
					} else {
						if(is_array($xValue)) { // Array
							JSONHelper::addLAB($sResult);
							foreach($xValue as $aContent) {
								if(is_array($aContent)) { // Sub-Array-Content -> New Object
									JSONHelper::addLB($sResult);
									foreach ($aContent as $key => $value) {
										JSONHelper::addKey($sResult, $key);
										JSONHelper::addValue($sResult, $value);
									}
									JSONHelper::trimLast($sResult);
									JSONHelper::addRB($sResult);
								} else { // Array-Content -> Value
									JSONHelper::addValue($sResult, $aContent);
									JSONHelper::trimLast($sResult);
								}
								JSONHelper::addC($sResult);
							}
							JSONHelper::trimLast($sResult);
							JSONHelper::addRAB($sResult);
						}
					}
				}
			}
		}else{
			$sResult.= sprintf("%s","null");
		}
		JSONHelper::addC($sResult);
	}
	
	// Handler für Rückgabeobjekt aus Pfad generieren und setzen z.B. {"dologin":{...}} aus do/login/
	public static function setHandler(&$handler) {
		$path_info = pathinfo($_SERVER["SCRIPT_FILENAME"]);
		$path = $path_info["dirname"];
		$x = explode("/",$path);
		$handler = $x[count($x)-2].$x[count($x)-1];
	}
	
	// Fehler-Rückgabe generieren
	public static function generateError(&$sResult, $msg = "unknown") {
			JSONHelper::setHandler($handler);
			
			JSONHelper::addLB($sResult);
			JSONHelper::addKey($sResult,$handler);
			JSONHelper::addLB($sResult);
			
			JSONHelper::addKey($sResult,'error');
			JSONHelper::addValue($sResult, $msg);
			JSONHelper::trimLast($sResult);
			
			JSONHelper::addRB($sResult);
			JSONHelper::addRB($sResult);	
	}
	
	// Erfolg-Rückgabe generieren
	public static function generateSuccess(&$sResult, $addParams = array()) {
			JSONHelper::setHandler($handler);
			
			JSONHelper::addLB($sResult);
			JSONHelper::addKey($sResult,$handler);
			JSONHelper::addLB($sResult);
			
			JSONHelper::addKey($sResult,'success');
			JSONHelper::addValue($sResult, 1);
			if(count($addParams)>0)
				JSONHelper::addKeyValues($sResult, $addParams);
			else
				JSONHelper::trimLast($sResult);
			JSONHelper::addRB($sResult);
			JSONHelper::addRB($sResult);	
	}
	
	// Unterscheidung ob JSON oder JSONP je nach Anfragetyp
	public static function doRequestSplit(&$data) {
		if(array_key_exists('callback', $_GET)){
			header('Content-Type: text/javascript; charset=utf8');
			header('Access-Control-Allow-Origin: *');
			header('Access-Control-Max-Age: 3628800');
			header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

			$callback = $_GET['callback'];
			echo $callback.'('.$data.');';
		} else {
			header('Content-Type: application/json; charset=utf8');
			echo $data;
		}
	}
	
	// Neues Objekt beginnen
	public static function addLB (&$sResult) {
		$sResult.= sprintf("{");
	}
	
	// Neues Objekt schließen
	public static function addRB (&$sResult) {
		$sResult.= sprintf("}");
	}
	
	// Neuen Array beginnen
	public static function addLAB (&$sResult) {
		$sResult.= sprintf("[");
	}
	
	// Neuen Array schließen
	public static function addRAB (&$sResult) {
		$sResult.= sprintf("]");
	}
	
	// Komma hinzufügen
	public static function addC (&$sResult) {
		$sResult.= sprintf(",");
	}
	
	// Letztes Zeichen entfernen
	public static function trimLast(&$sResult) {
		$sResult = substr($sResult, 0, -1);
	}
}