import React  from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../FormElement/CheckBox';
import Paragraphs from '../index';

class Checkboxes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
    props.list.forEach(checkbox => {
      this.state[checkbox.id] = 0;
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
    this.setState(state => {
      state[id] = value + 0; // Convert to int.

      if (this.props.handleQuizChange) {
        this.props.handleQuizChange(this.props.id, state);
      }

      return state;
    });
  }

  render() {
    const { title, blocks, handleParagraphLoaded } = this.props;
    return (
      <div className="container quiz checkboxes">
        <div className="row">
          <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              <Paragraphs blocks={blocks} handleParagraphLoaded={handleParagraphLoaded} />
            </div>
            }

            {this.props.list.map(checkbox => (
              <Checkbox
                label={checkbox.label}
                id={checkbox.id}
                key={checkbox.id}
                onChange={this.handleChange}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
}

Checkboxes.propTypes = {
  title: PropTypes.string,
  id: PropTypes.number,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  })),
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
  handleQuizChange: PropTypes.func,
  handleParagraphLoaded: PropTypes.func,
};

Checkboxes.defaultProps = {
  blocks: [],
};

export default Checkboxes;
