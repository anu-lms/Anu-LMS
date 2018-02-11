import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

class EditableElement extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isPlaceholderVisible: false,
    };

    this.handleElementChange = this.handleElementChange.bind(this);
    this.handleElementBlur = this.handleElementBlur.bind(this);
    this.handlePlaceholderClick = this.handlePlaceholderClick.bind(this);
  }

  componentDidMount() {
    this.refs.element.innerText = this.props.initialValue;
    if (!this.props.initialValue) {
      this.setState({ isPlaceholderVisible: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialValue !== this.props.initialValue) {
      this.refs.element.innerText = this.props.initialValue;

      const placeholderVisible = !this.props.initialValue;
      this.setState({ isPlaceholderVisible: placeholderVisible });
    }
  }

  handleElementChange() {
    if (this.props.onChange) {
      this.props.onChange(this.refs.element.innerText);
    }
  }

  handleElementBlur() {
    this.handleElementChange();

    const isPlaceholderVisible = this.state.isPlaceholderVisible;

    // If on blur there is no text and the current placeholder state is
    // hidden, then we should show the placeholder again.
    if (!this.refs.element.innerText && !isPlaceholderVisible) {
      this.setState({ isPlaceholderVisible: true });
    }

    // If on blur there is
    else if (this.refs.element.innerText && isPlaceholderVisible) {
      this.setState({ isPlaceholderVisible: false });
    }
  }

  handlePlaceholderClick() {

    // TODO: Bug - possible to click next to the placeholder.

    // Set the cursor to the element.
    let range, selection;
    range = document.createRange();
    range.selectNodeContents(this.refs.element);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Hide clicked placeholder.
    this.setState({ isPlaceholderVisible: false });
  }

  render() {
    return (
      <Fragment>

        {this.state.isPlaceholderVisible &&
        <span
          className="placeholder"
          onClick={this.handlePlaceholderClick}
        >
          {this.props.placeholder}
          </span>
        }

        <span
          ref="element"
          contentEditable={true}
          onInput={this.handleElementChange}
          onBlur={this.handleElementBlur}
          style={{ visibility: this.state.isPlaceholderVisible ? 'none' : 'visible' }}
        />

      </Fragment>
    )
  }
}

EditableElement.propTypes = {
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  maxLength: PropTypes.number, // TODO: Implement max length for element.
  onChange: PropTypes.func,
};

EditableElement.defaultProps = {
  maxLength: 0,
  initialValue: '',
  onChange: () => {},
};

export default EditableElement;
