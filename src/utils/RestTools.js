import 'whatwg-fetch'
// import 'fetch-ie8';
/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @return 返回Promise
 */

export default {
  fetchRequest(common_url, url, method, params = '',mode='cors') {
    let header = {
      'Content-Type': 'application/json;charset=UTF-8',
      // accesstoken: token, //用户登陆后返回的token，某些涉及用户数据的接口需要在header中加上token
    };
    // console.log('request url:', url, params); //打印请求参数
    if (params === '') {
      //如果网络请求中没有参数
      return new Promise(function(resolve, reject) {
        timeout_fetch(
          fetch(common_url + url, {
            method: method,
            headers: header,
            mode: mode,
          }),
        )
          .then(response => response.json())
          .then(responseData => {
            //   console.log('res:', url, responseData); //网络请求成功返回的数据
            resolve(responseData);
          })
          .catch(err => {
            console.log('err:', url, err); //网络请求失败返回的数据
            reject(err);
          });
      });
    } else {
      //如果网络请求中带有参数
      return new Promise(function(resolve, reject) {
        let newUrl = common_url + url;
        if (params) {
          let paramsArray = [];
          //拼接参数
          Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
          if (newUrl.search(/\?/) === -1) {
            newUrl += '?' + paramsArray.join('&');
          } else {
            newUrl += '&' + paramsArray.join('&');
          }
        }

        timeout_fetch(
          fetch(newUrl, {
            method: method,
            headers: header,
            mode: mode,
            // body: JSON.stringify(params), //body参数，通常需要转换成字符串后服务器才能解析
          }),
        )
          .then(response => response.json())
          .then(responseData => {
            // console.log('res:', url, responseData); //网络请求成功返回的数据
            resolve(responseData);
          })
          .catch(err => {
            console.log('err:', url, err); //网络请求失败返回的数据
            reject(err);
          });
      });
    }
  },
  sourceDb: {
    博士: 'CDFD',
    硕士: 'CMFD',
    期刊: 'CJFD',
    中国会议: 'CPFD',
    报纸: 'CCND',
  },
  setStorageInput(value) {
    let inputRecords = JSON.parse(window.localStorage.getItem('inputRecords')) || [];
    if (inputRecords.indexOf(value) < 0) {
      if (inputRecords.length < 10) {
        inputRecords.unshift(value);
      } else {
        inputRecords.pop();
        inputRecords.unshift(value);
      }
    } else {
      const index = inputRecords.indexOf(value);
      inputRecords.splice(index, 1);
      inputRecords.unshift(value);
    }
    window.localStorage.setItem('inputRecords', JSON.stringify(inputRecords));
    return inputRecords;
  },
  translateToRed(str) {
    return str.replace(/###/g, '<span style="color:red">').replace(/\$\$\$/g, '</span>');
  },
  completeUrl(str) {
    return str
      .replace(/\n/g, '<br/>')
      .replace(/src="/g, 'src="http://qa2.cnki.net/seu/')
      .replace(/src='/g, "src='http://qa2.cnki.net/seu/")
      .replace(/<a href="AnswerImage/g, '<a href="http://qa2.cnki.net/seu/AnswerImage');
  },
  urlFixed(url) {
    return url.replace(/\%/g,"%25").replace(/\#/g,"%23").replace(/\&/g,"%26")
  },

  completeToolsBook(str) {
    return str
      .replace(/\n/g, '<br/>')
      .replace(/src="/g, 'src="http://refbook.img.cnki.net')
      .replace(/src='/g, "src='http://refbook.img.cnki.net");
  },
  GetNewGuid() {
    try {
      var guid = '';
      for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16).toString(16);
        guid += n;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          guid += '-';
        }
      }
      return guid;
    } catch (e) {}
  },

  GetGUID: function() {
    try {
      var key = this.getCookie('guid');
      if (key === '') {
        key = this.GetNewGuid();
        this.setCookie('guid', key, 3650);
      }
      return this.getCookie('guid');
    } catch (e) {
      return '';
    }
  },

  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    window.document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  },

  getCookie(cname) {
    var name = cname + '=';
    var ca = window.document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },
  getInputTips(value) {
    return new Promise(function(reslove, reject) {
      fetch(
        `http://192.168.100.75/dn.qa.sug/su.ashx?action=getsmarttips&p=0.9044369541594852&kw=${
          encodeURI(value)
        }&td=1560427140234&tdsourcetag=s_pcqq_aiomsg`,
      )
        .then(function(response) {
          return response.text();
        })
        .then(function(myJson) {
          const tipsData = JSON.parse(myJson.replace(/var oJson = /g, '')).results;
          reslove(tipsData);
        })
        .catch(err => {
          console.log('err:', err); //网络请求失败返回的数据
          reject(err);
        });
    })
  },
  maxLength: 38
};

/**
 * 让fetch也可以timeout
 *  timeout不是请求连接超时的含义，它表示请求的response时间，包括请求的连接、服务器处理及服务器响应回来的时间
 * fetch的timeout即使超时发生了，本次请求也不会被abort丢弃掉，它在后台仍然会发送到服务器端，只是本次请求的响应内容被丢弃而已
 * @param {Promise} fetch_promise    fetch请求返回的Promise
 * @param {number} [timeout=10000]   单位：毫秒，这里设置默认超时时间为10秒
 * @return 返回Promise
 */
function timeout_fetch(fetch_promise, timeout = 5000) {
  let timeout_fn = null;

  //这是一个可以被reject的promise
  let timeout_promise = new Promise(function(resolve, reject) {
    timeout_fn = function() {
      reject('timeout promise');
    };
  });

  //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
  let abortable_promise = Promise.race([fetch_promise, timeout_promise]);

  setTimeout(function() {
    timeout_fn();
  }, timeout);

  return abortable_promise;
}
