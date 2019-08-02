import React, { Component } from 'react';
import { List, Icon } from 'antd';
import './index.less';

class InputRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  render() {
    const data = this.state.data;
    return data.length ? (
      <div className="record-list">
        <List
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item
              onClick={this.props.clickItem.bind(this, item)}
              onMouseDown={e => e.preventDefault()}
            >
              <div className="list-item">{item}</div>
              <Icon
                type="close"
                onClick={e => {
                  e.stopPropagation();
                  let inputRecords = JSON.parse(window.localStorage.getItem('inputRecords'));
                  inputRecords.splice(index, 1);
                  this.setState(
                    {
                      data: inputRecords,
                    },
                    () => {
                      window.localStorage.setItem('inputRecords', JSON.stringify(inputRecords));
                    },
                  );
                }}
              />
            </List.Item>
          )}
        />
      </div>
    ) : null;
  }
}
export default InputRecord;
