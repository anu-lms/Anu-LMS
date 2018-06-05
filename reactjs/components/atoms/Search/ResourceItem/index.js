import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';
import Icon from '../../Icons/Resource';

class ResourceSearchItem extends React.PureComponent {
  render() {
    const { excerpt, entity, type } = this.props.searchItem;
    const { id, title, lesson } = entity;
    const itemTitle = `<span class="thin">From</span> ${title} <span class="thin">in</span> ${lesson.title}`;
    return (
      <SearchItem
        icon={Icon}
        title={itemTitle}
        body={excerpt}
        className={type}
        itemLink={`${lesson.url}?paragraph=${id}`}
      />
    );
  }
}

ResourceSearchItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default ResourceSearchItem;
