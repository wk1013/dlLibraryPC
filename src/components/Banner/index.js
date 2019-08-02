import BannerAnim from 'rc-banner-anim';
import './index.less';

const { Element } = BannerAnim;
const BgElement = Element.BgElement;

const Banner = (props) => {
  return <BannerAnim autoPlay autoPlaySpeed={1000}>
  <Element key="aaa" prefixCls="banner-user-elem">
    <BgElement
      key="bg"
      className="bg"
      style={{
        backgroundImage: 'url(https://os.alipayobjects.com/rmsportal/IhCNTqPpLeTNnwr.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  </Element>
  <Element key="bbb" prefixCls="banner-user-elem">
    <BgElement
      key="bg"
      className="bg"
      style={{
        backgroundImage: 'url(https://os.alipayobjects.com/rmsportal/uaQVvDrCwryVlbb.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  </Element>
</BannerAnim>
}

export default Banner;