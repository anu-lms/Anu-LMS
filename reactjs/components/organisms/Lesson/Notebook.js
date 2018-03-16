import React from 'react';
import { connect} from 'react-redux';
import Button from '../../atoms/Button';
import CollapsibleNotebook from '../../atoms/CollapsibleNotebook';
import * as lessonNotebookActions from '../../../actions/lessonNotebook';

class LessonNotebook extends React.Component {

  render() {
    return (
      <CollapsibleNotebook className="lesson">
        <div className="">
          This is a LessonNotebook!
        </div>
        <div className="">
          <Button type="link" onClick={() => { this.props.dispatch(lessonNotebookActions.notebookClosed()) }}>
            Save and Close
          </Button>
        </div>
      </CollapsibleNotebook>
    )
  }
}

export default connect()(LessonNotebook);
