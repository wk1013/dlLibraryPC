import React, { Component } from 'react';
import _ from 'lodash';
import { Table } from 'antd';
import RestTools from '../../utils/RestTools';

const Column = Table.Column;
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
      <div className='literature'>
        <Table
          bordered
          rowKey='literature'
          dataSource={dataSource}
          pagination={{
            current: pageInfo.PageNum,
            pageSize: pageInfo.PageCount,
            total: pageInfo.Total,
            onChange: this.props.changePage.bind(this, data),
          }}
        >
          <Column
            title="题名"
            dataIndex="题名"
            key="题名"
            render={题名 => {
              return <div dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(题名) }} />;
            }}
          />
          <Column
            title="作者"
            dataIndex="作者"
            key="作者"
            render={作者 => {
              return <div dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(作者) }} />;
            }}
          />
          <Column
            title="来源"
            dataIndex="来源"
            key="来源"
            render={来源 => {
              return <div dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(来源) }} />;
            }}
          />
          <Column title="出版日期" dataIndex="出版日期" key="出版日期" />
          <Column title="被引频次" dataIndex="被引频次" key="被引频次" />
          <Column title="下载频次" dataIndex="下载频次" key="下载频次" />
        </Table>
      </div>
    );
  }
}

export default Literature;
