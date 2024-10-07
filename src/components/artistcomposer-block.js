import { Link } from 'react-router-dom';

function ArtistComposerBlock({ name, category, id }) {
    return (
        <div className="artistComposerContainer">
            <div className="artistComposerName">
                {/* Link to the artist or composer page */}
                <h4>
                    <Link to={`/${category}/${id}`}>{name}</Link>
                </h4>
            </div>
            <div className="category">
                <p>{category === 'artist' ? 'Künstler*in' : 'Komponist*in'}</p>
            </div>
        </div>
    );
}

export default ArtistComposerBlock;
