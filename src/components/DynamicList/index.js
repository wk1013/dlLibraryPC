import React, { Component } from 'react';
import _ from 'lodash';
import { List, Icon } from 'antd';
import RestTools from '../../utils/RestTools';
import './index.less';

class Literature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  render() {
    let data = this.state.data;
    let dataSource = data.KNode.map(item => item.DATA.map(v => v.FieldValue));
    dataSource = _.flatten(dataSource);
    const pageInfo = data.Page;
    return (
      <div className="dynamicList">
        <List
          dataSource={dataSource}
          pagination={{
            current: pageInfo.PageNum || 1,
            pageSize: pageInfo.PageCount,
            total: pageInfo.Total,
            onChange: this.props.changePage.bind(this, data),
          }}
          renderItem={item => {
            return (
              <List.Item>
                <a href={item.链接} target="_blank" rel="noopener noreferrer">
                  <Icon type="caret-right" style={{ color: '#ce7745' }} />
                  <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.标题) }} />
                </a>
                <span className="time">{item.发布时间.replace('(', '').replace(')', '')}</span>

                {/* <div style={{marginTop: 10}}> */}
                {/* <span
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.一级分类) }}
                  />
                  /<span>{item.二级分类}</span> */}
                {/* </div> */}
              </List.Item>
            );
          }}
        />
      </div>
    );
  }
}

export default Literature;
