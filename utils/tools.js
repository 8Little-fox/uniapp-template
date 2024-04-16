/**
 * 获取图片主题颜色
 * @param path 图片的路径
 * @param canvasId 画布id
 * @param success 获取图片颜色成功回调，主题色的RGB颜色值
 * @param fail 获取图片颜色失败回调
 */
export const getImageThemeColor = (that, path, canvasId, success = () => {}, fail = () => {}) => {
  // 获取图片后缀名
  const suffix = path.split('.').slice(-1)[0]
  // uni.getImageInfo({
  //   src: path,
  //   success: (e) => {
  //     console.log(e.path) // 在安卓app端，不管src路径怎样变化，path路径始终为第一次调用的图片路径
  //   }
  // })
  // 由于getImageInfo存在问题，所以改用base64
  uni.request({
    url: path,
    responseType: 'arraybuffer',
    success: (res) => {
      let base64 = uni.arrayBufferToBase64(res.data);
      const img = {
        path: `data:image/${suffix};base64,${base64}`
      }
      // 创建canvas对象
      const ctx = uni.createCanvasContext(canvasId, that);

      // 图片绘制尺寸
      const imgWidth = 300;
      const imgHeight = 150;

      ctx.drawImage(img.path, 0, 0, imgWidth, imgHeight);

      ctx.save();
      ctx.draw(true, () => {
        uni.canvasGetImageData({
          canvasId: canvasId,
          x: 0,
          y: 0,
          width: imgWidth,
          height: imgHeight,
          fail: fail,
          success(res) {
            let data = res.data;
            let r = 1,
              g = 1,
              b = 1;
            // 获取所有像素的累加值
            for (let row = 0; row < imgHeight; row++) {
              for (let col = 0; col < imgWidth; col++) {
                if (row == 0) {
                  r += data[imgWidth * row + col];
                  g += data[imgWidth * row + col + 1];
                  b += data[imgWidth * row + col + 2];
                } else {
                  r += data[(imgWidth * row + col) * 4];
                  g += data[(imgWidth * row + col) * 4 + 1];
                  b += data[(imgWidth * row + col) * 4 + 2];
                }
              }
            }
            // 求rgb平均值
            r /= imgWidth * imgHeight;
            g /= imgWidth * imgHeight;
            b /= imgWidth * imgHeight;
            // 四舍五入
            r = Math.round(r);
            g = Math.round(g);
            b = Math.round(b);
            success([r, g, b].join(','));
          },
        }, that);
      });
    }
  });
}
