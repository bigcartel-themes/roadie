var inPreview = (/\/admin\/design/.test(top.location.pathname));

$('.announcement-message-close').click(function(e) {
  $('.announcement-message').slideUp('fast', function() {
    $('.announcement-message').removeClass('visible');
    setCookie('hide-announcement-message',hashedMessage,7);
  });
})

$('.contact-form input[type="text"], .contact-form textarea').addClass('shrink-label');

$('body').on('change', ".shrink-label", function(){
  $(this).parents('.form-group').addClass('focused');
});

$('.contact-form input[type="text"], .contact-form textarea').focus(function(){
  $(this).parents('.form-group').addClass('focused');
});

if (!inPreview) {
  $('.product-sort-options-select').change(function() {
    window.location = $(this).find(":selected").data('url');
  })
}

$('body').on('blur', ".shrink-label", function(){
  inValue = $(this).val();
  if (!inValue) {
    $(this).removeClass('filled');
    $(this).parents('.form-group').removeClass('focused');
  }
  else {
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


$('.sidebar-nav .toggle-nav').click(function(e) {
  e.preventDefault();
  var sidebar_link = $(this).parent().parent().find('.sidebar-nav-links');
  var display = sidebar_link.css('display');
  var nav_container = sidebar_link.parent();
  var nav_type = nav_container.data('type');
  if (display == 'block') {
    sidebar_link.slideUp('fast', function() {
      nav_container.addClass('hidden-nav');
    });
    localStorage.setItem('show-sidebar-'+nav_type,'hidden');
  }
  else {
    sidebar_link.slideDown('fast', function() {
      nav_container.removeClass('hidden-nav');
    });
    localStorage.setItem('show-sidebar-'+nav_type,'visible');
  }
})

function setStyles() {
  var sidebarState = localStorage.getItem('sidebar');

  if (sidebarState == 'hidden') {
    $('.has-sidebar .sidebar').addClass('hidden');
    $('body').removeClass('sidebar-visible');
  }
  else {
    $('body').addClass('sidebar-visible');
  }
}
function populateStorage() {
  localStorage.setItem('sidebar','visible');
  setStyles();
}

$('.open-menu').click(function(e) {
  e.preventDefault();
  win_width = window.innerWidth;
  if (win_width > 767) {
    if (localStorage.getItem('sidebar') == 'visible') {
      $('.has-sidebar .sidebar').addClass('hidden');
      $('body').removeClass('sidebar-visible');
      localStorage.setItem('sidebar','hidden');
    }
    else {
      $('.has-sidebar .sidebar').removeClass('hidden');
      $('body').addClass('sidebar-visible');
      localStorage.setItem('sidebar','visible');
    }
    $(window).trigger('resize')
  }
  else {
    $('.sidebar').toggleClass('visible-mobile');
    $('body').toggleClass('sidebar-visible-mobile');
  }
  toggleMobileCart(win_width);
});

/* Gradients */
if ($('.background-image-overlay-gradient_overlay').length) {
  (function( $ ) {
    $.fn.drawGradient = function() {
      return this.each(function() {
        var element = $(this);
        var primaryGradient = themeOptions.primaryGradientColor;
        element.css(
          {
          "background-image": "linear-gradient(180deg, "+hexToRGB(primaryGradient,'0')+" 0%,"+ primaryGradient +" 100%)",
          "background-color": hexToRGB(primaryGradient,".7")
        });
      });
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

$('.overflow-scroll').each(function() {
  is_overflow = checkOverflow($(this).find('.sidebar-nav-links')[0])
  if (is_overflow) {
    $(this).find('.scroll-more').show();
    $(this).find('.sidebar-nav-links').css('padding-bottom','24px')
    first_color = hexToRGB(themeOptions.primaryGradientColor,'0.25')
    second_color = hexToRGB(themeOptions.primaryGradientColor,'1')
    $(this).find('.scroll-more').css('background-image','linear-gradient(to bottom, '+first_color+', '+second_color+')');
  }
  else {
    $(this).find('.scroll-more').hide();
  }
})

function checkOverflow(el) {
  var curOverflow = el.style.overflow;
  if ( !curOverflow || curOverflow === "visible" )
    el.style.overflow = "hidden";
  var isOverflowing = el.clientWidth < el.scrollWidth
    || el.clientHeight < el.scrollHeight;
  el.style.overflow = curOverflow;
  return isOverflowing;
}
function setDocHeight(win_width, win_height) {
  document.documentElement.style.setProperty('--vh', win_height/100 + "px");
}
function toggleMobileCart(win_width) {

  if (win_width < 961 && $('body').hasClass('sidebar-visible')) {
    setCartClass('enable');
  }
  else if (win_width < 768) {
    setCartClass('enable');
  }
  else {
    if ($('.cart-items').hasClass('mobile-cart')) {
      setCartClass('disable');
    }
  }
}
function setStyles() {
  var sidebarState = localStorage.getItem('sidebar');

  if (sidebarState == 'hidden') {
    $('.has-sidebar .sidebar').addClass('hidden');
    $('body').removeClass('sidebar-visible');
  }
  else {
    $('body').addClass('sidebar-visible');
  }
}
function populateStorage() {
  localStorage.setItem('sidebar','visible');
  setStyles();
}

function setCartClass(type) {
  if (type == 'enable') {
    if (!$('.cart-items').hasClass('mobile-cart')) {
      $('.cart-items').addClass('mobile-cart');
    }
  }
  else {
    if ($('.cart-items').hasClass('mobile-cart')) {
      $('.cart-items').removeClass('mobile-cart');
    }
  }
}

window.addEventListener('resize',function(){
  win_width = window.innerWidth;
  win_height = window.innerHeight;
  setDocHeight(win_width, win_height);
  toggleMobileCart(win_width);
});
window.addEventListener('orientationchange',function(){
  win_width = window.innerWidth;
  win_height = window.innerHeight;
  setDocHeight(win_width, win_height);
  toggleMobileCart(win_width);
});
$(document).ready(function() {
  win_width = window.innerWidth;
  win_height = window.innerHeight;
  setDocHeight(win_width, win_height);
  toggleMobileCart(win_width);
});

