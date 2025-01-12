function initSearchSuggest(portLocation) {
  let input = document.querySelector('.search-recommend')
  axios
    .post(portLocation)
    .then(res => {
      let suggestTitle = res.data.result.allMatch
      let index = 0
      function toggleTitle() {
        requestAnimationFrame(function () {
          setTimeout(() => {
            input.placeholder = `🔥${suggestTitle[index].keyword}`
            index++
            toggleTitle()
            if (index === suggestTitle.length) index = 0
          }, 2000)
        })
      }
      toggleTitle()
    })
    .catch(err => {
      console.log(err.name)
    })
}
function initRankingList(portLocation) {
  let rankingListContent = document.querySelector('.ranking-list-content')
  axios
    .post(portLocation)
    .then(res => {
      let fragment = document.createDocumentFragment()
      res.data.list.forEach(element => {
        if (element.tracks.length !== 0) {
          let rankingName = element.name
          let divMax = createElement('div', { className: 'w-[61vw] bg-[#fff] rounded-[2vw] ml-[2.344vw]' })
          divMax.innerHTML = `
            <div class="ml-[2vw] w-[54vw] h-[12.422vw] flex items-center border-b-[1px] border-b-[#eaeaea]">
              <span class="text-[4vw] text-[#2a344b] dark:text-[#fff] mr-[3.359vw] ml-[4vw]">${rankingName}</span>
              <div class="h-[5.235vw] bg-[#f3f4f1] dark:bg-[#393b42] flex items-center px-[2vw] rounded-[3vw]">
                <i class="iconfont text-[10px]">&#xe624;</i>
                <span class="text-[2.6vw] text-[#323c52] dark:text-[#fff]">播放</span>
              </div>
            </div>
          `
          let divsongList = document.createElement('div', { className: 'pr-[2vw]' })
          element.tracks.forEach((item, index) => {
            let songName = item.first
            let divItem = createElement('div', { className: 'my-[2.7vw] flex items-center h-[8vw]' })
            divItem.innerHTML = `
              <span class="text-[3.2vw] w-[8.83vw] text-center text-[#858393] font-[400]" style="color: red;">${index + 1}</span>
              <span class="text-start text-[3.2vw] text-[#2a344b] mr-[1vw] w-[50vw] overflow-hidden truncate">${songName}</span>
            `
            divsongList.appendChild(divItem)
          })
          divMax.appendChild(divsongList)
          fragment.appendChild(divMax)
        }
      });
      rankingListContent.appendChild(fragment)
      nextTick(() => scroll4.refresh())
    })
    .catch(err => {
      console.log(err.name)
    })
}
function renderSearch() {
  initSearchSuggest('/search/suggest?keywords=大奉打更人&type=mobile')
  initRankingList('/toplist/detail')
}
renderSearch()