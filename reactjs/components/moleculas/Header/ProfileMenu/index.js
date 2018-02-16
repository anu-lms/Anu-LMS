import PropTypes from 'prop-types';
import Dropdown, { MenuItem } from '../../../atoms/DropdownMenu';
import { Link } from '../../../../routes';

class ProfileMenu extends React.Component {
  render() {
    return (
      <Dropdown id="profile-menu">
        <Dropdown.Toggle noCaret btnStyle="link">
          <div className="icon profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M16.5 0C7.392 0 0 7.392 0 16.5S7.392 33 16.5 33 33 25.608 33 16.5 25.608 0 16.5 0zm0 4.95a4.943 4.943 0 0 1 4.95 4.95 4.943 4.943 0 0 1-4.95 4.95 4.943 4.943 0 0 1-4.95-4.95 4.943 4.943 0 0 1 4.95-4.95zm0 23.43a11.88 11.88 0 0 1-9.9-5.313c.05-3.284 6.6-5.082 9.9-5.082 3.284 0 9.85 1.799 9.9 5.082a11.88 11.88 0 0 1-9.9 5.313z" />
              </g>
            </svg>
          </div>

        </Dropdown.Toggle>
        <Dropdown.MenuWrapper pullRight>
          <Dropdown.Menu pullRight>
            <MenuItem>
              <Link to="/user/edit">
                <a>Edit profile</a>
              </Link>
            </MenuItem>
            <MenuItem onSelect={() => { console.log('Go to Edit password page'); }} >
              Edit Password
            </MenuItem>
            <MenuItem onSelect={this.context.auth.logout} >
              Logout
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown.MenuWrapper>
      </Dropdown>
    );
  }
}

ProfileMenu.contextTypes = {
  auth: PropTypes.shape({
    logout: PropTypes.func,
  }),
};

export default ProfileMenu;