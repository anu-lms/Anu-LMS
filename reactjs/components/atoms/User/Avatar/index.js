import React from 'react';
import PropTypes from 'prop-types';
import { getUserColor, getInitials } from '../../../../helpers/user';

const Avatar = ({ user }) => (
  <div className="user-avatar" style={{ background: getUserColor(user) }}>
    {getInitials(user)}
  </div>
);

Avatar.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Avatar;
