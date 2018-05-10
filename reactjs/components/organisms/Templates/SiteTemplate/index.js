import React from 'react';
import PropTypes from 'prop-types';
import App from '../../../../application/App';
import Header from '../../Header';
import ErrorPage from '../../../atoms/ErrorPage';

const SiteTemplate = ({ children, statusCode, isHeaderEmpty, className }) => (
  <App>
    <Header isEmpty={isHeaderEmpty} />
    <div className={`page-with-header ${className}`}>
      {statusCode === 200 ? (
        children
      ) : (
        <ErrorPage code={statusCode} />
      )}
    </div>
  </App>
);

SiteTemplate.propTypes = {
  className: PropTypes.string,
  statusCode: PropTypes.number,
  isHeaderEmpty: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

SiteTemplate.defaultProps = {
  className: '',
  pageTitle: '',
  statusCode: 200,
  isHeaderEmpty: false,
};

export default SiteTemplate;
