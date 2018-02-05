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
    const { text, image } = this.props;
    const imageUrl = fileUrl(image.meta.derivatives['w1400']);

    style.backgroundImage = `url("${imageUrl}")`;
    return (
      <div className="image-full" style={style}>
        <div className="overlay"/>
        <div className="container">
          <div className="row">
            <div
              className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
              {text &&
              <div className="text"
                   dangerouslySetInnerHTML={{__html: text.value}} />
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
  settings: PropTypes.object,
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
