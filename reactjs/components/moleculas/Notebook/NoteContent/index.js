import React, { Fragment } from 'react';
import moment from 'moment/moment';
import Html from 'slate-html-serializer';
import Button from '../../../atoms/Button';
import Editor from '../../../atoms/RichEditor';
import { rules } from '../../../atoms/RichEditor/serializer';

class NoteContent extends React.Component {

  constructor(props) {
    super(props);

    const initialValue = '<p></p>';

    // Create a new serializer instance with our `rules` from above.
    this.html = new Html({ rules});

    this.state = {
      contentValue: this.html.deserialize(initialValue),
    };

    this.onContentChange = this.onContentChange.bind(this);
    this.onContentSave = this.onContentSave.bind(this);
  }

  onContentChange(value) {
    this.setState({ contentValue: value });
  }

  onContentSave() {
    const value = this.state.contentValue;
    console.log(this.html.serialize(value));
  }

  render() {

    const { note } = this.props;

    return (
      <Fragment>

        <div className="caption sm">
          Updated {moment(note.changed * 1000).format('LLL')}
        </div>

        <h4 className="title editable">
          {note.title}
        </h4>

        <Editor value={this.state.contentValue} onChange={this.onContentChange} />

        <div className="mb-5"/>

        <Button block className="mt-3" onClick={this.onContentSave}>Save</Button>

      </Fragment>
    );
  }
}

export default NoteContent;
