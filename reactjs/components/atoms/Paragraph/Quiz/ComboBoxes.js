import React  from 'react';
import PropTypes from 'prop-types';
import Radio from '../../FormElement/Radio';

class ComboBoxes extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(id, value) {
    console.log('clicked id: ' + id);
    console.log('clicked value: ' + value);
  }

  render() {
    const { id, list, title } = this.props;

    const radios = list.map(radio => (
      <Radio
        id={radio.id}
        key={radio.id}
        label={radio.label}
        name={id}
        onChange={this.handleChange}
      />
    ));

    return (
      <div className="container quiz comboboxes">
        <div className="row">
          <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
            <div className="title">{title}</div>
            {radios}
          </div>
        </div>
      </div>
    );
  };
}

ComboBoxes.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  })),
};

export default ComboBoxes;
