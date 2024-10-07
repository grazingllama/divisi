import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Profile from "./components/profile";
import Settings from "./components/settings";
import Home from "./components/home";
import Recordings from "./components/recordings";
import About from "./components/about";
import MobileFooter from "./components/mobile-footer";
import ArtistPage from "./components/artist";
import ComposerPage from "./components/composer";
import MusicBar from "./components/music-bar";
import SearchPage from "./components/search";
import MobileHeader from "./components/header-mobile";

// Hook to detect viewport width
const useViewport = () => {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width };
}

// Navigation component that switches between Sidebar and MobileFooter based on screen size
const MainNavigation = ({ activePage, setActivePage, setContent }) => {
  const { width } = useViewport();
  const breakpoint = 620;

  return width < breakpoint 
    ? <MobileFooter activePage={activePage} setActivePage={setActivePage} setContent={setContent} />
    : <Sidebar activePage={activePage} setActivePage={setActivePage} setContent={setContent} />;
}

const SecNavigation = ({ activePage, setActivePage, setContent }) => {
    const { width } = useViewport();
    const breakpoint = 620;

    return width < breakpoint 
    ? <MobileHeader activePage={activePage} setActivePage={setActivePage} setContent={setContent} />
    : <Header activePage={activePage} setActivePage={setActivePage} setContent={setContent} />;
}

function App() {
    const [activePage, setActivePage] = useState('home'); // Default content is Home
    const [content, setContent] = useState(<Home />); // Default content is Home

    return (
        <Router basename="/build">
            <div className="app-container">
                <SecNavigation activePage={activePage} setActivePage={setActivePage} setContent={setContent} />
                <MainNavigation activePage={activePage} setActivePage={setActivePage} setContent={setContent} />
                <div className="content">
                    <Routes>
                        <Route path="/" element={content} />
                        <Route path="/artist/:id" element={<ArtistPage />} />
                        <Route path="/composer/:id" element={<ComposerPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/recordings" element={<Recordings />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/search" element={<SearchPage />} />
                    </Routes>
                    <MusicBar/>
                </div>
            </div>
        </Router>
    );
}

export default App;