<?php
	$url = null;
	$count = 1;
	
	if(isset($_GET['now'])) {
		$url = 'http://www.zap-programme.fr/rss/rss.php?bouquet=2&day=now';
	} else if(isset($_GET['tonight'])) {
		$url = 'http://programme-tv.orange.fr/rss/fluxRssProgrammeSoiree.xml';
	}
	
	$xml = file_get_contents($url);
	
	if(isset($_GET['now'])) {
		$xml = delreturn($xml, $count);
	}
	
	header("Content-Type: text/xml");
	echo $xml;
	
	function delreturn($str, $count) {
	   $str = preg_replace("/(\r\n|\n|\r)/", "", $str, $count);
	   return preg_replace("=<br */?>=i", "\n", $str, $count);
	}
?>