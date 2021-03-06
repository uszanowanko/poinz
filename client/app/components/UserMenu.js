import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {setVisitor, setUsername, setEmail, leaveRoom, setLanguage} from '../actions';

/**
 * The user menu displays a form for changing the username and the vistitor flag.
 *
 * It also dispalys a "leave room" button.
 */
const UserMenu = ({
  t,
  language,
  user,
  setUsername,
  setEmail,
  setVisitor,
  setLanguage,
  userMenuShown
}) => {
  const username = user.username;
  const email = user.email;
  const isVisitor = user.visitor;

  const menuClasses = classnames('user-menu', {
    'user-menu-active': userMenuShown
  });

  const visitorCheckboxClasses = classnames('fa', {
    'fa-square-o': !isVisitor,
    'fa-check-square-o': isVisitor
  });

  let usernameInputField, emailInputField;

  return (
    <div className={menuClasses}>
      <div className="pure-form">
        <div className="user-menu-section">
          <h5>{t('username')}</h5>

          <div className="username-wrapper">
            <input
              type="text"
              id="username"
              placeholder={t('name')}
              defaultValue={username}
              ref={(ref) => (usernameInputField = ref)}
              onKeyPress={handleUsernameKeyPress}
            />

            <button
              className="pure-button pure-button-primary button-save button-save-username"
              onClick={saveUsername}
            >
              {t('save')}
            </button>
          </div>
        </div>

        <div className="user-menu-section">
          <h5>{t('language')}</h5>
          <div className="language-selector-wrapper">
            <label htmlFor="language-selector-en">
              <input
                type="radio"
                id="language-selector-en"
                name="language-selector"
                defaultChecked={language === 'en'}
                onClick={() => setLanguage('en')}
              />
              {t('english')}
            </label>

            <label htmlFor="language-selector-de">
              <input
                type="radio"
                id="language-selector-de"
                name="language-selector"
                defaultChecked={language === 'de'}
                onClick={() => setLanguage('de')}
              />
              {t('german')}
            </label>
          </div>
        </div>

        <div className="user-menu-section">
          <h5>{t('gravatar')}</h5>
          {t('gravatarInfo')}

          <div className="email-wrapper">
            <input
              type="text"
              id="email"
              placeholder="Email..."
              defaultValue={email}
              ref={(ref) => (emailInputField = ref)}
              onKeyPress={handleEmailKeypress}
            />

            <button
              className="pure-button pure-button-primary button-save button-save-email"
              onClick={saveEmail}
            >
              {t('save')}
            </button>
          </div>
        </div>

        <div className="user-menu-section">
          <h5>{t('markVisitor')}</h5>
          {t('visitorInfo')}

          <p onClick={toggleVisitor} className="clickable">
            <i className={visitorCheckboxClasses}></i> {t('visitor')}
          </p>
        </div>
      </div>
    </div>
  );

  function handleUsernameKeyPress(e) {
    if (e.key === 'Enter') {
      saveUsername();
    }
  }

  function saveUsername() {
    // username length minimum is 2 characters
    if (usernameInputField.value && usernameInputField.value.length > 1) {
      setUsername(usernameInputField.value);
    }
  }

  function handleEmailKeypress(e) {
    if (e.key === 'Enter') {
      saveEmail();
    }
  }

  function saveEmail() {
    setEmail(emailInputField.value);
  }

  function toggleVisitor() {
    setVisitor(!isVisitor);
  }
};

UserMenu.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
  userMenuShown: PropTypes.bool,
  language: PropTypes.string,
  setVisitor: PropTypes.func,
  leaveRoom: PropTypes.func,
  setLanguage: PropTypes.func,
  setUsername: PropTypes.func,
  setEmail: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    language: state.language,
    user: state.users[state.userId],
    userMenuShown: state.userMenuShown
  }),
  {
    setVisitor,
    leaveRoom,
    setUsername,
    setEmail,
    setLanguage
  }
)(UserMenu);
