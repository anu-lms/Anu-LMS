import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';
import Icon from '../../Icons/Resource';

const ResourceSearchItem = ({ searchItem }) => {
  const { excerpt, entity, type } = searchItem;
  const { id, title, lesson } = entity;
  const itemTitle = `<span class="thin">From</span> ${title} <span class="thin">in</span> ${lesson.title}`;
  return (
    <SearchItem
      icon={Icon}
      title={itemTitle}
      excerpt={excerpt}
      className={type}
      itemLink={`${lesson.url}?section=${id}`}
      linkProps={{ scroll: false }} // Disables default link scroll to the top.
    />
  );
};

ResourceSearchItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default ResourceSearchItem;
