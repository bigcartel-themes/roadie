$('body').on('change', ".product-option-select", function(){
  var option_price = $(this).find("option:selected").attr("data-price");
  enableAddButton(option_price);
});

function enableAddButton(updated_price) {
  var addButton = $('.add-to-cart-button');
  var addButtonTextElement = addButton.find('.button-add-text');
  var addButtonPriceTextElement = addButton.find('.button-add-price');
  var addButtonTitle = addButton.attr('data-add-title');
  addButton.attr("disabled",false);
  $('.product-form-quantity').removeClass('disabled')
  $('.product-quantity').attr("disabled",false)
  if (updated_price) {
    quantity = parseInt($('#quantity').val());
    if (quantity > 0) {
      updated_total_price = quantity * updated_price;
    }
    addButtonPriceTextElement.html(Format.money(updated_total_price, true, true));
    addButton.attr('data-selected-price',updated_price);
    addButtonPriceTextElement.addClass('visible');
  }
  else {
    priceTitle = '';
    addButtonPriceTextElement.hide();
  }
  addButtonTextElement.html(addButtonTitle);
}

function disableAddButton(type) {
  var addButton = $('.add-to-cart-button');
  var addButtonTextElement = addButton.find('.button-add-text');
  var addButtonPriceTextElement = addButton.find('.button-add-price');
  var addButtonTitle = addButton.attr('data-add-title');
  if (type == "sold-out") {
    var addButtonTitle = addButton.attr('data-sold-title');
  }
  if (!addButton.is(":disabled")) {
    addButton.attr("disabled","disabled");
  }
  $('.product-quantity').attr("disabled","disabled")
  $('.product-form-quantity').addClass('disabled')
  addButtonTextElement.html(addButtonTitle);
  addButtonPriceTextElement.removeClass('visible');
}

$('body').on('keyup', "#quantity", function(){
  var $quantityInput = $(this)
    , $priceDisplay = $(".button-add-price")
    , quantity = parseInt($quantityInput.val())
    , price = $(".add-to-cart-button").attr("data-selected-price")
  if (quantity > 0 && price) {
    $priceDisplay.html(Format.money(quantity * price, true, true));
  }
});

function enableSelectOption(select_option) {
  select_option.removeAttr("disabled");
  select_option.text(select_option.attr("data-name"));
  select_option.removeAttr("disabled-type");
  if ((select_option.parent().is('span'))) {
    select_option.unwrap();
  }
}
function disableSelectOption(select_option, type) {
  if (type === "sold-out") {
    disabled_text = select_option.parent().attr("data-sold-text");
    disabled_type = "sold-out";
    if (themeOptions.showSoldOutOptions === false) {
      hide_option = true;
    }
    else {
      hide_option = false;
    }
  }
  if (type === "unavailable") {
    disabled_text = select_option.parent().attr("data-unavailable-text");
    disabled_type = "unavailable";
    hide_option = true;
  }
  if (select_option.val() > 0) {
    var name = select_option.attr("data-name");
    select_option.attr("disabled",true);
    select_option.text(name + ' ' + disabled_text);
    select_option.attr("disabled-type",disabled_type);
    if (hide_option === true) {
      if (!(select_option.parent().is('span'))) {
        select_option.wrap('<span>');
      }
    }
  }
}
$('body').addClass('pointer-device');

window.addEventListener('touchstart', function onFirstTouch() {
  $('body').addClass('touch-device');
  $('body').removeClass('pointer-device')
  window.removeEventListener('touchstart', onFirstTouch, false);
}, false);

function is_touch_device() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

