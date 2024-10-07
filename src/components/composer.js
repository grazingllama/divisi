import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecordingBlock from './recording-block'; // Import RecordingBlock

const ComposerPage = () => {
    const { id } = useParams(); // Get the composer/composer ID from the URL
    const [composer, setComposer] = useState(null);
    const [recordings, setRecordings] = useState([]);

    useEffect(() => {
        // Fetch composer details and recordings
        fetch(`https://divisi-project.de/getComposerData.php?composer_id=${id}`)
            .then(response => response.json())
            .then(data => {
                setComposer(data.composer); // Set composer details
                setRecordings(data.recordings); // Set recordings
            })
            .catch(error => console.error('Error fetching composer details:', error));
    }, [id]);

    if (!composer) return <div>Loading...</div>;

    return (
        <div>
            <h1>{composer.name}</h1>
            <p>{composer.info}</p>

            <h2>Recordings</h2>
            <ul>
                {recordings.map(recording => (
                    <li key={recording.recording_id}>
                        {/* Use the RecordingBlock component */}
                        <RecordingBlock
                            pieceName={recording.piece_name}
                            catalogueNumber={recording.catalogue_number}
                            composerName={composer.name} // Since we know this is the composer's page
                            composerId={id} // Composer ID from URL params
                            recordingId={recording.recording_id} // Recording ID for linking to detail page
                            artistNames={recording.artists.map(artist => artist.name)} // Pass artist names
                            artistIds={recording.artists.map(artist => artist.id)} // Pass artist IDs
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComposerPage;