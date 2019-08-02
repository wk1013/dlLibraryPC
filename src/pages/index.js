import { Component } from 'react';
import { Row, Col, List } from 'antd';
import router from 'umi/router';
import MockData from '../../mock/mockData.json';
import RestTools from '../utils/RestTools';
import SmartInput from '../components/SmartInput';
import './index.less';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      showRecord: false,
      tipsData: [],
    };
  }

  handleEnter = e => {
    router.push('./result?question=' + encodeURIComponent(e));
  };

  hanldeClickItem = item => {
    router.push('./result?question=' + encodeURIComponent(item));
  };

  render() {
    return (
      <div className="index">
        <SmartInput onClickItem={this.hanldeClickItem} onClickEnter={this.handleEnter}/>

        <div className="content">
          <Row gutter={24} style={{ marginTop: 40 }}>
            <Col className="gutter-row" xs={20} sm={16} md={12} lg={6} xl={6}>
              <Block data={{ dataSource: MockData.business, title: '最新问题' }} />
            </Col>
            <Col className="gutter-row" xs={20} sm={16} md={12} lg={6} xl={6}>
              <Block data={{ dataSource: MockData.storage, title: '业务工作' }} />
            </Col>
            <Col className="gutter-row" xs={20} sm={16} md={12} lg={6} xl={6}>
              <Block data={{ dataSource: MockData.news, title: '常见问题' }} />
            </Col>
            <Col className="gutter-row" xs={20} sm={16} md={12} lg={6} xl={6}>
              <Block data={{ dataSource: MockData.teachers, title: '公共图书馆法' }} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const Block = props => {
  const { dataSource, title } = props.data;
  return (
    <div className="gutter-box">
      <div className="top">
        <div className="title">{title}</div>
      </div>
      <List
        size="small"
        dataSource={dataSource}
        renderItem={item => (
          <List.Item
            onClick={() => {
              RestTools.setStorageInput(item.title);
              router.push('./result?question=' + item.title);
            }}
            key={item.id}
          >
            {item.title}
          </List.Item>
        )}
      />
    </div>
  );
};
