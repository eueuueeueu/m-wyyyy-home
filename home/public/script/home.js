(function () {
  let BASE_URL = 'https://docs-neteasecloudmusicapi.vercel.app'
  axios.defaults.baseURL = BASE_URL
  axios
    .post('/homepage/block/page')
    .then(res => {
      store.set('homePageData', res.data.data)
    })
    .catch(err => {
      console.log(err.name)
    })
    .finally(renderPage)
  function renderPage() {
    let blocks = formHomepageDate()
    initSwiper(blocks.HOMEPAGE_BANNER)
    initMenu(blocks.HOMEPAGE_BLOCK_OLD_DRAGON_BALL)
    initRecmSongList(blocks.HOMEPAGE_BLOCK_PLAYLIST_RCMD)
    initDrawer()
    initHomeToSearch()
  }
  function formHomepageDate() {
    let data = store.get('homePageData')
    if (!data) {
      alert('数据请求失败，请刷新页面重新请求')
    }
    let blocks = data.blocks.reduce(function (prev, block) {
      let key = block.blockCode
      prev[key] = block
      return prev
    }, {})
    console.log(blocks);
    return blocks
  }
  function initSwiper(res) {
    let bannerSwiper = document.querySelector('.banner-swiper')
    let Fragment = document.createDocumentFragment()
    res.extInfo.banners.forEach(banner => {
      let div = createElement('div', { className: 'swiper-slide', style: `background-image:url(${banner.pic});background-size:100% 100%` })
      Fragment.appendChild(div)
    });
    bannerSwiper.appendChild(Fragment)
    // 初始化swiper
    var swiper = new Swiper(".mySwiper", {
      loop: true,
      noSwiping: false,
      autoplay: {
        delay: 1000,
      },
      pagination: {
        el: ".swiper-pagination",
      },
    });
  }
  function initMenu(res) {
    let classify = document.querySelector('.classify')
    let fragment = document.createDocumentFragment()
    let resources = res.creatives[0].resources
    resources.forEach(item => {
      let title = item.uiElement.mainTitle.title
      let imgUrl = item.uiElement.image.imageUrl2
      let div = createElement('div', { className: 'flex flex-col justify-center items-center w-[60px] mr-[30px]' })
      let img = createElement('img', { src: imgUrl })
      let p = createElement('p', { className: 'text-[14px]' }, title)
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
  function initRecmSongList(res) {
    let recommendSongListHead = document.querySelector('.recommendSongList-head a')
    let recommendSongListBody = document.querySelector('.recommendSongList-body')
    recommendSongListHead.innerHTML = `${res.uiElement.subTitle.title}&nbsp;>`
    let fragment = document.createDocumentFragment()
    let resources = res.creatives
    resources.forEach(item => {
      let div = createElement('div', { className: 'flex flex-col w-[100px] mr-[30px]' })
      // 第一张的标题和图片的值
      let firstTitle = item.uiElement.mainTitle.title
      let firstImgUrl = item.uiElement.image.imageUrl
      // ---------------------------------------------------------
      let showTextBox = createElement('div', { className: 'w-[100px] h-[42px] overflow-hidden' })
      let showImgBox = createElement('div', { className: 'w-[100px] h-[100px] overflow-hidden' })
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
  function initDrawer() {
    let drawerController = document.querySelector('.drawer-controller')
    let maskLayer = document.querySelector('.mask-layer')
    let drawer = document.querySelector('.home-drawer')
    drawerController.addEventListener('click', () => {
      maskLayer.style.display = 'block'
      drawer.style.cssText = 'transform:translate(0);transition:all .3s'
    })
    maskLayer.addEventListener('click', () => {
      maskLayer.style.display = 'none'
      drawer.style.transform = 'translate(-100%)'
    })
  }
  function initHomeToSearch() {
    /*
    location.hash = '#home'
    let homeSearch = document.querySelector('#home-search')
    homeSearch.addEventListener('focus', e => {
      // 修改hash值来跳转
      location.hash = '#search'
      console.log(location.hash);

    })
    */
    var swiper2 = new Swiper(".myPageSwiper", {
      loop: true,
      direction: 'vertical',
      noSwiping: true,
      navigation: {
        nextEl: '.swiper-toggle-button-next',
        prevEl: '.swiper-toggle-button-prev',
      },
    });
    document.documentElement.addEventListener('click', e => {
      if (e.target.id === 'home-search' || e.target.id === 'search-back') {
        document.querySelector('.swiper-toggle-button-next').click()
      }
    })
  }
})()