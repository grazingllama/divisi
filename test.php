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
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web-App</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
    />
    <link rel="stylesheet" href="style/main.css" />
  </head>
  <body>
    <header class="header">
      <div class="info">
        <div class="komponist">
          <a href="https://d-nb.info/gnd/116514728">Karl Hasse</a> &mdash;
        </div>
        <div class="stueck">Herr, strafe mich nicht</div>
      </div>
      <div class="logo">
        <a href="#">
          <img
            class="logo-divisi"
            src="media/logo-divisi.png"
            alt="Logo Divisi"
          />
        </a>
      </div>
      <div class="menu"></div>
    </header>
    <div class="content">
      <svg
        class="ensemble"
        viewBox="0 0 1920 1080"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xml:space="preserve"
        xmlns:serif="http://www.serif.com/"
        style="
          fill-rule: evenodd;
          clip-rule: evenodd;
          stroke-linejoin: round;
          stroke-miterlimit: 2;
        "
      >
        <path
          id="mic1"
          alt="Sopran"
          d="M34.678,449.752c121.73,-106.104 261.874,-191.608 414.975,-251.058l104.924,270.84c-119.375,46.358 -228.82,112.68 -324.229,194.857l-195.67,-214.639Z"
        />
        <path
          id="mic2"
          alt="Alt"
          d="M470.839,190.665c148.438,-54.883 308.64,-85.415 475.746,-86.736l0,290.414c-130.121,1.297 -254.939,24.915 -370.806,67.205l-104.94,-270.883Z"
        />
        <path
          id="mic3"
          alt="Tenor"
          d="M969.24,103.929c167.106,1.321 327.308,31.853 475.747,86.736l-104.941,270.883c-115.866,-42.29 -240.685,-65.908 -370.806,-67.205l0,-290.414Z"
        />
        <path
          id="mic4"
          alt="Bass"
          d="M1466.17,198.694c153.102,59.45 293.246,144.954 414.975,251.058l-195.67,214.639c-95.408,-82.177 -204.854,-148.499 -324.228,-194.857l104.923,-270.84Z"
        />

        <text id="text1">Sopran</text>
        <text id="text2">Alt</text>
        <text id="text3">Tenor</text>
        <text id="text4">Bass</text>
      </svg>
    </div>
    <div class="footer">
      <div class="about"></div>
      <div class="controls">
        <div class="main-controls">
          <button id="play-pause">
            <img src="media/play-fill.svg" alt="Play" />
          </button>
        </div>
        <div class="volume"></div>
      </div>
    </div>

    <style>
      * {
        margin: 0;
        padding: 0;
        text-decoration: none;
      }

      body {
        background-color: black;
        height: 100vh;
        overflow: hidden;
      }

      a {
        color: inherit;
      }

      .header {
        height: 80px;
        margin: 0 10px;
        padding: 0;
        position: relative;
      }

      .info {
        position: absolute;
        font-family: "Noto Serif", serif;
        margin: 0;
        top: 50%;
        left: 0;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
      }

      .komponist {
        font-size: 1.25rem;
        font-weight: 500;
        color: lightgray;
      }

      .komponist a:hover {
        color: rgb(173, 173, 173);
      }

      .stueck {
        font-size: 1.75rem;
        font-style: italic;
        font-weight: 600;
        color: white;
      }

      .content {
        background-color: rgb(23, 23, 23);
        margin: 5px 10px;
        border-radius: 7.5px;
        max-height: 75%;
      }

      svg path {
        fill: rgb(80, 74, 207);
      }

      svg path:hover {
        fill: rgb(65, 61, 149);
        transition: 0.2s;
        cursor: pointer;
      }

      .ensemble {
        width: 100%;
        height: 100%;
      }

      .logo-divisi {
        position: absolute;
        height: 35px;
        width: auto;
        margin: 0;
        top: 50%;
        right: 0;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
      }

      .logo-divisi:hover {
        height: 34px;
        width: auto;
        transition: 0.2s;
      }

      text {
        fill: white;
        font-size: 40px;
        text-anchor: middle;
        dominant-baseline: middle;
        font-family: "Trajan Pro";
      }

      #play-pause {
        cursor: pointer;
        border: none;
        margin: none;
        padding: none;
        background: none;
      }

      #play-pause-btn > img {
        height: 40px;
      }

      .playing {
        color: red;
      }
    </style>

    <script>
      function calculatePathCentroid(path) {
        const length = path.getTotalLength();
        let sumX = 0,
          sumY = 0,
          points = 0;

        for (let i = 0; i <= length; i += 10) {
          // Sample points along the path
          const point = path.getPointAtLength(i);
          sumX += point.x;
          sumY += point.y;
          points++;
        }

        return {
          x: sumX / points,
          y: sumY / points,
        };
      }

      function placeTextAtPathCenter(textId, pathId) {
        const path = document.getElementById(pathId);
        const text = document.getElementById(textId);
        const centroid = calculatePathCentroid(path);
        text.setAttribute("x", centroid.x);
        text.setAttribute("y", centroid.y);
      }

      placeTextAtPathCenter("text1", "mic1");
      placeTextAtPathCenter("text2", "mic2");
      placeTextAtPathCenter("text3", "mic3");
      placeTextAtPathCenter("text4", "mic4");

      const audioContext = new(window.AudioContext || window.webkitAudioContext)();

        const audioFiles = ['audio/sopran.mp4', 'audio/alt.mp4', 'audio/tenor.mp3', 'audio/bass.mp3'];
        const buffers = [];
        const sources = [];
        const gains = [];
        let isPlaying = false;
        let startTime = 0;
        let pausedAt = 0;
        let currentMicIndex = 0;
        let duration = 0;

        async function loadAudioFiles() {
            try {
                for (const file of audioFiles) {
                    const response = await fetch(file);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    buffers.push(audioBuffer);
                    if (audioBuffer.duration > duration) {
                        duration = audioBuffer.duration;
                    }
                }
                document.getElementById('seekbar').max = duration;
                console.log('Audio files loaded');
            } catch (error) {
                console.error('Error loading audio files:', error);
            }
        }

        function setupAudioNodes(startOffset) {
            buffers.forEach((buffer, index) => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                sources[index] = source;

                const gainNode = audioContext.createGain();
                gainNode.gain.value = index === currentMicIndex ? 1 : 0;
                gains[index] = gainNode;

                source.connect(gainNode).connect(audioContext.destination);
                source.start(0, startOffset);
            });
        }

        function playAllBuffers() {
            setupAudioNodes(pausedAt);
            startTime = audioContext.currentTime - pausedAt;
            isPlaying = true;
            updateSeekbar();
        }

        function pauseAllBuffers() {
            if (!isPlaying) return;

            sources.forEach(source => source.stop());
            pausedAt = audioContext.currentTime - startTime;
            isPlaying = false;
        }

        function switchMicrophonePlacement(index) {
            if (!isPlaying) return;
            currentMicIndex = index;

            const fadeDuration = 1;
            gains.forEach((gain, i) => {
                if (i === index) {
                    gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
                    gain.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeDuration);
                } else {
                    gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
                    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
                }
            });
        }

        function updateSeekbar() {
            if (isPlaying) {
                const currentTime = audioContext.currentTime - startTime;
                document.getElementById('seekbar').value = currentTime;
                requestAnimationFrame(updateSeekbar);
            }
        }

        const btnPlayPause = document.getElementById('play-pause');

        btnPlayPause.addEventListener('click', () => {
            if (btnPlayPause.classList.contains('playing')) {
                pauseAllBuffers();
                btnPlayPause.classList.remove('playing');
                btnPlayPause.innerHTML = "<img src='media/play-fill.svg' alt='Play'/>";
            } else {
                if (buffers.length > 0) {
                    playAllBuffers();
                    btnPlayPause.classList.add('playing');
                    btnPlayPause.innerHTML = "<img src='media/pause-fill.svg' alt='Pause'/>";
                    document.getElementById('seekbar').value = pausedAt;
                } else {
                    console.error('Audio buffers not loaded yet.');
                }
            }
        });

        document.getElementById('mic1').addEventListener('click', () => {
            switchMicrophonePlacement(0);
        });

        document.getElementById('mic2').addEventListener('click', () => {
            switchMicrophonePlacement(1);
        });

        document.getElementById('mic3').addEventListener('click', () => {
            switchMicrophonePlacement(2);
        });

        document.getElementById('mic4').addEventListener('click', () => {
            switchMicrophonePlacement(3);
        });

        document.getElementById('seekbar').addEventListener('input', (event) => {
            const seekTime = parseFloat(event.target.value);
            if (isPlaying) {
                pauseAllBuffers();
                pausedAt = seekTime;
                playAllBuffers();
            } else {
                pausedAt = seekTime;
            }
        });

        window.onload = async () => {
            pausedAt = 0; // Reset pausedAt to 0 on reload
            document.getElementById('seekbar').value = 0; // Reset seekbar to 0 on reload
            await loadAudioFiles();
        };
    </script>
  </body>
</html>




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