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

  onItemClick() {
    const { itemLink, dispatch } = this.props;
    if (itemLink) {
      dispatch(overlayActions.close());
      dispatch(searchActions.clear());
    }
  }

  render() {
    const { icon, title, body, className, itemLink, children } = this.props;
    return (
      <div
        className={classNames('search-item', className)}
        onClick={this.onItemClick}
        onKeyPress={this.onItemClick}
      >
        <LinkWrap url={itemLink} className="item-wrapper">
          {icon &&
          <div className="type-icon">{icon}</div>
          }

          {/* eslint-disable-next-line react/no-danger */}
          <div className="title" dangerouslySetInnerHTML={{ __html: xss(title, { whiteList: { span: 'class' } }) }} />

          {/* eslint-disable-next-line react/no-danger */}
          <div className="body" dangerouslySetInnerHTML={{ __html: xss(body) }} />
          {children}
        </LinkWrap>
      </div>
    );
  }
}

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
