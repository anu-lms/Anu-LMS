import React from 'react';
import PropTypes from 'prop-types';
import { fileUrl } from '../../../../utils/url';
import ShowCommentsCTA from '../../../moleculas/Lesson/ShowCommentsCTA';

class ImageCentered extends React.Component {
  constructor(props) {
    super(props);
    this.contentLoaded = this.contentLoaded.bind(this);
  }

  componentWillReceiveProps() {
    if (this.element.complete) {
      // Report to the parent component that the loading is done.
      if (this.props.handleParagraphLoaded) {
        this.props.handleParagraphLoaded(this.props.id);
      }
    }
  }

  contentLoaded() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  render() {
    const { image, title, columnClasses, id } = this.props;
    return (
      <div className="container image-centered">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <img
              src={fileUrl(image.meta.derivatives.w730)}
              onLoad={this.contentLoaded}
              onError={this.contentLoaded}
              ref={element => this.element = element}
              alt=""
            />
            {title &&
            <div className="caption">{title}</div>
            }

            <ShowCommentsCTA paragraphId={id} />
          </div>
        </div>
      </div>
    );
  }
}

ImageCentered.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
  image: PropTypes.shape({
    url: PropTypes.string,
    meta: PropTypes.shape({
      derivatives: PropTypes.shape({
        w730: PropTypes.string,
      }),
    }),
  }).isRequired,
};

ImageCentered.defaultProps = {
  type: '',
  columnClasses: [],
  title: '',
  settings: {},
  handleParagraphLoaded: () => {},
};

export default ImageCentered;
