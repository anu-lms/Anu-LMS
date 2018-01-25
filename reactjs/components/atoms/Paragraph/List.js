import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../FormElement/Checkbox';

const List = ({ list, type, isNavCollapsed}) => {

  let Wrapper = 'ul';

  if (type === 'list_numbered') {
    Wrapper = 'ol';
  }
  else if (type === 'list_checkbox') {
    Wrapper = 'div';
  }

  return (
    <div className="container list">
      <div className="row">
        <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
          <Wrapper>
            {list.map((item, index) => (
              type === 'list_checkbox' ?
                <Checkbox key={index} label={item} /> :
                <li key={index}><span>{item}</span></li>
            ))}
          </Wrapper>
        </div>
      </div>
    </div>
  );
};

List.propTypes = {
  list: PropTypes.array,
  type: PropTypes.string,
  isNavCollapsed: PropTypes.bool,
  settings: PropTypes.object,
};

export default List;
