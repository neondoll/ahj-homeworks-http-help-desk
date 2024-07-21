module.exports = (url) => {
  const params = {};

  const urlArr = url.split('?');

  if (urlArr.length === 2) {
    urlArr[1].split('&').forEach((paramStr) => {
      const paramArr = paramStr.split('=');

      params[paramArr[0]] = paramArr[1];
    });
  }

  return params;
};
