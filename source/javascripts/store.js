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



$('.open-menu').click(function(e) {
  e.preventDefault();
  if ($(window).width() > 767) {
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
    $(this).find('.scroll-more').css('background','linear-gradient(0deg, '+themeOptions.primaryGradientColor+', transparent)');
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
function setDocHeight() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
};

addEventListener('resize', setDocHeight)
addEventListener('orientationchange', setDocHeight)

setDocHeight();


/*"background-image": "linear-gradient(0deg, "+hexToRGB(primaryGradient,'.8')+" 0%,"+ primaryGradient +" 100%)",*/