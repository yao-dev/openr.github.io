<?php
if(isset($_POST['id'])){
	echo file_get_contents('https://maps.googleapis.com/maps/api/place/details/json?placeid='.$_POST["id"].'&key=API_KEY');
}

// if(isset($_POST['origin'] && $_POST['destination'])){
// 	echo file_get_contents('https://maps.googleapis.com/maps/api/distancematrix/json?origins='.$_POST['origin'].'&destinations='.$_POST['destination'].'&mode=WALKING&language=fr-FR&key=AIzaSyCN_eZmq6P1ptPsvE0wa8MYrrJfwfRaTfU');
// }


