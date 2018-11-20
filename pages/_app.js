import React from 'react';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import makeStore from './../store.js';
import { Provider } from 'react-redux';
import Cookies from 'cookies';

class SpotifyApp extends App {
  static async getInitialProps({ Component, ctx, req }) {
    if (ctx && ctx.req && ctx.res) {
      const cookies = new Cookies(ctx.req, ctx.res);
      const accessToken = cookies.get('accessToken');
      const refreshToken = cookies.get('refreshToken');

      ctx.store.dispatch({
        type: 'UPDATE_TOKENS',
        accessToken,
        refreshToken,
      });
    }

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    //console.log(this.props);
  }
  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(makeStore)(SpotifyApp);