if (!is_touch_device()) {

  if ($('.product-image-zooming').length) {
    var driftOptions = {
      namespace: null,
      showWhitespaceAtEdges: false,
      containInline: false,
      inlineOffsetX: 0,
      inlineOffsetY: 0,
      inlineContainer: document.body,
      sourceAttribute: 'data-zoom',
      zoomFactor: 3,
      paneContainer: document.body,
      inlinePane: true,
      handleTouch: true,
      onShow: null,
      onHide: null,
      injectBaseStyles: true,
      hoverDelay: 0,
      touchDelay: 100,
      hoverBoundingBox: false,
      touchBoundingBox: false,
      boundingBoxContainer: document.body,
    };
    var thumbs = document.querySelectorAll('.product-image-zoom');
    for (var i = 0, len = thumbs.length; i < len; i++) {
      var thumb = thumbs[i];
      var drift = new Drift(thumb, driftOptions);
    }
  }
}

$('body').on('click', ".secondary-product-image-link--thumbs", function(e) {

  e.preventDefault();

  var data_url = $(this).data('url');
  var data_srcset = $(this).data('srcset');
  var image_zoom_url = $(this).data("zoom");

  $('.primary-product-image').attr('src',data_url);
  $('.primary-product-image').attr('data-srcset',data_srcset);
  $('.primary-product-image').attr('data-zoom',image_zoom_url);

  var image_container_offset = $('.primary-product-image-container').offset().top;

  var window_scrolltop = $(window).scrollTop();

  if (!$('.qs-modal').is(":hidden") || $('.qs-modal').hasClass('opened')) {
    var quickshop_scrolltop = $('.qs-product-container').offset().top;
    if (image_container_offset - quickshop_scrolltop < -10) {
      document.querySelector('.qs-product-container .primary-product-image-container').scrollIntoView()
    }
  }
  else {
    if (image_container_offset - window_scrolltop < -10) {
      $('html,body').animate({
        scrollTop: $('.primary-product-image-container').offset().top
      }, 0);
    }
  }

  $('.secondary-product-image-link').removeClass('active');

  $(this).addClass('active');

  return false;

});

$('body').on('submit', ".product-form", function(e){
  e.preventDefault();
  var quantity = $("#quantity").val()
  , itemID = $("#option").val()
  , addButton = $('.add-to-cart-button')
  if (addButton.length) {
    var updateElement = $('.button-add-text');
    var addText = updateElement.html();
  }
  var addedText = addButton.data('added-text')
  , addingText = addButton.data('adding-text')
  if (!addButton.hasClass('adding')) {
    if (quantity > 0 && itemID > 0) {
      addButton.addClass('adding');
      addButton.addClass('spinner');
      addButton.blur();
      $('.plus-icon').hide();
      Cart.addItem(itemID, quantity, function(cart) {
        setTimeout(function() {
          updateElement.html(addingText);
          setTimeout(function() {
            updateElement.html(addedText);
            $('.product-form-cart-link-container').slideDown('fast');
            updateCart(cart);
            addButton.removeClass('adding');
            addButton.removeClass('spinner');
            $('.check-icon').fadeIn('fast');
            setTimeout(function() {
              updateElement.html(addText);
              $('.check-icon').hide();
              $('.plus-icon').show();
            }, 1500)
          }, 600);
        }, 300);
      });
    }
  }
});

$('body').on('click', ".description-inventory-tab", function(e){
  e.preventDefault();
  var tab_name = $(this).data('tab');
  $('.description-inventory-tab').removeClass('active-tab')
  $(this).addClass('active-tab');
  $('.product-detail-tab-section').hide()
  $('.' + tab_name).show();
})

$(document).ready(function() {
  if ($('.all-similar-products').length) {
    var num_products = $('.all-similar-products .prod-thumb').length;
    var elements = $('.all-similar-products').children().toArray();
    var num_to_display = $('.related-products-container').data('num-products');
    for (var i=1; i<=num_to_display; i++) {
      var randomIndex = getRandomIndex(elements);
      $('.similar-product-list').append($('.all-similar-products').children().eq(randomIndex));
      elements.splice(randomIndex, 1);
      $('.similar-product-list .similar-product-list-image').each(function() {
        $(this).attr("src",$(this).data("src"));
      })
    }
    $('.all-similar-products').remove();
  }
});