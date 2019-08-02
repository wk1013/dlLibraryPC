import RestTools from '../../utils/RestTools';
import _ from 'lodash';

const ToolsBook = props => {
  const dataList = props.data.KNode.map(item => item.DATA[0].FieldValue);
  return (
    <div className="toolBooks">
      {dataList.map(item => {
        return (
          <div key={item.条目编码} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
            <a
              href={`http://gongjushu.cnki.net/RBook/Detail?entryId=${item.条目编码}`}
              dangerouslySetInnerHTML={{
                __html: RestTools.translateToRed(_.get(item, 'Title', '')),
              }}
            />
            <div
              key="answer"
              dangerouslySetInnerHTML={{
                __html: RestTools.translateToRed(
                  RestTools.completeToolsBook(_.get(item, 'Answer', '')),
                ),
              }}
            />
            {_.get(item, 'Answer', '') ? null : (
              <div
                key="intro"
                dangerouslySetInnerHTML={{
                  __html: RestTools.translateToRed(_.get(item, '介绍', '')),
                }}
              />
            )}
            <div
              key="name"
              className="name"
              dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.工具书名称) }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ToolsBook;
