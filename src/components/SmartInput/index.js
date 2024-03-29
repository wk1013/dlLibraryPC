import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import InputRecord from './InputRecord';
import InputTips from './InputTips';
import RestTools from '../../utils/RestTools';
import './index.less';
let timer = null;
const SmartInput = props => {
  const [value, setValue] = useState('');
  const [showRecord, setRecord] = useState(false);
  const [tipsData, setTips] = useState([]);
  const inputRecords = JSON.parse(window.localStorage.getItem('inputRecords')) || [];
  const needTip = props.needTip;
  useEffect(() => {
    setValue(props.question);
  }, [props.question]);

  function handleChange(e) {
    const currentValue = e.target.value;
    setValue(e.target.value);
    setRecord(e.target.value ? false : true);
    if (needTip) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        RestTools.getInputTips(currentValue)
          .then(res => {
            setTips(res);
          })
          .catch(err => {
            console.log(err);
          });
      }, 500);
    }
  }

  function hanldeClickItem(item) {
    setRecord(false);
    setTips([]);
    setValue(item);
    if (item) {
      RestTools.setStorageInput(item);
      props.onClickItem(item);
    } else {
      message.warning('请输入您的问题');
    }
  }

  function handleEnter() {
    const maxLength = RestTools.maxLength;
    let str = value;
    let newStr = str;
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
        newStr = value.substring(0, maxLength);
      }
      RestTools.setStorageInput(newStr); //存储输入
      props.onClickEnter(newStr);
    } else {
      message.warning('请输入您的问题');
    }
  }

  return (
    <div className="input-wrap">
      <Input
        placeholder="请输入问题"
        size="large"
        allowClear
        value={value}
        onChange={handleChange}
        maxLength={50}
        onFocus={() => {
          if (value) {
            if (props.needTip) {
              RestTools.getInputTips(value)
                .then(res => {
                  setTips(res);
                })
                .catch(err => {
                  console.log(err);
                });
            }
          } else {
            setRecord(true);
          }
        }}
        onBlur={() => {
          setRecord(false);
          setTips([]);
        }}
        onPressEnter={handleEnter}
        addonAfter={
          <Button type="primary" onClick={handleEnter}>
            提问
          </Button>
        }
      />
      {showRecord && inputRecords.length ? (
        <div className="record-wrap">
          <InputRecord data={inputRecords} clickItem={hanldeClickItem} />
        </div>
      ) : null}

      {tipsData.length ? (
        <div className="record-wrap">
          <InputTips keyword={value} data={tipsData} clickItem={hanldeClickItem} />
        </div>
      ) : null}
    </div>
  );
};

export default SmartInput;