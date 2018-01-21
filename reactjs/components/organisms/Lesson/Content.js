import React, { Fragment } from 'react';

// TODO: Dynamic loading.
import Text from '../../atoms/Paragraph/Text';

class LessonContent extends React.Component {

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>{this.props.title}</h1>
            <Text text={this.props.content} />
          </div>
        </div>
      </div>
    );
  }
}

export default LessonContent;
