import React, { Fragment } from 'react';
import moment from 'moment/moment';
import { connect } from 'react-redux';
import Editor from '../../../atoms/RichEditor';
import NoteMenu from '../NoteMenu';
import EditableElement from '../../../atoms/EditableElement';
import * as notebookHelpers from '../../../../helpers/notebook';
import * as notebookActions from '../../../../actions/notebook';

class NoteContent extends React.Component {

  constructor(props) {
    super(props);

    this.showNotes = this.showNotes.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  showNotes() {
    const { dispatch } = this.props;
    dispatch(notebookActions.toggleMobileVisibility());
  }

  onContentChange(value) {
    const { note, dispatch } = this.props;
    if (note.body !== value) {
      dispatch(notebookActions.updateNoteBody(note.id, value));
    }
  }

  onTitleChange(value) {
    const { note, dispatch } = this.props;
    dispatch(notebookActions.updateNoteTitle(note.id, value));
  }

  render() {
    return (
      <Fragment>

        <div className="show-notebook d-md-none" onClick={this.showNotes}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path fillRule="nonzero" d="M16 7H3.83l5.59-5.59L8 0 0 8l8 8 1.41-1.41L3.83 9H16z"/>
          </svg>
          <span>Back to Notebook</span>
        </div>

        <div className="row">
          <div className="caption sm col-auto mr-auto">

            <div>
              {notebookHelpers.getSavedState(this.props.note)}
            </div>

            {this.props.note &&
            <Fragment>
              Updated {moment(this.props.note.changed * 1000).format('LLL')}
            </Fragment>
            }
          </div>

          <div className="col-auto">
            {this.props.count > 1 && <NoteMenu note={this.props.note} />}
          </div>

        </div>

        <h5 className="title">
          <EditableElement
            id={this.props.note.id}
            initialValue={this.props.note.title}
            placeholder={"Untitled"}
            onChange={this.onTitleChange}
            maxLength={255}
          />
        </h5>

        <Editor
          id={this.props.note.id}
          initialValue={this.props.note.body}
          placeholder={"Type something..."}
          onChange={this.onContentChange}
        />

      </Fragment>
    );
  }
}

const mapStateToProps = ({ notebook }) => ({
  count: notebook.notes.length
});

export default connect(mapStateToProps)(NoteContent);
