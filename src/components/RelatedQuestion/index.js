import React, { Component } from 'react';
import { List } from 'antd';
class RelatedQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {}

  render() {
    let data = this.props.data;
    return (
      <div>
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item onClick={this.props.ClickRelated.bind(this, item.Content)}>
              <span title={item.Content}>{item.Content}</span>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default RelatedQuestion;
