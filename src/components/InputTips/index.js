import React, { Component } from 'react';
import { List } from 'antd';
import './index.less';

class InputTips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  render() {
    const { data, keyword } = this.props;
    return data.length ? (
      <div className="tip-list">
        <List
          dataSource={data.slice(0,10)}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              onClick={this.props.clickItem.bind(this, item.value)}
              onMouseDown={e => e.preventDefault()}
            >
              <div
                className="list-item"
                dangerouslySetInnerHTML={{__html: item.value.replace(keyword, `<Strong style="color:red">${keyword}</Strong>`)}}
              />
            </List.Item>
          )}
        />
      </div>
    ) : null;
  }
}
export default InputTips;
