export function fetchProfile() {
  return async (dispatch, getState) => {
    const { accessToken, logToConsole } = getState();
    let url = `https://api.spotify.com/v1/me`;

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
      data = await res.json();
      if (logToConsole) {
        console.log(`${customHeaders.method}\n${url}`);
        //console.log(JSON.stringify(data, null, 2));
        console.log(data);
      }

      if (data && !data.error) {
        dispatch({
          type: 'UPDATE_PROFILE',
          profile: data,
        });
      }
    } catch (e) {
      console.log(e);
    }

    return data;
  };
}
