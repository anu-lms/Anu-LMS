import React from 'react';
import { connect } from 'react-redux';
import CollapsibleNavigation from '../../atoms/CollapsibleNavigation';
import LinkWithProgress from '../../atoms/Link/LinkWithProgress';
import { setProgress } from '../../../actions/lesson';
import { getProgress } from '../../../helpers/lesson';

const toc = [
  {
    title: 'Introduction',
    url: '/',
    id: 1,
  },
  {
    title: 'Fifth Gear',
    url: '/',
    id: 2,
  },
  {
    title: 'Fourth Gear',
    url: '/',
    id: 3,
  },
  {
    title: 'Third Gear',
    url: '/',
    id: 4,
  },
  {
    title: 'Second Gear',
    url: '/',
    id: 5,
  },
  {
    title: 'First Gear',
    url: '/',
    id: 6,
  },
  {
    title: 'Reverse Gear',
    url: '/',
    id: 7,
  },
  {
    title: 'Five Gears Assessment Gear',
    url: '/',
    id: 8,
  },
  {
    title: 'Going Deeper: Five Gears',
    url: '/',
    id: 9,
  },
];

const LessonNavigation = ({ dispatch, lessons }) => (

  <CollapsibleNavigation className="lesson">

    <div className="course-teaser" style={{ backgroundImage: 'url("//via.placeholder.com/100x100")' }}>
      <div className="overlay" />
      <h5 className="title"><a>The Five Gears</a></h5>
      <div className="progress">
        <div className="completion">18% complete</div>
        <div className="progress-bar">
          <div className="current-progress" style={{ width: '18%' }} />
        </div>
      </div>
    </div>

    {console.log('LESSONS:')}
    {console.log(lessons)}

    <div className="table-of-contents">
      <h5 className="title">Course Contents</h5>
      <div className="contents">
        {toc.map(item => (
          <LinkWithProgress
            key={item.id}
            title={item.title}
            url={item.url}
            progress={getProgress(lessons, item.id)}
          />
        ))}
      </div>
    </div>

  </CollapsibleNavigation>

);

const mapStateToProps = ({ lesson }) => ({
  lessons: lesson,
});

export default connect(mapStateToProps)(LessonNavigation);
