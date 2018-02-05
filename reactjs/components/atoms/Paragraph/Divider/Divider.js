import React from 'react';
import PropTypes from 'prop-types';

class Divider extends React.Component {

  componentDidMount() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  render() {
    const {type, counter} = this.props;
    return (
      <div className="container divider">
        <div className="row">
          <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
            <div className="baseline"/>
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
  id: PropTypes.number,
  type: PropTypes.string,
  settings: PropTypes.object,
  handleParagraphLoaded: PropTypes.func,
  counter: PropTypes.number,
};

export default Divider;
