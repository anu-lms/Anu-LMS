import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '../../../../routes';
import SiteLogoIcon from '../../../atoms/Icons/SiteLogo';
import { getObjectById } from '../../../../utils/array';

const SiteLogo = ({ activeOrganizationLabel }) => (
  <Link to="/">
    <a rel="home" >
      <SiteLogoIcon />
      <span className="organization-name">{activeOrganizationLabel}</span>
    </a>
  </Link>
);

SiteLogo.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeOrganizationLabel: PropTypes.string.isRequired,
};

const mapStateToProps = ({ user }) => {
  let activeOrganizationLabel = '';
  if (user.activeOrganization) {
    const organization = getObjectById(user.data.organization, user.activeOrganization);
    activeOrganizationLabel = organization ? organization.name : '';
  }

  return {
    activeOrganizationLabel,
  };
};

export default connect(mapStateToProps)(SiteLogo);
