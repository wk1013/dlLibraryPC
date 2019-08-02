import React, { Component } from 'react';
import { Table, Modal, Spin } from 'antd';
import _ from 'lodash';
import RestTools from '../../utils/RestTools';
import Nameing from '../../utils/Nameing';
import './index.less';

const { Column } = Table;

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookData: props.data,
      visible: false,
    };
  }

  componentDidMount() {}

  showCollect = item => {
    console.log(item);
    this.setState(
      {
        visible: true,
        loading: true,
      },
      () => {
        RestTools.fetchRequest(Nameing.storageUrl, '/GetBookRetrInfo', 'GET', {
          bookrecno: item.ID,
        }).then(res => {
          if (res.success) {
            this.setState({
              loading: false,
              storage: res.Books,
            });
          }
        });
      },
    );
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { bookData, storage, loading } = this.state;
    let dataSource = bookData.KNode.map(item => item.DATA.map(v => v.FieldValue));
    dataSource = _.flatten(dataSource);
    const pageInfo = bookData.Page;
    console.log(dataSource)
    return (
      <div className="book">
        <Table
          bordered
          dataSource={dataSource}
          rowKey={'book' + bookData.intent_id}
          pagination={{
            current: pageInfo.PageNum,
            pageSize: pageInfo.PageCount,
            total: pageInfo.Total,
            onChange: this.props.changePage.bind(this, bookData),
          }}
        >
          {/* <Column title="图片" dataIndex="age" key="age" /> */}
          {/* <Column title="结论" dataIndex="结论" render={__Answer__ => <span>{__Answer__}</span>} /> */}
          <Column
            title="书名"
            width={20}
            dataIndex="题名"
            key="题名"
            render={题名 => (
              <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(题名) }} />
            )}
          />
          <Column
            title="作者"
            width={10}
            dataIndex="作者"
            key="作者"
            render={作者 => (
              <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(作者) }} />
            )}
          />
          <Column
            title="出版社"
            width={15}
            dataIndex="出版社"
            key="出版社"
            render={出版社 => (
              <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(出版社) }} />
            )}
          />
          <Column title="作品语种" dataIndex="作品语种" key="作品语种" width={10} />
          <Column
            title="索书号"
            dataIndex="索书号"
            key="索书号"
            width={10}
            render={索书号 => (
              <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(索书号) }} />
            )}
          />
          <Column title="馆藏副本" dataIndex="compnum" key="compnum" width={5} />
          <Column title="在馆数目" dataIndex="hldallnum" key="hldallnum" width={5} />
          <Column
            title="馆藏地"
            dataIndex="local"
            key="local"
            width={20}
            render={local => {
              return <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{local}</div>;
            }}
          />
          <Column
            title="馆藏详情"
            dataIndex="detail"
            key="detail"
            width={5}
            render={(t, r, i) => (
              <a href="#" onClick={this.showCollect.bind(this, r)}>
                详情
              </a>
            )}
          />
        </Table>

        <Modal
          title="馆藏详情"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={'确定'}
          cancelText={'取消'}
          width={800}
        >
          {loading ? <Spin /> : <LibrayStorage storage={storage} />}
        </Modal>
      </div>
    );
  }
}

export default Book;

const LibrayStorage = props => {
  console.log(props.storage);
  const dataSource = props.storage;
  return (
    <Table dataSource={dataSource}>
      <Column title="馆藏地" dataIndex="curlocal" key="馆藏地" />
      <Column
        title="状态"
        dataIndex="localstatus"
        key="状态"
        render={localstatus => <span>{localstatus || '-'}</span>}
      />
      <Column title="索书号" dataIndex="callno" key="索书号" />
      <Column
        title="归还日期"
        dataIndex="returndate"
        key="归还日期"
        render={returndate => <span>{returndate || '-'}</span>}
      />
    </Table>
  );
};
