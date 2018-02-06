import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../FormElement/CheckBox';

class List extends React.Component {

  componentDidMount() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  componentDidUpdate() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  render() {
    const { list, type } = this.props;
    let Wrapper = 'ul';

    if (type === 'list_numbered') {
      Wrapper = 'ol';
    }
    else
      if (type === 'list_checkbox') {
        Wrapper = 'div';
      }

    return (
      <div className="container list">
        <div className="row">
          <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
            <Wrapper>
              {list.map((item, index) => (
                type === 'list_checkbox' ?
                  <Checkbox key={index} label={item}/> :
                  <li key={index}><span>{item}</span></li>
              ))}
            </Wrapper>
          </div>
        </div>
      </div>
    );
  }
}

List.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  settings: PropTypes.object,
  handleParagraphLoaded: PropTypes.func,
  list: PropTypes.array,
};

export default List;
