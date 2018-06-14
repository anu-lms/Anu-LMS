import React from 'react';
import PropTypes from 'prop-types';

class Divider extends React.Component {
  componentDidMount() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  componentDidUpdate() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  render() {
    const { type, counter, columnClasses, id } = this.props;
    return (
      <div id={`paragraph-${id}`} className="container paragraph divider">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="baseline" />
            {type === 'divider_numbered' &&
            <div className="number">{counter}</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

Divider.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  // eslint-disable-next-line react/forbid-prop-types
  settings: PropTypes.object,
  handleParagraphLoaded: PropTypes.func,
  counter: PropTypes.number,
  commentsAllowed: PropTypes.bool,
};

Divider.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  commentsAllowed: false,
  handleParagraphLoaded: () => {},
  counter: 0,
};

export default Divider;
