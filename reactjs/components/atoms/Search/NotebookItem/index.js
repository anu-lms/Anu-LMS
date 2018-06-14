import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';
import Icon from '../../Icons/Notebook';
import * as notebookHelpers from '../../../../helpers/notebook';

const NotebookSearchItem = ({ searchItem }) => (
  <SearchItem
    icon={Icon}
    title={searchItem.entity.title || notebookHelpers.getTeaser(searchItem.entity.body, 1)}
    excerpt={searchItem.excerpt}
    className={searchItem.type}
    itemLink={`/notebook?note=${searchItem.entity.id}`}
  />
);

NotebookSearchItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default NotebookSearchItem;
