<?php
//Connect To Database
$hostname='sql8.freemysqlhosting.net';
$username='sql8111122';
$password='w8hpzgbYTm';
$dbname='sql8111122';
$usertable='prog_users';
$yourfield = 'username';

mysql_connect($hostname,$username, $password) OR DIE ('Unable to connect to database! Please try again later.');
mysql_select_db($dbname);

$query = 'SELECT * FROM ' . $usertable;
$result = mysql_query($query);
if($result) {
    while($row = mysql_fetch_array($result)){
        $name = $row[$yourfield];
        echo 'Name: ' . $name;
    }
}
else {
print "Database NOT Found ";
mysql_close($db_handle);
}
?>
