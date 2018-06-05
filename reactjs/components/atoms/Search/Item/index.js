import React from 'react';
import PropTypes from 'prop-types';
import xss from 'xss';
import classNames from 'classnames';
import LinkWrap from '../../Link/LinkWrap';

const SearchItem = ({ Icon, title, body, className, itemLink }) => (
  <div className={classNames('search-item', className)}>
    <LinkWrap url={itemLink}>
      {Icon &&
      <div className="type-icon"><Icon /></div>
      }
      <div className="title">{title}</div>
      <div className="body" dangerouslySetInnerHTML={{ __html: xss(body) }} />
    </LinkWrap>
  </div>
);

SearchItem.propTypes = {
  Icon: PropTypes.func,
  title: PropTypes.string.isRequired,
  body: PropTypes.string,
  className: PropTypes.string,
  itemLink: PropTypes.string,
};

SearchItem.defaultProps = {
  Icon: null,
  body: '',
  className: '',
  itemLink: null,
};

export default SearchItem;
