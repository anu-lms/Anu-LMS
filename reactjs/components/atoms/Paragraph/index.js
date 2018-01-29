import dynamic from 'next/dynamic';

export const paragraphComponents = {
  'text_text': dynamic(import('./Text')),
  'text_heading': dynamic(import('./Heading')),
  'text_subheading': dynamic(import('./Heading')),
  'text_heading_text': dynamic(import('./TextWithHeading')),
  'list_bullet': dynamic(import('./List')),
  'list_numbered': dynamic(import('./List')),
  'list_checkbox': dynamic(import('./List')),
  'image_centered_caption': dynamic(import('./ImageCentered')),
  'image_full_text': dynamic(import('./ImageFull')),
  'media_audio': dynamic(import('./Audio')),
  'media_video': dynamic(import('./Video')),
  'divider_simple': dynamic(import('./Divider')),
  'divider_numbered': dynamic(import('./Divider')),
};
