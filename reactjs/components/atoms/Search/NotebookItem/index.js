import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';
import Icon from '../../Icons/Notebook';
import * as notebookHelpers from '../../../../helpers/notebook';

class NotebookSearchItem extends React.PureComponent {
  render() {
    const { excerpt, entity, type } = this.props.searchItem;
    const { id, title, body } = entity;
    return (
      <SearchItem
        icon={Icon}
        title={title || notebookHelpers.getTeaser(body, 1)}
        body={excerpt}
        className={type}
        itemLink={`/notebook?note=${id}`}
      />
    );
  }
}

NotebookSearchItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default NotebookSearchItem;
