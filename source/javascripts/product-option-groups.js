function processProduct(product) {
  if (product.has_option_groups) {
    setInitialProductOptionStatuses(product);
  }
  if ($('.product-option-select').length) {
    if (themeOptions.showSoldOutOptions === false) {
      $('option[disabled-type="sold-out"]').wrap('<span>');
    }
  }
  $('body').on('click', ".reset-selection-button", function(e){
    active_form = $(this).closest('form');
    disableAddButton(active_form,"add-to-cart");
    active_form.find('#option').val(0);
    $(this).hide();
    $(".product-option-group option").each(function(index,element) {
      if (element.value > 0) {
        enableSelectOption($(element));
      }
    });
    active_form.find('.shrink-option-label').removeClass('filled');
    active_form.find('.product-option-select-container').removeClass('focused');
    setInitialProductOptionStatuses(product);
  })
}
function createCartesianProductOptions(product) {
  product_option_groups = [];
  for (ogIndex = 0; ogIndex < product.option_groups.length; ogIndex++) {
    product_option_group_group_values = [];
    for (ogvIndex = 0; ogvIndex < product.option_groups[ogIndex].values.length; ogvIndex++) {
      product_option_group_group_values.push(product.option_groups[ogIndex].values[ogvIndex].id);
    }
    product_option_groups.push(product_option_group_group_values);
  }
  var cartesian_options = cartesianProduct(product_option_groups);
  return cartesian_options;
}

function setInitialProductOptionStatuses(product) {
  product_option_group_values = [];
  for (ogIndex = 0; ogIndex < product.option_groups.length; ogIndex++) {
    pog_id = product.option_groups[ogIndex].id;
    pog_select_element = "#option_group_" + pog_id
    $('body').on('change', pog_select_element, function(e) {
      active_form = $(this).closest('form');
      active_form.find('#option').val(0);
      disableAddButton(active_form,"add-to-cart");
      processAvailableDropdownOptions(product, $(this));
    });
    for (ogvIndex = 0; ogvIndex < product.option_groups[ogIndex].values.length; ogvIndex++) {
      product_option_group_values.push(product.option_groups[ogIndex].values[ogvIndex].id);
    }
  }
  cartesian_options = createCartesianProductOptions(product);
  for (pogv = 0; pogv < product_option_group_values.length; pogv++) {
    var option_group_value_id = product_option_group_values[pogv];
    var product_iterator = 0;
    var num_sold_out = 0;
    var num_options = 0;
    for (co = 0; co < cartesian_options.length; co++) {
      if (cartesian_options[co].includes(option_group_value_id)) {
        product_option = findProductOptionByValueArray(product.options, cartesian_options[co]);
        if (product_option) {
          num_options++;
          if (product_option.sold_out) {
            num_sold_out++;
          }
        }
        product_iterator++;
      }
    }
    dropdown_select = $(".product-option-group option[value='" + option_group_value_id + "']");
    if (num_options === 0 || product_iterator === num_sold_out || num_options === num_sold_out) {
      if (num_options === 0) {
        disable_type = "unavailable";
      }
      if (product_iterator === num_sold_out || num_options === num_sold_out) {
        disable_type = "sold-out";
      }
      disableSelectOption(dropdown_select,disable_type);
    }
  }
}

