import React, { useState } from 'react';

function AudioPlayer( {file_path} ) {
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        const audio = new Audio(file_path);
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }

        setIsPlaying(!isPlaying);
    };

    return (
        <span className="answer_audio_player">
            <button onClick={togglePlay}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </span>
    );
}

export default AudioPlayer;