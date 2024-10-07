import { Link } from 'react-router-dom';

const RecordingBlock = ({ pieceName, catalogueNumber, composerName, composerId, recordingId, artistNames = [], artistIds = [] }) => {
    // Pair artist names with their corresponding IDs
    const artists = artistNames.map((name, index) => ({
        name,
        id: artistIds[index] // Ensure that artist IDs match the names
    }));

    return (
        <div className="recordingContainer">
            <div className="pieceName">
                {/* Link to the recording page */}
                <h4>
                    <Link to={`/recording/${recordingId}`}>
                        {pieceName}, {catalogueNumber}
                    </Link>
                </h4>
            </div>
            <div className="listComposerAndArtists">
                {/* Link to the composer's page */}
                <p>
                    <Link to={`/composer/${composerId}`}>{composerName}</Link> ·{' '}
                    {/* Render artist links with commas between artists */}
                    {artists.map((artist, index) => (
                        <span key={artist.id}>
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
