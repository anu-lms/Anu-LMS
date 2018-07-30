import React from 'react';
import PropTypes from 'prop-types';
import { MentionsInput, Mention } from 'react-mentions';
import * as userApi from '../../../../api/user';

class TaggingList extends React.Component {
  constructor(props) {
    super(props);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      value: '',
    };
  }

  async fetchUsers(query, callback) {
    const { request } = await this.context.auth.getRequest();
    await userApi.fetchTaggedUsers(request, query)
      .then(res => res.map(user => ({
        display: `${user.name} ${user.fieldFirstName} ${user.fieldLastName}`,
        id: user.name,
      })))
      .then(callback);
  }

  onChange({ target }) {
    console.log('aaa', target.value);
    this.setState({
      value: target.value,
    });
  }

  render() {
    return (
      <MentionsInput
        value={this.state.value}
        onChange={this.onChange}
        placeholder="Mention any Github user by typing `@` followed by at least one char"
        displayTransform={login => `@${login}`}
      >
        <Mention trigger="@" data={this.fetchUsers} />
      </MentionsInput>
    );
  }
}

TaggingList.propTypes = {};

TaggingList.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

export default TaggingList;
