import React from 'react';
import { connect } from 'react-redux';

import User from './User';

const Users = ({ users }) => (
  <div className='users'>
    {users.toList().map((user, index) => (
      <User
        key={user.get('id')}
        index={index}
        user={user}
      />
    ))}
  </div>
);


export default connect(
  state => ({
    users: state.get('users')
  })
)(Users);