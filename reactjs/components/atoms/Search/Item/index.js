import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import xss from 'xss';
import classNames from 'classnames';
import LinkWrap from '../../Link/LinkWrap';
import * as overlayActions from '../../../../actions/overlay';

const SearchItem = ({ icon, title, body, className, itemLink, dispatch }) => (
  <div
    className={classNames('search-item', className)}
    onClick={() => { dispatch(overlayActions.close()); }}
    onKeyPress={() => { dispatch(overlayActions.close()); }}
  >
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
  dispatch: PropTypes.func.isRequired,
};

SearchItem.defaultProps = {
  icon: null,
  body: '',
  className: '',
  itemLink: null,
};

export default connect()(SearchItem);
