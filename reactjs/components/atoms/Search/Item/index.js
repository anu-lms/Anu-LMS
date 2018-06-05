import React from 'react';
import PropTypes from 'prop-types';
import xss from 'xss';
import classNames from 'classnames';
import LinkWrap from '../../Link/LinkWrap';

const SearchItem = ({ icon, title, body, className, itemLink }) => (
  <div className={classNames('search-item', className)}>
    <LinkWrap url={itemLink}>
      {icon &&
      <div className="type-icon">{icon}</div>
       }
      <div className="title" dangerouslySetInnerHTML={{ __html: xss(title, { whiteList: { span: 'class' } }) }} />
      <div className="body" dangerouslySetInnerHTML={{ __html: xss(body) }} />
    </LinkWrap>
  </div>
);

SearchItem.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  body: PropTypes.string,
  className: PropTypes.string,
  itemLink: PropTypes.string,
};

SearchItem.defaultProps = {
  icon: null,
  body: '',
  className: '',
  itemLink: null,
};

export default SearchItem;
