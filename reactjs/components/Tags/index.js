import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';

const Tags = ({ tagsName, tags, className }) => (
  <div className={className} >
    {tagsName && <h4>{tagsName}</h4>}
    <div>
      {tags.map((tag, index) => (
        <Link to={tag.tagPath} key={tag.tagPath}>
          <span>{ index === 0 ? '' : ', ' }<a href={tag.tagPath} >{tag.tagName}</a></span>
        </Link>
      ))}
    </div>
  </div>
);

Tags.propTypes = {
  tagsName: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.shape({
    tagName: PropTypes.string,
    tagPath: PropTypes.string,
  })),
  className: PropTypes.string,
};

export default Tags;
