import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "../media/icons/search.svg";
import ArtistComposerBlock from "./artistcomposer-block"; // Import ArtistComposerBlock
import RecordingBlock from "./recording-block"; // Import RecordingBlock
import "../App.css";

function SearchPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();

    const initialQuery = queryParams.get('query') || ''; // Extract the search term from the URL
    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState(''); // Track which filter is active

    // Fetch search results when the page first loads and when the URL search term changes
    useEffect(() => {
        setSearchTerm(initialQuery);  // Update the search input with the new query from the URL
        if (initialQuery) {
            performSearch(initialQuery);  // Perform the search when the query changes
        }
    }, [initialQuery]);  // Rerun this effect whenever the URL's query changes

    const performSearch = (query) => {
        setIsLoading(true);
        fetch(`https://divisi-project.de/search.php?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                const combinedResults = [
                    ...data.artists_composers.map(item => ({ ...item, category: item.type })), // Artists/composers
                    ...data.recordings.map(recording => ({
                        ...recording, 
                        category: 'recording',
                        artistIds: recording.artist_ids || [],  // Assume artist_ids is returned in the API for recordings
                    })) // Recordings
                ];
                console.log("Combined Results:", combinedResults);
                setResults(combinedResults);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error during search:', error);
                setIsLoading(false);
            });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    };

    // Handle filter selection: If the filter is clicked, only show that category
    const handleFilterClick = (filterName) => {
        // Toggle the filter: if the same filter is clicked twice, reset to show all
        if (activeFilter === filterName) {
            setActiveFilter(''); // Show all categories
        } else {
            setActiveFilter(filterName); // Show only the selected category
        }
    };

    // Count results per category to determine which filters to show
    const hasArtists = results.some(item => item.category === 'artist');
    const hasComposers = results.some(item => item.category === 'composer');
    const hasRecordings = results.some(item => item.category === 'recording');

    // Apply filters: Only show items that match the active filter (or show all if no filter is selected)
    const filteredResults = results.filter((item) => {
        if (activeFilter === 'artist' && item.category !== 'artist') return false;
        if (activeFilter === 'composer' && item.category !== 'composer') return false;
        if (activeFilter === 'recording' && item.category !== 'recording') return false;
        return true; // Show everything if no filter is active
    });

    return (
        <div>
            <h1>Suche</h1>
            <div className="searchbar">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">
                        <img src={SearchIcon} alt="Suchen" />
                    </button>
                </form>
            </div>

            {/* Display Loading State */}
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {/* Filter buttons */}
                    <div className="filters">
                        {hasArtists && (
                            <button
                                className={activeFilter === 'artist' ? 'active' : ''}
                                onClick={() => handleFilterClick('artist')}
                            >
                                {activeFilter === 'artist' ? 'Show All' : 'Künstler*innen'}
                            </button>
                        )}
                        {hasComposers && (
                            <button
                                className={activeFilter === 'composer' ? 'active' : ''}
                                onClick={() => handleFilterClick('composer')}
                            >
                                {activeFilter === 'composer' ? 'Show All' : 'Komponist*innen'}
                            </button>
                        )}
                        {hasRecordings && (
                            <button
                                className={activeFilter === 'recording' ? 'active' : ''}
                                onClick={() => handleFilterClick('recording')}
                            >
                                {activeFilter === 'recording' ? 'Show All' : 'Aufnahmen'}
                            </button>
                        )}
                    </div>

                    {/* Render filtered results */}
                    {filteredResults.length === 0 ? (
                        <div>No results found</div>
                    ) : (
                        <ul>
                            {filteredResults.map((item) => (
                                <li key={item.id}>
                                    {item.category === 'artist' || item.category === 'composer' ? (
                                        <ArtistComposerBlock
                                            name={item.name}
                                            category={item.category}
                                            id={item.id} // Pass the ID for the link
                                        />
                                    ) : (
                                        <RecordingBlock
                                            pieceName={item.piece_name}
                                            catalogueNumber={item.catalogue_number}
                                            composerName={item.composer_name}
                                            composerId={item.composer_id} // Pass the composer ID for the link
                                            recordingId={item.id} // Pass the recording ID for the link
                                            artistNames={item.artist_names || []}
                                            artistIds={item.artistIds || []} // Ensure artistIds is passed correctly
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchPage;