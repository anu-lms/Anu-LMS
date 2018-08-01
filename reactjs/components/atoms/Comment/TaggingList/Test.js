import React from 'react';
import InputTrigger from 'react-input-trigger';

/**
 * The plain text example.
 *
 * @type {Component}
 */

class Test extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      top: null,
      left: null,
      showSuggestor: false,
      startPosition: null,

      users: [
        'Charmander',
        'Squirtle',
        'Bulbasaur',
        'Pikachu',
      ],

      text: null,

      currentSelection: 0,
    };

    this.toggleSuggestor = this.toggleSuggestor.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTextareaInput = this.handleTextareaInput.bind(this);
  }

  toggleSuggestor(metaInformation) {
    const { hookType, cursor } = metaInformation;

    if (hookType === 'start') {
      this.setState({
        showSuggestor: true,
        left: cursor.left,
        top: cursor.top + cursor.height, // we need to add the cursor height so that the dropdown doesn't overlap with the `@`.
        startPosition: cursor.selectionStart,
      });
    }

    if (hookType === 'cancel') {
      // reset the state

      this.setState({
        showSuggestor: false,
        left: null,
        top: null,
        text: null,
        startPosition: null,
      });
    }
  }

  handleInput(metaInformation) {
    this.setState({
      text: metaInformation.text,
    });
  }

  handleKeyDown(event) {
    const { which } = event;
    const { currentSelection, users } = this.state;

    if (which === 40) { // 40 is the character code of the down arrow
      event.preventDefault();

      this.setState({
        currentSelection: (currentSelection + 1) % users.length,
      });
    }

    if (which === 13) { // 13 is the character code for enter
      event.preventDefault();

      const { users, currentSelection, startPosition, textareaValue } = this.state;
      const user = users[currentSelection];

      const newText = `${textareaValue.slice(0, startPosition - 1)}${user}${textareaValue.slice(startPosition + user.length, textareaValue.length)}`;

      // reset the state and set new text

      this.setState({
        showSuggestor: false,
        left: null,
        top: null,
        text: null,
        startPosition: null,

        textareaValue: newText,
      });

      this.endHandler();
    }
  }

  handleTextareaInput(event) {
    const { value } = event.target;

    this.setState({
      textareaValue: value,
    });
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
        }}

        onKeyDown={this.handleKeyDown}
      >
        <InputTrigger
          trigger={{
            keyCode: 50,
            shiftKey: true,
          }}
          onStart={metaData => { this.toggleSuggestor(metaData); }}
          onCancel={metaData => { this.toggleSuggestor(metaData); }}
          onType={metaData => { this.handleInput(metaData); }}
          endTrigger={endHandler => { this.endHandler = endHandler; }}
        >
          <textarea
            style={{
              height: '100px',
              width: '400px',
              lineHeight: '1em',
            }}

            onChange={this.handleTextareaInput}
            value={this.state.textareaValue}
          />
        </InputTrigger>

        <div
          id="dropdown"
          style={{
            position: 'absolute',
            width: '200px',
            borderRadius: '6px',
            background: 'white',
            boxShadow: 'rgba(0, 0, 0, 0.4) 0px 1px 4px',

            display: this.state.showSuggestor ? 'block' : 'none',
            top: this.state.top,
            left: this.state.left,
          }}
        >
          {
            this.state.users
              .filter(user => user.indexOf(this.state.text) !== -1)
              .map((user, index) => (
                <div
                  style={{
                    padding: '10px 20px',
                    background: index === this.state.currentSelection ? '#eee' : '',
                  }}
                >
                  { user }
                </div>
              ))
          }
        </div>
      </div>
    );
  }
}

/**
 * Export.
 */

export default Test;
