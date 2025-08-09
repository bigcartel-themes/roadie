function initSplide() {
  const homeSlideshowContainer = document.querySelector('.splide.home-slideshow');
  if (homeSlideshowContainer) {
    var splide = new Splide( '.splide.home-slideshow', {
      arrows: true,
      type: 'slide',
      autoplay: themeOptions.homepageSlideshowAutoplay,
      interval: themeOptions.homepageSlideshowSpeed,
      speed: 1500,
      rewind: true,
      keyboard: true,
      pagination: true
    } );
    splide.mount();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSplide);
} else {
  initSplide();
}