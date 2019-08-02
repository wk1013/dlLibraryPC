import {List } from 'antd'
import RestTools from "../../utils/RestTools"
import './index.less'

const SGList = props => {
  const data = props.data;
  return (
    <div className="sglist">
      <List
        bordered
        dataSource={data}
        renderItem={item => {
          return (
            <List.Item key={item.Data.source_id}>
              <div
                className="sg-content"
                dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.Data.answer) }}
              />
              <div className="info">
                <div style={{ marginRight: 10 }}>{item.Data.source_type}</div>
                {/* <div>{item.Data.title}</div> */}
                <a
                  href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                    RestTools.sourceDb[item.Data.source_type]
                  }&filename=${item.Data.source_id.replace('###', '').replace('$$$', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b
                  className='outLink'
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.Data.title) }}
                  />
                </a>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default SGList;