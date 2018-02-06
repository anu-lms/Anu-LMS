import React from 'react';
import PropTypes from 'prop-types';

class Text extends React.Component {

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
    const { text } = this.props;
    return (
      <div className="container text">
        <div className="row">
          <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
            <div dangerouslySetInnerHTML={{ __html: text.value }} />
          </div>
        </div>
      </div>
    );
  }
}

Text.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  settings: PropTypes.object,
  handleParagraphLoaded: PropTypes.func,
  text: PropTypes.shape({
    value: PropTypes.string,
    format: PropTypes.string,
  }),
};

export default Text;