function processAvailableDropdownOptions(product, changed_dropdown) {
  active_form = changed_dropdown.closest('form');
  selected_values = getSelectedValues(active_form);
  num_selected = selected_values.count(function (item) {
    return item > 0;
  });
  allSelected = selected_values.every(isGreaterThanZero);
  num_option_groups = product.option_groups.length;
  changed_value = parseInt(changed_dropdown.val());
  selected_value = [];
  selected_value.push(changed_value);
  this_group_id = changed_dropdown.attr("data-group-id");
  active_form.find(".product-option-group").not(changed_dropdown).find('option').each(function(index,element) {
    if (element.value > 0) {
      enableSelectOption($(element));
    }
  });
  cartesian_options = createCartesianProductOptions(product);

  if (num_selected === 1 && num_option_groups > 1) {
    for (ogIndex = 0; ogIndex < product.option_groups.length; ogIndex++) {
      var option_group = product.option_groups[ogIndex];
      if (option_group.id != this_group_id) {
        for (ogvIndex = 0; ogvIndex < option_group.values.length; ogvIndex++) {
          var option_group_value = option_group.values[ogvIndex];
          option_group_value_array = [];
          option_group_value_array.push(changed_value);
          option_group_value_array.push(parseInt(option_group_value.id));
          var product_iterator = 0;
          var num_sold_out = 0;
          var num_options = 0;
          for (co = 0; co < cartesian_options.length; co++) {
            if (arrayContainsArray(cartesian_options[co], option_group_value_array)) {
              product_option = findProductOptionByValueArray(product.options, cartesian_options[co]);
              if (product_option) {
                num_options++;
                if (product_option.sold_out) {
                  num_sold_out++;
                }
              }
              product_iterator++;
            }
          }
          dropdown_select = active_form.find(".product-option-group option[value='" + option_group_value.id + "']");
          if (num_options === 0 || product_iterator === num_sold_out || num_options === num_sold_out) {
            if (num_options === 0) {
              disable_type = "unavailable";
            }
            if (product_iterator === num_sold_out || num_options === num_sold_out) {
              disable_type = "sold-out";
            }
            disableSelectOption(dropdown_select,disable_type);
          }
        }
      }
    }
  }
  if (num_selected === 2 && num_option_groups === 3) {
    active_form.find(".product-option-group").each(function(i, object) {
      if (object.value == 0) {
        unselected_group_id = parseInt($(object).attr("data-group-id"));
      }
    });
    for (ogIndex = 0; ogIndex < product.option_groups.length; ogIndex++) {
      option_group = product.option_groups[ogIndex];
      if (option_group.id != this_group_id) {
        for (ogvIndex = 0; ogvIndex < option_group.values.length; ogvIndex++) {
          option_group_value = option_group.values[ogvIndex];
          option_group_value_array = [];
          option_group_value_array.push(changed_value);
          option_group_value_array.push(parseInt(option_group_value.id));
          var product_iterator = 0;
          var num_sold_out = 0;
          var num_options = 0;
          for (co = 0; co < cartesian_options.length; co++) {
            if (arrayContainsArray(cartesian_options[co], option_group_value_array)) {
              product_option = findProductOptionByValueArray(product.options, cartesian_options[co]);
              if (product_option) {
                num_options++;
                if (product_option.sold_out) {
                  num_sold_out++;
                }
              }
              product_iterator++;
            }
          }
          if (option_group.id === unselected_group_id) {
            option_group_value_array = [];
            option_group_value_array.push(parseInt(option_group_value.id));
            for (svIndex = 0; svIndex < selected_values.length; svIndex++) {
              if (selected_values[svIndex] > 0) {
                option_group_value_array.push(selected_values[svIndex]);
              }
            }
            product_option = findProductOptionByValueArray(product.options, option_group_value_array);
            dropdown_select = active_form.find(".product-option-group option[value='" + option_group_value.id + "']");
            if (product_option) {
              if (product_option.sold_out) {
                disableSelectOption(dropdown_select,"sold-out");
              }
            }
            else {
              disableSelectOption(dropdown_select,"unavailable");
            }
          }
          dropdown_select = active_form.find(".product-option-group option[value='" + option_group_value.id + "']");
          if (num_options === 0 || product_iterator === num_sold_out || num_options === num_sold_out) {
            if (num_options === 0) {
              disable_type = "unavailable";
            }
            if (product_iterator === num_sold_out || num_options === num_sold_out) {
              disable_type = "sold-out";
            }
            disableSelectOption(dropdown_select,disable_type);
          }
        }
      }
    }
  }
  if (num_selected > 1 && allSelected) {
    active_form.find(".product-option-group").not(changed_dropdown).each(function(index, dropdown) {
      dropdown = $(dropdown);
      dropdown.find('option').each(function(idx, option) {
        is_selected = $(option).is(":selected");
        if (!is_selected) {
          if (option.value > 0) {
            option_group_value_array = [];
            option_group_value_array.push(parseInt(option.value));
            active_form.find(".product-option-group").not(dropdown).each(function(index, secondary_dropdown) {
              option_group_value_array.push(parseInt(secondary_dropdown.value));
            });
            product_option = findProductOptionByValueArray(product.options, option_group_value_array);
            for (i = 0; i < option_group_value_array.length; i++) {
              dropdown_select = active_form.find(".product-option-group option[value='" + option_group_value_array[i] + "']").not(":selected");
              if (dropdown_select) {
                if (product_option) {
                  if (product_option.sold_out) {
                    disableSelectOption(dropdown_select,"sold-out");
                  }
                  else {
                    enableSelectOption(dropdown_select);
                  }
                }
                else {
                  disableSelectOption(dropdown_select,"unavailable");
                }
              }
            }
          }
        }
      });
    });
  }
  if (allSelected) {

    product_option = findProductOptionByValueArray(product.options, selected_values);
    if (product_option) {
      if (!product_option.sold_out && product_option.id > 0) {
        active_form.find('#option').val(product_option.id);
        enableAddButton(active_form,product_option.price);
        if (num_option_groups > 1) {
          active_form.find('.reset-selection-button').fadeIn('fast');
        }
      }
      else {
        disableAddButton(active_form,"sold-out");
      }
    }
    else {
      disableAddButton(active_form,"sold-out");
    }
  }
}

function findProductOptionByValueArray(product_options, value_array) {
  for (var productOptionsIndex = 0; productOptionsIndex < product_options.length; productOptionsIndex ++) {
    option_group_values = product_options[productOptionsIndex].option_group_values;
    option_ids = [];
    option_group_values.forEach(function(option_group_value) {
      option_ids.push(option_group_value.id);
    });
    if (arrayContainsArray(option_ids, value_array)) {
      return product_options[productOptionsIndex];
    }
  };
}

function getSelectedValues(active_form) {
  selected_values = [];
  active_form.find(".product-option-group").each(function(i, object) {
    selected_values.push(parseInt(object.value));
  });
  return selected_values;

};
