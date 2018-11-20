export function setVolume(percent) {
  return async (dispatch, getState) => {
    const { accessToken, logToConsole } = getState();
    let url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${percent}`;

    const customHeaders = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fetch(url, customHeaders);

    if (logToConsole) {
      console.log(`${customHeaders.method}\n${url}`);
      console.log(res);
    }

    return res.status === 204 ? true : false;
  };
}

export function getAudioFeatures(ids) {
  return async (dispatch, getState) => {
    const { accessToken, logToConsole } = getState();
    let url = `https://api.spotify.com/v1/audio-features?ids=${ids}`;

    const customHeaders = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fetch(url, customHeaders);

    let currentAudioFeatures;
    let data;
    try {
      if (res.status === 200) {
        data = await res.json();

        if (data && data.audio_features && data.audio_features.length) {
          currentAudioFeatures = data.audio_features[0];
        }

        if (logToConsole) {
          console.log(`${customHeaders.method}\n${url}`);
          //console.log(JSON.stringify(data, null, 2));
          console.log(data);
        }
      }
    } catch (e) {
      console.log(e);
    }

    dispatch({
      type: 'CURRENT_AUDIO_FEATURES',
      currentAudioFeatures,
    });

    return data;
  };
}

export function getCurrentSong() {
  return async (dispatch, getState) => {
    const { accessToken, logToConsole } = getState();
    let url = `https://api.spotify.com/v1/me/player`;

    const customHeaders = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fetch(url, customHeaders);

    let data;
    try {
      if (res.status !== 204) {
        //if 204 no song is playing, return is empty
        data = await res.json();
        if (logToConsole) {
          console.log(`${customHeaders.method}\n${url}`);
          //console.log(JSON.stringify(data, null, 2));
          console.log(data);
        }
      }
    } catch (e) {
      console.log(e);
    }
    if (data && !data.error) {
      dispatch({
        type: 'UPDATE_CURRENTLY_PLAYING',
        currentlyPlaying: data,
      });
      if (data.item && data.item.id) {
        await dispatch(getAudioFeatures(data.item.id));
      }
    }

    return data;
  };
}

export function postPlayNextSong() {
  return async (dispatch, getState) => {
    const { accessToken, logToConsole } = getState();
    let url = `https://api.spotify.com/v1/me/player/next`;

    const customHeaders = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fetch(url, customHeaders);

    if (logToConsole) {
      console.log(`${customHeaders.method}\n${url}`);
      console.log(res);
    }

    return res.status === 204 ? true : false;
  };
}

export function startPlayback() {
  return async (dispatch, getState) => {
    const { accessToken, logToConsole } = getState();
    let url = `https://api.spotify.com/v1/me/player/play`;

    const customHeaders = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fetch(url, customHeaders);

    if (logToConsole) {
      console.log(`${customHeaders.method}\n${url}`);
      console.log(res);
    }

    return res.status === 204 ? true : false;
  };
}

export function pausePlayback() {
  return async (dispatch, getState) => {
    const { accessToken, logToConsole } = getState();
    let url = `https://api.spotify.com/v1/me/player/pause`;

    const customHeaders = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fetch(url, customHeaders);

    if (logToConsole) {
      console.log(`${customHeaders.method}\n${url}`);
      console.log(res);
    }

    return res.status === 204 ? true : false;
  };
}
