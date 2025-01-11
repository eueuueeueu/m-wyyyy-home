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
function renderSearch() {
  initSearchSuggest('/search/suggest?keywords=大奉打更人&type=mobile')
}
renderSearch()