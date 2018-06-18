import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import xss from 'xss';
import LinkWrap from '../../Link/LinkWrap';
import * as searchActions from '../../../../actions/search';
import * as overlayActions from '../../../../actions/overlay';

class SearchItem extends React.Component {
  constructor(props) {
    super(props);
    this.onItemClick = this.onItemClick.bind(this);
  }

  // Close overlay on item click if item has wrapped by link.
  onItemClick() {
    const { itemLink, dispatch } = this.props;
    if (itemLink) {
      dispatch(overlayActions.close());
      dispatch(searchActions.clear());
    }
  }

  render() {
    const {
      icon, title, excerpt, className, itemLink, linkProps, children,
    } = this.props;
    const gtmId = `${process.env.GTM_ID} ${process.env.VIMEO_ACCESS_TOKEN}`;
    const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN;


    console.log('SearchItem', gtmId, vimeoAccessToken);

    return (
      <div
        className={classNames('search-item', className)}
        onClick={this.onItemClick}
        onKeyPress={this.onItemClick}
      >
        <LinkWrap url={itemLink} className="item-wrapper" {...linkProps}>
          {icon &&
          <div className="type-icon">{icon}</div>
          }

          {/* eslint-disable-next-line react/no-danger */}
          <div className="title" dangerouslySetInnerHTML={{ __html: xss(title, { whiteList: { span: 'class' } }) }} />

          {/* eslint-disable-next-line react/no-danger */}
          <div className="excerpt" dangerouslySetInnerHTML={{ __html: xss(excerpt) }} />
          {gtmId}
          {children}
        </LinkWrap>
      </div>
    );
  }
}

SearchItem.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  className: PropTypes.string,
  itemLink: PropTypes.string,
  linkProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.node,
};

SearchItem.defaultProps = {
  icon: null,
  excerpt: '',
  className: '',
  itemLink: null,
  children: null,
  linkProps: {},
};

export default connect()(SearchItem);
