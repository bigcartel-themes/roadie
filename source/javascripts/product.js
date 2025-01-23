function initLightbox() {
  if (themeOptions.productImageZoom === true) {
    let carouselImages = document.querySelector('.splide__list');
    let galleryElement = '.product-images';
    let galleryChildren = '.gallery-link';
    if (carouselImages) {
      galleryElement = '.splide__list';
      galleryChildren = '.splide__slide:not(.splide__slide--clone) a'
    }
    var lightbox = new PhotoSwipeLightbox({
      gallery: galleryElement,
      children: galleryChildren,
      loop: true,
      showHideAnimationType: 'fade',
      paddingFn: (viewportSize) => {
        let paddingVal = 100;
        if (viewportSize.x < 768) {
          paddingVal = 16;
        }
        return {
          top: paddingVal,
          bottom: paddingVal,
          left: paddingVal,
          right: paddingVal
        };
      },
      bgOpacity: 1,
      pswpModule: PhotoSwipe
    });
    lightbox.init();
  }
}
initLightbox();

$('body').on('change', ".product-option-select", function(){
  active_form = $(this).closest('form');
  var option_price = $(this).find("option:selected").attr("data-price");
  enableAddButton(active_form,option_price);
});

function enableAddButton(active_form,updated_price) {
  var addButton = active_form.find('.add-to-cart-button');
  var addButtonTextElement = addButton.find('.button-add-text');
  var addButtonPriceTextElement = addButton.find('.button-add-price');
  var addButtonTitle = addButton.attr('data-add-title');
  addButton.attr("disabled",false);
  active_form.find('.product-form-quantity').removeClass('disabled')
  active_form.find('.product-quantity').attr("disabled",false)
  if (updated_price) {
    quantity = parseInt(active_form.find('#quantity').val());
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

function disableAddButton(active_form,type) {
  var addButton = active_form.find('.add-to-cart-button');
  var addButtonTextElement = addButton.find('.button-add-text');
  var addButtonPriceTextElement = addButton.find('.button-add-price');
  var addButtonTitle = addButton.attr('data-add-title');
  if (type == "sold-out") {
    var addButtonTitle = addButton.attr('data-sold-title');
  }
  if (!addButton.is(":disabled")) {
    addButton.attr("disabled","disabled");
  }
  active_form.find('.product-quantity').attr("disabled","disabled")
  active_form.find('.product-form-quantity').addClass('disabled')
  addButtonTextElement.html(addButtonTitle);
  addButtonPriceTextElement.removeClass('visible');
}

$('body').on('keyup', "#quantity", function() {
  active_form = $(this).closest('form');
  var $quantityInput = $(this)
    , $priceDisplay = active_form.find($(".button-add-price"))
    , quantity = parseInt($quantityInput.val())
    , price = active_form.find(".add-to-cart-button").attr("data-selected-price")
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

$('body').on('submit', ".product-form", function(e){
  e.preventDefault();
  var form = $(this);
  var quantity = form.find("#quantity").val()
  , itemID = form.find("#option").val()
  , addButton = form.find('.add-to-cart-button')
  , plusIcon = form.find('.plus-icon')
  , checkIcon = form.find('.check-icon')
  , cartLinkContainer = form.find('.product-form-cart-link-container')
  if (addButton.length) {
    var updateElement = form.find('.button-add-text');
    var addText = updateElement.html();
  }
  var addedText = addButton.data('added-text')
  , addingText = addButton.data('adding-text')
  if (!addButton.hasClass('adding')) {
    if (quantity > 0 && itemID > 0) {
      addButton.addClass('adding');
      addButton.addClass('spinner');
      addButton.blur();
      plusIcon.hide();
      Cart.addItem(itemID, quantity, function(cart) {
        setTimeout(function() {
          updateElement.html(addingText);
          setTimeout(function() {
            updateElement.html(addedText);
            cartLinkContainer.slideDown('fast');
            updateCart(cart);
            addButton.removeClass('adding');
            addButton.removeClass('spinner');
            checkIcon.fadeIn('fast');
            setTimeout(function() {
              updateElement.html(addText);
              checkIcon.hide();
              plusIcon.show();
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

document.addEventListener('DOMContentLoaded', () => {
  updateInventoryMessage();
});