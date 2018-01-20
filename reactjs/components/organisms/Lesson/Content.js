import React from 'react';

// TODO: Dynamic loading.
import Text from '../../atoms/Paragraph/Text';

class LessonContent extends React.Component {

  render() {
    return (
      <Text text={this.props.content} />
    );
  }
}

export default LessonContent;
