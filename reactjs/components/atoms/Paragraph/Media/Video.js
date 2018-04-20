import React from 'react';
import PropTypes from 'prop-types';
import Player from 'react-player';
import ShowCommentsCTA from '../../../moleculas/Lesson/ShowCommentsCTA';

class Video extends React.Component {
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
    const { url, columnClasses, id } = this.props;
    return (
      <div className="container video">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <Player
              url={url.uri}
              width="100%"
              controls
            />
            <ShowCommentsCTA paragraphId={id} />
          </div>
        </div>
      </div>
    );
  }
}

Video.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
  url: PropTypes.shape({
    uri: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

Video.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  handleParagraphLoaded: () => {},
};

export default Video;
