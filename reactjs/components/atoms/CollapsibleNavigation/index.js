import React from 'react';
import { connect} from 'react-redux';
import { toggle } from '../../../actions/navigation';
import * as mediaBreakpoint from '../../../utils/breakpoints';
import * as lessonNotebookActions from '../../../actions/lessonNotebook';

class CollapsibleNavigation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: true
    };
  }

  componentDidMount() {
    // Use isCollapsedMobile property for mobile devices and isCollapsed for desktop.
    this.setState({
      isCollapsed: mediaBreakpoint.isDown('md') ? this.props.isCollapsedMobile : this.props.isCollapsed
    });
  }

  componentWillReceiveProps(nextProps) {
    // Use isCollapsedMobile property for mobile devices and isCollapsed for desktop.
    this.setState({
      isCollapsed: mediaBreakpoint.isDown('md') ? nextProps.isCollapsedMobile : nextProps.isCollapsed
    });
  }

  toggleNavigation() {
    this.props.dispatch(toggle());

    // Close notebook pane on Tablet devices if navigation opened,
    // leave both panes opened on extra large screens.
    if (mediaBreakpoint.isBetween('md', 'xxl')) {
      this.props.dispatch(lessonNotebookActions.close());
    }
  }

  render() {
    return (
      <div className={`collapsible-navigation ${this.state.isCollapsed ? 'closed' : 'opened'} ${this.props.className}`}>

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
  isCollapsedMobile: navigation.isCollapsedMobile,
});

export default connect(mapStateToProps)(CollapsibleNavigation);
