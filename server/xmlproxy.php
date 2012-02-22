<?php
$count = 1;
$url = 'http://zap-programme.fr/rss/rss.php?bouquet=2&day=now';
$xml = file_get_contents($url);

$xml = $xml.replace("<br>", "<br />");
$xml = $xml.replace("<br/>", "<br />");

header("Content-Type: text/xml");
echo $xml;
?>