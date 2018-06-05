import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';
import LessonIcon from '../../Icons/Lesson';

class LessonSearchItem extends React.Component {
  render() {
    const { excerpt, entity, type } = this.props.searchItem;
    const { title, url } = entity;

    return (
      <SearchItem
        icon={LessonIcon}
        title={title}
        body={excerpt}
        className={type}
        itemLink={url}
      />
    );
  }
}

LessonSearchItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default LessonSearchItem;
