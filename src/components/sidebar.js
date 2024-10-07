import React from "react";
import { Link } from 'react-router-dom';
import '../App.css';
import HomeIcon from "../media/icons/home.svg";
import HomeFillIcon from "../media/icons/home-fill.svg";
import RecordingsIcon from "../media/icons/music-notes.svg";
import RecordingsFillIcon from "../media/icons/music-notes-fill.svg";
import AboutIcon from "../media/icons/info.svg";
import AboutFillIcon from "../media/icons/info-fill.svg";
import Home from "./home";
import Recordings from "./recordings";
import About from "./about";

function Sidebar({ activePage, setActivePage, setContent }) {

    const handleHomeClick = () => {
        setActivePage('home');
        setContent(<Home />); // Replace with your Home component
    };

    const handleRecordingsClick = () => {
        setActivePage('recordings');
        setContent(<Recordings />); // Replace with your Recordings component
    };

    const handleAboutClick = () => {
        setActivePage('about');
        setContent(<About />); // Replace with your About component
    };

    return(
        <div className="sidebar">
            <nav>
                <ul>
                    <li className={activePage === 'home' ? 'active' : ''}>
                        <Link to="/" onClick={handleHomeClick}>
                            <img src={activePage === 'home' ? HomeFillIcon : HomeIcon} alt="Startseite"/>
                            Startseite
                        </Link>
                    </li>
                    <li className={activePage === 'recordings' ? 'active' : ''}>
                        <Link to="/" onClick={handleRecordingsClick}>
                            <img src={activePage === 'recordings' ? RecordingsFillIcon : RecordingsIcon} alt="Stücke"/>
                            Aufnahmen
                        </Link>
                    </li>
                    <li className={activePage === 'about' ? 'active' : ''}>
                        <Link to="/" onClick={handleAboutClick}>
                            <img src={activePage === 'about' ? AboutFillIcon : AboutIcon} alt="Über divisi"/>
                            Über divisi
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar;