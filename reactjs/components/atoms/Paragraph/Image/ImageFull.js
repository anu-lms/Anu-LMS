import React from 'react';
import PropTypes from 'prop-types';
import xss from 'xss';
import { fileUrl } from '../../../../utils/url';

class ImageFull extends React.Component {
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
    let style = {};
    const { text, image, columnClasses, id } = this.props;
    const imageUrl = fileUrl(image);

    style.backgroundImage = `url("${imageUrl}")`;
    return (
      <div id={`paragraph-${id}`} className="paragraph image-full" style={style}>
        <div className="overlay" />
        <div className="container">
          <div className="row">
            <div className={columnClasses.join(' ')}>
              {text &&
              <div
                className="text"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: xss(text.value) }}
              />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ImageFull.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
  image: PropTypes.string.isRequired,
  text: PropTypes.shape({
    value: PropTypes.string,
    format: PropTypes.string,
  }),
  commentsAllowed: PropTypes.bool,
};

ImageFull.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  commentsAllowed: false,
  handleParagraphLoaded: () => {},
  text: {},
};

export default ImageFull;
