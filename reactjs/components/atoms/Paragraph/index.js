import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import * as lessonsHelper from '../../../helpers/lesson';

const Paragraphs = dynamic({

  modules: props => {
    const allComponents = {
      'text_text': import('./Text/Text'),
      'text_heading': import('./Text/Heading'),
      'text_subheading': import('./Text/Heading'),
      'text_heading_text': import('./Text/TextWithHeading'),
      'list_bullet': import('./List/List'),
      'list_numbered': import('./List/List'),
      'list_checkbox': import('./List/List'),
      'image_centered_caption': import('./Image/ImageCentered'),
      'image_full_text': import('./Image/ImageFull'),
      'media_audio': import('./Media/Audio'),
      'media_video': import('./Media/Video'),
      'media_resource': import('./Media/Resource'),
      'divider_simple': import('./Divider/Divider'),
      'divider_numbered': import('./Divider/Divider'),
      'quiz_checkboxes': import('./Quiz/CheckBoxes'),
      'quiz_comboboxes': import('./Quiz/ComboBoxes'),
      'quiz_linear_scale': import('./Quiz/LinearScale'),
      'quiz_free_answer': import('./Quiz/FreeAnswer'),
    };

    // Gather list of components which are needed on the lesson page.
    let neededComponents = {};
    props.blocks.forEach(block => {
      neededComponents[block.type] = allComponents[block.type];
    });

    return neededComponents;
  },

  render: ({ blocks, ...props }, components) => (
    blocks.map(block => {
      const Paragraph = components[block.type];

      // Quiz paragraph needs an additional piece of data from redux store.
      if (lessonsHelper.blockIsQuiz(block)) {
        const data = lessonsHelper.getQuizData(props.quizzesData, block.id);
        return <Paragraph key={block.id} {...props} {...block} data={data} />;
      }
      // Render usual non-quiz paragraph.

      return <Paragraph key={block.id} {...props} {...block} />;
    })
  ),

  // No loading message / component.
  loading: () => (null),
});

Paragraphs.propTypes = {
  lessonId: PropTypes.number.isRequired,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  blocks: PropTypes.arrayOf(PropTypes.shape), // Paragraphs.
  handleQuizChange: PropTypes.func,
  handleParagraphLoaded: PropTypes.func,
};

Paragraphs.defaultProps = {
  blocks: [],
};

const mapStateToProps = ({ lesson }, { lessonId }) => ({
  quizzesData: lessonsHelper.getQuizzesData(lesson.lessons, lessonId),
});

export default connect(mapStateToProps)(Paragraphs);
