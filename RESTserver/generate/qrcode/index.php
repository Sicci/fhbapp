<?php
	/*
		Generiert QR-Code aus dem Request-Code $_GET['qrrequest']
	*/
    include('./lib/qrlib.php');
        
	if(isset($_GET['qrrequest'])) {
		$qrrequest = $_GET['qrrequest'];
		QRcode::png($qrrequest);
	} else {
		
	}