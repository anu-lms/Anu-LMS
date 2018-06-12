import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../../routes';

// Wrap children to the link if url provided.
const LinkWrap = ({ url, children, ...props }) => (
  url ? <Link to={url}><a {...props}>{children}</a></Link> : <span {...props}>{children}</span>
);

LinkWrap.propTypes = {
  url: PropTypes.string,
  children: PropTypes.node,
};

LinkWrap.defaultProps = {
  url: null,
  children: null,
};

export default LinkWrap;
