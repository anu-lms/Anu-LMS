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
        type: "notebook--notebook",
        attributes: {
          field_notebook_title: note.title ? note.title : '',
          field_notebook_body: {
            value: note.body,
            format: 'filtered_html',
          },
        }
      }
    };

    let promise;
    if (note.uuid) {
      data.data.id = note.uuid;
      promise = request
        .patch('/jsonapi/notebook/notebook/' + note.uuid)
        .send(data);
    }
    else {
      promise = request
        .post('/jsonapi/notebook/notebook')
        .send(data)
    }

    promise
      .then(response => {
        let formattedResponse = [response.body.data];
        const notes = dataProcessors.notebookData(formattedResponse);
        const note = notes[0];

        // TODO: Set or update new.
        dispatch(notebookActions.addNote(note));
        console.log('response:');
        console.log(note);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <Fragment>

        <div className="caption sm">
          Updated {moment(this.props.note.changed * 1000).format('LLL')}
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

        <Button block className="mt-3" onClick={this.onContentSave}>Save</Button>

      </Fragment>
    );
  }
}

NoteContent.contextTypes = {
  request: PropTypes.func,
};

const mapStateToProps = ({ notebook }, { activeNoteId }) => {
  // Find currently active note in the store by id.
  const index = notebook.findIndex(note => note.id === activeNoteId);
  return {
    note: notebook[index].data,
  }
};

export default connect(mapStateToProps)(NoteContent);
