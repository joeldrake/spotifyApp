import Router from 'next/router';

export function redoLogin() {
  Router.push({
    pathname: `/login`,
  });
}
