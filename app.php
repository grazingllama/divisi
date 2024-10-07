<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the database connection file
include 'config.php'; // Adjust the path if necessary

$conn = new mysqli(
    DATABASE_HOSTNAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Example data
$recording_id = 1; // The recording ID you want to add artists to
$artist_ids = [1, 2, 3]; // Example artist IDs

// Prepare the check statement
$check_stmt = $conn->prepare("SELECT 1 FROM RecordingArtists WHERE recording_id = ? AND artist_id = ?");
if (!$check_stmt) {
    die("Prepare failed for CHECK: " . $conn->error);
}

// Prepare the insert statement
$insert_stmt = $conn->prepare("INSERT INTO RecordingArtists (recording_id, artist_id) VALUES (?, ?)");
if (!$insert_stmt) {
    die("Prepare failed for INSERT: " . $conn->error);
}

foreach ($artist_ids as $artist_id) {
    // Check if the combination already exists
    $check_stmt->bind_param("ii", $recording_id, $artist_id);
    $check_stmt->execute();
    $check_stmt->store_result();

    if ($check_stmt->num_rows == 0) {
        // Insert if the combination does not exist
        $insert_stmt->bind_param("ii", $recording_id, $artist_id);
        if (!$insert_stmt->execute()) {
            die("Execute failed for INSERT: " . $insert_stmt->error);
        }
    }
}

// Close the statements
$check_stmt->close();
$insert_stmt->close();

// Prepare the SQL statement to fetch recording details
$sql = "SELECT 
            Recordings.id AS recording_id,
            DATE_FORMAT(Recordings.recording_date, '%d.%m.%Y') AS recording_date,
            Pieces.name AS piece_name,
            Pieces.info AS piece_info,
            Pieces.catalogue_number,
            Composers.name AS composer_name,
            Composers.info AS composer_info,
            GROUP_CONCAT(DISTINCT CONCAT(Artists.name, ' (', Artists.info, ')') SEPARATOR ', ') AS artist_details,
            RecordingLinks.link_sopran,
            RecordingLinks.link_alt,
            RecordingLinks.link_tenor,
            RecordingLinks.link_bass,
            RecordingLinks.link_general
        FROM 
            Recordings
        JOIN 
            Pieces ON Recordings.piece_id = Pieces.id
        JOIN 
            Composers ON Pieces.composer_id = Composers.id
        JOIN 
            RecordingArtists ON Recordings.id = RecordingArtists.recording_id
        JOIN 
            Artists ON RecordingArtists.artist_id = Artists.id
        JOIN 
            RecordingLinks ON Recordings.id = RecordingLinks.recording_id
        WHERE 
            Recordings.id = ?
        GROUP BY 
            Recordings.id";

// Prepare and execute the statement
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("Prepare failed for SELECT: " . $conn->error);
}
$stmt->bind_param("i", $recording_id);
if (!$stmt->execute()) {
    die("Execute failed for SELECT: " . $stmt->error);
}
$result = $stmt->get_result();

// Fetch the result
$data = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Recording Details</title>
</head>
<body>

<h1>Recording Details</h1>

<?php if ($data) { ?>
    <h2>Composer</h2>
    <p>Name: <?php echo $data['composer_name']; ?></p>
    <p>Info: <?php echo $data['composer_info']; ?></p>

    <h2>Piece</h2>
    <p>Name: <?php echo $data['piece_name']; ?></p>
    <p>Info: <?php echo $data['piece_info']; ?></p>
    <p>Catalogue Number: <?php echo $data['catalogue_number']; ?></p>

    <h2>Artists</h2>
    <p><?php echo $data['artist_details']; ?></p>

    <h2>Recording Date</h2>
    <p><?php echo $data['recording_date']; ?></p>

    <h2>Recording Links</h2>
    <p>Sopran: <a href="<?php echo htmlspecialchars($data['link_sopran']); ?>"><?php echo htmlspecialchars($data['link_sopran']); ?></a></p>
    <p>Alt: <a href="<?php echo htmlspecialchars($data['link_alt']); ?>"><?php echo htmlspecialchars($data['link_alt']); ?></a></p>
    <p>Tenor: <a href="<?php echo htmlspecialchars($data['link_tenor']); ?>"><?php echo htmlspecialchars($data['link_tenor']); ?></a></p>
    <p>Bass: <a href="<?php echo htmlspecialchars($data['link_bass']); ?>"><?php echo htmlspecialchars($data['link_bass']); ?></a></p>
    <p>General: <a href="<?php echo htmlspecialchars($data['link_general']); ?>"><?php echo htmlspecialchars($data['link_general']); ?></a></p>

<?php } else { ?>
    <p>No details found for the specified recording.</p>
<?php } ?>

</body>
</html>

<?php
// Close the statement and the database connection
$stmt->close();
$conn->close();
?>