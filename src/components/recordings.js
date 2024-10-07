import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import ChevronDown from '../media/icons/chevron-down.svg';
import RecordingBlock from './recording-block'; // Import RecordingBlock component

const Recordings = () => {
    const [recordings, setRecordings] = useState([]);
    const [sortType, setSortType] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const dropdownRef = useRef(null); // Reference to the dropdown element

    // Fetch data when the component mounts
    useEffect(() => {
        fetch('https://divisi-project.de/getRecordings.php')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Data:', data); // Check the structure here
                // Ensure that artists and artist IDs are always arrays
                const formattedRecordings = data.map(recording => ({
                    ...recording,
                    artists: recording.artists || [], // Ensure artists is an array
                    artist_ids: recording.artist_ids || [] // Ensure artist_ids is an array
                }));
                setRecordings(formattedRecordings);
            })
            .catch(error => console.error('Error fetching recordings:', error));
    }, []);

    // Sort recordings whenever the sortType changes
    useEffect(() => {
        let sortedRecordings = [...recordings];
    
        if (sortType === "Name A - Z") {
            sortedRecordings.sort((a, b) => a.piece_name.localeCompare(b.piece_name));
        } else if (sortType === "Name Z - A") {
            sortedRecordings.sort((a, b) => b.piece_name.localeCompare(a.piece_name));
        } else if (sortType === "Datum ASC") {
            sortedRecordings.sort((a, b) => new Date(a.recording_date) - new Date(b.recording_date));
        } else if (sortType === "Datum DESC") {
            sortedRecordings.sort((a, b) => new Date(b.recording_date) - new Date(a.recording_date));
        }
    
        setRecordings(sortedRecordings);
    }, [sortType]); // Recalculate sorting when sortType changes

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleSortOptionClick = (option) => {
        setSortType(option);
        setDropdownVisible(false); // Hide dropdown after selecting an option
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    // Determine the button text based on the selected sort option
    const getSortButtonText = () => {
        switch (sortType) {
            case "Name A - Z":
                return "Name A - Z";
            case "Name Z - A":
                return "Name Z - A";
            case "Datum ASC":
                return "Datum ASC";
            case "Datum DESC":
                return "Datum DESC";
            default:
                return "Sortieren nach"; // Default text
        }
    };

    return (
        <div>
            <h1>Aufnahmen</h1>

            <div className="dropdown" ref={dropdownRef}>
                <button id="dropdownBtnSort" onClick={toggleDropdown}>
                    {getSortButtonText()} <img src={ChevronDown} alt="Sort" style={{ transform: dropdownVisible ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {dropdownVisible && (
                    <div id="dropdownSortOptions" className="dropdownSortOptions">
                        <button className="sortOption" onClick={() => handleSortOptionClick("Name A - Z")}>
                            Name <span>A - Z</span>
                        </button>
                        <button className="sortOption" onClick={() => handleSortOptionClick("Name Z - A")}>
                            Name <span>Z - A</span>
                        </button>
                        <button className="sortOption" onClick={() => handleSortOptionClick("Datum ASC")}>
                            Datum <span>ASC</span>
                        </button>
                        <button className="sortOption" onClick={() => handleSortOptionClick("Datum DESC")}>
                            Datum <span>DESC</span>
                        </button>
                    </div>
                )}
            </div>

            {recordings.length === 0 ? (
                <p>No recordings available.</p>
            ) : (
                <ul>
                    {recordings.map(recording => (
                        <li key={recording.id}>
                            {/* Use the RecordingBlock component to display each recording */}
                            <RecordingBlock
                                pieceName={recording.piece_name}
                                catalogueNumber={recording.catalogue_number}
                                composerName={recording.composer_name}
                                composerId={recording.composer_id}
                                recordingId={recording.id} // Pass the recording ID for linking to the detail page
                                artistNames={recording.artists.map(artist => artist.name)}
                                artistIds={recording.artists.map(artist => artist.id)}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Recordings;