import React  from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../FormElement/CheckBox';
import { paragraphComponents } from '../index';

class Checkboxes extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(id, value) {
    console.log('clicked id: ' + id);
    console.log('clicked value: ' + value);
  }

  render() {
    const { title, blocks } = this.props;
    return (
      <div className="container quiz checkboxes">
        <div className="row">
          <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              {blocks.map((block, index) => {
                const Paragraph = paragraphComponents[block.type];
                return <Paragraph key={index} {...block} />;
              })}
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
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  })),
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
};

Checkboxes.defaultProps = {
  blocks: [],
};

export default Checkboxes;
