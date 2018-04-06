import React from 'react';
import PropTypes from 'prop-types';

// Defines a link element which can have it's own click handler.
class LinkWithClick extends React.Component {
  handleClick = event => {
    const { onClick, onCustomClick } = this.props;
    if (onClick) {
      onClick(event);
    }

    if (onCustomClick) {
      onCustomClick(event);
    }
  };

  render() {
    const { onCustomClick, ...props } = this.props;
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a {...props} onClick={this.handleClick} onKeyPress={this.handleClick} />;
  }
}

LinkWithClick.propTypes = {
  onClick: PropTypes.func,
  onCustomClick: PropTypes.func,
};

LinkWithClick.defaultProps = {
  onClick: () => {},
  onCustomClick: () => {},
};

export default LinkWithClick;
