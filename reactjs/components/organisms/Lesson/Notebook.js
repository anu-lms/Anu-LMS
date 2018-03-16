import React from 'react';
import Button from '../../atoms/Button';
import CollapsibleNotebook from '../../atoms/CollapsibleNotebook';

class LessonNotebook extends React.Component {

  render() {
    return (
      <CollapsibleNotebook className="lesson">
        <div className="">
          This is a LessonNotebook!
        </div>
        <div className="">
          <Button type="link">
            Save and Close
          </Button>
        </div>
      </CollapsibleNotebook>
    )
  }
}

export default LessonNotebook;
