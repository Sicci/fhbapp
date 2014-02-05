<?php
	/*
		Klasse für das Datenbank-PDO zur Kommunikation 
		mit dem Datenbank-Server
	*/
class DBHandler extends PDO{
	private $db_server;
	private $db_user;
	private $db_pass;
	private $db_base; 
	
	public $aLastResult;
	
	public function __construct() {
		
		$this->db_server = "localhost";
		$this->db_user = "fhbapp";
		$this->db_pass = "stecklina";
		$this->db_base = "p5112_db1"; 
		
		parent::__construct("mysql:host=$this->db_server;dbname=$this->db_base;charset=UTF8", $this->db_user, $this->db_pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
		$this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$this->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	}
	
	/* Ausführen des Queries und Fetchen der Ergebnisse */
	public function query(&$oStatement, $aParameters = array ()) {

		try {
			$this->beginTransaction();
			$oStatement->execute($aParameters);
			$this->commit();
			$aResult = $oStatement->fetchAll(PDO::FETCH_ASSOC);
			
		} catch (Exception $e) {
			$aResult = array('Error');
		}
		
		$this->aLastResult = $aResult;
		return $aResult;
	}
}