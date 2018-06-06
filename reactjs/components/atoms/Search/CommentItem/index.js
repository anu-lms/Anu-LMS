import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';
import Icon from '../../Icons/Comment';

const CommentSearchItem = ({ searchItem }) => (
  <SearchItem
    icon={Icon}
    title={`Comment in ${searchItem.entity.title}`}
    body={searchItem.excerpt}
    className={searchItem.type}
    itemLink={searchItem.entity.url}
  />
);

CommentSearchItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default CommentSearchItem;
