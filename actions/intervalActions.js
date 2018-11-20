import {
  postPlayNextSong,
  getCurrentSong,
  setVolume,
  pausePlayback,
} from './playActions.js';

export function initiateIntervalTimer(songSettingValues) {
  return async (dispatch, getState) => {
    await dispatch(resetIntervalTimer());

    console.log(songSettingValues);

    const {
      timeUntilNext,
      timeBetween,
      fadeout,
      bpmMin,
      bpmMax,
    } = songSettingValues;

    dispatch({
      type: 'SET_TIMER',
      timeUntilNext,
      timeBetween,
      fadeout,
      bpmMin,
      bpmMax,
      timerCurrent: timeUntilNext,
    });

    const intervalTimer = setInterval(async () => {
      let {
        timeUntilNext,
        timeBetween,
        fadeout,
        bpmMin,
        bpmMax,
        timerCurrent,
        onPause,
      } = getState();
      timerCurrent = timerCurrent - 1;

      //dispatch(setVolume(50));

      if (!onPause && timerCurrent > 0 && timerCurrent < fadeout) {
        const step = 100 / fadeout;
        const add = fadeout - timerCurrent;
        const percent = Math.round(100 - step * add);
        dispatch(setVolume(percent));
      }

      if (timerCurrent < 0) {
        timerCurrent = timeUntilNext;

        if (timeBetween && !onPause) {
          dispatch(pausePlayback());
          timerCurrent = timeBetween;
          dispatch({
            type: 'ON_PAUSE',
            onPause: true,
          });
        } else {
          dispatch({
            type: 'ON_PAUSE',
            onPause: false,
          });

          if (fadeout) {
            dispatch(setVolume(100));
          }

          await dispatch(postPlayNextSong());
          setTimeout(async () => {
            //wait 500 ms to let spotify back end catch up
            await dispatch(getCurrentSong());
            //dispatch(checkBPM());
            console.log('next song playing');
          }, 500);
        }
      }

      dispatch({
        type: 'SET_TIMER',
        timeUntilNext,
        timeBetween,
        fadeout,
        bpmMin,
        bpmMax,
        timerCurrent,
      });
    }, 1000);

    dispatch({
      type: 'SET_INTERVAL_TIMER',
      intervalTimer,
    });
  };
}

export function checkBPM() {
  return async (dispatch, getState) => {
    const { bpmMin, bpmMax, currentAudioFeatures } = getState();
    console.log(bpmMin, bpmMax, currentAudioFeatures.tempo);

    if (
      !isNaN(bpmMin) &&
      !isNaN(bpmMax) &&
      currentAudioFeatures &&
      currentAudioFeatures.tempo
    ) {
      if (
        currentAudioFeatures.tempo < bpmMin ||
        currentAudioFeatures.tempo > bpmMax
      ) {
        dispatch(postPlayNextSong()).then(() => {
          console.log('checked and failed');
          dispatch(checkBPM());
        });
      }
    }
  };
}

export function resetIntervalTimer(value) {
  return async (dispatch, getState) => {
    const { intervalTimer } = getState();
    if (intervalTimer) {
      clearInterval(intervalTimer);
    }
    dispatch({
      type: 'SET_INTERVAL_TIMER',
    });
  };
}
