import React from 'react';
import PropTypes from 'prop-types';
import ReactHowler from 'react-howler';
import { ProgressBar } from 'react-player-controls';
import { fileUrl } from '../../../../utils/url';
import ShowCommentsCTA from '../../../moleculas/Lesson/ShowCommentsCTA';

class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      duration: '',
      seek: 0,
      seekUpdate: null,
    };

    this.formatDuration = this.formatDuration.bind(this);
    this.playerLoaded = this.playerLoaded.bind(this);
    this.play = this.play.bind(this);
    this.seek = this.seek.bind(this);
    this.seekEnd = this.seekEnd.bind(this);
    this.pause = this.pause.bind(this);
    this.updatePlayerProgressBar = this.updatePlayerProgressBar.bind(this);
  }

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

  componentWillUnmount() {
    if (this.state.seekUpdate) {
      clearInterval(this.state.seekUpdate);
    }
  }

  formatDuration(duration) {
    const minutes = `${Math.floor(duration / 60)}`;
    const seconds = `${Math.floor(duration % 60)}`;
    return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }

  playerLoaded() {
    this.setState({
      formattedDuration: this.formatDuration(this.player.duration()),
      duration: Math.floor(this.player.duration()),
    });
  }

  play() {
    this.setState({
      isPlaying: true,
      seekUpdate: setInterval(() => {
        this.updatePlayerProgressBar();
      }, 1000),
    });
  }

  /**
   * Update the time marker.
   */
  seek(time) {
    if (this.player) {
      this.player.seek(time);
    }
    this.updatePlayerProgressBar();
  }

  /**
   * Perform seek.
   */
  seekEnd() {
    this.updatePlayerProgressBar();
  }

  pause() {
    if (this.state.seekUpdate) {
      clearInterval(this.state.seekUpdate);
    }
    this.setState({
      isPlaying: false,
      seekUpdate: null,
    });
  }

  updatePlayerProgressBar() {
    if (this.player) {
      this.setState({
        seek: Math.floor(this.player.seek()),
        formattedDuration: this.formatDuration(this.player.duration() - this.player.seek()),
      });
    }
  }

  render() {
    const { file, columnClasses, id } = this.props;

    if (typeof file === 'undefined') {
      return null;
    }

    return (
      <div className="container audio">
        <div className="row">
          <div className={columnClasses.join(' ')}>

            <div className="player">

              <div className="controls">
                {!this.state.isPlaying &&
                <div onClick={this.play} onKeyPress={this.play}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <path fill="#2C2C2C" fillRule="evenodd" d="M20 10L0 20V0z" />
                  </svg>
                </div>
                }
                {this.state.isPlaying &&
                <div onClick={this.pause} onKeyPress={this.pause}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20">
                    <g fill="none" fillRule="evenodd">
                      <path fill="#2C2C2C" fillRule="nonzero" d="M0 19.333h5.333V.667H0v18.666zM10.667.667v18.666H16V.667h-5.333z" />
                    </g>
                  </svg>
                </div>
                }
              </div>

              <ReactHowler
                src={fileUrl(file.url)}
                ref={player => this.player = player}
                onLoad={this.playerLoaded}
                playing={this.state.isPlaying}
                loop={false}
                onEnd={this.pause}
              />

              <ProgressBar
                totalTime={parseInt(this.state.duration)} // eslint-disable-line radix
                currentTime={parseInt(this.state.seek)} // eslint-disable-line radix
                isSeekable
                onSeek={this.seek}
                onIntent={time => this.setState(() => ({ lastIntent: time }))}
                onSeekEnd={this.seekEnd}
              />

              <div className="duration">
                {this.state.formattedDuration}
              </div>
            </div>

            <ShowCommentsCTA paragraphId={id} />
          </div>
        </div>
      </div>
    );
  }
}

Audio.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
  file: PropTypes.shape({
    url: PropTypes.string,
  }).isRequired,
};

Audio.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  handleParagraphLoaded: () => {},
};

export default Audio;
