import React from 'react';
import PropTypes from 'prop-types';
import { fileUrl } from '../../../../utils/url';
import ShowCommentsCTA from '../../../moleculas/Lesson/ShowCommentsCTA';

class ImageCentered extends React.Component {
  constructor(props) {
    super(props);
    this.contentLoaded = this.contentLoaded.bind(this);
  }

  /**
   * @todo: deprecated method.
   */
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
    const { image, title, columnClasses, id, commentsAllowed } = this.props;
    return (
      <div id={`paragraph-${id}`} className="container paragraph image-centered">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <img
              src={fileUrl(image)}
              onLoad={this.contentLoaded}
              onError={this.contentLoaded}
              ref={element => this.element = element} // @todo: update ref to the new format
              alt=""
            />
            {title &&
            <div className="caption">{title}</div>
            }

            {commentsAllowed &&
              <ShowCommentsCTA paragraphId={id} />
            }
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
  image: PropTypes.string.isRequired,
  commentsAllowed: PropTypes.bool,
};

ImageCentered.defaultProps = {
  type: '',
  columnClasses: [],
  title: '',
  settings: {},
  commentsAllowed: false,
  handleParagraphLoaded: () => {},
};

export default ImageCentered;
