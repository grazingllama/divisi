import React from "react";
import PlayIcon from "../media/icons/play.svg";
import PauseIcon from "../media/icons/pause.svg";
import "../App.css";

function MusicBar() {
    return(
        <div className="musicbar">
            <div className="now-playing">
            <div className="top">
                <div className="information">
                    <div className="piece">
                        <h2><i>Herr, strafe mich nicht in deinem Zorn</i></h2>
                    </div>
                    <div className="composer">
                        <h4>Karl Hasse</h4>
                    </div>
                </div>
                <div className="play-pause">
                    <button className="pp-btn"><img src={PlayIcon} alt=""/></button>
                </div>
            </div>

            <div className="seekbar">
                <input type="range" value="0" id="progress"/>
            </div>
        </div>

        </div>
    )
}

export default MusicBar;