// 下载
const download = ({
  url,
  header,
  filePath,
}) => {
  let task = null;
  const p = new Promise((resolve, reject) => {
    task = wx.downloadFile({
      url,
      header,
      filePath,
      success: res => {
        if (res.statusCode === 200) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  });
  p.task = task;
  return p;
};

// 上传
const upload = ({
  name,
  url,
  header,
  filePath,
  formData,
}) => {
  let task = null;
  const p = new Promise((resolve, reject) => {
    task = wx.uploadFile({
      name,
      url,
      header,
      filePath,
      formData,
      success: res => {
        if (res.statusCode === 200) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  });
  p.task = task;
  return p;
};

// 双工通讯
const websocket = ({
  url,
  header,
  protocols,
}) => {
  let task = null;
  const p = new Promise((resolve, reject) => {
    task = wx.connectSocket({
      url,
      header,
      protocols,
      success: res => {
        if (res.statusCode === 200) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  });
  p.task = task;
  return p;
};

export default {
  DL: download,
  UL: upload,
  WS: websocket,
};