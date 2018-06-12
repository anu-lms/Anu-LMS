import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../../routes';

// Wrap children to the link if url provided.
const LinkWrap = ({ url, children, className, ...props }) => (
  url ? (
    <Link to={url} {...props}><a className={className}>{children}</a></Link>
  ) : (
    <span {...props}>{children}</span>
  )
);

LinkWrap.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
  children: PropTypes.node,
};

LinkWrap.defaultProps = {
  url: null,
  children: null,
  className: '',
};

export default LinkWrap;
