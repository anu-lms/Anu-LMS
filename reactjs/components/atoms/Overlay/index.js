import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageLoader from '../../atoms/PageLoader';
import * as overlayActions from '../../../actions/overlay';

class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.closeOverlay = this.closeOverlay.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    // Listen to key press.
    document.addEventListener('keydown', this.onKeyPress);
  }

  componentWillUnmount() {
    // Stop listening for key press.
    document.removeEventListener('keydown', this.onKeyPress);
  }

  /**
   * Close popup window on ESC press.
   */
  onKeyPress(event) {
    if (event.keyCode === 27) {
      this.closeOverlay();
    }
  }

  closeOverlay() {
    // Please note that the order of these commands is important. If you change
    // it, then ESC key press will not call this.props.onClose() as expected.
    this.props.onClose();
    this.props.dispatch(overlayActions.close());
  }

  render() {
    const { content, header, isLoading, isError, isOpened } = this.props;

    // Don't render overlay if it is not opened.
    if (!isOpened) {
      return null;
    }

    return (
      <div className="lightbox">

        <div className="overlay animate" />

        {isLoading &&
        <PageLoader />
        }

        <div className="navigation">

          <div className="back cta" onClick={this.closeOverlay} onKeyPress={() => {}}>
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
                <g fill="none" fillRule="evenodd">
                  <path fillRule="nonzero" d="M27.333 12.333H7.05l9.317-9.316L14 .667.667 14 14 27.333l2.35-2.35-9.3-9.316h20.283z" />
                </g>
              </svg>
            </div>
            <div className="label">Close</div>
          </div>

          {!isLoading && !isError &&
          header
          }

        </div>

        <div className="content">
          {!isError ? content : <div className="error">{content}</div>}
        </div>

      </div>
    );
  }
}

Overlay.propTypes = {
  content: PropTypes.node,
  header: PropTypes.node,
  onClose: PropTypes.func,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  isOpened: PropTypes.bool,
  dispatch: PropTypes.func,
};

Overlay.defaultProps = {
  content: null,
  header: null,
  onClose: () => {},
  isLoading: false,
  isError: false,
  isOpened: false,
  dispatch: () => {},
};

const mapStateToProps = ({ overlay }) => ({
  content: overlay.content,
  header: overlay.header,
  onClose: overlay.onClose,
  isLoading: overlay.isLoading,
  isError: overlay.isError,
  isOpened: overlay.isOpened,
});

export default connect(mapStateToProps)(Overlay);
