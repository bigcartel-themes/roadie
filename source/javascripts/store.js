
var inPreview = (/\/admin\/design/.test(top.location.pathname));


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
    if (show_sold_out_product_options === 'false') {
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




$('.contact-form input, .contact-form textarea').addClass('shrink-label');

$('.shrink-label').change(function(){
  $(this).parents('.form-group').addClass('focused');
});
$('.contact-form .shrink-label').focus(function(){
  $(this).parents('.form-group').addClass('focused');
});

$('.product-sort-options-select').change(function() {
  window.location = '/products?sort=' + $(this).val();
})

$('.shrink-label').blur(function(){
  var inputValue = $(this).val();
  if (inputValue.length == 0) {
    $(this).removeClass('filled');
    $(this).parents('.form-group').removeClass('focused');
  } else {
    $(this).addClass('filled');
  }
})

$(document).ready(function() {
  if ($('.shrink-label').length) {
    $('.shrink-label').each(function(){
      var inputValue = $(this).val();
      if (inputValue) {
        $(this).addClass('filled');
        $(this).parents('.form-group').addClass('focused');
      }
    });
    autoExpand($('textarea')[0]);
  }
});
document.addEventListener('input', function (event) {
  if (event.target.tagName.toLowerCase() !== 'textarea') return;
  autoExpand(event.target);
}, false);



$('.open-menu').click(function(e) {
  e.preventDefault();
  if (localStorage.getItem('sidebar') == 'visible') {
    $('.sidebar').hide();
    localStorage.setItem('sidebar','hidden');
  }
  else {
    $('.sidebar').show();
    localStorage.setItem('sidebar','visible');
  }
  //$('.sidebar').toggle();
});

$('.under-header .nav-section').hover(function(e) {
  $('.sidebar-nav-links').removeClass('expanded');
  $(this).find('.sidebar-nav-links').toggleClass('expanded');
})

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



var options = {
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
  handleTouch: true,
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

$(function() {
  $('.product-images img').each(function(i, el) {
    new Drift(el, options);
  });
});

if ($('body').hasClass('has-sidebar')) {
  if(!localStorage.getItem('sidebar')) {
    populateStorage();
  } else {
    setStyles();
  }
  function setStyles() {
    var sidebarState = localStorage.getItem('sidebar');

    if (sidebarState == 'hidden') {
      $('.has-sidebar .sidebar').addClass('hidden');
    }
  }
  function populateStorage() {
    localStorage.setItem('sidebar','visible');
    setStyles();
  }
}


if ($('.announcement-message-text').length) {
  var announcementMessage = $('.announcement-message-text').html();
  var hashedMessage = announcementMessage.hashCode();
  var cookieValue = getCookie('hide-announcement-message');
  if (cookieValue) {
    if (cookieValue != hashedMessage) {
      $('body').addClass('has-announcement-message');
    }
  }
  else {
    $('body').addClass('has-announcement-message');
  }
}

$('.announcement-message-close').click(function(e) {
  $('.announcement-message').slideUp('fast', function() {
    $('body').removeClass('has-announcement-message');
    setCookie('hide-announcement-message',hashedMessage,7);
  });
})


$('.description-inventory-tab').click(function(e) {
  e.preventDefault();
  var tab_name = $(this).data('tab');
  $('.description-inventory-tab').removeClass('active-tab')
  $(this).addClass('active-tab');
  $('.product-detail-tab-section').hide()
  $('.' + tab_name).show();
})



