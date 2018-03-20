import React from 'react';
import PropTypes from 'prop-types';
import ReactHowler from 'react-howler';
import { fileUrl } from '../../../../utils/url';
import { ProgressBar } from 'react-player-controls'

class Audio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      duration: '',
      seek: 0,
      seekUpdate: {},
    };

    this.formatDuration = this.formatDuration.bind(this);
    this.playerLoaded = this.playerLoaded.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
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

  formatDuration(duration) {
    const minutes = Math.floor(duration / 60) + '';
    const seconds = Math.floor(duration % 60) + '';
    return minutes.padStart(2, '0') + ':' + seconds.padStart(2, '0');
  }

  playerLoaded() {
    this.setState({
      formattedDuration: this.formatDuration(this.player.duration()),
      duration: Math.floor(this.player.duration())
    });
  }

  play() {
    this.setState({
      isPlaying: true,
      seekUpdate: setInterval(() => (
        this.setState({
          seek: Math.floor(this.player.seek()),
          formattedDuration: this.formatDuration(this.player.duration() - this.player.seek()),
        })
      ), 1000)
    });
  }

  pause() {
    this.setState(prevState => ({
      isPlaying: false,
      seekUpdate: clearInterval(prevState.seekUpdate),
    }));
  }

  render() {
    const { file } = this.props;

    if (typeof file === 'undefined') {
      return null;
    }

    return (
      <div className="container audio">
        <div className="row">
          <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">

            <div className="player">

              <div className="controls">
                {!this.state.isPlaying &&
                <div onClick={this.play}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <path fill="#2C2C2C" fillRule="evenodd" d="M20 10L0 20V0z"/>
                  </svg>
                </div>
                }
                {this.state.isPlaying &&
                <div onClick={this.pause}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20">
                    <g fill="none" fillRule="evenodd">
                      <path fill="#2C2C2C" fillRule="nonzero" d="M0 19.333h5.333V.667H0v18.666zM10.667.667v18.666H16V.667h-5.333z"/>
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
              />

              <ProgressBar
                totalTime={parseInt(this.state.duration)}
                currentTime={parseInt(this.state.seek)}
                isSeekable={true}
                onSeek={time => this.player.seek(time)}
                onIntent={time => this.setState(() => ({ lastIntent: time }))}
                onSeekEnd={this.play}
              />

              <div className="duration">
                {this.state.formattedDuration}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

Audio.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  settings: PropTypes.object,
  handleParagraphLoaded: PropTypes.func,
  file: PropTypes.shape({
    url: PropTypes.string,
  }),
};

export default Audio;
