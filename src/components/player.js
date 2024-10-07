import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

// Create a context to share audio players and volumes
const AudioContext = createContext();

const AudioPlayer = ({ url, targetVolume, playing }) => {
  const playerRef = useRef(null);
  const [currentVolume, setCurrentVolume] = useState(0.2);

  useEffect(() => {
    const fadeDuration = 500; // Duration of the fade effect in milliseconds
    const fadeSteps = 20; // Number of volume adjustments during the fade
    const volumeStep = (targetVolume - currentVolume) / fadeSteps;
    const stepInterval = fadeDuration / fadeSteps;

    const intervalId = setInterval(() => {
      setCurrentVolume((prevVolume) => {
        const newVolume = prevVolume + volumeStep;
        if ((volumeStep > 0 && newVolume >= targetVolume) || (volumeStep < 0 && newVolume <= targetVolume)) {
          clearInterval(intervalId);
          return targetVolume;
        }
        return newVolume;
      });
    }, stepInterval);

    return () => clearInterval(intervalId);
  }, [targetVolume]);

  return (
    <ReactPlayer
      url={url}
      playing={playing}
      volume={currentVolume}
      ref={playerRef}
      hidden
    />
  );
};

const VoiceSelector = () => {
  const { selectedVoices, setSelectedVoices } = useContext(AudioContext);

  const handleVoiceSelect = (voice) => {
    if (!selectedVoices.includes(voice)) {
      setSelectedVoices((prev) => [...prev, voice]);
    }
  };

  const handleVoiceDeselect = (voice) => {
    setSelectedVoices((prev) => prev.filter(v => v !== voice));
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            e.target.checked
              ? handleVoiceSelect('Sopran')
              : handleVoiceDeselect('Sopran')
          }
        />{' '}
        Sopran
      </label>
      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            e.target.checked
              ? handleVoiceSelect('Alt')
              : handleVoiceDeselect('Alt')
          }
        />{' '}
        Alt
      </label>
      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            e.target.checked
              ? handleVoiceSelect('Tenor')
              : handleVoiceDeselect('Tenor')
          }
        />{' '}
        Tenor
      </label>
      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            e.target.checked
              ? handleVoiceSelect('Bass')
              : handleVoiceDeselect('Bass')
          }
        />{' '}
        Bass
      </label>
    </div>
  );
};

const MusicPlayer = ({ recording }) => {
  const voices = recording.voices || []; // List of voices with their URLs
  const [selectedVoices, setSelectedVoices] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false); // Manage playback state

  const audioPlayers = voices.reduce((acc, voice) => {
    acc[voice.name] = {
      url: voice.url,
      targetVolume: selectedVoices.includes(voice.name) ? 0.8 : 0.2,
    };
    return acc;
  }, {});

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <AudioContext.Provider value={{ selectedVoices, setSelectedVoices }}>
      <VoiceSelector />
      <button onClick={togglePlayback}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      {voices.map(voice => (
        <AudioPlayer
          key={voice.name}
          url={voice.url}
          targetVolume={audioPlayers[voice.name].targetVolume}
          playing={isPlaying} // Control playback
        />
      ))}
    </AudioContext.Provider>
  );
};

export default MusicPlayer;