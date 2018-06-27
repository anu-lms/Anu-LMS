import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../routes';
import VerticalArrow from '../Icons/VerticalArrow';

class ProfileMenu extends React.Component {
  render() {
    const { username, organizations, onLogoutClick } = this.props;
    return (
      <div className="profile-menu-list">
        <ul className="">
          <li className="username">
            {username}
          </li>
          {organizations && organizations.length > 1 &&
            <li className="switch-organization">
              <span className="label">
                Switch Organization
                <span className="arrow"><VerticalArrow /></span>
              </span>
              <ul>
                {organizations.map(item => (
                  <li>{item.name}</li>
                ))}
              </ul>
            </li>
          }
          <li className="list-separator" />
          <li className="edit-profile">
            <Link to="/user/edit"><a>Edit Profile</a></Link>
          </li>
          <li className="edit-password">
            <Link to="/user/password"><a>Edit Password</a></Link>
          </li>
          <li className="list-separator" />
          <li className="logout">
            <span onClick={onLogoutClick}>Logout</span>
          </li>
        </ul>
      </div>
    );
  }
}

ProfileMenu.propTypes = {

};

export default ProfileMenu;
