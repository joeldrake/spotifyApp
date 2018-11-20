import NextHead from 'next/head';

const defaultTitle = 'Spotify Controll app';
const defaultDescription = 'Welcome to the spotify controll app';
const defaultIcon = '/static/img/spotifyAppIcon.png';
const defaultOGURL = 'https://spotifyapp.now.sh';
const defaultOGImage = '/static/img/spotifyAppIcon.png';

const Head = props => (
  <NextHead>
    <meta charSet="UTF-8" key="charSet" />
    <title key="title">{props.title || defaultTitle}</title>
    <link rel="manifest" href="/static/manifest.json" key="manifest" />
    <meta
      name="description"
      content={props.description || defaultDescription}
      key="description"
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
      key="viewport"
    />
    <link rel="icon" href={props.icon || defaultIcon} key="icon" />
    <meta property="og:url" content={props.url || defaultOGURL} key="ogUrl" />
    <meta
      property="og:title"
      content={props.title || defaultTitle}
      key="ogTitle"
    />
    <meta
      property="og:description"
      content={props.description || defaultDescription}
      key="ogDescription"
    />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="default"
      key="statusbar"
    />
    <link
      rel="apple-touch-icon"
      href={props.icon || defaultIcon}
      key="appletouchicon"
    />
    <link
      rel="apple-touch-startup-image"
      href={props.icon || defaultIcon}
      key="appletouchstartupimage"
    />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black"
      key="applemobilewebappstatusbarstyle"
    />
    <meta
      name="apple-mobile-web-app-capable"
      content="yes"
      key="applemobilewebappcapable"
    />
    <meta
      property="og:image"
      content={props.ogImage || defaultOGImage}
      key="ogImage"
    />
    <meta property="og:image:width" content="225" key="ogImageWidth" />
    <meta property="og:image:height" content="225" key="ogImageHeight" />
    <script src="https://sdk.scdn.co/spotify-player.js" />
  </NextHead>
);

export default Head;
