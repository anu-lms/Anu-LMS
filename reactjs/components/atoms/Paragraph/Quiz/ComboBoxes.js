import React from 'react';
import PropTypes from 'prop-types';
import Paragraphs from '../index';

class ComboBoxes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
    };

    this.handleAddSelection = this.handleAddSelection.bind(this);
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

  handleAddSelection(radioId) {
    this.setState({ active: radioId });

    if (this.props.handleQuizChange) {
      this.props.handleQuizChange(this.props.id, radioId);
    }
  }

  render() {
    const {
      id, options, title, blocks, columnClasses,
    } = this.props;

    /* eslint-disable max-len, jsx-a11y/no-noninteractive-element-interactions */
    return (
      <div className="container quiz comboboxes">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              <Paragraphs {...this.props} />
            </div>
            }

            {options.map(radio => (
              <div className="radio" key={radio.uuid}>
                <input
                  type="radio"
                  name={id}
                  value={radio.uuid}
                  checked={this.state.active === radio.uuid}
                />
                <span onClick={() => this.handleAddSelection(radio.uuid)} onKeyPress={() => this.handleAddSelection(radio.uuid)} />
                <label onClick={() => this.handleAddSelection(radio.uuid)} onKeyPress={() => this.handleAddSelection(radio.uuid)} htmlFor={id}>
                  {radio.value}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

ComboBoxes.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
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

ComboBoxes.defaultProps = {
  columnClasses: [],
  handleParagraphLoaded: () => {},
  handleQuizChange: () => {},
  blocks: [],
};

export default ComboBoxes;
