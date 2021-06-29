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
  .on( 'click', '.cart-item-remove', function(e) {
    e.preventDefault();
    item_id = $(this).parent().data("item-id");
    new_val = 0;
    Cart.updateItem(item_id, new_val, function(cart) {
      processUpdate('', item_id, '', cart);
    });
  })
  .on('change','.option-quantity', function(e) {
    var item_id = $(this).parent().data("item-id");
    var new_val = $(this).val();
    var input = $(this);
    Cart.updateItem(item_id, new_val, function(cart) {
      processUpdate(input, item_id, new_val, cart);
    });
  })
  .on('keydown','.option-quantity', function(e) {
    if (e.keyCode == 13) {
      item_id = $(this).closest('.cart-item').data("item-id");
      new_val = $(this).val();
      input = $(this);
      Cart.updateItem(item_id, new_val, function(cart) {
        processUpdate(input, item_id, new_val, cart);
      });
      e.preventDefault();
      return false;
    }
  })

var updateCart = function(cart) {
  var sub_total = Format.money(cart.total, true, true);
  var item_count = cart.item_count;
  $('.header-cart-total').html(sub_total);
  $('.cart-subtotal-amount').html(sub_total);
  $('.header-cart-count').html(item_count);
  if ($('.sidebar-cart-count').length) {
    $('.sidebar-cart-count').html(item_count);
    $('.sidebar-cart-total').html(sub_total);
  }
}

var processUpdate = function(input, item_id, new_val, cart) {
  var sub_total = Format.money(cart.total, true, true);
  var item_count = cart.item_count;

  $('.header-cart-total').html(sub_total);
  $('.cart-subtotal-amount').html(sub_total);
  $('.header-cart-count').html(item_count);
  if ($('.sidebar-cart-count').length) {
    $('.sidebar-cart-count').html(item_count);
    $('.sidebar-cart-total').html(sub_total);
  }
  if (item_count == 0) {
    $('.cart-form').slideUp('fast',function() {
      $('.cart-container').addClass('empty-cart');
      $("html, body").animate({ scrollTop: 0 }, "fast");
    });
  }
  else {
    $('.errors').hide();
    if (input) {
      input.val(new_val);
    }
  }
  if (new_val > 0) {
    for (itemIndex = 0; itemIndex < cart.items.length; itemIndex++) {
      if (cart.items[itemIndex].id == item_id) {
        item_price = cart.items[itemIndex].price;
        formatted_item_price = Format.money(item_price, true, true);
        $('.cart-item[data-item-id="'+item_id+'"]').find('.cart-item-details-price').html(formatted_item_price)
      }
    }

  }
  else {
    $('.cart-item[data-item-id="'+item_id+'"]').slideUp('fast');
  }
  return false;
}