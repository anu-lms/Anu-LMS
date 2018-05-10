import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as notificationsActions from '../../../../actions/notifications';
import withRedux from '../../../../store/withRedux';

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  closePopup() {
    const { dispatch } = this.props;
    dispatch(notificationsActions.closePopup());
  }

  togglePopup() {
    const { dispatch } = this.props;
    dispatch(notificationsActions.togglePopup());
  }

  render() {
    const { isOpened } = this.props;
    return (
      <div className={`notifications-icon-wrapper ${isOpened ? 'popup-opened' : 'popup-closed'}`}>

        <div className="icon icon-bell" onClick={this.togglePopup}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="33" viewBox="0 0 28 33">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M14 32.833c1.833 0 3.333-1.5 3.333-3.333h-6.666A3.332 3.332 0 0 0 14 32.833zm10-10V14.5c0-5.117-2.733-9.4-7.5-10.533V2.833c0-1.383-1.117-2.5-2.5-2.5a2.497 2.497 0 0 0-2.5 2.5v1.134C6.717 5.1 4 9.367 4 14.5v8.333L.667 26.167v1.666h26.666v-1.666L24 22.833z" />
            </g>
          </svg>
        </div>

        <div className="icon icon-close" onClick={this.closePopup}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z" />
            </g>
          </svg>
          {/* <div className="icon-amount">2</div> */}
        </div>

        {/* <div className="icon-label">Notifications</div> */}
      </div>
    );
  }
}

Notifications.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isOpened: PropTypes.bool.isRequired,
};

Notifications.defaultProps = {

};

const mapStateToProps = ({ notifications }) => ({
  isOpened: notifications.isOpened,
});

export default withRedux(connect(mapStateToProps)(Notifications));
