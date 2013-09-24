soysauce.init = function(selector, manual) {
  var set;
  var numItems = 0;
  var ret = false;
  var fastclickSelectors = "";
  
  fastclickSelectors = "[data-ss-widget='toggler'] > [data-ss-component='button']";
  fastclickSelectors += ", [data-ss-component='button'][data-ss-toggler-id]";
  fastclickSelectors += ", [data-ss-widget='carousel'] [data-ss-component='button']";
  fastclickSelectors += ", [data-ss-widget='carousel'] [data-ss-component='dots']";
  fastclickSelectors += ", [data-ss-utility='overlay'] [data-ss-component='close']";
  
  $(fastclickSelectors).each(function() {
    try {
      soysauce.vars.fastclick.push(FastClick.attach(this));
    }
    catch(e) {
      console.warn("Soysauce: Could not attach Fastclick listener on soysauce component. " + e.message);
    }
  });
  
  if (!selector) {
    set = $("[data-ss-widget]:not([data-ss-id]), [data-ss-component='button'][data-ss-toggler-id]");
  }
  else {
    set = $(selector);
  }
  
  if ((!$(selector) && !set) || $(selector).attr("data-ss-id") !== undefined) return ret;
  
  numItems = set.length;
  
  set.each(function(i) {
    var $this = $(this);
    var type = $(this).attr("data-ss-widget");
    var widget;
    var orphan = false;
    
    if (!type && $this.attr("data-ss-toggler-id") !== undefined) {
      type = "toggler";
      orphan = true;
    }
    
    if (!manual && /manual/.test($this.attr("data-ss-init"))) {
      return;
    }
    
    $this.attr("data-ss-id", ++soysauce.vars.idCount);
    
    switch (type) {
      case "toggler":
        widget = soysauce.togglers.init(this, orphan);
        break;
      case "carousel":
        widget = soysauce.carousels.init(this);
        break;
      case "lazyloader":
        widget = soysauce.lazyloader.init(this);
        break;
      case "autofill-zip":
        widget = soysauce.autofillZip.init(this);
        break;
      case "autodetect-cc":
        widget = soysauce.autodetectCC.init(this);
        break;
      case "autosuggest":
        widget = soysauce.autosuggest.init(this);
        break;
      case "input-clear":
        widget = soysauce.inputClear.init(this);
        break;
    }

    if (widget !== undefined) {
      widget.type = type;
      widget.id = soysauce.vars.idCount;
      soysauce.widgets.push(widget);
      ret = true;
      if ($this.attr("data-ss-defer") !== undefined) {
        widget.defer = true;
      }
      else {
        $this.imagesLoaded(function() {
          widget.initialized = true;
          $this.trigger("SSWidgetReady");
        });
      }
    }
    else {
      $this.removeAttr("data-ss-id");
      --soysauce.vars.idCount;
    }
  });
  
  return ret;
}
