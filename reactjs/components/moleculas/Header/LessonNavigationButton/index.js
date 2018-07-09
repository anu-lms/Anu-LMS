import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import HeaderIcon from '../../../atoms/HeaderIcon';
import LessonNavigationIcon from '../../../atoms/Icons/LessonNavigation';
import * as lessonNavigationActions from '../../../../actions/navigation';
import * as mediaBreakpoint from '../../../../utils/breakpoints';
import * as lessonSidebarActions from '../../../../actions/lessonSidebar';

class LessonNavigationButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: true,
    };

    this.toggleNavigation = this.toggleNavigation.bind(this);
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

  toggleNavigation() {
    const { dispatch } = this.props;
    dispatch(lessonNavigationActions.toggle());

    // Close notebook pane on Tablet devices if navigation opened,
    // leave both panes opened on extra large screens.
    if (mediaBreakpoint.isBetween('md', 'xxl')) {
      dispatch(lessonSidebarActions.close());
    }
  }

  render() {
    const { isCollapsed } = this.state;
    return (
      <div className={classNames('lesson-navigation-button', { 'opened': !isCollapsed })}>

        <HeaderIcon
          className="toggle"
          label="Contents"
          onClick={this.toggleNavigation}
          onKeyPress={this.toggleNavigation}
          isActive={!isCollapsed}
        >
          <LessonNavigationIcon />
        </HeaderIcon>
      </div>
    );
  }
}

LessonNavigationButton.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  isCollapsedMobile: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ navigation }) => ({
  isCollapsed: navigation.isCollapsed,
  isCollapsedMobile: navigation.isCollapsedMobile,
});

export default connect(mapStateToProps)(LessonNavigationButton);
