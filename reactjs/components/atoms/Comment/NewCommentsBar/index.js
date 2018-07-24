import React from 'react';
import PropTypes from 'prop-types';
import Sticky from '../../Sticky';
import * as mediaBreakpoint from '../../../../utils/breakpoints';

class NewCommentsBar extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isShown) {
      return {
        isShown: nextProps.newCommentsAmount > prevState.currentAmount,
        currentAmount: nextProps.newCommentsAmount,
      };
    }

    return {
      currentAmount: nextProps.newCommentsAmount,
    };
  }

  constructor(props, context) {
    super(props, context);

    this.onCloseClick = this.onCloseClick.bind(this);
    this.state = {
      isShown: true,
      currentAmount: 0,
      stickyOptionsEnter: '43',
    };
  }

  componentDidMount() {
    // Use different entry point for sticky new comments tab on mobile and desktop.
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      stickyOptionsEnter: mediaBreakpoint.isDown('md') ? '43' : '58',
    });
  }

  onCloseClick(e) {
    e.stopPropagation();
    this.setState({
      isShown: false,
    });
  }

  render() {
    const { onClick } = this.props;
    const { currentAmount, isShown, stickyOptionsEnter } = this.state;
    const commentsAmountLabel = currentAmount === 1 ? '1 new comment' : `${currentAmount} new comments`;

    if (!isShown) {
      return null;
    }

    return (
      <Sticky className="new-comments-sticky" enter={stickyOptionsEnter} rootId="lesson-comments-scrollable">
        <div className="new-comments-bar" onClick={onClick} onKeyPress={onClick}>
          <span className="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M11.333 6l-.94-.94-3.726 3.72V.667H5.333V8.78l-3.72-3.727L.667 6 6 11.333z" />
              </g>
            </svg>
          </span>

          {commentsAmountLabel}

          <button className="close-button" onClick={this.onCloseClick} onKeyPress={this.onCloseClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M9.667 1.273l-.94-.94L5 4.06 1.273.333l-.94.94L4.06 5 .333 8.727l.94.94L5 5.94l3.727 3.727.94-.94L5.94 5z" />
              </g>
            </svg>
          </button>
        </div>
      </Sticky>
    );
  }
}

NewCommentsBar.propTypes = {
  onClick: PropTypes.func,
};

NewCommentsBar.defaultProps = {
  onClick: () => {},
};

export default NewCommentsBar;
