import { useState, useEffect } from 'react';
import { Layout, BackTop, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import RestTools from '../utils/RestTools';
import Nameing from '../utils/Nameing';
import 'rc-texty/assets/index.css';
import './index.less';
const { Header, Footer, Content } = Layout;

function BasicLayout(props) {
  const w = JSON.parse(window.sessionStorage.getItem('weather'));
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    let nodeList = Array.from(document.getElementsByClassName('texty')[0].childNodes);
    for (let i = 0; i < nodeList.length; i++) {
      const item = nodeList[i];
      item.onmouseover = function() {
        item.style.transform = 'rotate(45deg)';
      };
      item.onmouseout = function() {
        item.style.transform = 'rotate(0deg)';
      };
    }
    if (w && w.expires > Date.now()) {
      const weather = w.weather;
      setWeather(weather);
    } else {
      RestTools.fetchRequest(Nameing.weatherUrl, '/now', 'GET', {
        key: '2502052d9d4f41878b85fa75635be718',
        tdsourcetag: 's_pcqq_aiomsg',
        location: 'auto_ip',
      }).then(res => {
        setWeather(res.HeWeather6[0]);
        //加入过期时间
        window.sessionStorage.setItem(
          'weather',
          JSON.stringify({
            weather: res.HeWeather6[0],
            expires: new Date().getTime() + 3 * 60 * 60 * 1000, //设置过期时间
          }),
        );
      });
    }
  }, []);
  return (
    <LocaleProvider locale={zhCN}>
    <Layout className="Layout">
      <Header className="Header">
        <div id="allmap" style={{ width: 10, height: 10 }} />
        {weather ? (
          <div className="weather-wrap">
            <div className="weather">
              <div className="location">{weather.basic.location}</div>
              <div className="detail">
                <img src={require(`../assets/weather/${weather.now.cond_code}.png`)} alt="" />
                {weather.now.cond_txt}
              </div>
              <div className="tempreture">{weather.now.tmp}℃</div>
            </div>
          </div>
        ) : null}
        <div className="logo">
          <div className='texty'>大连图书馆智能问答平台</div>
        </div>
      </Header>
      <Content className="Content">{props.children}</Content>
      <Footer className="Footer">Copyright@ 2019 中国 辽宁 大连 图书馆</Footer>
      <BackTop />
    </Layout>
    </LocaleProvider>
  );
}
export default BasicLayout;
