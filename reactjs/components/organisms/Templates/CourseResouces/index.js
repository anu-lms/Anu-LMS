import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LessonNavigation from '../../Lesson/Navigation';
import ResourceParagraph from '../../../atoms/Paragraph/Media/Resource';
import EmptyMessage from "../../../atoms/Empty";

class CourseResourcesTemplate extends React.Component {

  render() {
    const { course, resources, navigation } = this.props;

    let wrapperClasses = ['lesson-container', 'notebook-collapsed'];
    let columnClasses = ['col-12'];

    // Defines classes if navigation opened.
    if (navigation.isCollapsed) {
      wrapperClasses.push('nav-collapsed');
    }

    columnClasses.push('offset-md-1');
    columnClasses.push('col-md-10');
    columnClasses.push('offset-lg-2');
    columnClasses.push('col-lg-8');

    return (
      <div className="pt-3 pt-md-5">

        <LessonNavigation course={course}  />

        <div className={wrapperClasses.join(' ')}>

          <div className="container">
            <div className="row">
              <div className={columnClasses.join(' ')}>
                <h1>Course Resources</h1>

                <div className="resources-list">
                  {resources.length > 0 &&
                  resources.map(resource => (
                    <ResourceParagraph
                      key={resource.id}
                      title={resource.title}
                      privatefile={{
                        fid: parseInt(resource.id),
                        filename: resource.filename
                      }}
                      columnClasses={[]}
                    />
                  ))}

                  {!resources.length &&
                  <EmptyMessage message="The current course does not have any resources." />
                  }

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ navigation } ) => ({
  navigation,
});

export default connect(mapStateToProps)(CourseResourcesTemplate);
