import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as lessonNavigationActions from '../../../actions/navigation';
import * as mediaBreakpoint from '../../../utils/breakpoints';

class CollapsibleNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: true,
    };

    this.closeNavigation = this.closeNavigation.bind(this);
  }

  componentDidMount() {
    // Use isCollapsedMobile property for mobile devices and isCollapsed for desktop.
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      isCollapsed: mediaBreakpoint.isDown('md') ? this.props.isCollapsedMobile : this.props.isCollapsed,
    });
  }

  /**
   * @todo: deprecated method.
   */
  componentWillReceiveProps(nextProps) {
    // Use isCollapsedMobile property for mobile devices and isCollapsed for desktop.
    this.setState({
      isCollapsed: mediaBreakpoint.isDown('md') ? nextProps.isCollapsedMobile : nextProps.isCollapsed,
    });
  }

  closeNavigation() {
    const { dispatch } = this.props;
    dispatch(lessonNavigationActions.close());
  }

  render() {
    return (
      <div className={`collapsible-navigation ${this.state.isCollapsed ? 'closed' : 'opened'} ${this.props.className}`}>

        <div className="overlay" onClick={this.closeNavigation} onKeyPress={this.closeNavigation} />

        <div className="navigation">
          {this.props.children}
        </div>
      </div>
    );
  }
}

CollapsibleNavigation.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  isCollapsedMobile: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
};

CollapsibleNavigation.defaultProps = {
  className: '',
};

const mapStateToProps = ({ navigation }) => ({
  isCollapsed: navigation.isCollapsed,
  isCollapsedMobile: navigation.isCollapsedMobile,
});

export default connect(mapStateToProps)(CollapsibleNavigation);
