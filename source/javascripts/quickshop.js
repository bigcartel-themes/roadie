
$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    closeQuickShop()
  }
});

$('body').on('click', ".open-quickview", function(e){
  e.preventDefault();

  if (inPreview) {
    alert('Sorry, quick view is unavailable in the Customize Design area');
  }
  else {
    var permalink = $(this).data('permalink');

    this_product = $(this).closest('.prod-thumb')

    Product.find(permalink, function(product) {
      processProduct(product);
      loadProductContent(product, this_product);
    });
  }
});

$('body').on('click', ".qs-nav", function(e){
  e.preventDefault();
  var permalink = $(this).data('permalink');

  if (permalink) {
    Product.find(permalink, function(product) {
      processProduct(product);
      loadProductContent(product);
    });
  }
});

$('.qs-close').click(function(e) {
  closeQuickShop();
})

$('body').on('click', ".qs-product-details .primary-product-image-link", function(e) {
  e.preventDefault();
  return false;
});

function closeQuickShop() {
  $('.qs-modal').removeClass('opened');
  $('body').removeClass('no-scroll');
}
function openQuickShop() {
  $('body').addClass('no-scroll');
  $('.qs-modal').addClass('opened');
}

$(document).mouseup(function (e) {
  var container = $(".qs-modal-content");
  if (!container.is(e.target) && container.has(e.target).length === 0){
    closeQuickShop()
  }
});

function loadProductContent(product) {
  var $container = $('.qs-product-details');

  var this_product = $(".open-quickview[data-permalink='" + product.permalink + "']").closest('.prod-thumb');

  populatePreviousAndNext(this_product);

  $.get("/product/" + product.permalink + "?" + $.now(), function(response, status, xhr) {
    // error checking

    $container.html($(response).find(".main")); // Any <script> tags in the response string will execute
    // post processing
$('.qs-product-container').animate({
    scrollTop: 0
  }, 0);
    openQuickShop();
  });
}

function populatePreviousAndNext(this_product) {
  $('.qs-nav').attr("disabled", false);
  previous_product = this_product.prev('.prod-thumb');
  next_product = this_product.next('.prod-thumb');
  if (previous_product.length > 0) {
    permalink = previous_product.find('.open-quickview').data('permalink');
    $('.qs-nav-previous').data('permalink',permalink)
  }
  else {
    $('.qs-nav-previous').data('permalink','')
    $('.qs-nav-previous').attr("disabled", "disabled");
  }

  if (next_product.length > 0) {
    permalink = next_product.find('.open-quickview').data('permalink');
    $('.qs-nav-next').data('permalink',permalink)
  }
  else {
    $('.qs-nav-next').data('permalink','')
    $('.qs-nav-next').attr("disabled", "disabled");
  }
}