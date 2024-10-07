import { Link } from 'react-router-dom';

const RecordingBlock = ({ pieceName, catalogueNumber, composerName, composerId, recordingId, artistNames = [], artistIds = [] }) => {
    // Log the data being passed to RecordingBlock for clarity
    console.log("RecordingBlock props:", { pieceName, catalogueNumber, composerName, artistNames, artistIds });

    // Ensure artistNames and artistIds are arrays, and safely map over them
    const artists = Array.isArray(artistNames) ? artistNames.map((name, index) => ({
        name,
        id: artistIds[index] || null // Use null if artistId is not available
    })) : [];

    return (
        <div className="recordingContainer">
            <div className="pieceName">
                <h4>
                    <Link to={`/recording/${recordingId}`}>
                        {pieceName}, {catalogueNumber}
                    </Link>
                </h4>
            </div>
            <div className="listComposerAndArtists">
                <p>
                    <Link to={`/composer/${composerId}`}>{composerName}</Link> ·{' '}
                    {artists.map((artist, index) => (
                        <span key={artist.id || index}>
                            <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                            {index < artists.length - 1 && ', '}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
};

export default RecordingBlock;
