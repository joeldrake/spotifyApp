import React from 'react';
import { connect } from 'react-redux';
import NoSleep from 'nosleep.js';
import './../css/checkbox.css';
import './../css/wakeLock.css';

class WakeLock extends React.Component {
  componentDidMount() {
    if (!this.noSleep) {
      this.noSleep = new NoSleep();
    }
  }

  componentWillUpdate() {
    const { wakeLockEnabled } = this.props.store;

    if (
      this.noSleep &&
      this.noSleep.noSleepVideo &&
      this.noSleep.noSleepVideo.paused &&
      wakeLockEnabled
    ) {
      //wakelock enabled, but nosleep has been paused, change wakeLockEnabled, becuase noSleep requires user action
      this.props.dispatch({
        type: 'TOGGLE_WAKE_LOCK',
        wakeLockEnabled: false,
      });
      this.noSleep.disable();
    }
  }

  handleNoSleepClick = () => {
    const { wakeLockEnabled } = this.props.store;

    if (!wakeLockEnabled) {
      this.noSleep.enable(); // keep the screen on!
    } else {
      this.noSleep.disable(); // let the screen turn off.
    }

    this.props.dispatch({
      type: 'TOGGLE_WAKE_LOCK',
      wakeLockEnabled: !wakeLockEnabled,
    });
  };

  render() {
    const { wakeLockEnabled } = this.props.store;

    return (
      <div className={`wakeLockWrapper`}>
        <input
          type="checkbox"
          id={`wakeLock`}
          className="switch-input"
          onChange={this.handleNoSleepClick}
          checked={wakeLockEnabled}
        />
        <label
          htmlFor="wakeLock"
          className="switch-label"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              this.props.dispatch({
                type: 'TOGGLE_WAKE_LOCK',
                wakeLockEnabled: !wakeLockEnabled,
              });
            }
          }}
        >
          No sleep {wakeLockEnabled ? `on` : `off`}
        </label>
      </div>
    );
  }
}

export default connect(store => {
  return {
    store,
  };
})(WakeLock);
