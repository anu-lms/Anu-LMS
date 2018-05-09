import React from 'react';
import * as notificationsActions from '../../../../actions/notifications';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // When component is mounted, send action that the comments sidebar is opened.
    dispatch(notificationsActions.syncNotifications());
  }

  render() {
    return (
      <div className="notifications-wrapper">
        <div className="icon-wrapper">

          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="33" viewBox="0 0 28 33">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M14 32.833c1.833 0 3.333-1.5 3.333-3.333h-6.666A3.332 3.332 0 0 0 14 32.833zm10-10V14.5c0-5.117-2.733-9.4-7.5-10.533V2.833c0-1.383-1.117-2.5-2.5-2.5a2.497 2.497 0 0 0-2.5 2.5v1.134C6.717 5.1 4 9.367 4 14.5v8.333L.667 26.167v1.666h26.666v-1.666L24 22.833z" />
                <path d="M-6-3h40v40H-6z" />
              </g>
            </svg>
            {/* <div className="icon-amount">2</div> */}
          </div>

          {/* <div className="icon-label">Notifications</div> */}
        </div>

        <div className="notifications-popup">
          <div className="list">

            <div className="item not-read">
              <div className="header">
                <div className="type-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <g fill="none" fillRule="evenodd">
                      <path fill="#B2B2B2" fillRule="nonzero" d="M19.99 2c0-1.1-.89-2-1.99-2H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                      <path d="M-2-2h24v24H-2z" />
                    </g>
                  </svg>
                </div>
                <div className="date">
                  May 7th
                </div>
              </div>
              <div className="title">
                <b>Hannah Burton</b> replied to your comment in <b>Module 3: Carbohydrates</b>
              </div>
              <div className="body">
                “Body of notification, text falls into this box with 16pt padding right, 32pt padding left. Does the imbalance look odd? I don’t think so.”
              </div>
            </div>
            <div className="item">
              <div className="header">
                <div className="type-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <g fill="none" fillRule="evenodd">
                      <path fill="#B2B2B2" fillRule="nonzero" d="M19.99 2c0-1.1-.89-2-1.99-2H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                      <path d="M-2-2h24v24H-2z" />
                    </g>
                  </svg>
                </div>
                <div className="date">
                  May 7th
                </div>
              </div>
              <div className="title">
                <b>Hannah Burton</b> replied to your comment in <b>Module 3: Carbohydrates</b>
              </div>
              <div className="body">
                “Body of notification, text falls into this box with 16pt padding right, 32pt padding left. Does the imbalance look odd? I don’t think so.”
              </div>
            </div>

          </div>
          <div className="footer">
            Mark all as read
          </div>
        </div>
      </div>
    );
  }
}

Notifications.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Notifications.defaultProps = {

};

export default connect()(Notifications);
