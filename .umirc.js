// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  disableCSSModules: true,
  base: '/',
  publicPath: './',
  targets: {
    ie: 10,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: { webpackChunkName: true, loadingComponent:  './components/Loading/index.js'},
      title: '大连图书馆智能问答平台',
      // scripts: [{src: 'https://api.map.baidu.com/api?v=3.0&ak=nYXwpW455iW2cQM2q6Xbfe8rOLWXKB1M'}],
      links: [
        { rel: 'icon', href: './static/favicon.ico' },
      ],
      dll: false,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
}
