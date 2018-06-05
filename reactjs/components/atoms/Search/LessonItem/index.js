import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from '../Item';

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <g fill="none" fillRule="evenodd">
      <path fill="#B2B2B2" fillRule="nonzero" d="M19.99 2c0-1.1-.89-2-1.99-2H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
      <path d="M-2-2h24v24H-2z" />
    </g>
  </svg>
);

class LessonSearchItem extends React.Component {
  render() {
    const { excerpt, entity, type } = this.props.searchItem;
    const { title, url } = entity;

    return (
      <SearchItem
        Icon={Icon}
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
