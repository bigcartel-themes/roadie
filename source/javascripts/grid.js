
var isActive;
$(window).on("load resize", function() {
  var product_grid = $('.product-list');
  if (product_grid.hasClass('masonry')) {
    window_width = $(window).width();

    var $grid = $('.masonry').masonry({
      itemSelector: '.prod-thumb',
      percentPosition: true
    });

    if (window_width > 768) {
      if (!isActive) {
        $grid.on( 'load', function() {
          $grid.masonry('layout');
          isActive = true;
        });
      }
    }
    else {
      if (product_grid.hasClass('mobile-horizontal')) {
        $grid.masonry('destroy')
        isActive = !isActive;
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      }, {
        rootMargin: "0px 0px 256px 0px"
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});