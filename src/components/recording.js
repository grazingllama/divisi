import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MusicPlayer from './MusicPlayer';

const Recording = () => {
  const { recordingId } = useParams(); // Extract the recording ID from the URL params
  const [recording, setRecording] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the recording details based on the recordingId
    const fetchRecordingData = async () => {
      try {
        const response = await fetch(`https://divisi-project.de/getRecordingData.php?recording_id=${recordingId}`);
        const data = await response.json();
        setRecording(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching recording:', error);
        setIsLoading(false);
      }
    };

    fetchRecordingData();
  }, [recordingId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recording) {
    return <div>Recording not found</div>;
  }

  const { pieceName, catalogueNumber, pieceInfo, composer, artists, recordingDate } = recording;

  return (
    <div>
      <h1>{pieceName}</h1>
      <p>
        <Link to={`/composer/${composer.id}`}>{composer.name}</Link>
      </p>
      <p>Catalogue Number: {catalogueNumber}</p>
      <p>{pieceInfo}</p> {/* Display the additional piece info */}
      <div>
        <h4>Artists:</h4>
        <ul>
          {artists.map(artist => (
            <li key={artist.id}>
              <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <p>Recording Date: {new Date(recordingDate).toLocaleDateString()}</p>
      <MusicPlayer recording={recording} />
    </div>
  );
};

export default Recording;