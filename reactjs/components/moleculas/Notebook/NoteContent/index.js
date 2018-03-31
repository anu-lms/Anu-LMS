import React from 'react';
import PropTypes from 'prop-types';
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

    this.onContentChange = this.onContentChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
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
    const { note, count } = this.props;
    return (
      <div className="note-content">

        <div className="row note-meta">
          <div className="caption sm col-auto mr-auto">

            <div>
              {notebookHelpers.getSavedState(note)}
            </div>

            {note &&
            <div className="date">
              Updated {moment(note.changed * 1000).format('LLL')}
            </div>
            }
          </div>

          <div className="context-menu">
            {count > 1 && <NoteMenu note={note} />}
          </div>

        </div>

        <h5 className="title">
          <EditableElement
            id={note.id}
            initialValue={note.title}
            placeholder={'Untitled'}
            onChange={this.onTitleChange}
            maxLength={255}
          />
        </h5>

        <Editor
          id={note.id}
          initialValue={note.body}
          placeholder={'Type something...'}
          onChange={this.onContentChange}
        />

      </div>
    );
  }
}

NoteContent.propTypes = {
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  count: PropTypes.number,
  dispatch: PropTypes.func,
};

const mapStateToProps = ({ notebook }) => ({
  count: notebook.notes.length,
});

export default connect(mapStateToProps)(NoteContent);
