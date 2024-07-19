<?php

require __DIR__ . "/config.php";

$mysqli = new mysqli(
    DATABASE_HOSTNAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME);


$sql = "SELECT titel, werkverz FROM werke";
$result = mysqli_query($mysqli, $sql);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<p>" . $row["titel"] . ", " . $row["werkverz"] . "</p>";
    }
} else {
    echo "<p>kein Eintrag vorhanden</p>";
}

mysqli_close($mysqli);


?>