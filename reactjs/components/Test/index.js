import React from 'react';
import request from '../../lib/request';

class Test extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classes: [],
      courses: [],
      lessons: [],
    }
  }

  async requestSubmit() {
    let response;

    response = await request
      .get('/jsonapi/group/class');

    console.log(response);

    let classes = [];
    response.body.data.forEach(item => {
      classes.push(item.label);
    });

    response = await request
      .get('/jsonapi/node/course');

    console.log(response);

    let courses = [];
    response.body.data.forEach(item => {
      courses.push(item.title);
    });


    response = await request
      .get('/jsonapi/node/lesson');

    console.log(response);

    let lessons = [];
    response.body.data.forEach(item => {
      lessons.push(item.title);
    });

    this.setState({
      classes,
      courses,
      lessons,
    });
  }

  render() {
    return (
      <div>
        <a href='#' onClick={this.requestSubmit.bind(this)}>Fetch courses & lessons</a>
        {this.state.classes.length > 0 &&
        <div>
          Classes:
          <ul>
            {this.state.classes.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        }
        {this.state.courses.length > 0 &&
        <div>
          Courses:
          <ul>
            {this.state.courses.map((course, index) => <li key={index}>{course}</li>)}
          </ul>
        </div>
        }
        {this.state.lessons.length > 0 &&
        <div>
          Lessons:
          <ul>
            {this.state.lessons.map((lesson, index) => <li key={index}>{lesson}</li>)}
          </ul>
        </div>
        }
      </div>
    )
  }
}

export default Test;
