import React from 'react';
import PropTypes from 'prop-types';
// import { MentionsInput, Mention } from 'react-mentions';
// import rangy from 'rangy';

import Mention, { ContenteditableEditor } from 'uxcore-mention';

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

  personDataFormatter(data) {
    return data.map(item => ({
      ...item,
      displayName: item.username,
      text: item.username,
    }));
  }

  personPanelFormatter(data) {
    console.log(data);
    return `${data.username}`;
  }

  personMentionFormatter(data) {
    return '<div>{data.username}</div>';
  }

  async fetchUsers(query, callback) {
    const { request } = await this.context.auth.getRequest();
    await userApi.fetchTaggedUsers(request, query)
      .then(res => res.map(user => ({
        username: user.name,
        firstName: user.fieldFirstName,
        lastName: user.fieldLastName,
        display: `<strong>${user.name}</strong> ${user.fieldFirstName} ${user.fieldLastName}`,
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
      <Mention
        matchRange={[1, 6]}
        source={this.fetchUsers}
        panelFormatter={this.personPanelFormatter}
        // source={['aaaaa', 'aabbb', 'aaccc', 'bbbcc', 'dddee', 'fffqq', 'pppaa', 'ppccc']}
        // formatter={data => data.map(item => ({
        //   text: item,
        // }))}
        formatter={this.personDataFormatter}
      >
        <ContenteditableEditor
          placeholder="hello world"
          mentionFormatter={this.personMentionFormatter}
        />
      </Mention>
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
