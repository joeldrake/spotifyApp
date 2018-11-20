const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const Cookies = require('cookies');
const fetch = require('isomorphic-unfetch');
const ENV = require('dotenv').config();

const siteUrl = dev ? 'http://localhost:3000' : 'https://spotifyapp.now.sh';
const scopes =
  'user-read-private user-read-birthdate streaming user-read-email user-read-playback-state user-modify-playback-state';

const redirect_uri = siteUrl + '/authenticated';
const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
  process.env.CLIENT_ID
}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(
  redirect_uri,
)}`;

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/login', function(req, res) {
      const cookies = new Cookies(req, res);
      const refreshToken = cookies.get('refreshToken');
      if (refreshToken) {
        fetchTokenWithRefresh(refreshToken).then(respons => {
          console.log('refreshed token');
          var cookies = new Cookies(req, res);
          cookies.set('accessToken', respons.access_token, {
            expires: new Date(Date.now() + respons.expires_in * 10000000),
            httpOnly: false,
          });
          res.redirect('/');
        });
      } else {
        res.redirect(spotifyAuthUrl);
      }
    });

    server.get('/authenticated', function(req, res) {
      if (req && req.query && req.query.code) {
        fetchToken(req.query.code).then(respons => {
          var cookies = new Cookies(req, res);
          cookies.set('accessToken', respons.access_token, {
            expires: new Date(Date.now() + respons.expires_in * 10000000),
            httpOnly: false,
          });
          cookies.set('refreshToken', respons.refresh_token, {
            expires: new Date(Date.now() + respons.expires_in * 10000000),
            httpOnly: false,
          });
          res.redirect('/');
        });
      } else {
        res.redirect('/');
      }
    });

    server.get('/robots.txt', (req, res) => {
      const robotsOptions = {
        root: __dirname + '/static/',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
      };

      res.status(200).sendFile('robots.txt', robotsOptions);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log(`⚡️ Ready on ${siteUrl}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

async function fetchTokenWithRefresh(refreshToken) {
  const url = `https://accounts.spotify.com/api/token`;

  const authString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;

  const encodedAuthString = new Buffer(authString).toString('base64');

  const postBody = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${
    process.env.CLIENT_ID
  }&client_secret=${process.env.CLIENT_SECRET}`;

  const customHeaders = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    //Authorization: `Basic ${encodedAuthString}`,
    body: postBody,
  };

  const res = await fetch(url, customHeaders);
  const data = await res.json();

  return data;
}

async function fetchToken(code) {
  const url = `https://accounts.spotify.com/api/token`;

  const authString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const encodedAuthString = new Buffer(authString).toString('base64');

  const postBody = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
    redirect_uri,
  )}&client_id=${process.env.CLIENT_ID}&client_secret=${
    process.env.CLIENT_SECRET
  }`;

  const customHeaders = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    //Authorization: `Basic ${encodedAuthString}`,
    body: postBody,
  };

  const res = await fetch(url, customHeaders);
  const data = await res.json();
  return data;
}
