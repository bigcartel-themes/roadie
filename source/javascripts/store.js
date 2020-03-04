
var inPreview = (/\/admin\/design/.test(top.location.pathname));
var window_width = $(window).width();



$('.contact-form input, .contact-form textarea').addClass('shrink-label');

$('.shrink-label').change(function(){
  $(this).parents('.form-group').addClass('focused');
});
$('.contact-form .shrink-label').focus(function(){
  $(this).parents('.form-group').addClass('focused');
});

$('.product-sort-options-select').change(function() {
  window.location = $(this).find(":selected").data('url');
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



$('.under-header .nav-section').hover(function(e) {
  $('.sidebar-nav-links').removeClass('expanded');
  $(this).find('.sidebar-nav-links').toggleClass('expanded');
})




$('.open-menu').click(function(e) {
  e.preventDefault();
  if (window_width > 767) {
    if (localStorage.getItem('sidebar') == 'visible') {
      $('.has-sidebar .sidebar').addClass('hidden');
      localStorage.setItem('sidebar','hidden');
    }
    else {
      $('.has-sidebar .sidebar').removeClass('hidden');
      localStorage.setItem('sidebar','visible');
    }
    $(window).trigger('resize')
  }
  else {
    $('.sidebar').toggle();
  }

});


if ($('body').hasClass('has-sidebar')) {
  if (window_width > 767) {
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

/* Gradients */
if ($('.background-image-overlay-gradient_overlay').length) {
  (function( $ ) {
    $.fn.drawGradient = function() {
      this.filter( ".background-image-overlay-gradient_overlay" ).each(function() {
        var element = $(this);
        var primaryGradient = themeOptions.primaryGradientColor;
        element.css(
          {
          "background-image": "linear-gradient(180deg, "+hexToRGB(primaryGradient,'0')+" 0%,"+ primaryGradient +" 100%)",
          "background-color": hexToRGB(primaryGradient,".7")
        });
      });
      return this;
    };
  }( jQuery ));

  $('.background-image-overlay-gradient_overlay').drawGradient();
}

function hexToRGB(hex,opacity) {
  let r = 0, g = 0, b = 0;
  // 3 digits
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  // 6 digits
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return "rgba("+ +r + "," + +g + "," + +b + ","+opacity+")";
}


$('.sidebar-nav .toggle-nav').click(function(e) {
  e.preventDefault();
  $(this).parent().parent().find('.sidebar-nav-links').slideToggle('fast', function() {
    $(this).parent().toggleClass('hidden-nav');
  });
})


$('body')
  .on( 'click','.qty-button', function(e) {
    e.preventDefault();
    var $t = $(this)
    , input = $(this).parent().find('input')
    , val = parseInt(input.val())
    , valMin = 1
    , item_id = $(this).parent().data("item-id");
    if (isNaN(val) || val < valMin) {
      var new_val = valMin;
    }
    if ($t.data('func') == 'plus') {
      var new_val = val + 1;
    }
    else {
      if (val > valMin) {
        var new_val = val - 1;
      }
    }
    if (new_val > 0) {
      Cart.updateItem(item_id, new_val, function(cart) {
        processUpdate(input, item_id, new_val, cart);
      });
    }
    else {
      Cart.removeItem(item_id, function(cart) {
        processUpdate(input, item_id, 0, cart);
      });
    }
  })
  .on( 'blur','.option-quantity', function(e) {
    var item_id = $(this).parent().data("item-id");
    var new_val = $(this).val();
    var input = $(this);
    Cart.updateItem(item_id, new_val, function(cart) {
      processUpdate(input, item_id, new_val, cart);
    });
  })

var updateCart = function(cart) {
  var sub_total = Format.money(cart.total, true, true);
  var item_count = cart.item_count;
  $('.header-cart-total').html(sub_total);
  $('.cart-subtotal-amount').html(sub_total);
  $('.header-cart-count').html(item_count);
}

var processUpdate = function(input, item_id, new_val, cart) {
  var sub_total = Format.money(cart.total, true, true);
  var item_count = cart.item_count;
  $('.header-cart-total').html(sub_total);
  $('.cart-subtotal-amount').html(sub_total);
  $('.header-cart-count').html(item_count);
  if (item_count == 0) {
    $('.cart-form').slideUp('fast',function() {
      $("html, body").animate({ scrollTop: 0 }, "fast");
    });
  }
  else {
    $('.errors').hide();
    input.val(new_val);
  }
  if (new_val > 0) {

  }
  else {
    $('.cart-item[data-item-id="'+item_id+'"]').slideUp('fast');
  }
  return false;
}