import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from '../../../../routes';
import PageLoader from '../../../atoms/PageLoader';
import HeaderIcon from '../../../atoms/HeaderIcon';
import SlidingPanel from '../../../atoms/SlidingPanel';
import ProfileMenuList from '../../../atoms/ProfileMenu';
import CloseCrossIcon from '../../../atoms/Icons/CloseCross';
import * as userHelper from '../../../../helpers/user';
import * as userActions from '../../../../actions/user';

class ProfileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggingOut: false,
      isOpened: false,
    };

    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.setOrganization = this.setOrganization.bind(this);
  }

  togglePopup() {
    this.setState({
      isOpened: !this.state.isOpened,
    });
  }

  setOrganization(organizationId) {
    this.props.dispatch(userActions.setOrganization(organizationId));
  }

  async onLogoutClick() {
    // Inform UI that we started logout process.
    this.setState({ isLoggingOut: true });
    // Simply wait.
    await this.context.auth.logout();
  }

  render() {
    const { organizations, username, activeOrganization } = this.props;
    const { isOpened } = this.state;
    return (
      <div className={classNames('profile-menu', { 'menu-opened': isOpened })}>

        <div className="profile-icons">
          <HeaderIcon
            className="icon-profile"
            label="Profile"
            activePaths={['/user/edit', '/user/password']}
            onClick={this.togglePopup}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M16.5 0C7.392 0 0 7.392 0 16.5S7.392 33 16.5 33 33 25.608 33 16.5 25.608 0 16.5 0zm0 4.95a4.943 4.943 0 0 1 4.95 4.95 4.943 4.943 0 0 1-4.95 4.95 4.943 4.943 0 0 1-4.95-4.95 4.943 4.943 0 0 1 4.95-4.95zm0 23.43a11.88 11.88 0 0 1-9.9-5.313c.05-3.284 6.6-5.082 9.9-5.082 3.284 0 9.85 1.799 9.9 5.082a11.88 11.88 0 0 1-9.9 5.313z" />
              </g>
            </svg>
          </HeaderIcon>

          <HeaderIcon className="icon-close" onClick={this.togglePopup} onKeyPress={this.togglePopup}>
            <CloseCrossIcon />
          </HeaderIcon>
        </div>

        <SlidingPanel className="profile-menu-panel" isOpened={isOpened} onClose={this.togglePopup}>
          <ProfileMenuList
            organizations={organizations}
            username={username}
            activeOrganization={activeOrganization}
            onLogoutClick={this.onLogoutClick}
            setOrganization={this.setOrganization}
          />
          <div className="footer">
            <button onClick={this.togglePopup} className="close btn-grey">Close Profile Menu</button>
          </div>
        </SlidingPanel>

        {this.state.isLoggingOut && <PageLoader type="fixed" />}
      </div>
    );
  }
}

ProfileMenu.contextTypes = {
  auth: PropTypes.shape({
    logout: PropTypes.func,
  }),
};

const mapStateToProps = ({ user }) => ({
  username: user.data.name ? userHelper.getUsername(user.data) : '',
  organizations: user.data.organization ? user.data.organization : [],
  activeOrganization: user.activeOrganization,
});

export default connect(mapStateToProps)(ProfileMenu);
