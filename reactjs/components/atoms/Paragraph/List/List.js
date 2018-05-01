import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../FormElement/CheckBox';
import ShowCommentsCTA from '../../../moleculas/Lesson/ShowCommentsCTA';

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
    const {
      list, type, id, columnClasses,
    } = this.props;
    let Wrapper = 'ul';

    if (type === 'list_numbered') {
      Wrapper = 'ol';
    }
    else
    if (type === 'list_checkbox') {
      Wrapper = 'div';
    }

    const getKey = index => `${id}_${index}`;

    return (
      <div className="container list">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <Wrapper>
              {list.map((item, index) => (
                type === 'list_checkbox' ?
                  <Checkbox key={getKey(index)} label={item} id={getKey(index)} /> :
                  <li key={getKey(index)}><span>{item}</span></li>
              ))}
            </Wrapper>

            {this.props.data === undefined && // Don't output comments icon for blocks inside quizes.
            <ShowCommentsCTA paragraphId={id} />
            }
          </div>
        </div>
      </div>
    );
  }
}

List.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
};

List.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  handleParagraphLoaded: () => {},
};

export default List;
