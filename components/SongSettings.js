import React from 'react';
import { connect } from 'react-redux';
import {
  initiateIntervalTimer,
  resetIntervalTimer,
} from './../actions/intervalActions.js';
import {
  startPlayback,
  pausePlayback,
  setVolume,
  getCurrentSong,
} from './../actions/playActions.js';
import './../css/songSettings.css';

class SongSettings extends React.Component {
  componentDidMount() {
    this.setTimerInputSavedValue();
  }

  setTimerInputSavedValue() {
    if (this.timeUntilNext) {
      try {
        if (localStorage.timeUntilNext) {
          this.timeUntilNext.value = localStorage.timeUntilNext;
        }
        if (localStorage.timeBetween) {
          this.timeBetween.value = localStorage.timeBetween;
        }
        if (localStorage.fadeout) {
          this.fadeout.value = localStorage.fadeout;
        }
        if (localStorage.bpmMin) {
          this.bpmMin.value = localStorage.bpmMin;
        }
        if (localStorage.bpmMax) {
          this.bpmMax.value = localStorage.bpmMax;
        }
      } catch (e) {}
    }
  }

  handleSetTimerBtn = () => {
    const songSettingValues = {
      timeUntilNext: parseInt(this.timeUntilNext.value),
      timeBetween: parseInt(this.timeBetween.value),
      fadeout: parseInt(this.fadeout.value),
      bpmMin: parseInt(this.bpmMin.value),
      bpmMax: parseInt(this.bpmMax.value),
    };

    if (isNaN(songSettingValues.timeUntilNext)) {
      this.setTimerInputSavedValue();
      alert('Insert time until next as a number in seconds');
      this.timeUntilNext.focus();
      return;
    }

    this.props.dispatch(setVolume(100));
    this.props.dispatch(startPlayback());

    this.props.dispatch(initiateIntervalTimer(songSettingValues));

    setTimeout(() => {
      this.props.dispatch(getCurrentSong());
    }, 500);

    try {
      if (songSettingValues.timeUntilNext) {
        localStorage.timeUntilNext = songSettingValues.timeUntilNext;
      }
      if (songSettingValues.timeBetween) {
        localStorage.timeBetween = songSettingValues.timeBetween;
      }
      if (songSettingValues.fadeout) {
        localStorage.fadeout = songSettingValues.fadeout;
      }
      if (songSettingValues.bpmMin) {
        localStorage.bpmMin = songSettingValues.bpmMin;
      }
      if (songSettingValues.bpmMax) {
        localStorage.bpmMax = songSettingValues.bpmMax;
      }
    } catch (e) {}
  };

  handleStopTimerBtn = async () => {
    await this.props.dispatch(resetIntervalTimer());

    this.props.dispatch({
      type: 'SET_TIMER',
    });

    this.props.dispatch({
      type: 'ON_PAUSE',
      onPause: false,
    });

    this.props.dispatch(pausePlayback());

    this.props.dispatch(setVolume(100));

    this.setTimerInputSavedValue();
  };

  render() {
    const { timerCurrent, intervalTimer, onPause } = this.props.store;
    return (
      <div className={`timerWrapper`}>
        {intervalTimer ? (
          <React.Fragment>
            <h2>{onPause ? `Pause` : `Next song in`}</h2>
            <h1 className={`timerCounter`}>{timerCurrent}</h1>
            <button className={`btn`} onClick={this.handleStopTimerBtn}>
              Stop timer
            </button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h2>SETTINGS</h2>
            <div className={`timerInputsWrapper songSettingsInputsWrapper`}>
              <div className={`songSettingsWrapper`}>
                <label htmlFor={`timeUntilNext`}>Time until next</label>
                <input
                  id={`timeUntilNext`}
                  type={`tel`}
                  className={`form-control `}
                  placeholder={`00`}
                  ref={e => (this.timeUntilNext = e)}
                />
                <div className={`subInfo`}>seconds</div>
              </div>
              <div className={`songSettingsInputWrapper`}>
                <label htmlFor={`timeBetween`}>Time between</label>
                <input
                  id={`timeBetween`}
                  type={`tel`}
                  className={`form-control `}
                  placeholder={`00`}
                  ref={e => (this.timeBetween = e)}
                />
                <div className={`subInfo`}>seconds</div>
              </div>
              <div className={`songSettingsInputWrapper`}>
                <label htmlFor={`fadeout`}>Fadeout</label>
                <input
                  id={`fadeout`}
                  type={`tel`}
                  className={`form-control `}
                  placeholder={`00`}
                  ref={e => (this.fadeout = e)}
                />
                <div className={`subInfo`}>seconds</div>
              </div>
            </div>

            <div className={`songSettingsInputsWrapper bpmInputsWrapper`}>
              <div>
                <h2>BPM</h2>
              </div>
              <div className={`songSettingsInputWrapper`}>
                <input
                  id={`bpmMin`}
                  type={`tel`}
                  className={`form-control `}
                  placeholder={`000`}
                  ref={e => (this.bpmMin = e)}
                />
                <div className={`subInfo`}>min</div>
              </div>
              <div>
                <h2>–</h2>
              </div>
              <div className={`songSettingsInputWrapper`}>
                <input
                  id={`bpmMax`}
                  type={`tel`}
                  className={`form-control `}
                  placeholder={`000`}
                  ref={e => (this.bpmMax = e)}
                />
                <div className={`subInfo`}>max</div>
              </div>
            </div>
            <button className={`btn`} onClick={this.handleSetTimerBtn}>
              Activate
            </button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default connect(store => {
  return {
    store,
  };
})(SongSettings);
