import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '../../../../routes';
import SiteLogoIcon from '../../../atoms/Icons/SiteLogo';


class SiteLogo extends React.Component {
  componentDidMount() {

  }

  render() {
    const { activeOrganizationLabel } = this.props;
    return (
      <Link to="/">
        <a rel="home" >
          <SiteLogoIcon />
          <span className="organization-name">{activeOrganizationLabel}</span>
        </a>
      </Link>
    );
  }
}

SiteLogo.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeOrganizationLabel: PropTypes.string.isRequred,
};

SiteLogo.defaultProps = {
  // activeOrganizationLabel: 'Cultivate',
};

const mapStateToProps = ({ user }) => ({
  activeOrganizationLabel: user.activeOrganization,
});

export default connect(mapStateToProps)(SiteLogo);
