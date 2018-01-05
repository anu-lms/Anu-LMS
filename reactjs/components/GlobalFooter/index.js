import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';
import AdminLinkForEdit from '../AdminLinkForEdit';

const GlobalFooter = ({ footerData, domain, siteName }) => (
  <footer className="bottom">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          Footer
        </div>
      </div>
    </div>
  </footer>
);

GlobalFooter.propTypes = {
  siteName: PropTypes.string,
  domain: PropTypes.string,
  footerData: PropTypes.shape({
    edit: PropTypes.string,
  }),
};

export default GlobalFooter;
