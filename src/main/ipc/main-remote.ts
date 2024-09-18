const AutoLaunch = require("electron-auto-launch");
const packageJson = require("../../package.json");

const autoLauncher = new AutoLaunch({
  name: packageJson.name,
  path: `/Applications/${packageJson.name}.app`
});

export default {
  // 判断是否已经开启了自动启动
  isEnableAutoLaunch: () => {
    return autoLauncher.isEnabled();
  },
  // 设置是否开机自启动
  toggleEnableAutoLaunch: (enable) => {
    autoLauncher.isEnabled().then((isEnabled) => {
      if (isEnabled && !enable) {
        // 目前是开启，但是要关闭
        return autoLauncher.disable()
      } else if (!isEnabled && enable) {
        // 目前关闭，但是需要开启
        return autoLauncher.enable()
      }
    })
  }
};
