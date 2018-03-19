import React, { Fragment } from 'react';
import { connect} from 'react-redux';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import LessonNotebookOpenCTA from '../../../atoms/LessonNotebookOpenCTA';
import PageLoader from '../../../atoms/PageLoader';
import * as navigationActions from '../../../../actions/navigation';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';
import * as notebookHelpers from '../../../../helpers/notebook';

import PropTypes from "prop-types";

class LessonNotebook extends React.Component {

  constructor(props) {
    super(props);

    this.handleNotebookOpen = this.handleNotebookOpen.bind(this);
    this.handleNotebookClose = this.handleNotebookClose.bind(this);
  }

  async handleNotebookOpen() {
    const { dispatch } = this.props;

    dispatch(lessonNotebookActions.open());
    if (window.innerWidth < 1840) {
      dispatch(navigationActions.close());
    }

    // Get superagent request with authentication token.
    const { request } = await this.context.auth.getRequest();

    // Make a request to the backend to create a new token.
    const note = await notebookHelpers.createNote(request);

    dispatch(lessonNotebookActions.setActiveNote(note));
  }

  handleNotebookClose() {
    this.props.dispatch(lessonNotebookActions.close());
  }

  render() {
    const { isCollapsed, note } = this.props;

    return (
      <div className={`collapsible-notebook lesson  ${isCollapsed ? 'closed' : 'opened'}`}>

        {isCollapsed &&
        <LessonNotebookOpenCTA handleNotebookOpen={this.handleNotebookOpen}/>
        }

        <div className="lesson-notebook">
          {!isCollapsed &&
          <div className="lesson-notebook-inside">

            {!note &&
            <PageLoader/>
            }

            {note &&
            <Fragment>
              <NoteContent note={note}/>

              <div className="save-close" onClick={() => this.handleNotebookClose()}>
                Save and Close
              </div>

            </Fragment>
            }

          </div>
          }
        </div>

      </div>
    )
  }

}

LessonNotebook.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

const mapStateToProps = ({ lessonNotebook }) => ({
  isCollapsed: lessonNotebook.isCollapsed,
  note: lessonNotebook.note,
});

export default connect(mapStateToProps)(LessonNotebook);
