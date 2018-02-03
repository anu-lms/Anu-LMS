import React from 'react';
import dynamic from 'next/dynamic';

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
      'divider_simple': import('./Divider/Divider'),
      'divider_numbered': import('./Divider/Divider'),
      'quiz_checkboxes': import('./Quiz/CheckBoxes'),
      'quiz_comboboxes': import('./Quiz/ComboBoxes'),
      'quiz_linear_scale': import('./Quiz/LinearScale'),
      'quiz_textarea': import('./Quiz/TextArea'),
    };

    // Gather list of components which are needed on the lesson page.
    let neededComponents = {};
    props.blocks.forEach(block => {
      neededComponents[block.type] = allComponents[block.type];
    });

    return neededComponents;
  },

  render: ({ blocks, handleQuizChange }, components) => {

    return (
      blocks.map((block, index) => {
        const Paragraph = components[block.type];

        if (block.type.indexOf('quiz_') === 0) {
          return <Paragraph key={index} {...block} handleQuizChange={handleQuizChange} />;
        }
        return <Paragraph key={index} {...block} />;
      })
    );
  },
});

Paragraphs.defaultProps = {
  blocks: [],
  handleQuizChange: {},
};

export default Paragraphs;
