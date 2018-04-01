import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LessonNavigation from '../../Lesson/Navigation';
import ResourceParagraph from '../../../atoms/Paragraph/Media/Resource';
import EmptyMessage from '../../../atoms/Empty';

const CourseResourcesTemplate = ({ course, resources, navigation }) => {
  let wrapperClasses = ['lesson-container', 'notebook-collapsed', 'course-resources-container'];
  let columnClasses = ['col-12'];

  // Defines classes if navigation opened.
  if (navigation.isCollapsed) {
    wrapperClasses.push('nav-collapsed');
    columnClasses.push('offset-md-1');
    columnClasses.push('col-md-10');
  }

  columnClasses.push('offset-lg-2');
  columnClasses.push('col-lg-8');

  return (
    <div className="pt-3 pt-md-5">

      <LessonNavigation course={course} />

      <div className={wrapperClasses.join(' ')}>

        <div className="container">
          <div className="row">
            <div className={columnClasses.join(' ')}>
              <h1>Course Resources</h1>

              <div className="download-column-label"><div className="inner">Download</div></div>
              <div className="resources-list">
                {resources.length > 0 &&
                resources.map(resource => (
                  <ResourceParagraph
                    key={resource.id}
                    title={resource.title}
                    privatefile={{
                      fid: parseInt(resource.id), // eslint-disable-line radix
                      filename: resource.filename,
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
};

CourseResourcesTemplate.propTypes = {
  course: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = ({ navigation }) => ({
  navigation,
});

export default connect(mapStateToProps)(CourseResourcesTemplate);
