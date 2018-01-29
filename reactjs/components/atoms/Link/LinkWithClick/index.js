import React from 'react';
import PropTypes from 'prop-types';

// Defines a link element which can have it's own click handler.
class LinkWithClick extends React.Component {
  render () {
    const { onCustomClick, ...props } = this.props;
    return <a {...props} onClick={this.handleClick} />;
  }

  handleClick = event => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (this.props.onCustomClick) {
      this.props.onCustomClick(event);
    }
  }
}

LinkWithClick.propTypes = {
  onClick: PropTypes.func,
  onCustomClick: PropTypes.func,
};

export default LinkWithClick;
