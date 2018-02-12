import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { connect } from 'react-redux';
import Button from '../../../atoms/Button';
import Editor from '../../../atoms/RichEditor';
import EditableElement from '../../../atoms/EditableElement';
import * as notebookHelpers from '../../../../helpers/notebook';
import * as notebookActions from '../../../../actions/notebook';
import * as dataProcessors from '../../../../utils/dataProcessors';

class NoteContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      initialContent: '',
      initialTitle: '',
    };

    this.showNotes = this.showNotes.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onContentSave = this.onContentSave.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  componentDidMount() {
    // Set the initial value for the editable note title element.
    const { note } = this.props;

    this.setState({
      initialTitle: note.title,
      initialContent: note.body,
    });
  }

  componentDidUpdate(prevProps) {
    const prevNote = prevProps.note;
    const note = this.props.note;

    // Change the state of the component only when a new note is loaded.
    if (prevNote.id !== note.id) {
      this.setState({
        initialTitle: note.title,
        initialContent: note.body,
      });
    }
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

  onContentSave() {
    // TODO: Authentication may drop if expired.
    const request = this.context.request();
    const { note, dispatch } = this.props;

    // Set the note's state to "Is saving".
    dispatch(notebookActions.setNoteStateSaving(note.id));

    request
      .patch('/jsonapi/notebook/notebook/' + note.uuid)
      .send({
        data: {
          type: 'notebook--notebook',
          id: note.uuid,
          attributes: {
            field_notebook_title: note.title,
            field_notebook_body: {
              value: note.body,
              format: 'filtered_html',
            },
          }
        }
      })
      .then(response => {
        const data = dataProcessors.notebookData([response.body.data]);

        // Replace the old note with saved one.
        dispatch(notebookActions.addNote(data[0]));

        // Set the note's state to "Saved".
        dispatch(notebookActions.setNoteStateSaved(note.id));
      })
      .catch(error => console.log(error));
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

        <div className="caption sm">

          <div>
            {notebookHelpers.getSavedState(this.props.note)}
          </div>

          {this.props.note &&
          <Fragment>
            Updated {moment(this.props.note.changed * 1000).format('LLL')}
          </Fragment>
          }
        </div>

        <h5 className="title">
          <EditableElement
            initialValue={this.state.initialTitle}
            placeholder={"Untitled"}
            onChange={this.onTitleChange}
            maxLength={255}
          />
        </h5>

        <Editor
          initialValue={this.state.initialContent}
          placeholder={"Type something..."}
          onChange={this.onContentChange}
        />

        <div className="mb-5"/>

        <Button block onClick={this.onContentSave}>Save</Button>

      </Fragment>
    );
  }
}

NoteContent.contextTypes = {
  request: PropTypes.func,
};

export default connect()(NoteContent);
