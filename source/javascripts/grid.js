
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