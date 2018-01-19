import React from 'react';

class LessonContent extends React.Component {

  render() {
    return (
      <div className="container" ref="container">
        <div className="row">
          <div className="col-7 offset-3 mt-5 mb-5" >
            <div dangerouslySetInnerHTML={{__html: this.props.content}} />
          </div>
        </div>
      </div>
    );
  }
}

export default LessonContent;
