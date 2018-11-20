import React from 'react';
import { connect } from 'react-redux';
import './../css/currentlyPlaying.css';

class CurrentlyPlaying extends React.Component {
  render() {
    const { currentlyPlaying, currentAudioFeatures } = this.props.store;
    return (
      <div className={`currentlyPlayingWrapper`}>
        {currentlyPlaying ? (
          <div className={`currentlyPlaying`}>
            {currentAudioFeatures && currentAudioFeatures.tempo ? (
              <div>
                <p>Current BMP</p>
                <h2>{Math.round(currentAudioFeatures.tempo)}</h2>
              </div>
            ) : null}
            <p>{currentlyPlaying.is_playing ? `Now playing` : `Paused`}</p>
            <h2>
              {currentlyPlaying.item &&
              currentlyPlaying.item.artists &&
              currentlyPlaying.item.artists.length &&
              currentlyPlaying.item.artists[0].name
                ? currentlyPlaying.item.artists[0].name
                : null}

              {currentlyPlaying.item &&
              currentlyPlaying.item.artists &&
              currentlyPlaying.item.artists.length &&
              currentlyPlaying.item.artists[0].name &&
              currentlyPlaying.item &&
              currentlyPlaying.item.name
                ? ' - '
                : null}

              {currentlyPlaying.item && currentlyPlaying.item.name
                ? currentlyPlaying.item.name
                : null}
            </h2>
            {currentlyPlaying.item &&
            currentlyPlaying.item.album &&
            currentlyPlaying.item.album.images &&
            currentlyPlaying.item.album.images.length > 1 ? (
              <img
                src={currentlyPlaying.item.album.images[1].url}
                alt={currentlyPlaying.item.album.name}
                className={`currentlyPlayingImage`}
              />
            ) : null}
          </div>
        ) : (
          <div className={`noSongMessage`}>
            <p>No song currently playing</p>
            <p>Start one in your spotify app</p>
          </div>
        )}
      </div>
    );
  }
}

export default connect(store => {
  return {
    store,
  };
})(CurrentlyPlaying);
