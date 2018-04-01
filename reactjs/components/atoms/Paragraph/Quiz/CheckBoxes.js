import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../FormElement/CheckBox';
import Paragraphs from '../index';

class Checkboxes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
    props.options.forEach((checkbox) => {
      this.state[checkbox.uuid] = 0;
    });

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
    this.setState((state) => {
      state[id] = value + 0; // Convert to int.

      if (this.props.handleQuizChange) {
        this.props.handleQuizChange(this.props.id, state);
      }

      return state;
    });
  }

  render() {
    const { title, blocks, options, columnClasses } = this.props;
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

            {options.map(checkbox => (
              <Checkbox
                label={checkbox.value}
                id={checkbox.uuid}
                key={checkbox.uuid}
                onChange={this.handleChange}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Checkboxes.propTypes = {
  title: PropTypes.string,
  id: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string,
    value: PropTypes.string,
    is_answer: PropTypes.number,
  })),
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
  handleQuizChange: PropTypes.func,
  handleParagraphLoaded: PropTypes.func,
};

Checkboxes.defaultProps = {
  blocks: [],
};

export default Checkboxes;
