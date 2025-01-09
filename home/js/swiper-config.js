function swiperConfig() {
  var swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: true,
    autoplay: {
      delay: 1000,
    },
    pagination: {
      el: ".swiper-pagination",
    },
  });
}