import React from 'react';
import { connect} from 'react-redux';
import { toggle } from '../../../actions/navigation';

class CollapsibleNavigation extends React.Component {

  toggleNavigation() {
    this.props.dispatch(toggle());
  }

  render() {
    return (
      <div className={`collapsible-navigation ${this.props.className}`}>
        <div className="toggle" onClick={this.toggleNavigation.bind(this)} />
        <div className={`navigation ${this.props.isCollapsed ? 'closed' : 'opened'}`}>
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
