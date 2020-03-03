$(document).keyup(function(e) {
  if (e.keyCode === 27) $('.quick-shop-close').click();   // esc
});

$('body').on('click', ".open-quickview", function(e){
  e.preventDefault();
  var permalink = $(this).data('permalink');

  Product.find(permalink, function(product) {
    //loadProductDetails(product, has_default);
    processProduct(product);

    loadProductContent(product);
  });
});
$('.quick-shop-close').click(function(e) {
  e.preventDefault();
  $('.quick-shop-modal').removeClass('opened');
})
$(document).mouseup(function (e){
  var container = $(".quick-shop-modal-content");
  if (!container.is(e.target) && container.has(e.target).length === 0){
    $('.quick-shop-modal').removeClass('opened');
  }
});
function loadProductContent(product) {
  var $container = $('.quick-shop-product-details');
  //Product.find(product.permalink, processProduct)

  $.get("/product/" + product.permalink + "?" + $.now(), function(response, status, xhr) {
      // error checking
      $container.html($(response).find(".main")); // Any <script> tags in the response string will execute
      // post processing
      $('.quick-shop-modal').addClass('opened');
      /*
      if ($('.product-page').data('prev').length) {
        $('.quick-shop-nav-button--previous').data('permalink',$('.product-page').data('prev')).show();
      }
      else {
        $('.quick-shop-nav-button--previous').data('permalink','').hide();
      }
      if ($('.product-page').data('next').length) {
        $('.quick-shop-nav-button--next').data('permalink',$('.product-page').data('next')).show();
      }
      else {
        $('.quick-shop-nav-button--next').data('permalink','').hide();
      }
      */
  });
}