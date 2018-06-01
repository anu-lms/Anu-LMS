import React from 'react';
import PropTypes from 'prop-types';
import PageLoader from '../../atoms/PageLoader';

class Overlay extends React.Component {

  constructor(props) {
    super(props);

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
  onKeyPress() {
    if (event.keyCode === 27) {
      this.props.onClose();
    }
  }

  render() {
    const { children, navigation, onClose, isLoading, isError } = this.props;

    return (
      <div className="lightbox">
        <div className="overlay"/>

        {this.props.isLoading &&
        <PageLoader />
        }

        <div className="navigation">

          <div className="back cta" onClick={onClose}>
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                   viewBox="0 0 28 28">
                <g fill="none" fillRule="evenodd">
                  <path fillRule="nonzero"
                        d="M27.333 12.333H7.05l9.317-9.316L14 .667.667 14 14 27.333l2.35-2.35-9.3-9.316h20.283z"/>
                </g>
              </svg>
            </div>
            <div className="label">Close</div>
          </div>

          {!isLoading && !isError &&
          navigation
          }

        </div>

        <div className="content">
          {children}
        </div>

      </div>
    );
  }
}

Overlay.propTypes = {
  navigation: PropTypes.arrayOf(
    PropTypes.node,
  ),
  onClose: PropTypes.func,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
};

Overlay.defaultProps = {
  navigation: [],
  onClose: () => {},
  isLoading: false,
  isError: false,
};

export default Overlay;
