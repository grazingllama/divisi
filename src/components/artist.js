import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecordingBlock from './recording-block'; // Import RecordingBlock

const ArtistPage = () => {
    const { id } = useParams(); // Get the artist ID from the URL
    const [artist, setArtist] = useState(null);
    const [recordings, setRecordings] = useState([]);

    useEffect(() => {
        // Fetch artist data from the new API endpoint
        fetch(`https://divisi-project.de/getArtistData.php?artist_id=${id}`)
            .then(response => response.json())
            .then(data => {
                setArtist(data.artist); // Assuming the API returns { artist: { ... }, recordings: [ ... ] }
                setRecordings(data.recordings);
            })
            .catch(error => console.error('Error fetching artist details:', error));
    }, [id]);

    if (!artist) return <div>Loading...</div>;

    return (
        <div>
            <h1>{artist.name}</h1>
            <p>{artist.info}</p>

            <h2>Recordings</h2>
            <ul>
                {recordings.map(recording => (
                    <li key={recording.recording_id}>
                        {/* Use the RecordingBlock component */}
                        <RecordingBlock
                            pieceName={recording.piece_name}
                            catalogueNumber={recording.catalogue_number}
                            composerName={recording.composer_name} // Composer name from recording data
                            composerId={recording.composer_id} // Composer ID from recording data
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

export default ArtistPage;