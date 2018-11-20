import React from 'react';
import { connect } from 'react-redux';
import posed, { PoseGroup } from 'react-pose';
import Cookies from 'js-cookie';
import './../css/btn.css';
import './../css/menu.css';

const MenuContainer = posed.div({
  enter: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: '-12px',
    y: '-6px',
  },
});

class Menu extends React.Component {
  componentDidMount() {
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.removeEventListeners();
  }

  addEventListeners() {
    document.addEventListener('click', this.handlePageClick);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.handlePageClick);
  }

  handlePageClick = e => {
    const target = e.target;
    const { menuOpen } = this.props.store;

    if (!target || !menuOpen) {
      return;
    }

    const keepMenu =
      target.classList.contains('menuBtnImg') ||
      target.classList.contains('menuWrapper') ||
      target.classList.contains('menuHeadline');

    if (!keepMenu) {
      this.props.dispatch({ type: 'TOGGLE_MENU', menuOpen: false });
    }
  };

  handleMenuBtnClick = e => {
    e.preventDefault();
    const { menuOpen } = this.props.store;
    this.props.dispatch({ type: 'TOGGLE_MENU', menuOpen: !menuOpen });
  };

  handleLogoutClick = e => {
    e.preventDefault();

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    this.props.dispatch({
      type: 'LOGOUT',
    });
  };

  render() {
    const { profile, menuOpen } = this.props.store;
    return (
      <React.Fragment>
        <a
          href={`/`}
          className={`menuBtn`}
          alt={profile && profile.display_name ? profile.display_name : ``}
          onClick={this.handleMenuBtnClick}
        >
          <img
            src={profile && profile.images ? profile.images[0].url : null}
            className={`menuBtnImg`}
          />
        </a>
        <PoseGroup>
          {menuOpen ? (
            <MenuContainer className={`menuWrapper`} key={`menu`}>
              <h3 className={`menuHeadline`}>{profile.display_name}</h3>
              <a
                href={`/`}
                onClick={this.handleLogoutClick}
                className={`btn loginBtn`}
              >
                logout
              </a>
            </MenuContainer>
          ) : null}
        </PoseGroup>
      </React.Fragment>
    );
  }
}

export default connect(store => {
  return {
    store,
  };
})(Menu);
