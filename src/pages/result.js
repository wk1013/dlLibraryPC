import React, { Component, useState, useEffect } from 'react';
import { Breadcrumb, Card, Spin, message, Icon, Row, Col, Descriptions } from 'antd';
import Link from 'umi/link';
import _ from 'lodash';
import RestTools from '../utils/RestTools';
import Nameing from '../utils/Nameing';
import BookList from '../components/BookList';
import RelatedQuestion from '../components/RelatedQuestion';
import './result.less';
import ask from '../assets/ask.png';
import answer from '../assets/answer.png';
import Business from '../components/Business';
import LiteratureList from '../components/LiteratureList';
import DynamicList from '../components/DynamicList';
import ToolsBook from '../components/ToolsBook';
import SGList from '../components/SGList';
import SmartInput from '../components/SmartInput';

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: decodeURIComponent(window.location.href.split('?')[1].split('=')[1]), //刷新页面后url上的参数要与state保持一致
      guid: null,
      data: [],
      preData: [], //获取图书馆藏信息前的数据,
      relatedData: [],
      loading: true,
      User: '',
      PcAye: 0,
      PcNay: 0,
      Aye: null,
      Nay: null,
      showRecord: false,
      tipsData: [],
    };
  }

  componentDidMount() {
    const guid = this.state.guid;
    const question = this.state.question;
    this.getAnswer(question);
    if (guid) {
      this.getLikeCount(question, guid);
    } else {
      let newGuid = RestTools.GetGUID();
      this.setState(
        {
          guid: newGuid,
        },
        () => {
          this.getLikeCount(question, newGuid);
        },
      );
    }
  };

  //获取点赞数
  getLikeCount = () => {
    const { question, guid } = this.state;
    RestTools.fetchRequest(Nameing.serverUrl, '/GetLike', 'GET', {
      Content: encodeURIComponent(question),
      user: guid,
    })
      .then(res => {
        this.setState({
          User: res.User,
          PcAye: res.PcAye,
          PcNay: res.PcNay,
          Aye: res.Aye,
          Nay: res.Nay,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  //点赞
  sendLike = like => {
    let { User, Aye, Nay } = this.state;
    if (User === '') {
      RestTools.fetchRequest(Nameing.serverUrl, '/SendLike', 'POST', {
        user: this.state.guid,
        like: like,
        type: 'pc',
        Content: encodeURIComponent(this.state.question),
      })
        .then(res => {
          if (res.Success) {
            if (like) {
              Aye += 1;
            } else {
              Nay += 1;
            }
            //前端重置点赞状态
            this.setState({
              Aye: Aye,
              Nay: Nay,
              User: like ? '1' : '0',
            });
          } else {
            message.warning('出了点小问题~，请稍后再试');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if ((User === '1' && like) || (User === '0' && !like)) {
      //判断取消点赞的条件
      this.cancleLike(like);
    } else {
      return;
    }
  };

  //取消点赞
  cancleLike = like => {
    let { question, guid, Aye, Nay } = this.state;
    RestTools.fetchRequest(Nameing.serverUrl, '/CancelLike', 'POST', {
      user: guid,
      Content: encodeURIComponent(question),
      type: 'pc',
    })
      .then(res => {
        if (res.Success) {
          like ? (Aye -= 1) : (Nay -= 1);
          //前端重置点赞状态
          this.setState({
            Aye: Aye,
            Nay: Nay,
            User: '',
          });
        } else {
          message.warning('出了点小问题，请稍后再试');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //搜索结果数据
  getAnswer = question => {
    this.setState({
      question: question,
    });
    RestTools.fetchRequest(Nameing.serverTestUrl, '/GetAnswer', 'GET', {
      appid: '1',
      aid: '2',
      q: encodeURIComponent(question),
      type: 'pc',
    })
      .then(res => {
        if (res.result) {
          const MetaList = res.MetaList;
          const list = MetaList.filter(item => item.Data.domain === '图书馆_图书');
          if (list.length > 0 && list[0].Data.KNode[0].DATA[0].FieldValue.hasOwnProperty('ID')) {
            this.setState(
              {
                sg: false,
                preData: MetaList,
                questionTitle: question,
              },
              () => {
                const bookIdStr = list
                  .map(item => item.Data.KNode.map(val => val.DATA.map(v => v.FieldValue.ID)))
                  .map(item => item.join(','));
                this.getLibraryStorage(bookIdStr);
              },
            );
          } else {
            if (MetaList[0].Data.Domain === '图书馆_业务标准库' || MetaList[0].Data.Domain === '图书馆_常见问题' || MetaList[0].Data.Domain === '公共图书馆法' && MetaList[0].DataType === 0) {
              const qid =
                MetaList[0].Data.Extra && MetaList[0].Data.Extra.编号
                  ? MetaList[0].Data.Extra.编号
                  : MetaList[0].Data.Question;

              this.getRelated({
                question,
                QID: qid.replace(/###/g, '').replace(/\$\$\$/g, ''),
              });
            }
            this.setState({
              loading: false,
              sg: false,
              data: MetaList,
              questionTitle: question,
              errMsg: null,
            });
          }
        } else {
          // this.getSgData(question);
          this.setState({
            loading: false,
            questionTitle: question,
            errMsg: res.msg,
            noResult: true,
            data: [],
            sg: false,
          });
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
      });
  };

  //获取相关问题数据
  getRelated = obj => {
    const { question, QID } = obj;
    RestTools.fetchRequest(Nameing.relatedUrl, '/GetKB', 'GET', {
      content: encodeURI(question),
    })
      .then(res => {
        this.setState({
          relatedData: res.filter(item => item.QID !== QID),
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  //获取句群数据
  getSgData = question => {
    RestTools.fetchRequest(Nameing.sgServerUrl, '/GetSGData', 'GET', {
      q: encodeURIComponent(question),
    })
      .then(res => {
        if (res.result) {
          const MetaList = res.MetaList;
          this.setState({
            loading: false,
            data: MetaList,
            questionTitle: question,
            sg: true,
            errMsg: null,
          });
        } else {
          this.setState({
            loading: false,
            questionTitle: question,
            errMsg: res.msg,
            noResult: true,
            data: [],
            sg: false,
          });
        }
      })
      .catch(res => {
        console.log(res);
      });
  };

  //获取馆藏信息
  getLibraryStorage = str => {
    RestTools.fetchRequest(Nameing.innerStorageUrl, '/GetLocalInfo', 'GET', {
      bookrecnos: str,
    })
      .then(res => {
        let data = this.state.preData;
        data.map(item => {
          return (
            item.Data.domain === '图书馆_图书' &&
            item.Data.KNode.map(v => {
              v.DATA.map(c => {
                const current = c.FieldValue; //当前书本对象
                const book = _.filter(res.Books, { bookid: current.ID })[0]; // 馆藏数据中对应ID的书的数据
                c.FieldValue = Object.assign(current, book); //合并两个对象
                return c;
              });
              return v;
            })
          );
        });
        this.setState({
          data: data,
          loading: false,
        });
      })
      .catch(err => {
        console.log('超时');
        this.setState({
          data: this.state.preData,
          loading: false,
        });
      });
  };

  //获取分页数据
  changePage = (currdata, page) => {
    const { domain, intent_domain, intent_id, Title } = currdata;
    this.setState({
      loading: true,
    });
    RestTools.fetchRequest(Nameing.serverTestUrl, '/GetKBDataByPage', 'GET', {
      domain: encodeURI(domain),
      intent_domain: encodeURI(intent_domain),
      intent_id: intent_id,
      q: encodeURI(Title),
      pageNum: page,
    }).then(res => {
      if (res.result) {
        let MetaListData = this.state.data;
        MetaListData.map(item => {
          if (item.Data.intent_id === res.karea.intent_id) {
            item.Data = res.karea;
          }
          return item;
        });

        if (domain === '图书馆_图书') {
          this.setState(
            {
              preData: MetaListData,
            },
            () => {
              const list = res.karea;
              const bookIdStr = list.KNode.map(val => val.DATA.map(v => v.FieldValue.ID)).join(',');
              this.getLibraryStorage(bookIdStr);
              return;
            },
          );
        } else {
          this.setState({ data: MetaListData, loading: false });
        }
      }
    });
    window.sessionStorage.setItem(
      'pageInfo',
      JSON.stringify({
        page: page,
        currdata: {
          domain,
          intent_domain,
          intent_id,
          Title,
        },
      }),
    );
  };

  //搜索相关问题
  clickRelated = relatedQuestion => {
    RestTools.setStorageInput(relatedQuestion);
    window.location.href = window.location.href.split('?')[0] + '?qustion=' + relatedQuestion; //暴力修改url
    this.setState(
      {
        question: relatedQuestion,
        loading: true,
      },
      () => {
        this.getAnswer(relatedQuestion);
        this.getLikeCount(relatedQuestion, this.state.guid); //获取当前问题点赞数
      },
    );
  };

  handleSearch = newstr => {
    let value = newstr;
    console.log(value)
    const maxLength = RestTools.maxLength;
    if (value) {
      if (value.length > maxLength) {
        message.warning(
          <div>
            您输入的问题字数超过了限制，
            <em>
              <strong style={{ color: 'red' }}>{value.substring(maxLength - 3, maxLength)}</strong>
            </em>
            之后的字数将不会计入问题中
          </div>,
        );
        value = value.substring(0, maxLength);
      }
      window.location.href = window.location.href.split('?')[0] + '?qustion=' + value; //暴力修改url
      RestTools.setStorageInput(value); //存储输入
      this.setState(
        {
          showRecord: false,
          noResult: false,
          loading: true,
          relatedData: [],
        },
        () => {
          this.getAnswer(value);
          this.getLikeCount();
        },
      );
    } else {
      message.warning('请输入您的问题');
    }
  };

  handleClickItem = item => {
    this.setState(
      {
        question: item,
      },
      () => {
        this.handleSearch();
      },
    );
  };

  render() {
    const {
      data,
      loading,
      question,
      sg,
      questionTitle,
      relatedData,
      PcAye,
      PcNay,
      Aye,
      Nay,
      User,
      noResult,
    } = this.state;

    let bookData = [], //图书数据
      businessData = [], //资讯类数据
      literatureData = [], //文献类数据
      dynamicData = [], //图书馆动态数据
      sgData = [], //句群数据
      toolsBookData = [], //工具书
      gossipData = [], //闲聊,
      weather = null, //天气
      others,
      userFaq = [];
    data.length &&
      data.map(item => {
        if (item) {
          if (item.DataType === 0) {
            if (item.Data.Extra) {
              if (item.Data.Domain === '闲聊') {
                gossipData.push(item.Data);
              } else {
                businessData.push(item.Data);
              }
            } else {
              others = true;
            }
          } else if (item.DataType === 1) {
            userFaq.push(item.Data);
          } else if (item.DataType === 3) {
            bookData = []
          } else {
            others = true;
          }
        }
        return item;
      });

    return (
      <div className="result">
        <SmartInput onClickItem={this.handleClickItem} onClickEnter={this.handleSearch} question={question}/>

        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>结果</span>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={16} className="result-main">
          {loading ? (
            <Spin title="加载中..." style={{ minWidth: '66%' }} />
          ) : (
              <Col span={18} className="left" xs={20}>
                <div className="ask">
                  <div className="img-wrap">
                    <img src={ask} alt="ask" />
                  </div>
                  <div className="text">{questionTitle}</div>
                </div>
                <Card style={{ textAlign: 'center' }}>
                  <div className="left-main">
                    {businessData.length ||
                      bookData.length ||
                      toolsBookData.length ||
                      literatureData.length ||
                      dynamicData.length ? (
                        <LikeModule
                          key="likeModule"
                          data={{ User, PcAye, PcNay, Aye, Nay }}
                          handleClick={this.sendLike}
                        />
                      ) : null}

                    <div className="answer">
                      <div className="img-wrap">
                        <img src={answer} alt="answer" />
                      </div>
                      <div className="answer-content">
                        {businessData.length
                          ? businessData.map(item => {
                            return (
                              (item.Domain === '图书馆_业务标准库' || item.Domain === '图书馆_常见问题' || item.Domain === '公共图书馆法') && (
                                <Business key={item.ID} data={item} />
                              )
                            );
                          })
                          : null}
                        {toolsBookData.length
                          ? toolsBookData.map(item => {
                            return <ToolsBook key={item.ID} data={item} />;
                          })
                          : null}
                        {bookData.length && toolsBookData.length === 0
                          ? bookData.map(item => {
                            return (
                              <BookList
                                key={item.intent_id}
                                data={item}
                                changePage={this.changePage}
                              />
                            );
                          })
                          : null}

                        {literatureData.length
                          ? literatureData.map(item => {
                            return (
                              <LiteratureList
                                key={item.intent_id}
                                data={item}
                                changePage={this.changePage}
                              />
                            );
                          })
                          : null}

                        {dynamicData.length && toolsBookData.length === 0
                          ? dynamicData.map(item => {
                            return (
                              <DynamicList
                                key={item.intent_id}
                                data={item}
                                changePage={this.changePage}
                              />
                            );
                          })
                          : null}

                        {gossipData.length &&
                          (businessData.length === 0 &&
                            literatureData.length === 0 &&
                            dynamicData.length === 0 &&
                            bookData.length === 0 &&
                            toolsBookData.length === 0)
                          ? gossipData.map((item, index) => {
                            return <Business key={'gossip' + index} data={item} />;
                          })
                          : null}

                        {userFaq.length
                          ? userFaq.map((item, index) => (
                            <div
                              key={'userFaq' + index}
                              dangerouslySetInnerHTML={{
                                __html: RestTools.translateToRed(item.Answer),
                              }}
                            />
                          ))
                          : null}

                        {sg ? <SGList key="sglist" data={sgData} /> : null}
                        {weather ? <Weather city={weather} /> : null}

                        {noResult ? (
                          <div key="doudi1">这个问题还在学习中哟~，很快将会告诉你答案！</div>
                        ) : null}

                        {others ? (
                          <div key="doudi2">这个技能还在学习中哟~，很快将会告诉你答案！</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            )}

          {relatedData.length && !loading ? (
            <Col span={6} className="right">
              <Card
                title={
                  <span>
                    <Icon type="question-circle" style={{ marginRight: 4 }} />
                    相关问题
                  </span>
                }
                className="related"
              >
                <RelatedQuestion
                  ClickRelated={this.clickRelated}
                  data={relatedData}
                  question={question}
                />
              </Card>
            </Col>
          ) : null}
        </Row>
      </div>
    );
  }
}

export default Result;

const Weather = props => {
  const [data, setWeather] = useState(null);
  useEffect(() => {
    RestTools.fetchRequest(Nameing.weatherUrl, '/now', 'GET', {
      key: '2502052d9d4f41878b85fa75635be718',
      tdsourcetag: 's_pcqq_aiomsg',
      location: encodeURI(props.city),
    }).then(res => {
      setWeather(res.HeWeather6[0]);
    });
  }, []);

  return data ? (
    <Descriptions title={`${data.basic.location}`}>
      <Descriptions.Item label="天气">
        <img
          style={{ width: 24, height: 24 }}
          src={require(`../assets/weather/${data.now.cond_code}.png`)}
          alt=""
        />
        {data.now.cond_txt}
      </Descriptions.Item>
      <Descriptions.Item label="温度">{data.now.tmp}℃</Descriptions.Item>
      <Descriptions.Item label="体感温度">{data.now.fl}℃</Descriptions.Item>
      <Descriptions.Item label="风力">{data.now.wind_sc}</Descriptions.Item>
      <Descriptions.Item label="风向">{data.now.wind_dir}</Descriptions.Item>
      <Descriptions.Item label="降水量">{data.now.pcpn}</Descriptions.Item>
      <Descriptions.Item label="相对湿度">{data.now.hum}</Descriptions.Item>
      <Descriptions.Item label="能见度">{data.now.vis}公里</Descriptions.Item>
    </Descriptions>
  ) : null;
};

const LikeModule = props => {
  const { User, Aye, Nay } = props.data;
  return (
    <div className="like-wrap">
      <div style={{ marginRight: 40 }}>
        <Icon
          type="like"
          theme="filled"
          style={{ fontSize: 20, color: User === '1' ? '#0084ff' : '#999', cursor: 'pointer' }}
          onClick={props.handleClick.bind(this, true)}
        />
        <span>{Aye}</span>
      </div>
      <div>
        <Icon
          type="dislike"
          theme="filled"
          style={{ fontSize: 20, color: User === '0' ? '#0084ff' : '#999', cursor: 'pointer' }}
          onClick={props.handleClick.bind(this, false)}
        />
        <span>{Nay}</span>
      </div>
    </div>
  );
};
