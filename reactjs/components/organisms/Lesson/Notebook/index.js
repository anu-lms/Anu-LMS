import React, { Fragment } from 'react';
import { connect} from 'react-redux';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import LessonNotebookOpenCTA from '../../../atoms/LessonNotebookOpenCTA';
import PageLoader from '../../../atoms/PageLoader';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';
import * as notebookHelpers from '../../../../helpers/notebook';

import PropTypes from "prop-types";

class LessonNotebook extends React.Component {

  constructor(props) {
    super(props);

    this.handleNotebookOpened = this.handleNotebookOpened.bind(this);
    this.handleNotebookClosed = this.handleNotebookClosed.bind(this);
  }

  async handleNotebookOpened() {
    const { dispatch } = this.props;

    dispatch(lessonNotebookActions.notebookOpened());

    // Get superagent request with authentication token.
    const { request } = await this.context.auth.getRequest();

    // Make a request to the backend to create a new token.
    const note = await notebookHelpers.createNote(request);

    dispatch(lessonNotebookActions.setActiveNote(note));
  }

  handleNotebookClosed() {
    this.props.dispatch(lessonNotebookActions.notebookClosed());
  }

  render() {
    const { isCollapsed, note } = this.props;

    return (
      <div className={`collapsible-notebook lesson  ${isCollapsed ? 'closed' : 'opened'}`}>

        {isCollapsed &&
        <LessonNotebookOpenCTA handleNotebookOpened={this.handleNotebookOpened}/>
        }

        {!isCollapsed &&
        <div className="lesson-notebook">

          {!note &&
          <PageLoader/>
          }

          {note &&
          <Fragment>
            <NoteContent note={note}/>

            <div className="save-close" onClick={() => this.handleNotebookClosed()}>
              Save and Close
            </div>

          </Fragment>
          }

        </div>
        }

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
