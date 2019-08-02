import React, { Component } from 'react';
import { List } from 'antd';
import _ from 'lodash';
import RestTools from '../../utils/RestTools';
import './index.less';

class LiteratureList extends Component {
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
      <div className="literatureList">
        <List
          itemLayout="horizontal"
          dataSource={dataSource}
          pagination={{
            current: pageInfo.PageNum || 1,
            pageSize: pageInfo.PageCount,
            total: pageInfo.Total,
            onChange: this.props.changePage.bind(this, data),
          }}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a
                    href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                      RestTools.sourceDb[item.来源数据库]
                    }&filename=${item.文件名.replace('###', '').replace('$$$', '')}`}
                    target='_blank'
                    rel="noopener noreferrer" 
                  >
                    <b dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.题名) }} />
                  </a>
                }
                description={
                  <div>
                    <span
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.作者) }}
                    />
                    <span>/</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.来源),
                      }}
                    />
                  </div>
                }
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}
              >
                <div>{_.get(item, '出版日期', '-')}</div>
                <div>
                  <span style={{ marginRight: 10 }}>
                    被引频次:{item.被引频次 >= 0 ? item.被引频次 : '-'}
                  </span>
                  <span>下载频次:{item.下载频次 >= 0 ? item.下载频次 : '-'}</span>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default LiteratureList;
