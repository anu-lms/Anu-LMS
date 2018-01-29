import React from 'react';
import md5 from '../../../../utils/md5';

class Checkbox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
    };

    this.toggleCheck = this.toggleCheck.bind(this);
  }

  toggleCheck() {
    this.setState(prevState => ({
      isChecked: !prevState.isChecked
    }));
  }

  render() {
    const { label } = this.props;

    return (
      <div className="checkbox">
        <input type="checkbox" id={md5(label)} checked={this.state.isChecked} />
        <span onClick={this.toggleCheck}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M5.403 10.58l-4.03-4.17L0 7.82l5.403 5.59L17 1.41 15.637 0z"/>
            </g>
          </svg>
        </span>
        <label onClick={this.toggleCheck} htmlFor={md5(label)}>{label}</label>
      </div>
    );
  }
}

export default Checkbox;
