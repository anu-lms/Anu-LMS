import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';
import Icon from '../../Icons/Comment';

class CommentSearchItem extends React.Component {
  render() {
    const { excerpt, entity, type } = this.props.searchItem;
    const { lesson, url } = entity;

    return (
      <SearchItem
        icon={Icon}
        title={`Comment in ${lesson.title}`}
        body={excerpt}
        className={type}
        itemLink={url}
      />
    );
  }
}

CommentSearchItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default CommentSearchItem;
