import React  from 'react';
import PropTypes from 'prop-types';
import Paragraphs from '../index';

class ComboBoxes extends React.Component {

  constructor(props) {
    super(props);

    this.handleSelection = this.handleSelection.bind(this);
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

  handleSelection(radioId) {
    if (this.props.handleQuizChange) {
      this.props.handleQuizChange(this.props.id, radioId);
    }
  }

  render() {
    const { id, options, title, blocks, data, columnClasses } = this.props;

    let activeId = 0;

    // The backend sends an object, so we handle it accordingly.
    if (typeof data === 'object' && data !== null) {
      activeId = Object.keys(data)[0];
    }
    // The value from redux store is just a string with uuid.
    else if (typeof data === 'string') {
      activeId = data;
    }

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
                  checked={activeId === radio.uuid}
                  onChange={() => {}}
                />
                <span onClick={() => this.handleSelection(radio.uuid)} />
                <label onClick={() => this.handleSelection(radio.uuid)}>
                  {radio.value}
                  </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
}

ComboBoxes.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object, // null or value from the backend.
    PropTypes.string, // value from the redux is just a plain string.
  ]),
  options: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string,
    value: PropTypes.string,
    is_answer: PropTypes.number,
  })),
  columnClasses: PropTypes.array,
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
  handleQuizChange: PropTypes.func,
  handleParagraphLoaded: PropTypes.func,
};

ComboBoxes.defaultProps = {
  blocks: [],
  data: null,
};

export default ComboBoxes;
