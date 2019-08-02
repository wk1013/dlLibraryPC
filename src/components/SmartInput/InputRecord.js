import React from 'react';
import { List, Icon } from 'antd';
import './inputRecord.less';

const InputRecord = props => {
  const data = props.data;
  return props.data.length ? (
    <div className="record-list">
      <List
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            onClick={props.clickItem.bind(this, item)}
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
};
export default InputRecord;
