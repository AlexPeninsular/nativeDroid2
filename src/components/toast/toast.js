
// nd2Toast
(function($) {
    $.nd2Toast = function(options) {

        var _self = this;

        _self.defaults = {
            message: "",
            action: {
                link: null,
                title: null,
                fn: null,
                color: "lime"
            },
            ttl: 3000
        };

        _self.isClosed = false;

        _self.toastId = null;

        _self.options = $.extend(_self.defaults, options);

        _self.getToast = function() {
            return $("body").find("#" + _self.toastId);
        };

        _self.hasPendingToasts = function() {
            return ($("body").find(".nd2-toast").length > 0);
        };

        _self.getOtherToast = function() {
            return $("body").find(".nd2-toast");
        };

        _self.hasAction = function() {
            return (_self.options.action.title &&
            (_self.options.action.link || _self.options.action.fn));
        };

        _self.getAction = function() {
            return (_self.hasAction()) ? "<span class='nd2-toast-action'><a href='#toastAction' class='ui-btn ui-btn-inline clr-btn-accent-" + _self.options.action.color + "'>" + _self.options.action.title + "</a></span>" : "";
        };

        _self.getMessage = function() {
            return "<span class='nd2-toast-message'>" + _self.options.message + "</span>";
        };

        _self.generateId = function() {
            _self.toastId = "toast" + Math.random().toString(16).slice(2);
        };

        _self.create = function() {

            if (!_self.hasPendingToasts()) {

                _self.generateId();

                var hasActionClass = (!_self.hasAction()) ? "no-action" : "";
                var toast = "<div id='" + _self.toastId + "' class='nd2-toast nd2-toast-off " + hasActionClass + "'><div class='nd2-toast-wrapper'>" + _self.getMessage() + _self.getAction() + "</div></div>";

                $("body").append(toast);

                window.setTimeout(function() {
                    _self.bindAction();
                    _self.show();
                }, 50);

            } else {
                window.setTimeout(function() {
                    _self.abortOtherToasts();
                }, 100);
            }
        };

        _self.bindAction = function() {
            if (_self.hasAction()) {

                var toast = _self.getToast();
                var hasLink = (_self.options.action.link);
                var hasEvent = (_self.options.action.fn && typeof _self.options.action.fn === "function");

                toast.find(".nd2-toast-action a").on("click", function(e) {
                    if (hasEvent) {
                        _self.options.action.fn(e);
                    }
                    if (hasLink) {
                        $("body").pagecontainer("change", _self.options.action.link);
                    }
                    _self.hide();
                });

            }
        };

        _self.show = function() {
            var toast = _self.getToast();
            toast.removeClass("nd2-toast-off");

            $("body").addClass("nd2-toast-open");

            window.setTimeout(function() {
                _self.hide();
            }, _self.options.ttl);

        };

        _self.hide = function() {
            if (_self.isClosed) return;

            _self.isClosed = true;

            var toast = _self.getToast();
            if (toast.length > 0) {

                toast.addClass("nd2-toast-off");

                if (_self.hasPendingToasts()) {
                    $("body").removeClass("nd2-toast-open");
                }

                window.setTimeout(function() {
                    _self.destroyToast();
                }, 400);
            }

        };

        _self.destroyToast = function() {
            var toast = _self.getToast();
            toast.remove();
        };

        _self.abortOtherToasts = function() {

            if (_self.hasPendingToasts()) {

                var toast = _self.getOtherToast();
                if (toast) {

                    toast.addClass("nd2-toast-off");

                    $("body").removeClass("nd2-toast-open");

                    window.setTimeout(function() {

                        toast.remove();
                        _self.create();

                    }, 400);

                }

            }

        };

        _self.create();

    };

    $("body").on("click", "[data-role='toast']", function(e) {
        e.preventDefault();
        var options = {
            action: {}
        };

        if ($(this).data('toast-message')) {
            options.message = $(this).data('toast-message');
        }
        if ($(this).data('toast-ttl')) {
            options.ttl = $(this).data('toast-ttl');
        }
        if ($(this).data('toast-action-title')) {
            options.action.title = $(this).data('toast-action-title');
        }
        if ($(this).data('toast-action-link')) {
            options.action.link = $(this).data('toast-action-link');
        }
        if ($(this).data('toast-action-color')) {
            options.action.color = $(this).data('toast-action-color');
        }

        new $.nd2Toast(options);

    });

}($));

