import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router v6
import ProfileIcon from '../media/icons/person.svg';
import ProfileFillIcon from '../media/icons/person-fill.svg';
import SettingsIcon from '../media/icons/settings.svg';
import SettingsFillIcon from '../media/icons/settings-fill.svg';
import SearchIcon from '../media/icons/search.svg';
import '../App.css';
import Profile from "./profile";
import Settings from "./settings"

function Header({ activePage, setActivePage, setContent }) {
    const navigate = useNavigate(); // Hook to manage navigation
    const [searchTerm, setSearchTerm] = useState(''); // State to track the search input

    const handleProfileClick = () => {
        setActivePage('profile');
        setContent(<Profile />); 
    };

    const handleSettingsClick = () => {
        setActivePage('settings');
        setContent(<Settings />); 
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`); // Redirect to the search page with the query
        }
    };

    return (
        <header>
            <div className="logo">
                <a href="/">
                    <img src="" alt="divisi" />
                </a>
            </div>
            <div className="search">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update the searchTerm state
                    />
                    <button type="submit"><img src={SearchIcon} alt="Suchen" /></button>
                </form>
            </div>
            <div className="hdr-btns">
                <div className="profile-btn" onClick={handleProfileClick}>
                    <img src={activePage === 'profile' ? ProfileFillIcon : ProfileIcon} alt="Profil" />
                </div>
                <div className="settings-btn" onClick={handleSettingsClick}>
                    <img src={activePage === 'settings' ? SettingsFillIcon : SettingsIcon} alt="Einstellungen" />
                </div>
            </div>
        </header>
    );
};

export default Header;
