import React from 'react';
import PropTypes from 'prop-types';
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
    const { text, image, columnClasses } = this.props;
    const imageUrl = fileUrl(image.meta.derivatives.w1400);

    style.backgroundImage = `url("${imageUrl}")`;
    return (
      <div className="image-full" style={style}>
        <div className="overlay" />
        <div className="container">
          <div className="row">
            <div className={columnClasses.join(' ')}>
              {text &&
              <div
                className="text"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: text.value }}
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
  id: PropTypes.number,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
  image: PropTypes.shape({
    url: PropTypes.string,
    meta: PropTypes.shape({
      derivatives: PropTypes.shape({
        w1400: PropTypes.string,
      }),
    }),
  }),
  text: PropTypes.shape({
    value: PropTypes.string,
    format: PropTypes.string,
  }),
};

export default ImageFull;
