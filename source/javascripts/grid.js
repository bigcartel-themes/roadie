
let isActive;
$(window).on("load resize", function() {
  let product_grid = $('.product-list');
  let window_width = $(window).width();
  if (product_grid.hasClass('masonry')) {
    if (window_width > 768) {
      let $grid = $('.masonry').masonry({
        itemSelector: '.prod-thumb',
        percentPosition: true
      });
      if (!isActive) {
        $grid.on( 'load', function() {
          $grid.masonry('layout');
          isActive = true;
        });
      }
    }
    else {
      if (product_grid.hasClass('mobile-horizontal')) {
        if (isActive) {
          $grid.masonry('destroy')
          isActive = !isActive;
        }
      }
    }
  }
});