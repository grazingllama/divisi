import React, { useState, useEffect } from 'react';
import RecordingBlock from './recording-block'; // Assuming you have a RecordingBlock component
import MusicPlayer from './player'; // Import the MusicPlayer component

const Recordings = () => {
    const [recordings, setRecordings] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null);
    const [currentRecording, setCurrentRecording] = useState(null); // State to hold the current recording for the MusicPlayer

    useEffect(() => {
        // Fetch recordings from the API
        fetch('https://divisi-project.de/getRecordings.php') // Adjust this URL to your actual API endpoint
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Recordings Data:', data); // Log the fetched data to inspect it
                setRecordings(data); // Set the recordings data in state
                setIsLoading(false); // Turn off loading state once data is fetched
            })
            .catch(error => {
                console.error('Error fetching recordings:', error); // Log any error during fetch
                setError('Error fetching recordings'); // Set error message in state
                setIsLoading(false); // Turn off loading state if error occurs
            });
    }, []);

    const handlePlayClick = (recording) => {
        setCurrentRecording(recording); // Set the selected recording to play in the MusicPlayer
    };

    if (isLoading) return <div>Loading recordings...</div>; // Display a loading message while fetching data
    if (error) return <div>{error}</div>; // Display an error message if something goes wrong

    return (
        <div>
            <h1>Recordings</h1>
            {recordings.length === 0 ? (
                <p>No recordings found.</p>
            ) : (
                <ul>
                    {recordings.map(recording => (
                        <li key={recording.id}>
                            <RecordingBlock
                                pieceName={recording.piece_name}
                                catalogueNumber={recording.catalogue_number}
                                composerName={recording.composer_name}
                                composerId={recording.composer_id} // Assuming you have composerId in data
                                recordingId={recording.id}
                                artistNames={recording.artist_names || []}
                                artistIds={recording.artist_ids || []} // Pass artist IDs correctly
                            />
                            <button onClick={() => handlePlayClick(recording)}>
                                Play this Recording
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Music Player: only show when a recording is selected */}
            {currentRecording && (
                <MusicPlayer
                    url={currentRecording.complete_recording} // Pass the recording URL to the player
                    targetVolume={0.8} // Adjust the volume as needed
                    playing={true} // Automatically start playing when a recording is selected
                />
            )}
        </div>
    );
};

export default Recordings;