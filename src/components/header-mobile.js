import React from "react";
import ProfileIcon from '../media/icons/person.svg';
import ProfileFillIcon from '../media/icons/person-fill.svg';
import SettingsIcon from '../media/icons/settings.svg';
import SettingsFillIcon from '../media/icons/settings-fill.svg';
import '../App.css';
import Profile from "./profile";
import Settings from "./settings"

function MobileHeader({ activePage, setActivePage, setContent }) {

    const handleProfileClick = () => {
        setActivePage('profile');
        setContent(<Profile />); // Assuming Profile is a component you want to render
    };

    const handleSettingsClick = () => {
        setActivePage('settings');
        setContent(<Settings />); // Assuming Settings is a component you want to render
    };

    return(
        <header>
            <div className="logo">
                <a href="/">
                    <img src="" alt="divisi"/>
                </a>
            </div>
            <div className="hdr-btns">
                <div className="profile-btn" onClick={handleProfileClick}>
                    <img src={activePage === 'profile' ? ProfileFillIcon : ProfileIcon} alt="Profil"/>
                </div>
                <div className="settings-btn" onClick={handleSettingsClick}>
                    <img src={activePage === 'settings' ? SettingsFillIcon : SettingsIcon} alt="Einstellungen"/>
                </div>
            </div>
        </header>
    )
};

export default MobileHeader;