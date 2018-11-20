import React from 'react';
import { connect } from 'react-redux';
import { fetchProfile } from './../actions/profileActions.js';
import {
  getAudioFeatures,
  postPlayNextSong,
  getCurrentSong,
} from './../actions/playActions.js';
import { initiateIntervalTimer } from './../actions/intervalActions.js';
import { redoLogin } from './../actions/sessionActions.js';
import Layout from './../components/Layout.js';
import WakeLock from './../components/WakeLock.js';
import Menu from './../components/Menu.js';
import CurrentlyPlaying from './../components/CurrentlyPlaying.js';
import SongSettings from './../components/SongSettings.js';
import Cookies from 'js-cookie';
import './../css/btn.css';
import './../css/form-control.css';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.player = null;
  }
  componentDidMount() {
    const { accessToken } = this.props.store;

    if (accessToken) {
      this.props.dispatch(fetchProfile()).then(data => {
        if (data && data.error && data.error.status === 401) {
          redoLogin();
        } else {
          this.props.dispatch({ type: 'INITIAL_LOAD_DONE' });
        }
      });
      this.props.dispatch(getCurrentSong());
    } else if (Cookies.get('refreshToken')) {
      redoLogin();
    } else {
      this.props.dispatch({ type: 'INITIAL_LOAD_DONE' });
    }

    this.initPlayer();
  }

  initPlayer() {
    const { accessToken } = this.props.store;

    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new Spotify.Player({
        name: 'Spotify Time Control App',
        getOAuthToken: callback => {
          callback(accessToken);
        },
      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      this.player.connect();
    };
  }

  handlePlayNextSongBtn = async () => {
    let { timer, intervalTimer } = this.props.store;

    await this.props.dispatch(postPlayNextSong());

    setTimeout(async () => {
      //wait 500 ms to let spotify back end catch up
      this.props.dispatch(getCurrentSong());

      console.log('next song playing');
    }, 500);

    console.log(timer);

    if (intervalTimer) {
      //this.props.dispatch(initiateIntervalTimer(timer));
    }
  };

  render() {
    const { profile, initialLoadDone } = this.props.store;

    let renderPage;
    if (profile) {
      //success, user is logged in
      renderPage = (
        <div className={`loggedInWrapper`}>
          <Menu />

          <SongSettings />

          <CurrentlyPlaying />

          <button className={`btn`} onClick={this.handlePlayNextSongBtn}>
            Next song
          </button>
        </div>
      );
    } else if (initialLoadDone) {
      renderPage = (
        <div className={`loginWrapper`}>
          <h1>Spotify control app</h1>
          <a href={`/login`} className={`btn loginBtn`}>
            Login
          </a>
        </div>
      );
    }

    return (
      <Layout>
        <WakeLock />
        <div className={`start widthWrapper addPadding`}>{renderPage}</div>
      </Layout>
    );
  }
}

export default connect(store => {
  return {
    store,
  };
})(Index);
