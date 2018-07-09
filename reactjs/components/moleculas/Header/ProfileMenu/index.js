import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PageLoader from '../../../atoms/PageLoader';
import HeaderIcon from '../../../atoms/HeaderIcon';
import SlidingPanel from '../../../atoms/SlidingPanel';
import ProfileMenuList from '../../../atoms/ProfileMenu';
import ProfileIcon from '../../../atoms/Icons/Profile';
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
    this.onOrganizationChange = this.onOrganizationChange.bind(this);
  }

  async onLogoutClick() {
    // Inform UI that we started logout process.
    this.setState({ isLoggingOut: true });
    // Simply wait.
    await this.context.auth.logout();
  }

  onOrganizationChange(organizationId) {
    this.props.dispatch(userActions.setOrganization(organizationId));
  }

  togglePopup() {
    this.setState(previousState => ({
      ...previousState,
      isOpened: !previousState.isOpened,
    }));
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
            <ProfileIcon />
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
            onOrganizationChange={this.onOrganizationChange}
          />
          <div className="footer">
            <button onClick={this.togglePopup} className="close btn-grey">Close Profile Menu</button>
          </div>
        </SlidingPanel>

        {this.state.isLoggingOut &&
        <PageLoader type="fixed" />
        }
      </div>
    );
  }
}

ProfileMenu.contextTypes = {
  auth: PropTypes.shape({
    logout: PropTypes.func,
  }),
};

ProfileMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  organizations: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeOrganization: PropTypes.number.isRequired,
};

const mapStateToProps = ({ user }) => ({
  username: user.data.name ? userHelper.getUsername(user.data) : '',
  organizations: user.data.organization ? user.data.organization : [],
  activeOrganization: user.activeOrganization,
});

export default connect(mapStateToProps)(ProfileMenu);
