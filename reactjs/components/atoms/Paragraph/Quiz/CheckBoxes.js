import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../FormElement/CheckBox';
import Paragraphs from '../index';

class Checkboxes extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

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

  handleChange(id, value) {
    // Change the prev quiz data.
    let data = this.props.data; // eslint-disable-line prefer-destructuring
    if (data === null) {
      data = {};
    }

    data[id] = value + 0; // Convert to int.

    if (this.props.handleQuizChange) {
      this.props.handleQuizChange(this.props.id, data);
    }
  }

  render() {
    const {
      title, blocks, options, data, columnClasses,
    } = this.props;
    return (
      <div className="container quiz checkboxes">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              <Paragraphs {...this.props} />
            </div>
            }

            {options.map(checkbox => {
              // By default every checkbox in not ticked.
              let isChecked = false;

              // Get checkbox's value from the backend or redux store.
              if (typeof data === 'object' && data !== null) {
                isChecked = typeof data[checkbox.uuid] !== 'undefined' ? !!data[checkbox.uuid] : false;
              }

              return (<Checkbox
                label={checkbox.value}
                id={checkbox.uuid}
                key={checkbox.uuid}
                onChange={this.handleChange}
                isChecked={isChecked}
              />);
            })}
          </div>
        </div>
      </div>
    );
  }
}

Checkboxes.propTypes = {
  title: PropTypes.string,
  id: PropTypes.number.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object, // null or value from the backend.
    PropTypes.string, // value from the redux is just a plain string.
  ]),
  options: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string,
    value: PropTypes.string,
    is_answer: PropTypes.number,
  })).isRequired,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
  handleQuizChange: PropTypes.func,
  handleParagraphLoaded: PropTypes.func,
};

Checkboxes.defaultProps = {
  data: null,
  title: '',
  columnClasses: [],
  handleParagraphLoaded: () => {},
  handleQuizChange: () => {},
  blocks: [],
};

export default Checkboxes;
