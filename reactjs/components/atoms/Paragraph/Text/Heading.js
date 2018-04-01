import React from 'react';
import PropTypes from 'prop-types';

class Heading extends React.Component {
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
    const { title, type, columnClasses } = this.props;
    return (
      <div className="container heading">
        <div className="row">
          <div className={columnClasses.join(' ')}>

            {title && type === 'text_heading' &&
            <h4>{title}</h4>
            }

            {title && type !== 'text_heading' &&
            <h5>{title}</h5>
            }

          </div>
        </div>
      </div>
    );
  }
}

Heading.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
};

Heading.defaultProps = {
  title: '',
  type: '',
  columnClasses: [],
  settings: {},
  handleParagraphLoaded: () => {},
};

export default Heading;
