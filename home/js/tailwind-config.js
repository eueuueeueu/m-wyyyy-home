(function (window) {
  function setSizeConfig(max, unit) {
    let config = {}
    for (let i = 0; i < max; i++) {
      config[i] = `${i}${unit}`
    }
    return config
  }
  window.tailwind.config = {
    // 配置暗黑模式
    darkMode: 'selector',
    // 扩展样式主题
    theme: {
      extend: {
        width: setSizeConfig(1080, 'px'),
        height: setSizeConfig(1080, 'px'),
      }
    }
  }
})(window)