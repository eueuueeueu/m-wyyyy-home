(function () {
  function nextTick(fn) {
    requestAnimationFrame(function () {
      setTimeout(function () {
        typeof fn === "function" && fn();
      }, 0)
    })
  }
  function typeOf(data) {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
  }
  function createElement(tag, attrs, children) {
    if (typeof tag !== 'string') throw new Error('tag参数类型必须是字符串')
    let element = document.createElement(tag)
    if (element instanceof HTMLUnknownElement) throw new Error('tag标签名不合法')
    attrs = typeOf(attrs === 'object') ? attrs : {}
    Object.entries(attrs).forEach(attr => {
      let attrName = attr[0]
      let attrValue = typeOf(attr[1]) === 'object' ? Object.entries(attr[1]).join(';').split(',').join(':') : attr[1]
      element[attrName] = attrValue
    })
    if (typeof children === 'string') element.innerHTML = children
    return element
  }
  function createSwiper(res) {
    let bannerSwiper = document.querySelector('.banner-swiper')
    let Fragment = document.createDocumentFragment()
    res.data.blocks[0].extInfo.banners.forEach(src => {
      let div = createElement('div', { className: 'swiper-slide', style: `background-image:url(${src.pic});background-size:100% 100%` })
      Fragment.appendChild(div)
    });
    bannerSwiper.appendChild(Fragment)
    swiperConfig()
  }
  function creatClassify(res) {
    let classify = document.querySelector('.classify')
    let fragment = document.createDocumentFragment()
    let resources = res.data.blocks[1].creatives[0].resources
    resources.forEach(item => {
      let title = item.uiElement.mainTitle.title
      let imgUrl = item.uiElement.image.imageUrl2
      let div = createElement('div', { className: 'flex flex-col justify-center items-center w-60 mr-[30px]' })
      let img = createElement('img', { src: imgUrl })
      let p = createElement('p', {}, title)
      div.appendChild(img)
      div.appendChild(p)
      fragment.appendChild(div)
    })
    classify.appendChild(fragment)
    nextTick(() => scroll.refresh())
  }
  function addAnimaScroll(element, animaName, heightValue) {
    let childrenLength = element.children.length - 1
    let keyframesStr = ''
    for (let i = 1; i <= childrenLength; i++) {
      keyframesStr += `
      ${100 / (childrenLength * 2) * (2 * i - 1)}%,
      ${100 / (childrenLength * 2) * (2 * i)}%{
        transform:translateY(-${heightValue * i}px);
      }
    `
    }
    keyframesStr = `
    @keyframes ${animaName} {
    ${keyframesStr}
}
  `
    let styleSheet = document.createElement('style');
    styleSheet.innerHTML = keyframesStr;
    // 获取所有css样式表 将@keyframes规则添加到样式表中
    document.head.appendChild(styleSheet);
    element.style.animation = `${animaName} ${childrenLength}s infinite`;
  }
  function createSongList(res) {
    let recommendSongListHead = document.querySelector('.recommendSongList-head a')
    let recommendSongListBody = document.querySelector('.recommendSongList-body')
    recommendSongListHead.innerHTML = `${res.data.blocks[2].uiElement.subTitle.title}&nbsp;>`
    let fragment = document.createDocumentFragment()
    let resources = res.data.blocks[2].creatives
    resources.forEach(item => {
      let div = createElement('div', { className: 'flex flex-col w-100 mr-[30px]' })
      // 第一张的标题和图片的值
      let firstTitle = item.uiElement.mainTitle.title
      let firstImgUrl = item.uiElement.image.imageUrl
      // ---------------------------------------------------------
      let showTextBox = createElement('div', { className: 'w-100 h-42 overflow-hidden' })
      let showImgBox = createElement('div', { className: 'w-100 h-100 overflow-hidden' })
      let moveImgBox = createElement('div', { className: 'my-move' })
      let moveTextBox = createElement('div', { className: 'my-move2' })
      let payCount = item.resources // 播放的张数(数组)
      payCount.forEach(ele => {
        // 标题和图片的值
        imgUrl = ele.uiElement.image.imageUrl
        title = ele.uiElement.mainTitle.title
        let itemImg = createElement('img', { src: imgUrl, style: 'border-radius:10px' })
        let itemP = createElement('p', { style: 'height:42px;line-height:42px;font-size:12px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;' }, title)
        moveImgBox.appendChild(itemImg)
        moveTextBox.appendChild(itemP)
      })
      if (payCount.length > 1) {
        // 将第一张的标题和图片 复制一份 放到最后
        let itemImg = createElement('img', { src: firstImgUrl, style: 'border-radius:10px' })
        let itemP = createElement('p', { style: 'height:42px;line-height:42px;font-size:12px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;' }, firstTitle)
        moveImgBox.appendChild(itemImg)
        moveTextBox.appendChild(itemP)
        // 给图片和文字(张数大于1的) 加css3动画
        addAnimaScroll(moveImgBox, "move1", 100)
        addAnimaScroll(moveTextBox, "move2", 42)
      }
      // 将移动的盒子放到展示区盒子
      showImgBox.appendChild(moveImgBox)
      showTextBox.appendChild(moveTextBox)
      // ---------------------------------------------------------
      div.appendChild(showImgBox)
      div.appendChild(showTextBox)
      fragment.appendChild(div)
    })
    recommendSongListBody.appendChild(fragment)
    // 下一次渲染后重新调用betterScroll
    nextTick(() => scroll2.refresh())
  }
  function get(url) {
    let xhr = new XMLHttpRequest()
    if (typeof url !== "string") return
    return new Promise(function (resolve, reject) {
      xhr.open("GET", url)
      xhr.onload = function (e) {
        resolve(JSON.parse(e.target.response))
      }
      xhr.onerror = function (e) {
        reject(e)
      }
      xhr.send()
    })
  }
  function post(url, config) {
    return new Promise(function (resolve, reject) {
      let defaultConfig = { contentType: 'application/json', data: {} }
      config = _.merge(defaultConfig, config)
      let xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.setRequestHeader('Content-Type', config.contentType)//告诉服务端数据类型
      xhr.onreadystatechange = function () {
        if (Math.floor(this.status / 100) === 2 && this.readyState === 4) {
          let contentType = this.getResponseHeader('content-type')//服务端返回的content-type
          let responseData = null
          if (contentType.indexOf('application/json') > -1) {
            responseData = JSON.parse(this.response)
          }
          // console.log(responseData);
          typeof config.success === "function" && config.success(responseData)
          resolve(responseData)
        }
      }
      xhr.onerror = function (err) {
        typeof config.fail === "function" && config.fail(err.message)
        reject(err)
      }
      if (config.contentType === 'application/json') {
        data = JSON.stringify(config.data)
      }
      if (config.contentType === 'application/x-www-form-urlencoded') {
        // 对象转字符串(application/x-www-form-urlencoded)
        data = Qs.stringify(config.data)
      }
      xhr.send(data)
    })
  }
  // 
  post('https://docs-neteasecloudmusicapi.vercel.app/homepage/block/page', { contentType: 'application/json' })
    // get('https://docs-neteasecloudmusicapi.vercel.app/homepage/block/page')
    .then(function (res) {
      createSwiper(res)
      creatClassify(res)
      createSongList(res)
    })
    .catch(function (err) {
      console.log(err);
    })
})()