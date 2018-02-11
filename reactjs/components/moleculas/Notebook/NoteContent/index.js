import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { connect } from 'react-redux';
import Button from '../../../atoms/Button';
import Editor from '../../../atoms/RichEditor';
import EditableElement from '../../../atoms/EditableElement';
import * as notebookActions from "../../../../actions/notebook";
import * as dataProcessors from "../../../../utils/dataProcessors";

class NoteContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      initialContent: '',
      initialTitle: '',
    };

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

  onContentChange(value) {
    const { note, dispatch } = this.props;
    dispatch(notebookActions.updateNoteBody(note.id, value));
  }

  onTitleChange(value) {
    const { note, dispatch } = this.props;
    dispatch(notebookActions.updateNoteTitle(note.id, value));
  }

  onContentSave() {
    // TODO: Authentication may drop if expired.
    const request = this.context.request();
    const { note, dispatch } = this.props;

    const data = {
      data: {
        type: 'notebook--notebook',
        id: note.uuid,
        attributes: {
          field_notebook_title: note.title,
          field_notebook_body: {
            value: note.body,
            format: 'filtered_html',
          },
          // TODO: Changed prop can't be patched somewhy.
          //changed: Math.floor(Date.now() / 1000),
        }
      }
    };

    // If note exists, then we should send update request to the backend.
    if (note.uuid) {
      request
        .patch('/jsonapi/notebook/notebook/' + note.uuid)
        .send(data)
        .then(response => {
          const data = dataProcessors.notebookData([response.body.data]);
          console.log('Saved entity');
          console.log(data[0]);
          dispatch(notebookActions.addNote(data[0]))
        })
        .catch(error => console.log(error));
    }
    // If this is a new note, send post request to create one.
    else {
      request
        .post('/jsonapi/notebook/notebook')
        .send(data)
        .then(response => {
          const data = dataProcessors.notebookData([response.body.data]);
          dispatch(notebookActions.replaceNewNote(data[0]));
          dispatch(notebookActions.setActiveNote(data[0].id));
        })
        .catch(error => console.log(error));
    }
  }

  render() {
    return (
      <Fragment>

        <div className="caption sm">
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
