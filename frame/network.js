// 请求
const fetch = ({
  url,
  data,
  method = 'GET',
  dataType = 'json',
  responseType = 'text',
  header,
}) => {
  let task = null;
  const p = new Promise((resolve, reject) => {
    task = wx.request({
      url,
      data,
      method,
      dataType,
      responseType,
      header,
      success: res => {
        if (res.statusCode >= 200 && res.statusCode < 300 || res.statusCode === 304) resolve(res);
        else reject(res);
      },
      fail: reject,
    });
  });
  p.task = task;
  return p;
};

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
const ws = ({
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
  fetch,
  download,
  upload,
  ws,
};