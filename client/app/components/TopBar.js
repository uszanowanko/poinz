import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {toggleBacklog, toggleUserMenu, toggleLog, leaveRoom} from '../actions';

const TopBar = ({
  t,
  roomId,
  username,
  alias,
  leaveRoom,
  toggleBacklog,
  toggleUserMenu,
  toggleLog,
  userMenuShown,
  logShown,
  backlogShown
}) => {
  const roomLink = <a href={'/' + (alias ? alias : roomId)}>{alias ? alias : roomId}</a>;

  return (
    <div className="top-bar">
      <div className="left-logo-container">
        <a
          className={`backlog-toggle clickable ${backlogShown ? 'pure-button-active' : ''}`}
          onClick={toggleBacklog}
        >
          <span className="menu-link-inner">
            <span></span>
          </span>
        </a>
        <div className="poinz-logo">PoinZ</div>
      </div>

      <div className="quick-menu">
        <span className="whoami">
          <span className="whoami-simple">{username}</span>

          <span className="whoami-extended">
            {username} @ {roomLink}
          </span>
        </span>

        <a
          className={`user-menu-toggle clickable pure-button pure-button-primary ${
            userMenuShown ? 'pure-button-active' : ''
          } `}
          onClick={toggleUserMenu}
          title={t('toggleMenu')}
        >
          <i className="fa fa-cog"></i>
        </a>
        <a
          className={`log-toggle clickable pure-button pure-button-primary ${
            logShown ? 'pure-button-active' : ''
          }`}
          onClick={toggleLog}
          title={t('toggleLog')}
        >
          <i className="fa fa-list"></i>
        </a>

        <a
          className="leave-room clickable pure-button pure-button-primary"
          onClick={leaveRoom}
          title={t('leaveRoom')}
        >
          <i className="fa fa-sign-out"></i>
        </a>
      </div>
    </div>
  );
};

TopBar.propTypes = {
  t: PropTypes.func,
  userMenuShown: PropTypes.bool,
  backlogShown: PropTypes.bool,
  logShown: PropTypes.bool,
  username: PropTypes.string,
  alias: PropTypes.string,
  roomId: PropTypes.string,
  toggleBacklog: PropTypes.func,
  toggleUserMenu: PropTypes.func,
  leaveRoom: PropTypes.func,
  toggleLog: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    roomId: state.roomId,
    userMenuShown: state.userMenuShown,
    backlogShown: state.backlogShown,
    logShown: state.logShown,
    alias: state.alias,
    username: state.users && state.users[state.userId] ? state.users[state.userId].username : '-'
  }),
  {toggleBacklog, toggleUserMenu, toggleLog, leaveRoom}
)(TopBar);
