<?php
$myFile = "logfile.txt";
$playerData =  "";
foreach($_POST['player'] as $var => $player) {
  $playerData .= " | " . $var ."->".$player;
}
$fh = fopen($myFile, 'a') or die("can't open file");

$stringData = "data: " . $_SERVER['REMOTE_ADDR'] . " / " . date('l jS \of F Y h:i:s A') . " - " . $playerData . "\n";

$stringData = "data: ".$_POST['time']." Player:".$playerData."\n";

fwrite($fh, $stringData);
fclose($fh);
?>