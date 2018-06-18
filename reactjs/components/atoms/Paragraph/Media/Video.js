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
    const { url, columnClasses, id, commentsAllowed } = this.props;
    return (
      <div id={`paragraph-${id}`} className="container paragraph video">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <Player
              url={url.uri}
              width="100%"
              controls
            />

            {commentsAllowed &&
            <ShowCommentsCTA paragraphId={id} />
            }
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
  commentsAllowed: PropTypes.bool,
};

Video.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  commentsAllowed: true,
  handleParagraphLoaded: () => {},
};

export default Video;
