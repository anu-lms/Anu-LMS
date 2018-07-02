import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from '../../../routes';
import VerticalArrow from '../Icons/VerticalArrow';

class ProfileMenu extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOrgsListCollapsed: true,
    };
    this.toggleOrganizationsList = this.toggleOrganizationsList.bind(this);
    this.collapseOrganizationsList = this.collapseOrganizationsList.bind(this);
    this.handleOrganizationClick = this.handleOrganizationClick.bind(this);
  }

  toggleOrganizationsList() {
    this.setState({
      isOrgsListCollapsed: !this.state.isOrgsListCollapsed,
    });
  }

  collapseOrganizationsList() {
    this.setState({
      isOrgsListCollapsed: true,
    });
  }

  handleOrganizationClick(organizationId) {
    const { onItemClick, onOrganizationClick } = this.props;
    this.collapseOrganizationsList();
    onItemClick();
    onOrganizationClick(organizationId);
  }

  render() {
    const { username, organizations, activeOrganization, onItemClick, onLogoutClick } = this.props;
    const { isOrgsListCollapsed } = this.state;
    return (
      <div className="profile-menu-list">
        <ul className="">
          <li className="username">
            {username}
          </li>
          {organizations && organizations.length > 1 &&
            <li className={classNames('switch-organization', { 'collapsed': isOrgsListCollapsed })}>
              <span
                className="label"
                onClick={this.toggleOrganizationsList}
                onKeyPress={this.toggleOrganizationsList}
              >
                Switch Organization
                <span className="arrow"><VerticalArrow /></span>
              </span>
              <ul className="organizations">
                {organizations.map(item => (
                  <li // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
                    className={classNames({ 'active': activeOrganization === item.id })}
                    key={item.id}
                    onClick={() => { this.handleOrganizationClick(item.id); }}
                    onKeyPress={() => { this.handleOrganizationClick(item.id); }}
                  >
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </li>
          }
          <li className="list-separator" />
          <li className="edit-profile" onClick={onItemClick} onKeyPress={onItemClick}> {/* eslint-disable-line jsx-a11y/no-noninteractive-element-interactions */}
            <Link to="/user/edit"><a>Edit Profile</a></Link>
          </li>
          <li className="edit-password" onClick={onItemClick} onKeyPress={onItemClick}> {/* eslint-disable-line jsx-a11y/no-noninteractive-element-interactions */}
            <Link to="/user/password"><a>Edit Password</a></Link>
          </li>
          <li className="list-separator" />
          <li className="logout">
            <span onClick={onLogoutClick} onKeyPress={onLogoutClick}>Logout</span>
          </li>
        </ul>
      </div>
    );
  }
}

ProfileMenu.propTypes = {
  username: PropTypes.string,
  organizations: PropTypes.arrayOf(PropTypes.object),
  activeOrganization: PropTypes.number,
  onItemClick: PropTypes.func,
  onOrganizationClick: PropTypes.func,
  onLogoutClick: PropTypes.func,
};

ProfileMenu.defaultProps = {
  username: '',
  organizations: [],
  activeOrganization: null,
  onItemClick: () => {},
  onOrganizationClick: () => {},
  onLogoutClick: () => {},
};

export default ProfileMenu;
