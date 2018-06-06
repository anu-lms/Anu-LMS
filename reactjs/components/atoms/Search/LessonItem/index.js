import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';
import Icon from '../../Icons/Lesson';

const LessonSearchItem = ({ searchItem }) => (
  <SearchItem
    icon={Icon}
    title={searchItem.entity.title}
    body={searchItem.excerpt}
    className={searchItem.type}
    itemLink={searchItem.entity.url}
  />
);

LessonSearchItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default LessonSearchItem;
