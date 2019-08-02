import React, { Component } from 'react';
import { Table, Modal, Spin, List, Skeleton, Avatar, message, Tag } from 'antd';
import _ from 'lodash';
import RestTools from '../../utils/RestTools';
import Nameing from '../../utils/Nameing';
import './index.less';
import defalutlBook from '../../assets/defaultBook.jpg';

const { Column } = Table;

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookData: props.data,
      visible: false,
    };
  }

  componentDidMount() {}

  showCollect = item => {
    if (item.compnum >= 0) {
      this.setState(
        {
          visible: true,
          loading: true,
        },
        () => {
          RestTools.fetchRequest(Nameing.innerStorageUrl, '/GetBookRetrInfo', 'GET', {
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
    } else {
      message.warning('本书暂无馆藏信息哟');
    }
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { bookData, storage, loading } = this.state;
    let dataSource = bookData.KNode.map(item => item.DATA.map(v => v.FieldValue));
    dataSource = _.flatten(dataSource);
    const pageInfo = bookData.Page;
    return (
      <div className="bookList">
        {dataSource.length && dataSource[0].hasOwnProperty('__Answer__') ? (
          <List
            dataSource={dataSource}
            bordered={false}
            renderItem={(item, index) =>
              index + 1 < dataSource.length ? (
                <span>{item.__Answer__ + '、'}</span>
              ) : (
                <span>{item.__Answer__}</span>
              )
            }
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={dataSource}
            pagination={{
              current: pageInfo.PageNum || 1,
              pageSize: pageInfo.PageCount,
              total: pageInfo.Total,
              onChange: this.props.changePage.bind(this, bookData),
            }}
            renderItem={item => (
              <List.Item
                actions={
                  item.compnum
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    ? [<a style={{padding: '10px 25px',borderRadius: '20px', border: '1px solid #1890ff'}} onClick={this.showCollect.bind(this, item)}>馆藏详情</a>]
                    : null
                }
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src={defalutlBook} />}
                    title={
                      <b style={{fontSize: '15px'}}
                        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.题名 || '-') }}
                      />
                    }
                    description={
                      <div>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: RestTools.translateToRed(item.作者_显示 || '-'),
                          }}
                        />/
                         <span
                          dangerouslySetInnerHTML={{
                            __html: RestTools.translateToRed(item.出版时间 || '-'),
                          }}
                        />/
                        <span
                          style={{
                            width: 500,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: RestTools.translateToRed(item.出版社 || '-'),
                          }}
                        />/
                        <span
                          dangerouslySetInnerHTML={{
                            __html: RestTools.translateToRed(item.索书号 || '-'),
                          }}
                        />
                        {item.local ? (
                          <div
                          style={{
                            width: 500,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                            dangerouslySetInnerHTML={{
                              __html: RestTools.translateToRed(item.local),
                            }}
                          />
                        ) : null}
                        {item.compnum >= 0 && item.hldallnum >= 0 ? (
                          <div>
                            <span style={{ marginRight: 10 }}>馆藏复本:{item.compnum}</span>
                            <span>在馆数:{item.hldallnum}</span>
                          </div>
                        ) : null}
                      </div>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        )}

        <Modal
          title="馆藏详情"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // okText={'确定'}
          width={800}
          footer={null}
        >
          {loading ? <Spin /> : <LibrayStorage storage={storage} />}
        </Modal>
      </div>
    );
  }
}

export default BookList;

const LibrayStorage = props => {
  const dataSource = props.storage;
  const status = {
    声明丢失: <Tag color="magenta">声明丢失</Tag>,
    可借: <Tag color="green">可借</Tag>,
    非可借: <Tag color="red">非可借</Tag>,
    剔旧报废: <Tag color="orange">剔旧报废</Tag>,
    借出: <Tag color="blue">借出</Tag>,
    保留本: <Tag color="cyan">保留本</Tag>,
    书刊修补: <Tag color="purple">书刊修补</Tag>,
    遗失赔偿: <Tag color="red">遗失赔偿</Tag>,
    赠送出: <Tag color="blue">赠送出</Tag>,
    阅览: <Tag color='cyan'>阅览</Tag>

  };
  return (
    <Table dataSource={dataSource}>
      <Column title="馆藏地" dataIndex="curlocal" key="馆藏地" />
      <Column
        title="状态"
        dataIndex="localstatus"
        key="状态"
        render={localstatus => <span>{localstatus ? status[localstatus] : '-'}</span>}
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
