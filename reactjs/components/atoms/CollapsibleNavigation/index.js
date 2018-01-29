import React from 'react';
import { connect} from 'react-redux';
import { toggle } from '../../../actions/navigation';

class CollapsibleNavigation extends React.Component {

  toggleNavigation() {
    this.props.dispatch(toggle());
  }

  render() {
    return (
      <div className={`collapsible-navigation  ${this.props.isCollapsed ? 'closed' : 'opened'} ${this.props.className}`}>

        <div className="overlay" onClick={this.toggleNavigation.bind(this)} />

        <div className="toggle" onClick={this.toggleNavigation.bind(this)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="18" viewBox="0 0 30 18">
            <g fill="none" fillRule="evenodd">
              <path fillRule="nonzero" d="M0 10.667h3.333V7.333H0v3.334zm0 6.666h3.333V14H0v3.333zM0 4h3.333V.667H0V4zm6.667 6.667H30V7.333H6.667v3.334zm0 6.666H30V14H6.667v3.333zm0-16.666V4H30V.667H6.667z"/>
            </g>
          </svg>
        </div>

        <div className="navigation">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ navigation }) => ({
  isCollapsed: navigation.isCollapsed,
});

export default connect(mapStateToProps)(CollapsibleNavigation);
