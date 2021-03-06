import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {createRoom} from '../actions';

/**
 * The form on the landing page where the user can create a new room
 */
const CreateRoomForm = ({t, presetUsername, createRoom}) => {
  const [showExtended, setShowExtended] = useState(false);
  const [alias, setAlias] = useState('');

  let aliasInputField;

  return (
    <div className="eyecatcher create-room-form">
      <div className="info-text">
        <i className="fa fa-users leading-paragraph-icon"></i>
        <div>
          {presetUsername && (
            <h5>
              {t('welcomeBack')}, {presetUsername}!
            </h5>
          )}
          <h4>{t('createRoomInfo')}</h4>
          <p>{t('joinRoomInfo')}</p>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="create-room-button pure-button pure-button-primary"
          onClick={onCreateButtonClick}
        >
          {t('createNewRoom')}
        </button>

        <button
          type="button"
          className="create-room-extend-button pure-button pure-button-primary"
          onClick={() => setShowExtended(!showExtended)}
        >
          <i className={`fa fa-angle-double-${showExtended ? 'up' : 'down'}`} />
        </button>
      </div>

      {showExtended && (
        <div className="room-alias-wrapper">
          <input
            type="text"
            id="alias"
            placeholder={t('alias')}
            value={alias}
            onChange={(e) => setAlias(e.target.value.toLowerCase())}
            ref={(ref) => (aliasInputField = ref)}
          />
        </div>
      )}
    </div>
  );

  function onCreateButtonClick() {
    createRoom(aliasInputField ? aliasInputField.value : '');
  }
};

CreateRoomForm.propTypes = {
  t: PropTypes.func,
  presetUsername: PropTypes.string,
  createRoom: PropTypes.func
};

export default connect(
  (state) => ({
    t: state.translator,
    presetUsername: state.presetUsername
  }),
  {createRoom}
)(CreateRoomForm);
