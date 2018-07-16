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
      list, type, id, columnClasses, commentsAllowed,
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
      <div id={`paragraph-${id}`} className="container paragraph list">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <Wrapper>
              {list.map((item, index) => (
                type === 'list_checkbox' ?
                  <Checkbox key={getKey(index)} label={item} id={getKey(index)} /> :
                  <li key={getKey(index)}><span>{item}</span></li>
              ))}
            </Wrapper>

            {commentsAllowed &&
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
  commentsAllowed: PropTypes.bool,
};

List.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  commentsAllowed: false,
  handleParagraphLoaded: () => {},
};

export default List;
