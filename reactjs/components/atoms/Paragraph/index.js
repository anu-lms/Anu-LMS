import dynamic from 'next/dynamic';

export const paragraphComponents = {
  'text_text': dynamic(import('./Text/Text')),
  'text_heading': dynamic(import('./Text/Heading')),
  'text_subheading': dynamic(import('./Text/Heading')),
  'text_heading_text': dynamic(import('./Text/TextWithHeading')),
  'list_bullet': dynamic(import('./List/List')),
  'list_numbered': dynamic(import('./List/List')),
  'list_checkbox': dynamic(import('./List/List')),
  'image_centered_caption': dynamic(import('./Image/ImageCentered')),
  'image_full_text': dynamic(import('./Image/ImageFull')),
  'media_audio': dynamic(import('./Media/Audio')),
  'media_video': dynamic(import('./Media/Video')),
  'divider_simple': dynamic(import('./Divider/Divider')),
  'divider_numbered': dynamic(import('./Divider/Divider')),
  'quiz_checkboxes': dynamic(import('./Quiz/CheckBoxes')),
  'quiz_comboboxes': dynamic(import('./Quiz/ComboBoxes')),
  'quiz_linear_scale': dynamic(import('./Quiz/LinearScale')),
  'quiz_textarea': dynamic(import('./Quiz/TextArea')),
};
