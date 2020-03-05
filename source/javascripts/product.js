$('.product-option-select').on('change',function() {
  var option_price = $(this).find("option:selected").attr("data-price");
  enableAddButton(option_price);
});



function enableAddButton(updated_price) {
  var addButton = $('.add-to-cart-button');
  var addButtonTextElement = addButton.find('.button-add-text');
  var addButtonPriceTextElement = addButton.find('.button-add-price');
  var addButtonTitle = addButton.attr('data-add-title');
  addButton.attr("disabled",false);
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
  addButtonTextElement.html(addButtonTitle);
  addButtonPriceTextElement.removeClass('visible');
}

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



if ($('.magnify-on-hover .primary-product-image').length) {
  var driftOptions = {
    // Prefix for generated element class names (e.g. `my-ns` will
    // result in classes such as `my-ns-pane`. Default `drift-`
    // prefixed classes will always be added as well.
    namespace: null,
    // Whether the ZoomPane should show whitespace when near the edges.
    showWhitespaceAtEdges: false,
    // Whether the inline ZoomPane should stay inside
    // the bounds of its image.
    containInline: false,
    // How much to offset the ZoomPane from the
    // interaction point when inline.
    inlineOffsetX: 0,
    inlineOffsetY: 0,
    // A DOM element to append the inline ZoomPane to.
    inlineContainer: document.body,
    // Which trigger attribute to pull the ZoomPane image source from.
    sourceAttribute: 'data-zoom',
    // How much to magnify the trigger by in the ZoomPane.
    // (e.g., `zoomFactor: 3` will result in a 900 px wide ZoomPane image
    // if the trigger is displayed at 300 px wide)
    zoomFactor: 3,
    // A DOM element to append the non-inline ZoomPane to.
    // Required if `inlinePane !== true`.
    paneContainer: document.body,
    // When to switch to an inline ZoomPane. This can be a boolean or
    // an integer. If `true`, the ZoomPane will always be inline,
    // if `false`, it will switch to inline when `windowWidth <= inlinePane`
    inlinePane: true,
    // If `true`, touch events will trigger the zoom, like mouse events.
    handleTouch: false,
    // If present (and a function), this will be called
    // whenever the ZoomPane is shown.
    onShow: null,
    // If present (and a function), this will be called
    // whenever the ZoomPane is hidden.
    onHide: null,
    // Add base styles to the page. See the "Theming"
    // section of README.md for more information.
    injectBaseStyles: true,
    // An optional number that determines how long to wait before
    // showing the ZoomPane because of a `mouseenter` event.
    hoverDelay: 0,
    // An optional number that determines how long to wait before
    // showing the ZoomPane because of a `touchstart` event.
    // Setting this to a reasonable amount will allow users to execute
    // scroll-gestures events on touch-enabled devices with the image as
    // a starting point
    touchDelay: 0,
    // If true, a bounding box will show the area currently being previewed
    // during mouse hover
    hoverBoundingBox: false,
    // If true, a bounding box will show the area currently being previewed
    // during touch events
    touchBoundingBox: false,
    // A DOM element to append the bounding box to.
    boundingBoxContainer: document.body,
  };
  new Drift(document.querySelector('.magnify-on-hover .primary-product-image'), driftOptions);
}


if ($('.click-to-zoom').length) {
  var luminousOptions = {
    // Prefix for generated element class names (e.g. `my-ns` will
    // result in classes such as `my-ns-lightbox`. Default `lum-`
    // prefixed classes will always be added as well.
    namespace: null,
    // Which attribute to pull the lightbox image source from.
    sourceAttribute: "href",
    // Captions can be a literal string, or a function that receives the Luminous instance's trigger element as an argument and returns a string. Supports HTML, so use caution when dealing with user input.
    caption: null,
    // The event to listen to on the _trigger_ element: triggers opening.
    openTrigger: "click",
    // The event to listen to on the _lightbox_ element: triggers closing.
    closeTrigger: "click",
    // Allow closing by pressing escape.
    closeWithEscape: true,
    // Automatically close when the page is scrolled.
    closeOnScroll: false,
    // Disable close button
    showCloseButton: true,
    // A node to append the lightbox element to.
    appendToNode: document.body,
    // A selector defining what to append the lightbox element to.
    // This will take precedence over `appendToNode`.
    appendToSelector: null,
    // If present (and a function), this will be called
    // whenever the lightbox is opened.
    onOpen: null,
    // If present (and a function), this will be called
    // whenever the lightbox is closed.
    onClose: null,
    // When true, adds the `imgix-fluid` class to the `img`
    // inside the lightbox. See https://github.com/imgix/imgix.js
    // for more information.
    includeImgixJSClass: false,
    // Add base styles to the page. See the "Theming"
    // section of README.md for more information.
    injectBaseStyles: true
  };
  var galleryOpts = {
    // Whether pressing the arrow keys should move to the next/previous slide.
    arrowNavigation: true
  };
  if ($('.product-image-link').length > 1) {
    new LuminousGallery(document.querySelectorAll(".primary-product-image-link"), galleryOpts, luminousOptions);
  }
  else {
    new Luminous(document.querySelector(".product-image-link"), luminousOptions);
  }
}

$('.secondary-product-image-link').click(function(e) {
  console.log('ya');

  var large_image = $(this).attr('href');
  var normal_image = $(this);


  $('.primary-product-image').attr('src',large_image);

  //$('.secondary-product-image-link').removeClass('active');
  //$(this).addClass('active');

  return false;
});

$('.product-form').submit(function(e) {
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
      addButton.blur();
      Cart.addItem(itemID, quantity, function(cart) {
        setTimeout(function() {
          updateElement.html(addingText);
          setTimeout(function() {
            updateElement.html(addedText);
            $('.product-form-cart-link-container').slideDown('fast');
            updateCart(cart);
            addButton.removeClass('adding');
            setTimeout(function() {
              updateElement.html(addText);

            }, 900)
          }, 600);
        }, 300);
      });
    }
  }
});



$('.description-inventory-tab').click(function(e) {
  e.preventDefault();
  var tab_name = $(this).data('tab');
  $('.description-inventory-tab').removeClass('active-tab')
  $(this).addClass('active-tab');
  $('.product-detail-tab-section').hide()
  $('.' + tab_name).show();
})










$(document).ready(function() {
  if ($('.all-similar-products').length) {
    var num_products = $('.all-similar-products .product-list-item').length;
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