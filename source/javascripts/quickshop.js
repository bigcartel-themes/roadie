
$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    closeQuickShop()
  }
});

$('body').on('click', ".open-quickview", function(e){
  e.preventDefault();
  var permalink = $(this).data('permalink');
  clearTimeout(loadingTimer);
  loadingTimer = setTimeout(showLoading, 400)
  this_product = $(this).closest('.prod-thumb')
  openQuickShop();
  Product.find(permalink, function(product) {
    processProduct(product);
    loadProductContent(product, this_product);
  });
});

$('body').on('click', ".qs-nav", function(e){
  e.preventDefault();
  var permalink = $(this).data('permalink');
  clearTimeout(loadingTimer);
  loadingTimer = setTimeout(showLoading, 400)
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

$(document).mouseup(function (e) {
  var container = $(".qs-modal-content");
  if (!container.is(e.target) && container.has(e.target).length === 0){
    closeQuickShop()
  }
});

function closeQuickShop() {
  clearTimeout(loadingTimer);
  $('.qs-modal').removeClass('opened');
  $('body').removeClass('no-scroll');
  $('.qs-product-details .main-product').remove();
  $('.qs-product-details').html('');
}
function openQuickShop() {
  $('body').addClass('no-scroll');
  $('.qs-modal').addClass('opened');
}

var loadingTimer;
$(document)
  .ajaxStart(function () {

  })
  .ajaxStop(function () {
    clearTimeout(loadingTimer);
    $('.qs-product-container').removeClass('spinner');
});

function showLoading(){
  $('.qs-product-container').addClass('spinner');
}

async function loadProductContent(product) {
  var $container = $('.qs-product-details');

  var this_product = $(".open-quickview[data-permalink='" + product.permalink + "']").closest('.prod-thumb');

  populatePreviousAndNext(this_product);

  openQuickShop();

  if (!window.location.hostname.includes('127.0.0.1')) {
    $.getJSON(`/product/${product.permalink}.json`)
      .done(productData => {
        window.bigcartel.product = productData;
      })
      .fail(() => {
        window.bigcartel.product = product;
      });
  } else {
    window.bigcartel.product = product;
  }
  
  $.get("/product/" + product.permalink + "?" + $.now(), function(response, status, xhr) {
    $container.html($(response).find(".main"));
    initCarousel('quickshop');
    initLightbox();
    updateInventoryMessage();
    $('.qs-product-container').removeClass('spinner');
    $('.qs-product-container').animate({
      scrollTop: 0
    }, 0);
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