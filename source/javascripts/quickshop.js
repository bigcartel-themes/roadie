
$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    closeQuickShop()
  }
});

$('body').on('click', ".open-quickview", function(e){
  e.preventDefault();
  var permalink = $(this).data('permalink');

  this_product = $(this).closest('.product-list-item')

  Product.find(permalink, function(product) {
    processProduct(product);
    loadProductContent(product, this_product);
  });
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

function closeQuickShop() {
  $('.qs-modal').removeClass('opened');
  $('body').removeClass('no-scroll');
}
function openQuickShop() {
  $('body').addClass('no-scroll');
  $('.qs-modal').addClass('opened');
}

function trapFocus(element, namespace) {
    var focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'),
        firstFocusableEl = focusableEls[0];
        lastFocusableEl = focusableEls[focusableEls.length - 1];
        KEYCODE_TAB = 9;

    element.addEventListener('keydown', function(e) {
        var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (!isTabPressed) {
            return;
        }

        if ( e.shiftKey ) /* shift + tab */ {
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else /* tab */ {
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }

    });
}

$(document).mouseup(function (e) {
  var container = $(".qs-modal-content");
  if (!container.is(e.target) && container.has(e.target).length === 0){
    closeQuickShop()
  }
});

function loadProductContent(product) {
  var $container = $('.qs-product-details');

  var this_product = $(".open-quickview[data-permalink='" + product.permalink + "']").closest('.product-list-item');

  populatePreviousAndNext(this_product);

  $.get("/product/" + product.permalink + "?" + $.now(), function(response, status, xhr) {
    // error checking

    $container.html($(response).find(".main")); // Any <script> tags in the response string will execute
    // post processing

    openQuickShop();

  });
}

function populatePreviousAndNext(this_product) {

  previous_product = this_product.prev('.product-list-item');
  next_product = this_product.next('.product-list-item');

  if (previous_product) {
    permalink = previous_product.find('.open-quickview').data('permalink');
    $('.qs-nav-previous').data('permalink',permalink)
  }
  else {
    $('.qs-nav-previous').data('permalink','')
  }

  if (next_product) {
    permalink = next_product.find('.open-quickview').data('permalink');
    $('.qs-nav-next').data('permalink',permalink)
  }
  else {
    $('.qs-nav-next').data('permalink','')
  }
}