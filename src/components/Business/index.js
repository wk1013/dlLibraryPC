import RestTools from '../../utils/RestTools';
import './index.less';

const Business = props => {
  return (
    <div
      className="business"
      dangerouslySetInnerHTML={{
        __html: RestTools.completeUrl(
          props.data.Answer || '这个问题还在学习中哟~，很快将会告诉你答案！',
        ),
      }}
    />
  );
};

export default Business;
