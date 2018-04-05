import React from 'react';
import PropTypes from 'prop-types';
import Player from 'react-player';

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.playerLoaded = this.playerLoaded.bind(this);
  }

  playerLoaded() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  render() {
    const { url, columnClasses } = this.props;
    return (
      <div className="container video">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <Player
              url={url.uri}
              width="100%"
              onReady={this.playerLoaded}
              onError={this.playerLoaded}
              controls
            />
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
