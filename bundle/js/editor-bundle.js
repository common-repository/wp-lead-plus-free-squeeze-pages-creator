/*
 * Toastr
 * Copyright 2012-2015
 * Authors: John Papa, Hans Fjällemark, and Tim Ferrell.
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * ARIA Support: Greta Krafsig
 *
 * Project: https://github.com/CodeSeven/toastr
 */
/* global define */
(function (define) {
    define(['jquery'], function ($) {
        return (function () {
            var $container;
            var listener;
            var toastId = 0;
            var toastType = {
                error: 'error',
                info: 'info',
                success: 'success',
                warning: 'warning'
            };

            var toastr = {
                clear: clear,
                remove: remove,
                error: error,
                getContainer: getContainer,
                info: info,
                options: {},
                subscribe: subscribe,
                success: success,
                version: '2.1.4',
                warning: warning
            };

            var previousToast;

            return toastr;

            ////////////////

            function error(message, title, optionsOverride) {
                return notify({
                    type: toastType.error,
                    iconClass: getOptions().iconClasses.error,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function getContainer(options, create) {
                if (!options) { options = getOptions(); }
                $container = $('#' + options.containerId);
                if ($container.length) {
                    return $container;
                }
                if (create) {
                    $container = createContainer(options);
                }
                return $container;
            }

            function info(message, title, optionsOverride) {
                return notify({
                    type: toastType.info,
                    iconClass: getOptions().iconClasses.info,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function subscribe(callback) {
                listener = callback;
            }

            function success(message, title, optionsOverride) {
                return notify({
                    type: toastType.success,
                    iconClass: getOptions().iconClasses.success,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function warning(message, title, optionsOverride) {
                return notify({
                    type: toastType.warning,
                    iconClass: getOptions().iconClasses.warning,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function clear($toastElement, clearOptions) {
                var options = getOptions();
                if (!$container) { getContainer(options); }
                if (!clearToast($toastElement, options, clearOptions)) {
                    clearContainer(options);
                }
            }

            function remove($toastElement) {
                var options = getOptions();
                if (!$container) { getContainer(options); }
                if ($toastElement && $(':focus', $toastElement).length === 0) {
                    removeToast($toastElement);
                    return;
                }
                if ($container.children().length) {
                    $container.remove();
                }
            }

            // internal functions

            function clearContainer (options) {
                var toastsToClear = $container.children();
                for (var i = toastsToClear.length - 1; i >= 0; i--) {
                    clearToast($(toastsToClear[i]), options);
                }
            }

            function clearToast ($toastElement, options, clearOptions) {
                var force = clearOptions && clearOptions.force ? clearOptions.force : false;
                if ($toastElement && (force || $(':focus', $toastElement).length === 0)) {
                    $toastElement[options.hideMethod]({
                        duration: options.hideDuration,
                        easing: options.hideEasing,
                        complete: function () { removeToast($toastElement); }
                    });
                    return true;
                }
                return false;
            }

            function createContainer(options) {
                $container = $('<div/>')
                    .attr('id', options.containerId)
                    .addClass(options.positionClass);

                $container.appendTo($(options.target));
                return $container;
            }

            function getDefaults() {
                return {
                    tapToDismiss: true,
                    toastClass: 'toast',
                    containerId: 'toast-container',
                    debug: false,

                    showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
                    showDuration: 300,
                    showEasing: 'swing', //swing and linear are built into jQuery
                    onShown: undefined,
                    hideMethod: 'fadeOut',
                    hideDuration: 1000,
                    hideEasing: 'swing',
                    onHidden: undefined,
                    closeMethod: false,
                    closeDuration: false,
                    closeEasing: false,
                    closeOnHover: true,

                    extendedTimeOut: 1000,
                    iconClasses: {
                        error: 'toast-error',
                        info: 'toast-info',
                        success: 'toast-success',
                        warning: 'toast-warning'
                    },
                    iconClass: 'toast-info',
                    positionClass: 'toast-top-right',
                    timeOut: 5000, // Set timeOut and extendedTimeOut to 0 to make it sticky
                    titleClass: 'toast-title',
                    messageClass: 'toast-message',
                    escapeHtml: false,
                    target: 'body',
                    closeHtml: '<button type="button">&times;</button>',
                    closeClass: 'toast-close-button',
                    newestOnTop: true,
                    preventDuplicates: false,
                    progressBar: false,
                    progressClass: 'toast-progress',
                    rtl: false
                };
            }

            function publish(args) {
                if (!listener) { return; }
                listener(args);
            }

            function notify(map) {
                var options = getOptions();
                var iconClass = map.iconClass || options.iconClass;

                if (typeof (map.optionsOverride) !== 'undefined') {
                    options = $.extend(options, map.optionsOverride);
                    iconClass = map.optionsOverride.iconClass || iconClass;
                }

                if (shouldExit(options, map)) { return; }

                toastId++;

                $container = getContainer(options, true);

                var intervalId = null;
                var $toastElement = $('<div/>');
                var $titleElement = $('<div/>');
                var $messageElement = $('<div/>');
                var $progressElement = $('<div/>');
                var $closeElement = $(options.closeHtml);
                var progressBar = {
                    intervalId: null,
                    hideEta: null,
                    maxHideTime: null
                };
                var response = {
                    toastId: toastId,
                    state: 'visible',
                    startTime: new Date(),
                    options: options,
                    map: map
                };

                personalizeToast();

                displayToast();

                handleEvents();

                publish(response);

                if (options.debug && console) {
                    console.log(response);
                }

                return $toastElement;

                function escapeHtml(source) {
                    if (source == null) {
                        source = '';
                    }

                    return source
                        .replace(/&/g, '&amp;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                }

                function personalizeToast() {
                    setIcon();
                    setTitle();
                    setMessage();
                    setCloseButton();
                    setProgressBar();
                    setRTL();
                    setSequence();
                    setAria();
                }

                function setAria() {
                    var ariaValue = '';
                    switch (map.iconClass) {
                        case 'toast-success':
                        case 'toast-info':
                            ariaValue =  'polite';
                            break;
                        default:
                            ariaValue = 'assertive';
                    }
                    $toastElement.attr('aria-live', ariaValue);
                }

                function handleEvents() {
                    if (options.closeOnHover) {
                        $toastElement.hover(stickAround, delayedHideToast);
                    }

                    if (!options.onclick && options.tapToDismiss) {
                        $toastElement.click(hideToast);
                    }

                    if (options.closeButton && $closeElement) {
                        $closeElement.click(function (event) {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) {
                                event.cancelBubble = true;
                            }

                            if (options.onCloseClick) {
                                options.onCloseClick(event);
                            }

                            hideToast(true);
                        });
                    }

                    if (options.onclick) {
                        $toastElement.click(function (event) {
                            options.onclick(event);
                            hideToast();
                        });
                    }
                }

                function displayToast() {
                    $toastElement.hide();

                    $toastElement[options.showMethod](
                        {duration: options.showDuration, easing: options.showEasing, complete: options.onShown}
                    );

                    if (options.timeOut > 0) {
                        intervalId = setTimeout(hideToast, options.timeOut);
                        progressBar.maxHideTime = parseFloat(options.timeOut);
                        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                        if (options.progressBar) {
                            progressBar.intervalId = setInterval(updateProgress, 10);
                        }
                    }
                }

                function setIcon() {
                    if (map.iconClass) {
                        $toastElement.addClass(options.toastClass).addClass(iconClass);
                    }
                }

                function setSequence() {
                    if (options.newestOnTop) {
                        $container.prepend($toastElement);
                    } else {
                        $container.append($toastElement);
                    }
                }

                function setTitle() {
                    if (map.title) {
                        var suffix = map.title;
                        if (options.escapeHtml) {
                            suffix = escapeHtml(map.title);
                        }
                        $titleElement.append(suffix).addClass(options.titleClass);
                        $toastElement.append($titleElement);
                    }
                }

                function setMessage() {
                    if (map.message) {
                        var suffix = map.message;
                        if (options.escapeHtml) {
                            suffix = escapeHtml(map.message);
                        }
                        $messageElement.append(suffix).addClass(options.messageClass);
                        $toastElement.append($messageElement);
                    }
                }

                function setCloseButton() {
                    if (options.closeButton) {
                        $closeElement.addClass(options.closeClass).attr('role', 'button');
                        $toastElement.prepend($closeElement);
                    }
                }

                function setProgressBar() {
                    if (options.progressBar) {
                        $progressElement.addClass(options.progressClass);
                        $toastElement.prepend($progressElement);
                    }
                }

                function setRTL() {
                    if (options.rtl) {
                        $toastElement.addClass('rtl');
                    }
                }

                function shouldExit(options, map) {
                    if (options.preventDuplicates) {
                        if (map.message === previousToast) {
                            return true;
                        } else {
                            previousToast = map.message;
                        }
                    }
                    return false;
                }

                function hideToast(override) {
                    var method = override && options.closeMethod !== false ? options.closeMethod : options.hideMethod;
                    var duration = override && options.closeDuration !== false ?
                        options.closeDuration : options.hideDuration;
                    var easing = override && options.closeEasing !== false ? options.closeEasing : options.hideEasing;
                    if ($(':focus', $toastElement).length && !override) {
                        return;
                    }
                    clearTimeout(progressBar.intervalId);
                    return $toastElement[method]({
                        duration: duration,
                        easing: easing,
                        complete: function () {
                            removeToast($toastElement);
                            clearTimeout(intervalId);
                            if (options.onHidden && response.state !== 'hidden') {
                                options.onHidden();
                            }
                            response.state = 'hidden';
                            response.endTime = new Date();
                            publish(response);
                        }
                    });
                }

                function delayedHideToast() {
                    if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                        intervalId = setTimeout(hideToast, options.extendedTimeOut);
                        progressBar.maxHideTime = parseFloat(options.extendedTimeOut);
                        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                    }
                }

                function stickAround() {
                    clearTimeout(intervalId);
                    progressBar.hideEta = 0;
                    $toastElement.stop(true, true)[options.showMethod](
                        {duration: options.showDuration, easing: options.showEasing}
                    );
                }

                function updateProgress() {
                    var percentage = ((progressBar.hideEta - (new Date().getTime())) / progressBar.maxHideTime) * 100;
                    $progressElement.width(percentage + '%');
                }
            }

            function getOptions() {
                return $.extend({}, getDefaults(), toastr.options);
            }

            function removeToast($toastElement) {
                if (!$container) { $container = getContainer(); }
                if ($toastElement.is(':visible')) {
                    return;
                }
                $toastElement.remove();
                $toastElement = null;
                if ($container.children().length === 0) {
                    $container.remove();
                    previousToast = undefined;
                }
            }

        })();
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require('jquery'));
    } else {
        window.toastr = factory(window.jQuery);
    }
}));

/*! Lity - v2.2.2 - 2016-12-14
* http://sorgalla.com/lity/
* Copyright (c) 2015-2016 Jan Sorgalla; Licensed MIT */
(function(window, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory(window, $);
        });
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(window, require('jquery'));
    } else {
        window.lity = factory(window, window.jQuery || window.Zepto);
    }
}(typeof window !== "undefined" ? window : this, function(window, $) {
    'use strict';

    var document = window.document;

    var _win = $(window);
    var _deferred = $.Deferred;
    var _html = $('html');
    var _instances = [];

    var _attrAriaHidden = 'aria-hidden';
    var _dataAriaHidden = 'lity-' + _attrAriaHidden;

    var _focusableElementsSelector = 'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';

    var _defaultOptions = {
        handler: null,
        handlers: {
            image: imageHandler,
            inline: inlineHandler,
            youtube: youtubeHandler,
            vimeo: vimeoHandler,
            googlemaps: googlemapsHandler,
            facebookvideo: facebookvideoHandler,
            iframe: iframeHandler
        },
        template: '<div class="lity" role="dialog" aria-label="Dialog Window (Press escape to close)" tabindex="-1"><div class="lity-wrap" data-lity-close role="document"><div class="lity-loader" aria-hidden="true">Loading...</div><div class="lity-container"><div class="lity-content"></div><button class="lity-close" type="button" aria-label="Close (Press escape to close)" data-lity-close>&times;</button></div></div></div>'
    };

    var _imageRegexp = /(^data:image\/)|(\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?)(\?\S*)?$)/i;
    var _youtubeRegex = /(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i;
    var _vimeoRegex =  /(vimeo(pro)?.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/;
    var _googlemapsRegex = /((maps|www)\.)?google\.([^\/\?]+)\/?((maps\/?)?\?)(.*)/i;
    var _facebookvideoRegex = /(facebook\.com)\/([a-z0-9_-]*)\/videos\/([0-9]*)(.*)?$/i;

    var _transitionEndEvent = (function() {
        var el = document.createElement('div');

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }

        return false;
    })();

    function transitionEnd(element) {
        var deferred = _deferred();

        if (!_transitionEndEvent || !element.length) {
            deferred.resolve();
        } else {
            element.one(_transitionEndEvent, deferred.resolve);
            setTimeout(deferred.resolve, 500);
        }

        return deferred.promise();
    }

    function settings(currSettings, key, value) {
        if (arguments.length === 1) {
            return $.extend({}, currSettings);
        }

        if (typeof key === 'string') {
            if (typeof value === 'undefined') {
                return typeof currSettings[key] === 'undefined'
                    ? null
                    : currSettings[key];
            }

            currSettings[key] = value;
        } else {
            $.extend(currSettings, key);
        }

        return this;
    }

    function parseQueryParams(params) {
        var pairs = decodeURI(params.split('#')[0]).split('&');
        var obj = {}, p;

        for (var i = 0, n = pairs.length; i < n; i++) {
            if (!pairs[i]) {
                continue;
            }

            p = pairs[i].split('=');
            obj[p[0]] = p[1];
        }

        return obj;
    }

    function appendQueryParams(url, params) {
        return url + (url.indexOf('?') > -1 ? '&' : '?') + $.param(params);
    }

    function transferHash(originalUrl, newUrl) {
        var pos = originalUrl.indexOf('#');

        if (-1 === pos) {
            return newUrl;
        }

        if (pos > 0) {
            originalUrl = originalUrl.substr(pos);
        }

        return newUrl + originalUrl;
    }

    function error(msg) {
        return $('<span class="lity-error"/>').append(msg);
    }

    function imageHandler(target, instance) {
        var desc = (instance.opener() && instance.opener().data('lity-desc')) || 'Image with no description';
        var img = $('<img src="' + target + '" alt="' + desc + '"/>');
        var deferred = _deferred();
        var failed = function() {
            deferred.reject(error('Failed loading image'));
        };

        img
            .on('load', function() {
                if (this.naturalWidth === 0) {
                    return failed();
                }

                deferred.resolve(img);
            })
            .on('error', failed)
        ;

        return deferred.promise();
    }

    imageHandler.test = function(target) {
        return _imageRegexp.test(target);
    };

    function inlineHandler(target, instance) {
        var el, placeholder, hasHideClass;

        try {
            el = $(target);
        } catch (e) {
            return false;
        }

        if (!el.length) {
            return false;
        }

        placeholder = $('<i style="display:none !important"/>');
        hasHideClass = el.hasClass('lity-hide');

        instance
            .element()
            .one('lity:remove', function() {
                placeholder
                    .before(el)
                    .remove()
                ;

                if (hasHideClass && !el.closest('.lity-content').length) {
                    el.addClass('lity-hide');
                }
            })
        ;

        return el
            .removeClass('lity-hide')
            .after(placeholder)
        ;
    }

    function youtubeHandler(target) {
        var matches = _youtubeRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.youtube' + (matches[2] || '') + '.com/embed/' + matches[4],
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[5] || '')
                    )
                )
            )
        );
    }

    function vimeoHandler(target) {
        var matches = _vimeoRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://player.vimeo.com/video/' + matches[3],
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[4] || '')
                    )
                )
            )
        );
    }

    function facebookvideoHandler(target) {
        var matches = _facebookvideoRegex.exec(target);

        if (!matches) {
            return false;
        }

        if (0 !== target.indexOf('http')) {
            target = 'https:' + target;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.facebook.com/plugins/video.php?href=' + target,
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[4] || '')
                    )
                )
            )
        );
    }

    function googlemapsHandler(target) {
        var matches = _googlemapsRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.google.' + matches[3] + '/maps?' + matches[6],
                    {
                        output: matches[6].indexOf('layer=c') > 0 ? 'svembed' : 'embed'
                    }
                )
            )
        );
    }

    function iframeHandler(target) {
        return '<div class="lity-iframe-container"><iframe frameborder="0" allowfullscreen src="' + target + '"/></div>';
    }

    function winHeight() {
        return document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : Math.round(_win.height());
    }

    function keydown(e) {
        var current = currentInstance();

        if (!current) {
            return;
        }

        // ESC key
        if (e.keyCode === 27) {
            current.close();
        }

        // TAB key
        if (e.keyCode === 9) {
            handleTabKey(e, current);
        }
    }

    function handleTabKey(e, instance) {
        var focusableElements = instance.element().find(_focusableElementsSelector);
        var focusedIndex = focusableElements.index(document.activeElement);

        if (e.shiftKey && focusedIndex <= 0) {
            focusableElements.get(focusableElements.length - 1).focus();
            e.preventDefault();
        } else if (!e.shiftKey && focusedIndex === focusableElements.length - 1) {
            focusableElements.get(0).focus();
            e.preventDefault();
        }
    }

    function resize() {
        $.each(_instances, function(i, instance) {
            instance.resize();
        });
    }

    function registerInstance(instanceToRegister) {
        if (1 === _instances.unshift(instanceToRegister)) {
            _html.addClass('lity-active');

            _win
                .on({
                    resize: resize,
                    keydown: keydown
                })
            ;
        }

        $('body > *').not(instanceToRegister.element())
            .addClass('lity-hidden')
            .each(function() {
                var el = $(this);

                if (undefined !== el.data(_dataAriaHidden)) {
                    return;
                }

                el.data(_dataAriaHidden, el.attr(_attrAriaHidden) || null);
            })
            .attr(_attrAriaHidden, 'true')
        ;
    }

    function removeInstance(instanceToRemove) {
        var show;

        instanceToRemove
            .element()
            .attr(_attrAriaHidden, 'true')
        ;

        if (1 === _instances.length) {
            _html.removeClass('lity-active');

            _win
                .off({
                    resize: resize,
                    keydown: keydown
                })
            ;
        }

        _instances = $.grep(_instances, function(instance) {
            return instanceToRemove !== instance;
        });

        if (!!_instances.length) {
            show = _instances[0].element();
        } else {
            show = $('.lity-hidden');
        }

        show
            .removeClass('lity-hidden')
            .each(function() {
                var el = $(this), oldAttr = el.data(_dataAriaHidden);

                if (!oldAttr) {
                    el.removeAttr(_attrAriaHidden);
                } else {
                    el.attr(_attrAriaHidden, oldAttr);
                }

                el.removeData(_dataAriaHidden);
            })
        ;
    }

    function currentInstance() {
        if (0 === _instances.length) {
            return null;
        }

        return _instances[0];
    }

    function factory(target, instance, handlers, preferredHandler) {
        var handler = 'inline', content;

        var currentHandlers = $.extend({}, handlers);

        if (preferredHandler && currentHandlers[preferredHandler]) {
            content = currentHandlers[preferredHandler](target, instance);
            handler = preferredHandler;
        } else {
            // Run inline and iframe handlers after all other handlers
            $.each(['inline', 'iframe'], function(i, name) {
                delete currentHandlers[name];

                currentHandlers[name] = handlers[name];
            });

            $.each(currentHandlers, function(name, currentHandler) {
                // Handler might be "removed" by setting callback to null
                if (!currentHandler) {
                    return true;
                }

                if (
                    currentHandler.test &&
                    !currentHandler.test(target, instance)
                ) {
                    return true;
                }

                content = currentHandler(target, instance);

                if (false !== content) {
                    handler = name;
                    return false;
                }
            });
        }

        return {handler: handler, content: content || ''};
    }

    function Lity(target, options, opener, activeElement) {
        var self = this;
        var result;
        var isReady = false;
        var isClosed = false;
        var element;
        var content;

        options = $.extend(
            {},
            _defaultOptions,
            options
        );

        element = $(options.template);

        // -- API --

        self.element = function() {
            return element;
        };

        self.opener = function() {
            return opener;
        };

        self.options  = $.proxy(settings, self, options);
        self.handlers = $.proxy(settings, self, options.handlers);

        self.resize = function() {
            if (!isReady || isClosed) {
                return;
            }

            content
                .css('max-height', winHeight() + 'px')
                .trigger('lity:resize', [self])
            ;
        };

        self.close = function() {
            if (!isReady || isClosed) {
                return;
            }

            isClosed = true;

            removeInstance(self);

            var deferred = _deferred();

            // We return focus only if the current focus is inside this instance
            if (
                activeElement &&
                (
                    document.activeElement === element[0] ||
                    $.contains(element[0], document.activeElement)
                )
            ) {
                try {
                    activeElement.focus();
                } catch (e) {
                    // Ignore exceptions, eg. for SVG elements which can't be
                    // focused in IE11
                }
            }

            content.trigger('lity:close', [self]);

            element
                .removeClass('lity-opened')
                .addClass('lity-closed')
            ;

            transitionEnd(content.add(element))
                .always(function() {
                    content.trigger('lity:remove', [self]);
                    element.remove();
                    element = undefined;
                    deferred.resolve();
                })
            ;

            return deferred.promise();
        };

        // -- Initialization --

        result = factory(target, self, options.handlers, options.handler);

        element
            .attr(_attrAriaHidden, 'false')
            .addClass('lity-loading lity-opened lity-' + result.handler)
            .appendTo('body')
            .focus()
            .on('click', '[data-lity-close]', function(e) {
                if ($(e.target).is('[data-lity-close]')) {
                    self.close();
                }
            })
            .trigger('lity:open', [self])
        ;

        registerInstance(self);

        $.when(result.content)
            .always(ready)
        ;

        function ready(result) {
            content = $(result)
                .css('max-height', winHeight() + 'px')
            ;

            element
                .find('.lity-loader')
                .each(function() {
                    var loader = $(this);

                    transitionEnd(loader)
                        .always(function() {
                            loader.remove();
                        })
                    ;
                })
            ;

            element
                .removeClass('lity-loading')
                .find('.lity-content')
                .empty()
                .append(content)
            ;

            isReady = true;

            content
                .trigger('lity:ready', [self])
            ;
        }
    }

    function lity(target, options, opener) {
        if (!target.preventDefault) {
            opener = $(opener);
        } else {
            target.preventDefault();
            opener = $(this);
            target = opener.data('lity-target') || opener.attr('href') || opener.attr('src');
        }

        var instance = new Lity(
            target,
            $.extend(
                {},
                opener.data('lity-options') || opener.data('lity'),
                options
            ),
            opener,
            document.activeElement
        );

        if (!target.preventDefault) {
            return instance;
        }
    }

    lity.version  = '2.2.2';
    lity.options  = $.proxy(settings, lity, _defaultOptions);
    lity.handlers = $.proxy(settings, lity, _defaultOptions.handlers);
    lity.current  = currentInstance;

    $(document).on('click.lity', '[data-lity]', lity);

    return lity;
}));

/**
 * Created by luis on 10/14/16.
 */

//STORE ALL STRING CONSTANT (FEEDBACK MESSAGE)
var UPGRADE_TO_UNLOCK_TEMPLATE = "It seems you have not activated the PRO version. Please activate it to use this feature";
var UPGRADE_TO_USE_TEMPLATES = "It seems you have not activated the PRO version. Please activate it to use this feature";
var UPGRADE_TO_USE_IMAGE = "Either you have not activated the PRO version or you are using the free version. Please upgrade to use image in your page";
var UPGRADE_TO_USE_IMAGE_BG = "Either you have not activated the PRO version or you are using the free version. Please upgrade to use image as background";
var UPGRADE_TO_USE_SHORTCODE = "Shortcode only available in PRO version. Please upgrade to use this function.";
var UPGRADE_TO_USE_RATING = "Stars rating is available in the PRO version only. Please upgrade to use ratings in your form";
var UPGRADE_TO_USE_PREMIUM_ELEMENT = "This is a premium element. Please upgrade to PRO version to use it";
var ERROR_MISSING_PAGE_NAME = 'Please enter a title for your page';
var SUCCESS_FORM_SAVED = 'Page saved!';
var SUCCESS_CODE_SAVED = 'Code saved!';
var SUCCESS_EMAIL_SAVED = 'Email saved!';
var SUCCESS_SUBSCRIBER_DATA_CLEARED = 'Subscribers data for currently selected form cleared!';
var INFO_LOADING_SUBSCRIBERS_DATA = 'Loading subscribers data';


var ERROR_PLEASE_SOLVE_CAPTCHA = 'Please solve the captcha';
var ERROR_INPUT_NOT_VALID = 'Your input is not valid! ';

var INFO_CLEAR_SUBSCRIBERS = 'Clear subscribers data?';
var INFO_CLEAR_SUBSCRIBERS_EXPLAIN = 'You are going to clear subscribers data for currently selected form. This cannot be undone';
var INFO_SUBSCRIBERS_CLEARED = 'Subscribers data cleared!';

var INFO_PLEASE_ACTIVATE = 'The plugin has not been activated. Please go to the main page and activate it to use all the PRO features';



//POPUP OPTIONS MESSAGES
var POPUP_OPTION_NAME_MISSING = "Popup name is missing";
var POPUP_OPTION_WHERE_TO_DISPLAY_MISSING = "Where to display option is missing";
var POPUP_OPTION_POPUP_CONTENT_MISSING = "Popup content is missing";
var POPUP_OPTION_CATEGORY_MISSING = "Category is missing";
var POPUP_OPTION_POST_MISSING = "Post/page is missing";
var POPUP_OPTION_POSITION_ON_PAGE_MISSING = "Position on page is missing";
var POPUP_OPTION_HOW_TO_SHOWUP_MISSING = "How to show up is missing";
var POPUP_OPTION_SHOW_UP_DELAY_MISSING = "Show up delay (seconds) is missing";
var POPUP_OPTION_SCROLL_PERCENTAGE_MISSING = "Scroll percentage is missing";
var POPUP_OPTION_AFTER_CLOSE_MISSING = "After close/submit is missing";
var POPUP_OPTION_DAYS_TO_HIDE_MISSING = "Days to hide is missing";
var POPUP_OPTION_SAVED = "Popup option saved!";
var POPUP_OPTION_DELETED = "Popup option deleted!";
var POPUP_OPTION_UPGRADE = "Popup is a PRO only feature. Either you haven't activated the plugin or you are using the free version. Upgrade now to PRO version to use it.";



var WIDGET_OPTION_NAME_MISSING = 'Widget option\'s name is missing';
var WIDGET_OPTION_CONTENT_MISSING = 'Widget option\'s content is missing';
var WIDGET_OPTION_ALIGNMENT_MISSING = 'Widget option\'s alignment is missing';
var WIDGET_OPTION_POSITION_MISSING = 'Widget option\'s position is missing';
var WIDGET_OPTION_WHERE_TO_DISPLAY_MISSING = "Widget option's where to display is missing";
var WIDGET_OPTION_SAVED = "Popup option saved!";
/*! highlight.js v9.12.0 | BSD3 License | git.io/hljslicense */
!function(e){var n="object"==typeof window&&window||"object"==typeof self&&self;"undefined"!=typeof exports?e(exports):n&&(n.hljs=e({}),"function"==typeof define&&define.amd&&define([],function(){return n.hljs}))}(function(e){function n(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function t(e){return e.nodeName.toLowerCase()}function r(e,n){var t=e&&e.exec(n);return t&&0===t.index}function a(e){return k.test(e)}function i(e){var n,t,r,i,o=e.className+" ";if(o+=e.parentNode?e.parentNode.className:"",t=B.exec(o))return w(t[1])?t[1]:"no-highlight";for(o=o.split(/\s+/),n=0,r=o.length;r>n;n++)if(i=o[n],a(i)||w(i))return i}function o(e){var n,t={},r=Array.prototype.slice.call(arguments,1);for(n in e)t[n]=e[n];return r.forEach(function(e){for(n in e)t[n]=e[n]}),t}function u(e){var n=[];return function r(e,a){for(var i=e.firstChild;i;i=i.nextSibling)3===i.nodeType?a+=i.nodeValue.length:1===i.nodeType&&(n.push({event:"start",offset:a,node:i}),a=r(i,a),t(i).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:i}));return a}(e,0),n}function c(e,r,a){function i(){return e.length&&r.length?e[0].offset!==r[0].offset?e[0].offset<r[0].offset?e:r:"start"===r[0].event?e:r:e.length?e:r}function o(e){function r(e){return" "+e.nodeName+'="'+n(e.value).replace('"',"&quot;")+'"'}s+="<"+t(e)+E.map.call(e.attributes,r).join("")+">"}function u(e){s+="</"+t(e)+">"}function c(e){("start"===e.event?o:u)(e.node)}for(var l=0,s="",f=[];e.length||r.length;){var g=i();if(s+=n(a.substring(l,g[0].offset)),l=g[0].offset,g===e){f.reverse().forEach(u);do c(g.splice(0,1)[0]),g=i();while(g===e&&g.length&&g[0].offset===l);f.reverse().forEach(o)}else"start"===g[0].event?f.push(g[0].node):f.pop(),c(g.splice(0,1)[0])}return s+n(a.substr(l))}function l(e){return e.v&&!e.cached_variants&&(e.cached_variants=e.v.map(function(n){return o(e,{v:null},n)})),e.cached_variants||e.eW&&[o(e)]||[e]}function s(e){function n(e){return e&&e.source||e}function t(t,r){return new RegExp(n(t),"m"+(e.cI?"i":"")+(r?"g":""))}function r(a,i){if(!a.compiled){if(a.compiled=!0,a.k=a.k||a.bK,a.k){var o={},u=function(n,t){e.cI&&(t=t.toLowerCase()),t.split(" ").forEach(function(e){var t=e.split("|");o[t[0]]=[n,t[1]?Number(t[1]):1]})};"string"==typeof a.k?u("keyword",a.k):x(a.k).forEach(function(e){u(e,a.k[e])}),a.k=o}a.lR=t(a.l||/\w+/,!0),i&&(a.bK&&(a.b="\\b("+a.bK.split(" ").join("|")+")\\b"),a.b||(a.b=/\B|\b/),a.bR=t(a.b),a.e||a.eW||(a.e=/\B|\b/),a.e&&(a.eR=t(a.e)),a.tE=n(a.e)||"",a.eW&&i.tE&&(a.tE+=(a.e?"|":"")+i.tE)),a.i&&(a.iR=t(a.i)),null==a.r&&(a.r=1),a.c||(a.c=[]),a.c=Array.prototype.concat.apply([],a.c.map(function(e){return l("self"===e?a:e)})),a.c.forEach(function(e){r(e,a)}),a.starts&&r(a.starts,i);var c=a.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([a.tE,a.i]).map(n).filter(Boolean);a.t=c.length?t(c.join("|"),!0):{exec:function(){return null}}}}r(e)}function f(e,t,a,i){function o(e,n){var t,a;for(t=0,a=n.c.length;a>t;t++)if(r(n.c[t].bR,e))return n.c[t]}function u(e,n){if(r(e.eR,n)){for(;e.endsParent&&e.parent;)e=e.parent;return e}return e.eW?u(e.parent,n):void 0}function c(e,n){return!a&&r(n.iR,e)}function l(e,n){var t=N.cI?n[0].toLowerCase():n[0];return e.k.hasOwnProperty(t)&&e.k[t]}function p(e,n,t,r){var a=r?"":I.classPrefix,i='<span class="'+a,o=t?"":C;return i+=e+'">',i+n+o}function h(){var e,t,r,a;if(!E.k)return n(k);for(a="",t=0,E.lR.lastIndex=0,r=E.lR.exec(k);r;)a+=n(k.substring(t,r.index)),e=l(E,r),e?(B+=e[1],a+=p(e[0],n(r[0]))):a+=n(r[0]),t=E.lR.lastIndex,r=E.lR.exec(k);return a+n(k.substr(t))}function d(){var e="string"==typeof E.sL;if(e&&!y[E.sL])return n(k);var t=e?f(E.sL,k,!0,x[E.sL]):g(k,E.sL.length?E.sL:void 0);return E.r>0&&(B+=t.r),e&&(x[E.sL]=t.top),p(t.language,t.value,!1,!0)}function b(){L+=null!=E.sL?d():h(),k=""}function v(e){L+=e.cN?p(e.cN,"",!0):"",E=Object.create(e,{parent:{value:E}})}function m(e,n){if(k+=e,null==n)return b(),0;var t=o(n,E);if(t)return t.skip?k+=n:(t.eB&&(k+=n),b(),t.rB||t.eB||(k=n)),v(t,n),t.rB?0:n.length;var r=u(E,n);if(r){var a=E;a.skip?k+=n:(a.rE||a.eE||(k+=n),b(),a.eE&&(k=n));do E.cN&&(L+=C),E.skip||(B+=E.r),E=E.parent;while(E!==r.parent);return r.starts&&v(r.starts,""),a.rE?0:n.length}if(c(n,E))throw new Error('Illegal lexeme "'+n+'" for mode "'+(E.cN||"<unnamed>")+'"');return k+=n,n.length||1}var N=w(e);if(!N)throw new Error('Unknown language: "'+e+'"');s(N);var R,E=i||N,x={},L="";for(R=E;R!==N;R=R.parent)R.cN&&(L=p(R.cN,"",!0)+L);var k="",B=0;try{for(var M,j,O=0;;){if(E.t.lastIndex=O,M=E.t.exec(t),!M)break;j=m(t.substring(O,M.index),M[0]),O=M.index+j}for(m(t.substr(O)),R=E;R.parent;R=R.parent)R.cN&&(L+=C);return{r:B,value:L,language:e,top:E}}catch(T){if(T.message&&-1!==T.message.indexOf("Illegal"))return{r:0,value:n(t)};throw T}}function g(e,t){t=t||I.languages||x(y);var r={r:0,value:n(e)},a=r;return t.filter(w).forEach(function(n){var t=f(n,e,!1);t.language=n,t.r>a.r&&(a=t),t.r>r.r&&(a=r,r=t)}),a.language&&(r.second_best=a),r}function p(e){return I.tabReplace||I.useBR?e.replace(M,function(e,n){return I.useBR&&"\n"===e?"<br>":I.tabReplace?n.replace(/\t/g,I.tabReplace):""}):e}function h(e,n,t){var r=n?L[n]:t,a=[e.trim()];return e.match(/\bhljs\b/)||a.push("hljs"),-1===e.indexOf(r)&&a.push(r),a.join(" ").trim()}function d(e){var n,t,r,o,l,s=i(e);a(s)||(I.useBR?(n=document.createElementNS("http://www.w3.org/1999/xhtml","div"),n.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):n=e,l=n.textContent,r=s?f(s,l,!0):g(l),t=u(n),t.length&&(o=document.createElementNS("http://www.w3.org/1999/xhtml","div"),o.innerHTML=r.value,r.value=c(t,u(o),l)),r.value=p(r.value),e.innerHTML=r.value,e.className=h(e.className,s,r.language),e.result={language:r.language,re:r.r},r.second_best&&(e.second_best={language:r.second_best.language,re:r.second_best.r}))}function b(e){I=o(I,e)}function v(){if(!v.called){v.called=!0;var e=document.querySelectorAll("pre code");E.forEach.call(e,d)}}function m(){addEventListener("DOMContentLoaded",v,!1),addEventListener("load",v,!1)}function N(n,t){var r=y[n]=t(e);r.aliases&&r.aliases.forEach(function(e){L[e]=n})}function R(){return x(y)}function w(e){return e=(e||"").toLowerCase(),y[e]||y[L[e]]}var E=[],x=Object.keys,y={},L={},k=/^(no-?highlight|plain|text)$/i,B=/\blang(?:uage)?-([\w-]+)\b/i,M=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,C="</span>",I={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0};return e.highlight=f,e.highlightAuto=g,e.fixMarkup=p,e.highlightBlock=d,e.configure=b,e.initHighlighting=v,e.initHighlightingOnLoad=m,e.registerLanguage=N,e.listLanguages=R,e.getLanguage=w,e.inherit=o,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},e.C=function(n,t,r){var a=e.inherit({cN:"comment",b:n,e:t,c:[]},r||{});return a.c.push(e.PWM),a.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),a},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e.METHOD_GUARD={b:"\\.\\s*"+e.UIR,r:0},e});hljs.registerLanguage("javascript",function(e){var r="[A-Za-z$_][0-9A-Za-z$_]*",t={keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},a={cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},n={cN:"subst",b:"\\$\\{",e:"\\}",k:t,c:[]},c={cN:"string",b:"`",e:"`",c:[e.BE,n]};n.c=[e.ASM,e.QSM,c,a,e.RM];var s=n.c.concat([e.CBCM,e.CLCM]);return{aliases:["js","jsx"],k:t,c:[{cN:"meta",r:10,b:/^\s*['"]use (strict|asm)['"]/},{cN:"meta",b:/^#!/,e:/$/},e.ASM,e.QSM,c,e.CLCM,e.CBCM,a,{b:/[{,]\s*/,r:0,c:[{b:r+"\\s*:",rB:!0,r:0,c:[{cN:"attr",b:r,r:0}]}]},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{cN:"function",b:"(\\(.*?\\)|"+r+")\\s*=>",rB:!0,e:"\\s*=>",c:[{cN:"params",v:[{b:r},{b:/\(\s*\)/},{b:/\(/,e:/\)/,eB:!0,eE:!0,k:t,c:s}]}]},{b:/</,e:/(\/\w+|\w+\/)>/,sL:"xml",c:[{b:/<\w+\s*\/>/,skip:!0},{b:/<\w+/,e:/(\/\w+|\w+\/)>/,skip:!0,c:[{b:/<\w+\s*\/>/,skip:!0},"self"]}]}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:r}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:s}],i:/\[|%/},{b:/\$[(.]/},e.METHOD_GUARD,{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]},{bK:"constructor",e:/\{/,eE:!0}],i:/#(?!!)/}});hljs.registerLanguage("json",function(e){var i={literal:"true false null"},n=[e.QSM,e.CNM],r={e:",",eW:!0,eE:!0,c:n,k:i},t={b:"{",e:"}",c:[{cN:"attr",b:/"/,e:/"/,c:[e.BE],i:"\\n"},e.inherit(r,{b:/:/})],i:"\\S"},c={b:"\\[",e:"\\]",c:[e.inherit(r)],i:"\\S"};return n.splice(n.length,0,t,c),{c:n,k:i,i:"\\S"}});hljs.registerLanguage("sql",function(e){var t=e.C("--","$");return{cI:!0,i:/[<>{}*#]/,c:[{bK:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke comment",e:/;/,eW:!0,l:/[\w\.]+/,k:{keyword:"abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias allocate allow alter always analyze ancillary and any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain export export_set extended extent external external_1 external_2 externally extract failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour http id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second section securefile security seed segment select self sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",literal:"true false null",built_in:"array bigint binary bit blob boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text varchar varying void"},c:[{cN:"string",b:"'",e:"'",c:[e.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[e.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[e.BE]},e.CNM,e.CBCM,t]},e.CBCM,t]}});hljs.registerLanguage("css",function(e){var c="[a-zA-Z-][a-zA-Z0-9_-]*",t={b:/[A-Z\_\.\-]+\s*:/,rB:!0,e:";",eW:!0,c:[{cN:"attribute",b:/\S/,e:":",eE:!0,starts:{eW:!0,eE:!0,c:[{b:/[\w-]+\(/,rB:!0,c:[{cN:"built_in",b:/[\w-]+/},{b:/\(/,e:/\)/,c:[e.ASM,e.QSM]}]},e.CSSNM,e.QSM,e.ASM,e.CBCM,{cN:"number",b:"#[0-9A-Fa-f]+"},{cN:"meta",b:"!important"}]}}]};return{cI:!0,i:/[=\/|'\$]/,c:[e.CBCM,{cN:"selector-id",b:/#[A-Za-z0-9_-]+/},{cN:"selector-class",b:/\.[A-Za-z0-9_-]+/},{cN:"selector-attr",b:/\[/,e:/\]/,i:"$"},{cN:"selector-pseudo",b:/:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/},{b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{b:"@",e:"[{;]",i:/:/,c:[{cN:"keyword",b:/\w+/},{b:/\s/,eW:!0,eE:!0,r:0,c:[e.ASM,e.QSM,e.CSSNM]}]},{cN:"selector-tag",b:c,r:0},{b:"{",e:"}",i:/\S/,c:[e.CBCM,t]}]}});hljs.registerLanguage("xml",function(s){var e="[A-Za-z0-9\\._:-]+",t={eW:!0,i:/</,r:0,c:[{cN:"attr",b:e,r:0},{b:/=\s*/,r:0,c:[{cN:"string",endsParent:!0,v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s"'=<>`]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist"],cI:!0,c:[{cN:"meta",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},s.C("<!--","-->",{r:10}),{b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{b:/<\?(php)?/,e:/\?>/,sL:"php",c:[{b:"/\\*",e:"\\*/",skip:!0}]},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{name:"style"},c:[t],starts:{e:"</style>",rE:!0,sL:["css","xml"]}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{name:"script"},c:[t],starts:{e:"</script>",rE:!0,sL:["actionscript","javascript","handlebars","xml"]}},{cN:"meta",v:[{b:/<\?xml/,e:/\?>/,r:10},{b:/<\?\w+/,e:/\?>/}]},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"name",b:/[^\/><\s]+/,r:0},t]}]}});
!function(e,t,n){"use strict";!function o(e,t,n){function a(s,l){if(!t[s]){if(!e[s]){var i="function"==typeof require&&require;if(!l&&i)return i(s,!0);if(r)return r(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var c=t[s]={exports:{}};e[s][0].call(c.exports,function(t){var n=e[s][1][t];return a(n?n:t)},c,c.exports,o,e,t,n)}return t[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(o,a,r){var s=function(e){return e&&e.__esModule?e:{"default":e}};Object.defineProperty(r,"__esModule",{value:!0});var l,i,u,c,d=o("./modules/handle-dom"),f=o("./modules/utils"),p=o("./modules/handle-swal-dom"),m=o("./modules/handle-click"),v=o("./modules/handle-key"),y=s(v),h=o("./modules/default-params"),b=s(h),g=o("./modules/set-params"),w=s(g);r["default"]=u=c=function(){function o(e){var t=a;return t[e]===n?b["default"][e]:t[e]}var a=arguments[0];if(d.addClass(t.body,"stop-scrolling"),p.resetInput(),a===n)return f.logStr("SweetAlert expects at least 1 attribute!"),!1;var r=f.extend({},b["default"]);switch(typeof a){case"string":r.title=a,r.text=arguments[1]||"",r.type=arguments[2]||"";break;case"object":if(a.title===n)return f.logStr('Missing "title" argument!'),!1;r.title=a.title;for(var s in b["default"])r[s]=o(s);r.confirmButtonText=r.showCancelButton?"Confirm":b["default"].confirmButtonText,r.confirmButtonText=o("confirmButtonText"),r.doneFunction=arguments[1]||null;break;default:return f.logStr('Unexpected type of argument! Expected "string" or "object", got '+typeof a),!1}w["default"](r),p.fixVerticalPosition(),p.openModal(arguments[1]);for(var u=p.getModal(),v=u.querySelectorAll("button"),h=["onclick","onmouseover","onmouseout","onmousedown","onmouseup","onfocus"],g=function(e){return m.handleButton(e,r,u)},C=0;C<v.length;C++)for(var S=0;S<h.length;S++){var x=h[S];v[C][x]=g}p.getOverlay().onclick=g,l=e.onkeydown;var k=function(e){return y["default"](e,r,u)};e.onkeydown=k,e.onfocus=function(){setTimeout(function(){i!==n&&(i.focus(),i=n)},0)},c.enableButtons()},u.setDefaults=c.setDefaults=function(e){if(!e)throw new Error("userParams is required");if("object"!=typeof e)throw new Error("userParams has to be a object");f.extend(b["default"],e)},u.close=c.close=function(){var o=p.getModal();d.fadeOut(p.getOverlay(),5),d.fadeOut(o,5),d.removeClass(o,"showSweetAlert"),d.addClass(o,"hideSweetAlert"),d.removeClass(o,"visible");var a=o.querySelector(".sa-icon.sa-success");d.removeClass(a,"animate"),d.removeClass(a.querySelector(".sa-tip"),"animateSuccessTip"),d.removeClass(a.querySelector(".sa-long"),"animateSuccessLong");var r=o.querySelector(".sa-icon.sa-error");d.removeClass(r,"animateErrorIcon"),d.removeClass(r.querySelector(".sa-x-mark"),"animateXMark");var s=o.querySelector(".sa-icon.sa-warning");return d.removeClass(s,"pulseWarning"),d.removeClass(s.querySelector(".sa-body"),"pulseWarningIns"),d.removeClass(s.querySelector(".sa-dot"),"pulseWarningIns"),setTimeout(function(){var e=o.getAttribute("data-custom-class");d.removeClass(o,e)},300),d.removeClass(t.body,"stop-scrolling"),e.onkeydown=l,e.previousActiveElement&&e.previousActiveElement.focus(),i=n,clearTimeout(o.timeout),!0},u.showInputError=c.showInputError=function(e){var t=p.getModal(),n=t.querySelector(".sa-input-error");d.addClass(n,"show");var o=t.querySelector(".sa-error-container");d.addClass(o,"show"),o.querySelector("p").innerHTML=e,setTimeout(function(){u.enableButtons()},1),t.querySelector("input").focus()},u.resetInputError=c.resetInputError=function(e){if(e&&13===e.keyCode)return!1;var t=p.getModal(),n=t.querySelector(".sa-input-error");d.removeClass(n,"show");var o=t.querySelector(".sa-error-container");d.removeClass(o,"show")},u.disableButtons=c.disableButtons=function(){var e=p.getModal(),t=e.querySelector("button.confirm"),n=e.querySelector("button.cancel");t.disabled=!0,n.disabled=!0},u.enableButtons=c.enableButtons=function(){var e=p.getModal(),t=e.querySelector("button.confirm"),n=e.querySelector("button.cancel");t.disabled=!1,n.disabled=!1},"undefined"!=typeof e?e.sweetAlert=e.swal=u:f.logStr("SweetAlert is a frontend module!"),a.exports=r["default"]},{"./modules/default-params":2,"./modules/handle-click":3,"./modules/handle-dom":4,"./modules/handle-key":5,"./modules/handle-swal-dom":6,"./modules/set-params":8,"./modules/utils":9}],2:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o={title:"",text:"",type:null,allowOutsideClick:!1,showConfirmButton:!0,showCancelButton:!1,closeOnConfirm:!0,closeOnCancel:!0,confirmButtonText:"OK",confirmButtonColor:"#8CD4F5",cancelButtonText:"Cancel",imageUrl:null,imageSize:null,timer:null,customClass:"",html:!1,animation:!0,allowEscapeKey:!0,inputType:"text",inputPlaceholder:"",inputValue:"",showLoaderOnConfirm:!1};n["default"]=o,t.exports=n["default"]},{}],3:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=t("./utils"),r=(t("./handle-swal-dom"),t("./handle-dom")),s=function(t,n,o){function s(e){m&&n.confirmButtonColor&&(p.style.backgroundColor=e)}var u,c,d,f=t||e.event,p=f.target||f.srcElement,m=-1!==p.className.indexOf("confirm"),v=-1!==p.className.indexOf("sweet-overlay"),y=r.hasClass(o,"visible"),h=n.doneFunction&&"true"===o.getAttribute("data-has-done-function");switch(m&&n.confirmButtonColor&&(u=n.confirmButtonColor,c=a.colorLuminance(u,-.04),d=a.colorLuminance(u,-.14)),f.type){case"mouseover":s(c);break;case"mouseout":s(u);break;case"mousedown":s(d);break;case"mouseup":s(c);break;case"focus":var b=o.querySelector("button.confirm"),g=o.querySelector("button.cancel");m?g.style.boxShadow="none":b.style.boxShadow="none";break;case"click":var w=o===p,C=r.isDescendant(o,p);if(!w&&!C&&y&&!n.allowOutsideClick)break;m&&h&&y?l(o,n):h&&y||v?i(o,n):r.isDescendant(o,p)&&"BUTTON"===p.tagName&&sweetAlert.close()}},l=function(e,t){var n=!0;r.hasClass(e,"show-input")&&(n=e.querySelector("input").value,n||(n="")),t.doneFunction(n),t.closeOnConfirm&&sweetAlert.close(),t.showLoaderOnConfirm&&sweetAlert.disableButtons()},i=function(e,t){var n=String(t.doneFunction).replace(/\s/g,""),o="function("===n.substring(0,9)&&")"!==n.substring(9,10);o&&t.doneFunction(!1),t.closeOnCancel&&sweetAlert.close()};o["default"]={handleButton:s,handleConfirm:l,handleCancel:i},n.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],4:[function(n,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=function(e,t){return new RegExp(" "+t+" ").test(" "+e.className+" ")},s=function(e,t){r(e,t)||(e.className+=" "+t)},l=function(e,t){var n=" "+e.className.replace(/[\t\r\n]/g," ")+" ";if(r(e,t)){for(;n.indexOf(" "+t+" ")>=0;)n=n.replace(" "+t+" "," ");e.className=n.replace(/^\s+|\s+$/g,"")}},i=function(e){var n=t.createElement("div");return n.appendChild(t.createTextNode(e)),n.innerHTML},u=function(e){e.style.opacity="",e.style.display="block"},c=function(e){if(e&&!e.length)return u(e);for(var t=0;t<e.length;++t)u(e[t])},d=function(e){e.style.opacity="",e.style.display="none"},f=function(e){if(e&&!e.length)return d(e);for(var t=0;t<e.length;++t)d(e[t])},p=function(e,t){for(var n=t.parentNode;null!==n;){if(n===e)return!0;n=n.parentNode}return!1},m=function(e){e.style.left="-9999px",e.style.display="block";var t,n=e.clientHeight;return t="undefined"!=typeof getComputedStyle?parseInt(getComputedStyle(e).getPropertyValue("padding-top"),10):parseInt(e.currentStyle.padding),e.style.left="",e.style.display="none","-"+parseInt((n+t)/2)+"px"},v=function(e,t){if(+e.style.opacity<1){t=t||16,e.style.opacity=0,e.style.display="block";var n=+new Date,o=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.style.opacity=+e.style.opacity+(new Date-n)/100,n=+new Date,+e.style.opacity<1&&setTimeout(o,t)});o()}e.style.display="block"},y=function(e,t){t=t||16,e.style.opacity=1;var n=+new Date,o=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.style.opacity=+e.style.opacity-(new Date-n)/100,n=+new Date,+e.style.opacity>0?setTimeout(o,t):e.style.display="none"});o()},h=function(n){if("function"==typeof MouseEvent){var o=new MouseEvent("click",{view:e,bubbles:!1,cancelable:!0});n.dispatchEvent(o)}else if(t.createEvent){var a=t.createEvent("MouseEvents");a.initEvent("click",!1,!1),n.dispatchEvent(a)}else t.createEventObject?n.fireEvent("onclick"):"function"==typeof n.onclick&&n.onclick()},b=function(t){"function"==typeof t.stopPropagation?(t.stopPropagation(),t.preventDefault()):e.event&&e.event.hasOwnProperty("cancelBubble")&&(e.event.cancelBubble=!0)};a.hasClass=r,a.addClass=s,a.removeClass=l,a.escapeHtml=i,a._show=u,a.show=c,a._hide=d,a.hide=f,a.isDescendant=p,a.getTopMargin=m,a.fadeIn=v,a.fadeOut=y,a.fireClick=h,a.stopEventPropagation=b},{}],5:[function(t,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=t("./handle-dom"),s=t("./handle-swal-dom"),l=function(t,o,a){var l=t||e.event,i=l.keyCode||l.which,u=a.querySelector("button.confirm"),c=a.querySelector("button.cancel"),d=a.querySelectorAll("button[tabindex]");if(-1!==[9,13,32,27].indexOf(i)){for(var f=l.target||l.srcElement,p=-1,m=0;m<d.length;m++)if(f===d[m]){p=m;break}9===i?(f=-1===p?u:p===d.length-1?d[0]:d[p+1],r.stopEventPropagation(l),f.focus(),o.confirmButtonColor&&s.setFocusStyle(f,o.confirmButtonColor)):13===i?("INPUT"===f.tagName&&(f=u,u.focus()),f=-1===p?u:n):27===i&&o.allowEscapeKey===!0?(f=c,r.fireClick(f,l)):f=n}};a["default"]=l,o.exports=a["default"]},{"./handle-dom":4,"./handle-swal-dom":6}],6:[function(n,o,a){var r=function(e){return e&&e.__esModule?e:{"default":e}};Object.defineProperty(a,"__esModule",{value:!0});var s=n("./utils"),l=n("./handle-dom"),i=n("./default-params"),u=r(i),c=n("./injected-html"),d=r(c),f=".sweet-alert",p=".sweet-overlay",m=function(){var e=t.createElement("div");for(e.innerHTML=d["default"];e.firstChild;)t.body.appendChild(e.firstChild)},v=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=t.querySelector(f);return e||(m(),e=v()),e}),y=function(){var e=v();return e?e.querySelector("input"):void 0},h=function(){return t.querySelector(p)},b=function(e,t){var n=s.hexToRgb(t);e.style.boxShadow="0 0 2px rgba("+n+", 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"},g=function(n){var o=v();l.fadeIn(h(),10),l.show(o),l.addClass(o,"showSweetAlert"),l.removeClass(o,"hideSweetAlert"),e.previousActiveElement=t.activeElement;var a=o.querySelector("button.confirm");a.focus(),setTimeout(function(){l.addClass(o,"visible")},500);var r=o.getAttribute("data-timer");if("null"!==r&&""!==r){var s=n;o.timeout=setTimeout(function(){var e=(s||null)&&"true"===o.getAttribute("data-has-done-function");e?s(null):sweetAlert.close()},r)}},w=function(){var e=v(),t=y();l.removeClass(e,"show-input"),t.value=u["default"].inputValue,t.setAttribute("type",u["default"].inputType),t.setAttribute("placeholder",u["default"].inputPlaceholder),C()},C=function(e){if(e&&13===e.keyCode)return!1;var t=v(),n=t.querySelector(".sa-input-error");l.removeClass(n,"show");var o=t.querySelector(".sa-error-container");l.removeClass(o,"show")},S=function(){var e=v();e.style.marginTop=l.getTopMargin(v())};a.sweetAlertInitialize=m,a.getModal=v,a.getOverlay=h,a.getInput=y,a.setFocusStyle=b,a.openModal=g,a.resetInput=w,a.resetInputError=C,a.fixVerticalPosition=S},{"./default-params":2,"./handle-dom":4,"./injected-html":7,"./utils":9}],7:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o='<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert"><div class="sa-icon sa-error">\n      <span class="sa-x-mark">\n        <span class="sa-line sa-left"></span>\n        <span class="sa-line sa-right"></span>\n      </span>\n    </div><div class="sa-icon sa-warning">\n      <span class="sa-body"></span>\n      <span class="sa-dot"></span>\n    </div><div class="sa-icon sa-info"></div><div class="sa-icon sa-success">\n      <span class="sa-line sa-tip"></span>\n      <span class="sa-line sa-long"></span>\n\n      <div class="sa-placeholder"></div>\n      <div class="sa-fix"></div>\n    </div><div class="sa-icon sa-custom"></div><h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type="text" tabIndex="3" />\n      <div class="sa-input-error"></div>\n    </fieldset><div class="sa-error-container">\n      <div class="icon">!</div>\n      <p>Not valid!</p>\n    </div><div class="sa-button-container">\n      <button class="cancel" tabIndex="2">Cancel</button>\n      <div class="sa-confirm-button-container">\n        <button class="confirm" tabIndex="1">OK</button><div class="la-ball-fall">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div></div>';n["default"]=o,t.exports=n["default"]},{}],8:[function(e,t,o){Object.defineProperty(o,"__esModule",{value:!0});var a=e("./utils"),r=e("./handle-swal-dom"),s=e("./handle-dom"),l=["error","warning","info","success","input","prompt"],i=function(e){var t=r.getModal(),o=t.querySelector("h2"),i=t.querySelector("p"),u=t.querySelector("button.cancel"),c=t.querySelector("button.confirm");if(o.innerHTML=e.html?e.title:s.escapeHtml(e.title).split("\n").join("<br>"),i.innerHTML=e.html?e.text:s.escapeHtml(e.text||"").split("\n").join("<br>"),e.text&&s.show(i),e.customClass)s.addClass(t,e.customClass),t.setAttribute("data-custom-class",e.customClass);else{var d=t.getAttribute("data-custom-class");s.removeClass(t,d),t.setAttribute("data-custom-class","")}if(s.hide(t.querySelectorAll(".sa-icon")),e.type&&!a.isIE8()){var f=function(){for(var o=!1,a=0;a<l.length;a++)if(e.type===l[a]){o=!0;break}if(!o)return logStr("Unknown alert type: "+e.type),{v:!1};var i=["success","error","warning","info"],u=n;-1!==i.indexOf(e.type)&&(u=t.querySelector(".sa-icon.sa-"+e.type),s.show(u));var c=r.getInput();switch(e.type){case"success":s.addClass(u,"animate"),s.addClass(u.querySelector(".sa-tip"),"animateSuccessTip"),s.addClass(u.querySelector(".sa-long"),"animateSuccessLong");break;case"error":s.addClass(u,"animateErrorIcon"),s.addClass(u.querySelector(".sa-x-mark"),"animateXMark");break;case"warning":s.addClass(u,"pulseWarning"),s.addClass(u.querySelector(".sa-body"),"pulseWarningIns"),s.addClass(u.querySelector(".sa-dot"),"pulseWarningIns");break;case"input":case"prompt":c.setAttribute("type",e.inputType),c.value=e.inputValue,c.setAttribute("placeholder",e.inputPlaceholder),s.addClass(t,"show-input"),setTimeout(function(){c.focus(),c.addEventListener("keyup",swal.resetInputError)},400)}}();if("object"==typeof f)return f.v}if(e.imageUrl){var p=t.querySelector(".sa-icon.sa-custom");p.style.backgroundImage="url("+e.imageUrl+")",s.show(p);var m=80,v=80;if(e.imageSize){var y=e.imageSize.toString().split("x"),h=y[0],b=y[1];h&&b?(m=h,v=b):logStr("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+e.imageSize)}p.setAttribute("style",p.getAttribute("style")+"width:"+m+"px; height:"+v+"px")}t.setAttribute("data-has-cancel-button",e.showCancelButton),e.showCancelButton?u.style.display="inline-block":s.hide(u),t.setAttribute("data-has-confirm-button",e.showConfirmButton),e.showConfirmButton?c.style.display="inline-block":s.hide(c),e.cancelButtonText&&(u.innerHTML=s.escapeHtml(e.cancelButtonText)),e.confirmButtonText&&(c.innerHTML=s.escapeHtml(e.confirmButtonText)),e.confirmButtonColor&&(c.style.backgroundColor=e.confirmButtonColor,c.style.borderLeftColor=e.confirmLoadingButtonColor,c.style.borderRightColor=e.confirmLoadingButtonColor,r.setFocusStyle(c,e.confirmButtonColor)),t.setAttribute("data-allow-outside-click",e.allowOutsideClick);var g=e.doneFunction?!0:!1;t.setAttribute("data-has-done-function",g),e.animation?"string"==typeof e.animation?t.setAttribute("data-animation",e.animation):t.setAttribute("data-animation","pop"):t.setAttribute("data-animation","none"),t.setAttribute("data-timer",e.timer)};o["default"]=i,t.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],9:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},r=function(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?parseInt(t[1],16)+", "+parseInt(t[2],16)+", "+parseInt(t[3],16):null},s=function(){return e.attachEvent&&!e.addEventListener},l=function(t){e.console&&e.console.log("SweetAlert: "+t)},i=function(e,t){e=String(e).replace(/[^0-9a-f]/gi,""),e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),t=t||0;var n,o,a="#";for(o=0;3>o;o++)n=parseInt(e.substr(2*o,2),16),n=Math.round(Math.min(Math.max(0,n+n*t),255)).toString(16),a+=("00"+n).substr(n.length);return a};o.extend=a,o.hexToRgb=r,o.isIE8=s,o.logStr=l,o.colorLuminance=i},{}]},{},[1]),"function"==typeof define&&define.amd?define(function(){return sweetAlert}):"undefined"!=typeof module&&module.exports&&(module.exports=sweetAlert)}(window,document);
/**
 * Created by luis on 9/21/16.
 */

//this class contains functions, data to generate HTML form for elements
var C37BackendValidation =
{
    /**
     * This function take the validation options (in HTML) and return a wrapper div with class .validation
     * @param code
     * @returns {string}
     */
    makeValidationArea: function(code)
    {
        return '<div class="validation">' + code + '</div>';
    },

//this is the file that store validation settings for the backend
    validationHTML:
    {
        common: jQuery('#wplx-edit-validation-common').html(),
        min_length: '<label>Min length (characters)</label>',
        max_length: '<label>Max length (characters)</label>',
        textInput: '',
        textarea: '',
        file:   '<label>File type</label>' +//for file, file type validation is needed
        '<select <% var value=this.model.get(\'file_type\');console.log(value); %> data-for="file-type">' +
            '<option <%= value==""? "selected" : "" %> value="">Any</option>' +
            '<option <%= value=="image/*"? "selected" : "" %> value="image/*">Images</option>' +
            '<option <%= value=="audio/*"? "selected" : "" %> value="audio/*">Audios</option>' +
            '<option <%= value=="video/*"? "selected" : "" %> value="video/*">Videos</option>' +
            '<option <%= value=="text/html"? "selected" : "" %> value="text/html">HTML Files</option>' +
            '<option <%= value==".doc,.docx,.pdf"? "selected" : "" %> value=".doc,.docx,.pdf">Documents</option>' +
            //'<option <%= value==""? "selected" : "" %> value="custom">Custom</option>' +
        '</select>'
    },
    textValidation: function()
    {
        return this.makeValidationArea(this.validationHTML.common + this.validationHTML.textInput);
    },
    textAreaValidation: function()
    {
        return this.makeValidationArea(this.validationHTML.common);
    },
    fileValidation: function()
    {
        return this.makeValidationArea(this.validationHTML.common + this.validationHTML.file);
    }

};

function showUpgradeDialog()
{

    if (!versionNangCap)
    {
        swal({
                title: "One more step...",
                text: "This feature is available in the PRO version only. Upgrade now to unlock it and ALL other features",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#F37C39",
                confirmButtonText: "Upgrade now!",
                cancelButtonText: "Maybe later...",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(){
                window.open('http://wpleadplus.com/?src=up_dialog', '_blank');
            });
    } else
    {
        swal({
                title: "One more step...",
                text: "It seems you haven't activated the plugin. Please go to your site's dasboard, click on WP Lead Plus X to start activating the plugin.",
                type: "info",
                showCancelButton: false,
                confirmButtonColor: "#F37C39",
                confirmButtonText: "Got it!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(){

            });
    }

}

function showLoadingScreen()
{
    var element = document.getElementById('loading-screen');
    element.classList.remove('hidden');
}

function hideLoadingScreen()
{
    var element = document.getElementById('loading-screen');
    element.classList.add('hidden');
}


/**
 *
 * @param dataList: jQuery object of the datalist
 * @param values: array of selected values
 * @param selectedValue: selected values
 * @param input: jquery object of the input text
 */
function populateDataList(selectBox, values, selectedValue)
{
    selectBox.append('<option value=""></option>');
    for(var i = 0; i < values.length; i++)
    {
        selectBox.append('<option value="'+values[i].id+'">'+values[i].text+'</option>');
    }
    selectBox.val(selectedValue);
    return selectBox;
}


//load
var isActivated = true;

//on page load, check if the user has activated the plugin yet, if not, ask them to do so (in pro only)
jQuery.post(
    ajaxurl,
    {
        action: 'core37_lp_check_activation'
    },
    function(response)
    {
        var data = JSON.parse(response);
        if (!data['result'])
        {
            isActivated = false;
        }
    }
);
/**
 * Created by luis on 9/18/16.
 */
//use a function instead of an object as models' default because object will be modified and new models
//will inherit from previous models
function getModelDefaults()
{
    return {

    action: {},
    hidden: {
        desktop: false,
        tablet: false,
        phone: false
    },
    cssStyle: {
        desktop: {
            'box-shadow': {},
            'background-color': {},
            'background-overlay': {}
        },//key -> value css rules
        phone: {},//key -> value css rules
        tablet: {},//key -> value css rules
        customCSS: '',//this is this css style, users enter in the advanced panel of each element,
        extraClasses: '',
        innerSelector: '',//this is the class appended before the rule, for buttons, menus, styles are applied to c37-child element
        videoBg: {
            type: 'youtube',
            src: {
                mp4: '',
                webm: '',
                ogv: '',
                yt: ''//youtube video ID
            }
        }
    }
};    
}

var C37ElementModel = Backbone.Model.extend({
    initialize: function(){

        if (typeof this.get('editingElementID') === 'undefined' ||  !this.get('editingElementID'))
        {
            this.changeElementID();
        }

        console.log("new element created with id is: ", this.get('editingElementID'));
        //update json on model created
        this.updateJSON();

        this.on('change', function(){
            console.log("model for element ", this.get('editingElementID'), ' is changing');

            this.updateJSON();
        });
    },

    changeElementID: function(){
        this.set('editingElementID',  'c37-'+this.get('etype')+'-' + Math.round(Math.random() * 1000000) );
    },

    getElementID: function(){
        return this.get('editingElementID');
    },
    updateJSON: function(){
        var elementID = this.get('editingElementID');
        console.log("changing model for element id: ", elementID);
        core37Page.pageSettings.modelsJSON[elementID] = this.toJSON();
        modelsList[elementID] = this;
    },
    defaults: function(){
        return getModelDefaults();
    }
});

var PageModel = C37ElementModel.extend({
    defaults: function(){

        return jQuery.extend(true, {}, getModelDefaults(), {
            width: 700,
            codes: {
                trackingCode: '',
                experimentCode: '',
                beforeBodyClosing: '',
                afterBodyOpening: '',
                metaCode: '',
                customCSSCode: '',//css code enter in page->settings->advanced->CSS
            },
            pageTitle: '',
            pageSlug: '',
            cssID: jQuery('.c37-lp').attr('id'),

            editingElementID: 'page',
            etype: 'page'
        })
    }

});

var ButtonModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            preset: {
                style: 'c37-button-glow',
                shape: '',
                color: 'c37-button-primary',
                size: 'c37-button-normal'

            },
            action: {},
            text: 'My Button',
            icon: 'fa-paper-plane',
            etype: 'button',
            type: '',//this is the difference between a normal button and a submit button, submit button has value of submit
            buttonImage: ''//image src

        })
    }
});


var ImageSlidersModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            images: [
                {
                    src: 'https://picsum.photos/200/300',
                    target: 'https://google.com/'
                }

            ],
            thumbnail: true,
            lightbox: true,
            etype: 'image_sliders'

        })
    }
});

var SubmitButtonModel = C37ElementModel.extend({
    defaults: function() {

        return jQuery.extend(true, {}, getModelDefaults(), {
            preset: {
                style: 'c37-button-glow',
                shape: '',
                color: 'c37-button-primary',
                size: 'c37-button-normal'

            },
            action: {},
            size: 12,
            text: 'Submit Button',
            icon: 'fa-paper-plane',
            etype: 'button',
            type: 'submit',
            buttonImage: ''//image src
        })
    }
});


var ParagraphModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            content: 'This is a paragraph',
            etype: 'paragraph'
        })
    }
});

var TextInputModel = C37ElementModel.extend({
    defaults: function(){
        return jQuery.extend(true, {}, getModelDefaults(), {
        placeholder: 'enter text here',
        icon: 'fa-user',
        type: 'text',
        label: '',
        required: false,
        name: 'textinput-' + Math.floor(Math.random() * 100000),
        id: 'c37-text-' + Math.floor(Math.random() * 100000),
        value: '',
        etype: 'text_input'
    })
    }
});

var YouTubeVideoModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            videoURL: 'https://www.youtube.com/embed/Rb0UmrCXxVA',
            width: 560,
            height: 315,
            hideInfo: false,
            hideControls: false,
            autoPlay: false,
            etype: 'youtube'
        })
    }
});

var UnorderedListModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            items: ['first item', 'second item'],
            icon: 'fa-check',
            listPadding: 5,
            iconBgColor: '#ffffff',
            iconSize: 14,
            leftPadding: 20,
            iconColor: '#000000',
            align: '',
            etype: 'ul'
        })
    }
});


var IconModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            icon: 'fa-heart-o',
            align: 'c37-left',
            color: '#000',
            size: '14px',
            etype: 'icon'
        })
    }
});

var ImageLinkModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            src: 'https://wpleadplus.com/wp-content/uploads/2018/03/sample-button.png',
            alignmentClass: 'c37-left',
            target: '_self',
            url: '#',
            etype: 'image_link'
        })
    }
});


var ImageModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            src: 'https://wpleadplus.com/wp-content/uploads/2018/03/image-placeholder.jpg',
            alignmentClass: 'c37-left',
            action: {},
            etype: 'image'
        })
    }
});

var TextAreaModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            placeholder: 'enter text here',
            icon: '',
            label: '',
            required: false,
            name: 'textarea-' + Math.floor(Math.random() * 100000),
            id: 'c37-text-area-' + Math.floor(Math.random() * 100000),
            value: '',
            etype: 'textarea'
        })
    }
});

var FormContainerModel = C37ElementModel.extend({
    defaults: function() {

        return jQuery.extend(true, {}, getModelDefaults(), {
            rawCode: '%3Cform%20action%3D%22https%3A%2F%2Fbinarycarpenter.us17.list-manage.com%2Fsubscribe%2Fpost%3Fu%3Df64172d4d7d98201cc0b0d402%26amp%3Bid%3D35fb4ed9b2%22%20method%3D%22post%22%20%3E%3Cinput%20type%3D%22email%22%20value%3D%22%22%20name%3D%22EMAIL%22%20class%3D%22required%20email%22%20id%3D%22mce-EMAIL%22%3E%3Cinput%20type%3D%22submit%22%20value%3D%22Subscribe%22%20name%3D%22subscribe%22%20id%3D%22mc-embedded-subscribe%22%20class%3D%22button%22%3E%3C%2Fform%3E',
            code: '',//this is the HTML code, after parsed
            method: 'post',
            action: '',
            etype: 'form_container',
            styleClass: 'c37-form-style-1'
        })
    }
});

var CodeModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            code: 'your code here(shortcode, html...)',
            etype: 'code'
        })
    }
});

var LineModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            lineClass: 'c37-hr-1',
            etype: 'line'
        })
    }
});

var SimpleCountdownModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            days: 0,
            hours: 0,
            minutes: 4,
            seconds: 58,
            language: 'en',
            type: 'countAmount',
            clockDisplay: 'HourlyCounter',
            daysLabel: 'Days',
            hoursLabel: 'Hours',
            minutesLabel: 'Minutes',
            secondsLabel: 'Seconds',
            action: 'do-nothing',
            actionValue: '',
            etype: 'simple_countdown'
        })
    }
});

var OtherVideosModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            source: '%3Ciframe%20src%3D%22https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F253135841%22%20width%3D%22640%22%20height%3D%22360%22%20frameborder%3D%220%22%20webkitallowfullscreen%20mozallowfullscreen%20allowfullscreen%3E%3C%2Fiframe%3E',
            etype: 'other_videos'
        })
    }
});

var MenuModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            style: 'c37-lp-menu-1',
            title: 'Menu',
            iconUrl: '',
            menu: '',
            itemColor: '#000000',
            itemSize: '1rem',
            uppercase: false,
            etype: 'menu'
        })
    }
});


var SimpleNavbarModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            style: 'luxbar-default',
            brand: 'WP LEAD PLUS X',
            color: 'luxbar-menu-material-green',
            items: ['%3Ca%20href%3D%22%22%3Emenu%20item%3C%2Fa%3E', '%3Ca%20href%3D%22%22%3Emenu%20item%3C%2Fa%3E', '%3Ca%20href%3D%22%22%3Emenu%20item%3C%2Fa%3E'],
            iconUrl: '',
            alignment: 'luxbar-menu-left',

            uppercase: false,
            etype: 'simple_navbar'
        })
    }
});

var SelfHostedVideoModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            mp4: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4',
            ogv: 'http://clips.vorwaerts-gmbh.de/VfE.ogv',
            webm: 'http://clips.vorwaerts-gmbh.de/VfE.webm',
            autoplay: false,
            poster: '',
            controls: true,
            loop: false,
            muted: false,
            etype: 'self_hosted_video'
        })
    }
});

var BoxModel = C37ElementModel.extend({

    defaults: function(){
        return jQuery.extend(true, {}, getModelDefaults(), {
            horizontal: '',//content alignment center, right, left
            vertical: '', //content alignment center, top, bottom
            size: {
                desktop: 12,
                tablet: 12,
                phone: 12
            },
            direction: 'flex-column',
            etype: 'box'
        })
    }
});

var RowModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            horizontal: '',//content alignment center, right, left
            vertical: '', //content alignment center, top, bottom
            layout: "12",
            etype: 'row'
        })
    }
});


var SectionModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            layout: 12,
            containerClass: '',
            etype: 'section'
        })
    }
});


var WallModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            horizontal: '',//content alignment center, right, left
            vertical: '', //content alignment center, top, bottom
            layout: "12",
            etype: 'wall'
        })
    }
});


var CheckBoxModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            icon: '',
            label: '',
            required: false,
            name: 'cbox-' + Math.floor(Math.random() * 100000),
            id: 'c37-cbox-' + Math.floor(Math.random() * 100000),
            options: [
                {
                    value: 'option 1',
                    checked: false
                },
                {
                    value: 'option 2',
                    checked: false
                }
            ],
            alignment: 'c37-vertical',
            etype: 'checkbox'
        })
    }
});


var RadioModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            icon: '',
            label: '',
            required: false,
            name: 'radio-' + Math.floor(Math.random() * 100000),
            id: 'c37-radio-' + Math.floor(Math.random() * 100000),
            options: [
                {
                    value: 'option 1',
                    id: 'cbox-id-' + Math.floor(Math.random() * 100000),
                    checked: false
                },
                {
                    value: 'option 2',
                    checked: false
                }
            ],
            alignment: 'c37-vertical',
            etype: 'radio'

        })
    }
});


var SelectModel = C37ElementModel.extend({
    defaults: function() {
        return jQuery.extend(true, {}, getModelDefaults(), {
            placeholder: 'enter text here',
            icon: '',
            label: '',
            required: false,
            name: 'textarea-' + Math.floor(Math.random() * 100000),
            id: 'c37-text-area-' + Math.floor(Math.random() * 100000),
            value: '',
            etype: 'select',
            options: [
                {
                    value: 'option 1',
                    selected: false
                },
                {
                    value: 'option 2',
                    selected: false
                }
            ]
        })
    }
});


var ModelTemplates = {
    checkbox: CheckBoxModel,
    radio: RadioModel,
    textarea: TextAreaModel,
    text: TextInputModel,
    // date: DateInput,
    select: SelectModel,
    // label: Label,
    // file: FileModel,
    box: BoxModel,
    button: ButtonModel,
    // input_submit: InputSubmitModel,
    // acceptance: Acceptance,
    row: RowModel,
    section: SectionModel,
    // heading: Heading,
    paragraph: ParagraphModel,
    // step: Step,
    // fieldset: FieldSet,
    // recaptcha: ReCaptcha,
    image: ImageModel,
    // stars: Stars,
    youtube: YouTubeVideoModel,
    self_hosted_video: SelfHostedVideoModel,
    ul: UnorderedListModel,
    form_container: FormContainerModel,
    code: CodeModel,
    wall: WallModel,
    menu: MenuModel,
    line: LineModel,
    // countdown: Countdown,
    simple_countdown: SimpleCountdownModel,
    other_videos: OtherVideosModel,
    page: PageModel,
    icon: IconModel,
    simple_navbar: SimpleNavbarModel,
    image_link: ImageLinkModel,
    image_sliders: ImageSlidersModel
};
/**
 * Created by luis on 6/11/16.
 */

/**
 *
 * @param name: name of the form to get
 */
function getEditForm(name)
{
    var element = Forms[name];

    console.log("getting editing form for ", name);
    var content = [];

    if (element.general !== '')
    {
        var data;
        data = {
            'tab': '<li class="col"><a class="active-tab" href="#general-tab">General</a></li>',
            'tabContent': '<div id="general-tab">'+element.general+ jQuery('#wplx-edit-visibility').html() +'</div>'
        };
        content.push(data);
    }

    if (typeof element.advanced !== 'undefined' && element.advanced !== '')
    {
        content.push({
            'tab': '<li class="col"><a href="#advanced-tab">Advanced</a></li>',
            'tabContent': '<div id="advanced-tab">'+element.advanced+'</div>'
        })
    }

    if (typeof element.style !== 'undefined' && element.style !== '')
    {
        content.push({
            'tab': '<li class="col"><a href="#style-tab">Styles</a></li>',
            'tabContent': '<div id="style-tab">'+element.style+'</div>'
        })
    }

    if (typeof element.action !== 'undefined' && element.action !== '')
    {
        content.push({
            'tab': '<li class="col"><a href="#action-tab">Action</a></li>',
            'tabContent': '<div id="action-tab">'+element.action+'</div>'
        })
    }

    var head = '';
    var body = '';


    _.each(content, function(c){
        head+= c.tab;
        body+= c.tabContent;
    });

    return '<div id="settings-micro-panel">' +
    '<span data-balloon="close the panel" data-balloon-pos="right" id="close-panel"><i class="fa fa-close"></i> </span>' +//close panel button
    '<span data-balloon="drag to move this panel" data-balloon-pos="right" id="move-panel"><i class="fa fa-arrows"></i> </span>' +//close panel button
    '<span data-balloon="click to toggle window size" data-balloon-pos="right" id="maximize-panel"><i class="fa fa-window-restore"></i> </span>' +//close panel button
    '</div>'+
    '<div class="'+element.parentClass+'" id="setting-tabs">' +


                '<ul id="settings-tab-header" class="d-flex flex-row justify-content-around flex-grow">' +

                    head +
                    //'<li><a class="active-tab" href="#general-tab">General</a></li>' +
                    //'<li><a href="#style-tab">Styles</a></li>' +
                    //'<li><a href="#advanced-tab">Advanced</a></li>' +
                    //'<li><a href="#action-tab">Action</a></li>' +
                '</ul>' +

                body +
            '</div><div class="clear"></div>';

    //return '<div class="'+element.parentClass+'">'+code + '</div>';

}

/**
 * define HTML style tab, different elements may have different style area
 * @type {{colors: string, elementSize: string, formStyle: string, textStyle: string, buttonStyle: string}}
 */
var elementStyle = {
    textColor: jQuery('#wplx-edit-text-color').html(),
    background: jQuery('#wplx-edit-background').html(),
    elementSize: jQuery('#wplx-edit-element-width').html(),
    border: jQuery('#wplx-edit-border').html(),
    margin: jQuery('#wplx-edit-margin').html(),
    actionArea: jQuery('#wplx-edit-action-area').html(),
    boxShadow: jQuery('#wplx-edit-boxshadow').html(),
    dimensions: jQuery('#wplx-edit-dimensions').html()
};



var advancedArea = jQuery('#advanced-area').html();


var textEditOptions =
{
    general:    jQuery('#wplx-edit-text-input-general').html(),
    advanced: jQuery('#wplx-edit-text-advanced').html() + advancedArea,
    action: '',
    style: elementStyle.background + elementStyle.border + elementStyle.margin + elementStyle.elementSize

};

var iconOptions = {
    general: jQuery('#wplx-edit-icon').html(),
    style: elementStyle.background + elementStyle.border + elementStyle.margin + elementStyle.elementSize,
    advanced: '',

};


var fileEditOptions =
{
    general:    '<label>Upload multiple files?</label>' +
                '<input <%= this.model.get(\'multiple\')? "checked" : "" %> type="checkbox" data-for="multiple" />' +
                '<label>Text</label>' +
                '<input data-for="text" type="text" value="<%= this.model.get(\'text\') %>" placeholder="upload text" />' +
                '<label>Icon</label>' +
                '<div class="fa-icon"><i class="fa <%= this.model.get(\'icon\') ? this.model.get(\'icon\'): \'\' %>"></i><input <%= versionNangCap ? ""  : "disabled" %> data-for="icon" value="<%= this.model.get(\'icon\')? this.model.get(\'icon\'): \'\' %> " type="text" id="fa-icon-input" /> </div>',

    advanced:   '<label>Field name: </label>' +
                '<input type="text" data-for="name" value="<%= this.model.get(\'name\').replace(\'[\',\'\').replace(\']\',\'\') %>" />',
                // C37BackendValidation.fileValidation(this.model),
    style: '',
    action: ''

};


var checkboxEditOptions =
{
    general:    jQuery('#wplx-edit-checkbox-general').html(),

    advanced:   jQuery('#wplx-edit-cb-radio-alignment').html() +  advancedArea,
    style: elementStyle.textColor + elementStyle.elementSize,
    action: ''
};


var radioEditOptions  =
{
    general:    jQuery('#wplx-edit-radio-general').html(),
    advanced:   jQuery('#wplx-edit-cb-radio-alignment').html() + advancedArea,
    style: elementStyle.textColor + elementStyle.elementSize,
    action: ''
};



var labelEditOptions =
{
    general:    '<label>Content: </label>'+
                '<input type="text" data-for="label" placeholder="enter your label" value="<%= this.model.get(\'content\') %>" /> ' +
                '<input type="checkbox" <%= this.model.get("required") ? "checked" : "" %> data-for="required"> Field is required',
    advanced: advancedArea,
    style: elementStyle.background + elementStyle.elementSize,
    action: null
};

var headingEditOptions =
{
    general:    '<label>Content: </label>'+
                '<input type="text" data-for="heading" placeholder="enter text content" value="<%= this.model.get(\'content\') %>" /> '+
                '<label>Type: </label>'+
                '<select <% var tagName = this.model.get(\'tagName\'); %> data-for="tagName">' +
                    '<option <%= tagName=="h1"? "selected" : ""  %> value="h1">h1</option>' +
                    '<option <%= tagName=="h2"? "selected" : ""  %>  value="h2">h2</option>' +
                    '<option <%= tagName=="h3"? "selected" : ""  %>  value="h3">h3</option>' +
                    '<option <%= tagName=="h4"? "selected" : ""  %>  value="h4">h4</option>' +
                    '<option <%= tagName=="h5"? "selected" : ""  %>  value="h5">h5</option>' +
                    '<option <%= tagName=="h6"? "selected" : ""  %>  value="h6">h6</option>' +
                '</select>',
    advanced: advancedArea,
    style: elementStyle.background + elementStyle.elementSize,
    action: null
};

var paragraphEditOptions =
{
    general:    jQuery('#wplx-edit-paragraph').html(),
    advanced: advancedArea,
    style: elementStyle.textColor + elementStyle.background + elementStyle.border + elementStyle.margin,
    action: ''
};

var textAreaEditOptions =
{
    general:    '<label>Placeholder: </label>'+   
                '<input type="text" data-for="placeholder" placeholder="enter placeholder" value="<%= this.model.get(\'placeholder\') %>" /> ' +
                '<label>Label</label>' + 
                '<input value="<%= this.model.get(\'label\') %>" type="text" data-for="input-label" placeholder="enter label" />',


    advanced:   '<label>Field name: </label>'+
                '<input type="text" data-for="name" placeholder="enter field name" value="<%= this.model.get(\'name\') %>" /> '+
                C37BackendValidation.textAreaValidation(),
   
    style: elementStyle.background + elementStyle.elementSize,
    action: elementStyle.actionArea
};

var buttonEditOptions =
{
    general: jQuery('#wplx-edit-button-general').html(),
    advanced: advancedArea,
    style:  jQuery('#wplx-edit-button-preset').html() +
            elementStyle.textColor +
            elementStyle.background +
            elementStyle.margin +
            elementStyle.border +
            elementStyle.elementSize,

    action: elementStyle.actionArea
};

var dateEditOptions =
{
    general:    '<label <% var type = this.model.get(\'type\'); %> >Default value: </label>'+
                '<input type="<%= type %>" data-for="default-value" value="<%= this.model.get(\'value\') %>" />'+
                '<label>Type:</label>'+
                '<select data-for="date-type">' +
                '<option <%= type=="date"? "selected" : "" %> value="date">Date</option>'+
                //'<option <%= type=="time"? "selected" : "" %> value="time">Time</option>'+
                //'<option <%= type=="week"? "selected" : "" %> value="week">Week</option>'+
                //'<option <%= type=="month"? "selected" : "" %> value="month">Month</option>'+
                //'<option <%= type=="datetime"? "selected" : "" %> value="datetime">DateTime</option>'+
                //'<option <%= type=="datetime-local"? "selected" : "" %> value="datetime-local">DateTime Local</option>'+
                '</select>',
    advanced:   '<label>Field name:</label>' +
                '<input type="text" data-for="name" value="<%= this.model.get(\'name\') %>" />',
    style: elementStyle.background + elementStyle.elementSize,
    action: elementStyle.actionArea
};



var selectEditOptions =
{
    general:    jQuery('#wplx-edit-select-general').html(),
    advanced:   '<label>Name</label>'+
                '<input data-for="name" type="text" value="<%= name %>" placeholder="enter a name for your field" />',
    style: elementStyle.background + elementStyle.elementSize,
    action: elementStyle.actionArea
};


var acceptanceEditOptions =
{
    general:    '<label>Text: </label>'+
                '<input type="text" data-for="text" placeholder="enter acceptance text" value="<%= this.model.get(\'text\') %>" />'+
                '<label>Error message(<small>When not checked</small>)</label>'+

                '<input type="text" data-for="error" placeholder="enter error message" value="<%= this.model.get(\'error_message\') %>" /> ',
    advanced:   '<label>Field name:</label>' +
                '<input disabled type="text" data-for="name" value="<%= this.model.get(\'name\') %>" />',
    style: elementStyle.background,
    action: elementStyle.actionArea
};

var rowEditOptions =
{
    general:    jQuery('#wplx-edit-row').html() + elementStyle.dimensions,
    advanced:   advancedArea,
    style: elementStyle.background + elementStyle.border + elementStyle.margin + elementStyle.boxShadow,
    action: elementStyle.actionArea
};

var boxEditOptions = {
    general: jQuery('#wplx-edit-box').html(),
    style: elementStyle.background + elementStyle.border + elementStyle.margin + elementStyle.boxShadow,
    advanced: advancedArea,
    action: ''
};

var codeEditOptions = {
    general: '<label>Custom code</label>' +
                '<textarea class="full" placeholder="paste your shortcode here" data-for="code"><%= decodeURIComponent(code) %></textarea>',
    style: '',
    advanced: advancedArea,
    action: ''
};

var pageEditOptions =
{
    general:    jQuery('#wplx-edit-page-general').html(),

    advanced:   jQuery('#wplx-edit-page-advanced').html(),

    style:      elementStyle.background + elementStyle.margin ,
    action: ''
};

var imageEditOptions = {
    general : jQuery('#wplx-edit-image-general').html() + elementStyle.dimensions,

    advanced: advancedArea,
    style   : elementStyle.background + elementStyle.border + elementStyle.margin + elementStyle.boxShadow,
    action: elementStyle.actionArea
};


var imageLinkEditOptions = {
    general : jQuery('#wplx-edit-image-link-general').html() + elementStyle.dimensions,

    advanced: advancedArea,
    style   : elementStyle.background + elementStyle.border + elementStyle.margin + elementStyle.boxShadow,
    action: ''
};

var starsEditOptions = {
    general: '<% var initialRating = this.model.get("initialRating"); var theme = this.model.get("theme"); var id = this.model.get("id"); var optionsString = ""; var options = this.model.get("options"); _.each(options, function(option){ optionsString += option.value + "\\n"; }) %>' +
            '<label>Select style</label>' +
            '<select data-for="theme">' +
                '<option <%= theme == "fontawesome-stars" ? "selected" : ""  %> value="fontawesome-stars">Round-edges Stars</option>' +
                '<option <%= theme == "css-stars" ? "selected" : ""  %> value="css-stars">Sharp-edges Stars</option>' +
                '<option <%= theme == "bars-1to10" ? "selected" : ""  %> value="bars-1to10">Bars</option>' +
                '<option <%= theme == "bars-horizontal" ? "selected" : ""  %> value="bars-horizontal">Stack bars</option>' +
                '<option <%= theme == "bars-movie" ? "selected" : ""  %> value="bars-movie">Flat bar</option>' +
                '<option <%= theme == "bars-pill" ? "selected" : ""  %> value="bars-pill">Pills</option>' +
                '<option <%= theme == "bars-square" ? "selected" : ""  %> value="bars-square">Blue boxes</option>' +
            '</select>' +
            '<label>Values</label>' +
            '<textarea data-for="options"><%= jQuery.trim(optionsString) %></textarea>' +
            '<label>Initial value</label>' +
            '<select data-for="initial-rating">' +
            '<% _.each(options, function(option) {  %>' +
                '<option <%= option.value == initialRating ? "selected" : "" %>  value="<%= option.value %>"> <%= option.text %> </option>' +
            '<% }) %>' +
            '</select>'+
            '<label>Show values</label>' +
            '<input <%= this.model.get("showValues")? "checked" : ""%> type="checkbox" data-for="show-labels" /> Show values for each rating' +
            '<label>Show selected value</label>' +
            '<input <%= this.model.get("showSelectedRating")? "checked" : ""%>  type="checkbox" data-for="show-selected" /> Show currently selected value' +
    '' +
    '' +
    '',
    advanced:   '<label>Field name</label>' +
                '<input data-for="name" type="text" placeholder="set a name for your field" value="<%= this.model.get(\'name\') %>" />' +
                advancedArea,
    style: '<label>Stars color</label>' +
            '<input type="color" data-for="star-color" />',
    action: ''
};

var videoEditOptions = {
    general: jQuery('#wplx-edit-youtube').html(),
    advanced: advancedArea,
    style: elementStyle.background + elementStyle.border + elementStyle.margin,
    action: ''

};


var hostedVideoOptions = {
    general: jQuery('#wplx-edit-self-hosted-video').html(),
    advanced: advancedArea,
    style: elementStyle.background + elementStyle.border + elementStyle.margin,
    action: ''
};


var menuEditOptions = {
    general: jQuery('#wplx-edit-menu-general').html(),
    style: jQuery('#wplx-edit-menu-item-style').html() + elementStyle.background + elementStyle.margin + elementStyle.boxShadow,
    advanced: advancedArea ,
    action: ''
};

var ulEditOptions = {
    general: '<textarea id="ul-editor"></textarea>',
    style: elementStyle.background + elementStyle.border + elementStyle.margin +
            jQuery('#wplx-edit-ul-list-items-style').html(),
    advanced: advancedArea,
    action: ''
};



var imageSlidersOptions = {
    general: jQuery('#wplx-edit-image-sliders-general').html(),
    style: elementStyle.background + elementStyle.border + elementStyle.margin,
    advanced: advancedArea,
    action: ''
};


var formContainerOptions = {
    general: '<label>Put your form code here</label>' +
            '<textarea data-for="form-code" class="full"><%= decodeURIComponent(rawCode) %></textarea>',
    style:
        jQuery('#wplx-edit-form-style').html()  +
        elementStyle.background + elementStyle.border + elementStyle.margin,
    advanced: advancedArea,
    action: ''
};

var otherVideosContainerOptions = {
      general: jQuery('#wplx-edit-other-video').html(),
      style: elementStyle.background + elementStyle.border + elementStyle.margin
};

var sectionEditOptions = {
    style: elementStyle.background + elementStyle.border + elementStyle.margin,
    advanced:   advancedArea
};

var lineOptions = {
    general: jQuery('#wplx-edit-line').html()

};


var simpleCountdownOptions = {
    general: jQuery('#wplx-edit-simple-countdown').html(),
    style: elementStyle.textColor +  elementStyle.background + elementStyle.textColor + elementStyle.border + elementStyle.margin,
    advanced: advancedArea,
    action: jQuery('#wplx-edit-simple-countdown-action').html()
};


var simpleNavbarEditOptions = {
    general: jQuery('#wplx-edit-simple-navbar').html(),
    style:  jQuery('#wplx-edit-simple-navbar-style-options').html() + elementStyle.background + elementStyle.border + elementStyle.margin,
    advanced: advancedArea,
    action: ''//
};




var Forms = {
    textEdit: {
        general: textEditOptions.general,
        advanced: textEditOptions.advanced,
        style: textEditOptions.style,
        action: textEditOptions.action,
        parentClass: 'for-text'
    },
    checkboxEdit: {
        general: checkboxEditOptions.general,
        advanced: checkboxEditOptions.advanced,
        style: checkboxEditOptions.style,
        action: checkboxEditOptions.action,
        parentClass: 'for-checkbox'
    },
    radioEdit: {
        general: radioEditOptions.general,
        advanced: radioEditOptions.advanced,
        style: radioEditOptions.style,
        action: radioEditOptions.action,
        parentClass: 'for-radio'
    },
    labelEdit: {
        general: labelEditOptions.general,
        advanced: labelEditOptions.advanced,
        style: labelEditOptions.style,
        action: labelEditOptions.action,
        parentClass: 'for-label'
    },
    headingEdit: {
        general: headingEditOptions.general,
        advanced: headingEditOptions.advanced,
        style: headingEditOptions.style,
        action: headingEditOptions.action,
        parentClass: 'for-heading'
    },
    paragraphEdit: {
        general: paragraphEditOptions.general,
        advanced: paragraphEditOptions.advanced,
        style: paragraphEditOptions.style,
        action: paragraphEditOptions.action,
        parentClass: 'for-paragraph'
    },
    textAreaEdit: {
        general: textAreaEditOptions.general,
        advanced: textAreaEditOptions.advanced,
        style: textAreaEditOptions.style,
        action: textAreaEditOptions.action,
        parentClass: 'for-textarea'
    },
    buttonEdit: {
        general: buttonEditOptions.general,
        advanced: buttonEditOptions.advanced,
        style: buttonEditOptions.style,
        action: buttonEditOptions.action,
        parentClass: 'for-button'
    },
    dateEdit: {
        general: dateEditOptions.general,
        advanced: dateEditOptions.advanced,
        style: dateEditOptions.style,
        action: dateEditOptions.action,
        parentClass: 'for-date'
    },
    selectEdit: {
        general: selectEditOptions.general,
        advanced: selectEditOptions.advanced,
        style: selectEditOptions.style,
        action: selectEditOptions.action,
        parentClass: 'for-select'
    },
    acceptanceEdit: {
        general: acceptanceEditOptions.general,
        advanced: acceptanceEditOptions.advanced,
        style: acceptanceEditOptions.style,
        action: acceptanceEditOptions.action,
        parentClass: 'for-acceptance'
    },
    pageEdit: {
        general: pageEditOptions.general,
        advanced: pageEditOptions.advanced,
        style: pageEditOptions.style,
        action: pageEditOptions.action,
        parentClass: 'for-page'
    },

    rowEdit: {
        general: rowEditOptions.general,
        advanced: rowEditOptions.advanced,
        style: rowEditOptions.style,
        action: '',
        parentClass: 'for-row'
    },
    fileEdit: {
        general: fileEditOptions.general,
        advanced: fileEditOptions.advanced,
        style: fileEditOptions.style,
        action: fileEditOptions.action,
        parentClass: 'for-file'
    },

    imageEdit: {
        general: imageEditOptions.general,
        advanced: imageEditOptions.advanced,
        style: imageEditOptions.style,
        action: imageEditOptions.action,
        parentClass: 'for-image'
    },

    starsEdit: {
        general: starsEditOptions.general,
        advanced: starsEditOptions.advanced,
        style: '',
        action: starsEditOptions.action,
        parentClass: 'for-stars'
    },

    videoEdit: {
        general: videoEditOptions.general,
        advanced: videoEditOptions.advanced,
        style: videoEditOptions.style,
        action: videoEditOptions.action,
        parentClass: 'for-video'
    },
    selfHostedVideoEdit: {
        general: hostedVideoOptions.general,
        advanced: hostedVideoOptions.advanced,
        style: hostedVideoOptions.style,
        action: hostedVideoOptions.action,
        parentClass: 'for-self-hosted-video'
    },

    ulEdit: {
        general: ulEditOptions.general,
        advanced: ulEditOptions.advanced,
        style: ulEditOptions.style,
        action: '',
        parentClass: 'for-ul'
    },
    menuEdit: {
        general: menuEditOptions.general,
        advanced: menuEditOptions.advanced,
        style: menuEditOptions.style,
        action: '',
        parentClass: 'for-menu'

    },
    formContainerEdit: {
        general: formContainerOptions.general,
        advanced: formContainerOptions.advanced,
        style: formContainerOptions.style,
        action: formContainerOptions.action,
        parentClass: 'for-form-container'
    },
    boxEdit: {
        general: boxEditOptions.general,
        style: boxEditOptions.style,
        advanced: boxEditOptions.advanced,
        action: boxEditOptions.action,
        parentClass: 'for-box'
    },

    codeEdit: {
        general: codeEditOptions.general,
        style: codeEditOptions.style,
        advanced: codeEditOptions.advanced,
        action: codeEditOptions.action,
        parentClass: 'for-custom-code'
    },

    lineEdit: {
        general: lineOptions.general,
        style: '',
        advanced: '',
        action: '',
        parentClass: 'for-line'
    },
    // countdownEdit: {
    //     general: countdownOptions.general,
    //     style: countdownOptions.style,
    //     advanced: '',
    //     action: '',
    //     parentClass: 'for-countdown'
    // },


    simpleCountdownEdit: {
        general: simpleCountdownOptions.general,
        style: simpleCountdownOptions.style,
        advanced: '',
        action: simpleCountdownOptions.action,
        parentClass: 'for-simple-countdown'
    },
    otherVideosEdit: {
        general: otherVideosContainerOptions.general,
        style: otherVideosContainerOptions.style,
        parentClass: 'for-other-videos'
    },
    simpleNavbarEdit: {
        general: simpleNavbarEditOptions.general,
        style: simpleNavbarEditOptions.style,
        advanced: simpleNavbarEditOptions.advanced,
        parentClass: 'for-simple-navbar'
    },    
    sectionEdit: {
        general: '',
        style: sectionEditOptions.style,
        advanced: sectionEditOptions.advanced,
        parentClass: 'for-section'
    },
    iconEdit: {
        general: iconOptions.general,
        style: iconOptions.style,
        advanced: iconOptions.advanced,
        parentClass: 'for-icon'
    },
    imageLinkEdit: {
        general: imageLinkEditOptions.general,
        style: imageLinkEditOptions.style,
        advanced: imageLinkEditOptions.advanced,
        parentClass: 'for-image-link'
    },
    imageSlidersEdit: {
        general: imageSlidersOptions.general,
        style: imageSlidersOptions.style,
        advanced: imageSlidersOptions.advanced,
        parentClass: 'for-image-sliders',

    }

};

/**
 * Created by luis on 9/18/16.
 */
/**
 * Created by luis on 6/9/16.
 */
var C37FormElement = Backbone.View.extend({

    initialize: function(){
        _.bindAll(this, 'render');
        /*
          creating editingElementID for models that don't have one
          The case when editingElementID === false is when loading the edit panel and the model doesn't exist
          in modelsList or modelsJSON
        */
        //
        //
        // this.updateJSON();
        //
        if (typeof this.model === 'undefined')
            return;
        this.model.on('change', function(){
            this.render();
            // this.updateJSON();
        }, this);

    },
    //
    // updateJSON: function () {
    //   if (typeof  (this.model.get('editingElementID') !== 'undefined'))
    //   {
    //       core37Page.pageSettings.modelsJSON[this.model.get('editingElementID')] = this.model.toJSON();
    //       modelsList[this.model.get('editingElementID')] = this.model;
    //   }
    // },

    renderSize: function ()
    {
        if (!this.model)
            return;

        if (this.model.get('size'))
        {
            var sizeClass = 'c37-col-md-'+this.model.get('size').size;
            if (this.model.get('size').expand)
                sizeClass+=' c37-col-xs-12';
            //remove all previous class
            for (var i = 1; i <=12; i++)
                this.$el.removeClass('c37-col-md-' + i);
            this.$el.addClass(sizeClass);
        }

    }

});

function removeElement() {
    console.log('start removing');
    this.editingElement().remove();
    jQuery('#element-settings').html('');
}




//remove size class and return the element with size class removed
function removeSizeClass(element)
{
    element.attr('class',
        function(i, c){
            return c.replace(/(^|\s)c37-col-md\S+/g, '');
        });

    return element;
}

/**
 * Render CSS style for each element in form
 */
function renderCSS()
{
    // var elementID = this.model.get('editingElementID');
    // var textColor = this.$el.find('[data-for=text-color] input').first().val();
    // var textSize = this.$el.find('[data-for=text-size]').first().val();
    //
    // console.log('text size is: ' + textSize);
    // var backgroundColor = this.$el.find('[data-for=background-color] input').first().val();
    // if (typeof core37Page.pageSettings.elementsStyles[elementID] === "undefined")
    //     core37Page.pageSettings.elementsStyles[elementID] = {};
    // core37Page.pageSettings.elementsStyles[elementID]['background-color'] = backgroundColor;
    // core37Page.pageSettings.elementsStyles[elementID]['color'] = textColor;
    // core37Page.pageSettings.elementsStyles[elementID]['font-size'] = textSize+"px";

    // applyCSS();
}
//
// //take the global object elementsStyles and render it to a style tag in the head
// function applyCSS()
// {
//     var style = '';
//     for (var element in core37Page.pageSettings.elementsStyles)
//     {
//         var styles = core37Page.pageSettings.elementsStyles[element];
//
//         var rule = '';
//         for (var s in styles)
//         {
//             if (typeof styles[s] == 'undefined')
//                 continue;
//             rule+= s + ":" + styles[s] + ";";
//         }
//
//         style += '#' + core37Page.pageSettings.cssID +  ' #'+element + " .c37-child{" + rule + "}";
//
//     }
//
//     var elementStylesInHead = jQuery('#element-styles')
//     //append style to the head
//     if (elementStylesInHead.length == 0)
//         jQuery('head').append('<style id="element-styles"></style>');
//
//     elementStylesInHead.text("");
//     elementStylesInHead.text(style);
// }


var Heading = C37FormElement.extend({
    initialize: function () {
        this.render();
    },



    render: function()
    {
        // var self = this;
        // var content = self.template(self.model);
        // self.$el.html(content);
        // if (!this.model)
        //     this.$el.html(this.template);
        // else
        // {
        //     var content = ('<'+this.model.get('tagName')+'  class="c37-child">'+this.model.get('content')+'</'+this.model.get('tagName')+'>');
        //     console.log('tagName' + this.model.get('tagName'));
        //     this.$el.html(content);
        // }
    }
});

var Page = C37FormElement.extend({
    initialize: function () {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function()
    {
        //do nothing
    }
});


var Paragraph = C37FormElement.extend({
    initialize: function () {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function()
    {
        var content = _.template(jQuery('#wplx-paragraph').html())(this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});

var Icon = C37FormElement.extend({
    initialize: function () {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function()
    {
        var content = _.template(jQuery('#wplx-icon').html())(this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});



var Row = C37FormElement.extend({
    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function() {
        var content = _.template(jQuery('#wplx-row').html())(this.model.toJSON());
        var innerBox = new Box({model: new BoxModel()});
        innerBox.render();
        var boxHTML = innerBox.$el.html();

        content = content.replace('boxPlaceholder', boxHTML);

        this.$el.html(content);
    }
});


var Section = C37FormElement.extend({
    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function() {
        var content = _.template(jQuery('#wplx-section').html())(this.model.toJSON());

        var innerRowModel = new RowModel();
        var innerRow = new Row({model : innerRowModel});
        innerRow.render();

        var rowHTML = innerRow.$el.html();
        content = content.replace('rowPlaceholder', rowHTML);

        this.$el.html(content);
    }
});




var Box = C37FormElement.extend({
    initialize: function () {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function() {
        var content = _.template(jQuery('#wplx-box').html())(this.model.toJSON());
        this.$el.html(content);
    }

});

var Wall = C37FormElement.extend({
    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function() {
        var content = _.template(jQuery('#wplx-wall').html())(this.model.toJSON());
        var innerBox = new Box({model: new BoxModel()});
        innerBox.render();
        var boxHTML = innerBox.$el.html();

        content = content.replace('boxPlaceholder', boxHTML);

        this.$el.html(content);
    }
});


var Step = C37FormElement.extend({
    initialize: function () {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    template: _.template(
        '<div class="c37-step c37-style-1 c37-container">' +
        '<div class="c37-row" id="c37-row-0" data-c37-layout="12">' +
        '<div id="c37-box'+Math.floor(Math.random() * 10000)+'" class="c37-box d-flex flex-column c37-col-md-12"></div>' +
        '</div>' +
        '</div>'
    ),

    render: function()
    {
        this.setElement(this.template({}));
    }

});
//checkbox
var CheckBox = C37FormElement.extend({

    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    }
    ,
    render: function () {

    var content = _.template(jQuery('#wplx-checkbox').html())( this.model.toJSON());
    this.$el.html(content);
    return this;
}
});

//Radio
var Radio = C37FormElement.extend({

    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    },
    render: function () {

        var content = _.template(jQuery('#wplx-radio').html())( this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});

var Menu = C37FormElement.extend({

    initialize: function() {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function() {
        //get html code of form by ajax
        var that = this;

        if (typeof this.model.get('name') === 'undefined')
        {
            console.log('no menu selected');
            return;
        }

        toastr.info('loading menu...');

        var data = this.model.toJSON();
        data.action = 'core37_lp_get_menu_html';
        jQuery.post(
            ajaxurl,
            data,
            function(response) {

                var data = JSON.parse(response);

                that.$el.html('<div class="c37-child wplpx-menu '+that.model.get('style')+'">'+decodeURIComponent(data.content)+'</div>');

                toastr.remove();
                toastr.success('menu loaded!');
            }
        );
    },

    template: _.template('')



});



//Input text
var TextInput = C37FormElement.extend({

    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function () {
        var content = _.template(jQuery('#wplx-text-input').html())( this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});

//Input date
var DateInput = C37FormElement.extend({

    initialize: function(){
        this.render();
    },
    template: _.template(
        '<i class="fa fa-calendar c37-suggest-icon"></i><input class="c37-child" name="<%= name %>" type="date"/>'
    ),
    render: function () {
        if (!this.model)
            this.$el.html(this.template({name: 'date_input_'+Math.floor(Math.random()*1000) }));
        else
        {
            var dateElement = '<i class="fa fa-calendar c37-suggest-icon"></i><input name="'+this.model.get('name')+'" type="'+this.model.get('type')+'" value="'+this.model.get('value')+'"/>';
            this.$el.html(dateElement);
        }
    }
});

//Select box
var Select = C37FormElement.extend({

    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    },
    render: function () {
        var content = _.template(jQuery('#wplx-select').html())( this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});

//Label
var Label = C37FormElement.extend({

    initialize: function(){
        this.render();
    },
    template: _.template(
        '<label for="<%= forID %>"><%= content %></label>'
    ),
    render: function () {

        if (!this.model)
        {
            this.$el.html(this.template(
                {
                    forID: 'input_'+Math.floor(Math.random()*1000),
                    content: 'Label'
                }
            ));
        } else
        {
            if (this.model.get('required'))
            {
                this.$el.html('<label>'+this.model.get('content')+'<sup class="required">*</sup></label>');

            } else
            {
                var content = this.model.get('content');
                this.$el.html(this.template({
                    forID: 'input_'+Math.floor(Math.random()*1000),
                    content: content
                }));
            }
        }
        this.renderSize();
    }
});

//Button
var Button = C37FormElement.extend({

    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },


    render: function()
    {
        var content = _.template(jQuery('#wplx-button').html())( this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});


//Input submit (input type=submit, button, image)
var InputSubmit = C37FormElement.extend({

    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },
    render: function()
    {
        var content = _.template(jQuery('#wplx-input-submit').html())( this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});


//Textarea
var TextArea = C37FormElement.extend({

    initialize: function(){
        this.render();
    },
    template: _.template(
        '<i class="fa fa-edit c37-suggest-icon"></i><textarea id="<%= id %>" class="c37-child" name="<%= name %>" placeholder="enter something"></textarea>'
    ),
    render: function () {
        if (!this.model)
            this.$el.html(this.template({
                name: 'textarea_'+Math.floor(Math.random()*1000),
                id: 'textarea_'+Math.floor(Math.random()*1000)
            }));
        else
        {
            var required = this.model.get('required')? 'required' : '';
            //Class need to be re-render after style options are added
            var content = '';
            if (typeof this.model.get('label') !== 'undefined' && this.model.get('label') != '')
            {
                content+= '<label for="'+this.model.get('cssID')+'">'+this.model.get('label')+'</label>';
            }

            content += '<i class="fa fa-edit c37-suggest-icon"></i><textarea id="'+this.model.get('cssID')+'" class="c37-child" '+required+' name="'+this.model.get('name')+'" placeholder="'+this.model.get('placeholder')+'"></textarea>';
            this.$el.html(content);
            this.renderSize();
        }
    }
});


//Input text
var File = C37FormElement.extend({

    initialize: function(){
        this.render();
    },
    template: _.template(
        '<div class="c37-child"></label><input id="<%= field_id %>" class="c37-child" name="<%= name %>" type="file" /><label class="c37-file-label" for="<%= field_id %>"><i class="fa fa-cloud-upload"></i> <%= text %> </div>'
    ),
    render: function () {
        if (!this.model)
            this.$el.html(this.template({
                name: 'attachment_'+Math.floor(Math.random()*1000),
                field_id: 'c37_attachment_' + Math.floor(Math.random() * 10000),
                text: 'Select file...'
            }));
        else
        {
            var multiple = this.model.get('multiple') ? 'multiple' : '';
            var name = this.model.get('multiple')? this.model.get('name'): this.model.get('name');
            var required = this.model.get('required') ? 'required' : '';
            var accept = this.model.get('file_type') ? 'accept="'+this.model.get('file_type')+'"' : '';
            var icon = this.model.get('icon');
            var text = this.model.get('text');

            //we need to insert a blank label to style file upload button (hide the actual input, show the label)
            var content =
                '<div class="c37-child">' +
                    '<label class="c37-file-label" for="'+this.model.get('field_id')+'"><i class="fa '+icon+'"></i>'+text+'</label>' +
                    '<input '+required+' type="file" id="'+this.model.get('field_id')+'" name="'+name+'" '+multiple+ ' '+accept+' />' +
                '</div>';

            this.$el.html(content);
        }
    }
});

//Acceptance
var Acceptance = C37FormElement.extend({

    initialize: function(){
        this.render();
    },
    template: _.template(
        '<input class="c37-acceptance" id="<%= id %>" data-error="Please accept this" name="<%= name %>" type="checkbox" /><label for="<%= id %>" class="c37-acceptangvcd-label"></label> <span class="c37-child">I agree with terms of service</span>'
    ),
    render: function () {
        if (!this.model)
            this.$el.html(this.template({
                name: 'acceptance',
                id: 'acceptance_id_'+Math.floor(Math.random() * 10000)

            }));
        else
        {
            console.log(this.model);

            var content = '<input id="'+this.model.get('id')+'" data-error="'+this.model.get('error_message')+'" class="c37-acceptance" name="'+this.model.get('name')+'" type="checkbox" /><label for="'+this.model.get('id')+'" class="c37-acceptangvcd-label"></label> <span class="c37-child">'+this.model.get('text')+'</span>';
            this.$el.html(content);
        }
    }
});

//ReCaptcha
var ReCaptcha = C37FormElement.extend({
    initialize: function()
    {
        this.render();
    },

    template: _.template(
        '<div class="g-recaptcha" data-sitekey="<%= site_key %>"></div>'
    ),

    render: function()
    {

    }

});

var Countdown = C37FormElement.extend({

    initialize: function()
    {
        this.render();
    },

    template: _.template(
        '<div id="<%= gvcdID %>" class="gvcd-countdown gvcd-countdown--theme-10">'+
        '<div class="gvcd-unit-wrap  <%= displayDays? \'c37-hidden\' : \'\' %>">'+
            '<div class="days"></div>'+
            '<span class="gvcd-days-label"></span>'+
        '</div>'+
        '<div class="gvcd-unit-wrap  <%= displayHours? \'c37-hidden\' : \'\' %>">'+
            '<div class="hours"></div>'+
            '<span class="gvcd-hours-label"></span>'+
        '</div>'+
        '<div class="gvcd-unit-wrap  <%= displayMinutes? \'c37-hidden\' : \'\' %>">'+
            '<div class="minutes"></div>'+
            '<span class="gvcd-minutes-label"></span>'+
        '</div>'+
        '<div class="gvcd-unit-wrap  <%= displaySeconds? \'c37-hidden\' : \'\' %>">'+
            '<div class="seconds"></div>'+
            '<span class="gvcd-seconds-label"></span>'+
        '</div>'+
        '</div>'
    ),

    render: function()
    {
        if (typeof this.model !== 'undefined')
        {
            var model = this.model;
            this.$el.html(this.template({
                displayDays: model.get('displayDays'),
                displayHours: model.get('displayHours'),
                displayMinutes: model.get('displayMinutes'),
                displaySeconds: model.get('displaySeconds'),
                gvcdID: model.get('editingElementID')
            }));
        }

    }

});

var FlipCountdown = C37FormElement.extend({

    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    template: _.template(
        '<div class="c37-clock">'+

        '</div>'
    ),

    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));
        this.renderClock();
        return this;
    },


    renderClock: function()
    {
        var clock;
        var clockDisplay = this.model.get('clockDisplay');
        var totalTime = parseInt(this.model.get('days')) * 3600 * 24 +
            parseInt(this.model.get('hours')) * 3600 +
            parseInt(this.model.get('minutes')) * 60 +
            parseInt(this.model.get('seconds'));
        var language = this.model.get('language');

        var element = jQuery('#'+this.model.get('editingElementID') +" .c37-clock");
        clock = element.FlipClock({
            clockFace: clockDisplay,
            autoStart: false,
            language: language,
            callbacks: {
                stop: function() {

                }
            }
        });

        clock.setTime(totalTime);
        clock.setCountdown(true);
        clock.start();
    }

});



var SimpleCountdown = C37FormElement.extend({

    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    template: _.template(jQuery('#wplx-simple-countdown').html()),

    render: function()
    {
        console.log("rendering countdown");
        var model;
        model = this.model;

        console.log("model is: ", model.toJSON());
        this.$el.html(this.template(model.toJSON()));

        var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;


        var distance = 0;
        if (this.model.get('type') === 'countAmount')
        {
            distance = (parseInt(this.model.get('days')) * 3600 * 24 +
                parseInt(this.model.get('hours')) * 3600+
                parseInt(this.model.get('minutes')) * 60 +
                parseInt(this.model.get('seconds'))) * 1000;
        } else
        {
            distance = new Date(this.model.get('date')).getTime() - new Date().getTime();
        }

        console.log('distance is: ', this.model);


        jQuery('#' + model.get('editingElementID') + ' .simple-countdown-days .cd-number').html(Math.floor(distance / (day)) < 10 ? "0" + Math.floor(distance / (day)) : Math.floor(distance / (day)));
        jQuery('#' + model.get('editingElementID') + ' .simple-countdown-hours .cd-number').html(Math.floor((distance % (day)) / (hour)) < 10 ? "0" + Math.floor((distance % (day)) / (hour)) : Math.floor((distance % (day)) / (hour)));
        jQuery('#' + model.get('editingElementID') + ' .simple-countdown-minutes .cd-number').html(Math.floor((distance % (hour)) / (minute)) < 10 ? "0" + Math.floor((distance % (hour)) / (minute)) : Math.floor((distance % (hour)) / (minute)) );
        jQuery('#' + model.get('editingElementID') + ' .simple-countdown-seconds .cd-number').html(Math.floor((distance % (minute)) / second) < 10 ? "0" + Math.floor((distance % (minute)) / second) : Math.floor((distance % (minute)) / second));

    }

});


var FieldSet = C37FormElement.extend({
    initialize: function()
    {
        this.render();
    },

    template: _.template(
        '<fieldset class="c37-box">' +
        '<legend>Fieldset legend:</legend>' +
        '</fieldset>'
    ),
    render: function() {
        this.setElement(this.template({}));
    }


});

//Image
var ImageElement = C37FormElement.extend({
    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function()
    {
        var content = _.template(jQuery('#wplx-image').html())( this.model.toJSON());
        this.$el.html(content); //hello
        return this;
    }
});


var ImageSliders = C37FormElement.extend({
    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function()
    {
        var content = _.template(jQuery('#wplx-image-sliders').html())( this.model.toJSON());
        this.$el.html("");
        this.$el.html(content);

        var sliderID = '#' + this.model.get('editingElementID') + ' .wplx-image-slider';

        var slider;
        setTimeout(function(){

            if (typeof slider !== 'undefined')
                slider.destroy();
            slider = tns({
                container: sliderID,
                slideBy: 'page',
                autoplay: true
            });


        }, 200);

        return this;
    }
});

var ImageLink = C37FormElement.extend({
    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function()
    {
        var content = _.template(jQuery('#wplx-image-link').html())( this.model.toJSON());
        this.$el.html(content); //hello
        return this;
    }
});


//Form container
var FormContainer = C37FormElement.extend({
    initialize: function() {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    template: _.template(jQuery('#wplx-form-container').html()),

    render: function()
    {
        var parsedForm = c37CleanForm(this.model.get('rawCode'));
        console.log("parsing form");
        console.log("parsed form: ", parsedForm);

        this.$el.html(this.template({
            method: parsedForm.method,
            code: parsedForm.code,
            action: parsedForm.action,
            styleClass: this.model.get('styleClass')
        }));
        makeFormSortable(jQuery);
        makeC37BoxDroppable(jQuery);
    }
});

//Stars
var Stars = C37FormElement.extend({
    initialize: function(){
        this.render();
    },

    template: _.template(
        '<select name="<%= name %>" data-show-selected="false" data-show-values="false" data-initial-rating="1" data-theme="<%= theme %>" class="c37-star-rating" id="<%= id %>">' +
            '<option value="1">1</option>' +
            '<option value="2">2</option>' +
            '<option value="3">3</option>' +
            '<option value="4">4</option>' +
            '<option value="5">5</option>' +
        '</select>'),

    render: function()
    {
        var id = '';
        if (!this.model)
        {
            id = 'star-id-' + Math.floor(Math.random() * 10000);
            this.$el.html(this.template({
                id: id,
                theme: defaultValues.starsRatingOptions.theme,
                name: 'star-' + Math.round(Math.random() * 10000)
            }));

        } else
        {
            //singleStars are all the rating option in a scale
            var optionHTML = '';
            var model = this.model;

            _.each(this.model.get('options'), function(singleStar){
                optionHTML += '<option value="'+singleStar.value+'">'+singleStar.text+'</option>';
            });


            this.$el.html(
                '<select ' +
                'data-theme="'+ model.get('theme') +'" '
                + 'class="c37-star-rating" id="'+model.get('id') + '"'
                + 'data-initial-rating="'+model.get('initialRating')+'"'
                + 'data-show-selected="'+model.get('showSelectedRating')+'"'
                + 'data-show-values="'+model.get('showValues')+'"'
                + 'name="'+model.get('name')+'"'
                +'">'
                +optionHTML+'</select>');

            id = model.get('id');

            console.log('render with model');
        }



        this.renderRating(id);



    },

    //this function render the style of star (instead of the default select box)
    renderRating: function(id)
    {
        var self =this;
        jQuery(function(){
            id = '#' + id;

            if (self.model)
            {
                console.log('rendering with theme: ' + self.model.get('theme'));
                defaultValues.starsRatingOptions.theme = self.model.get('theme');
                defaultValues.starsRatingOptions.showValues = self.model.get('showValues');
                defaultValues.starsRatingOptions.initialRating = self.model.get('initialRating');
                defaultValues.starsRatingOptions.showSelectedRating = self.model.get('showSelectedRating');
            }

            setTimeout(function(){
                jQuery(id).barrating(defaultValues.starsRatingOptions);
            }, 0);
        });
    }


});

var YouTubeVideo = C37FormElement.extend({
    initialize: function()
    {

        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function(){
        var content = _.template(jQuery('#wplx-youtube').html())( this.model.toJSON());
        this.$el.html(content);
        return this;
    }

});


var OtherVideos = C37FormElement.extend({
    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },


    render: function(){

        console.log('modeol: ', this.model.toJSON());
        this.$el.html(_.template(jQuery('#wplx-other-video').html())(this.model.toJSON()));
        return this;
    }
});


// var SimpleNavbar = C37FormElement.extend({
//     initialize: function()
//     {
//         C37FormElement.prototype.initialize.apply(this, arguments);
//     },
//
//
//     render: function(){
//
//         console.log('modeol: ', this.model.toJSON());
//         this.$el.html(_.template(jQuery('#wplx-other-video').html())(this.model.toJSON()));
//         return this;
//     }
// });


var SelfHostedVideo = C37FormElement.extend({
    initialize: function()
    {
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function(){

        this.$el.html(this.template(this.model.toJSON()));
    },

    template: _.template(jQuery('#wplx-self-hosted').html())

});


var UnorderedList = C37FormElement.extend({
    initialize: function()
    {
        _.bindAll(this, "render");
        this.model.bind('change', this.render);
        this.render();
    },


    render: function()
    {
        if (typeof this.model.get('items') === 'undefined')
            this.model.set('items', ['first item', 'second item']);
        var content = _.template(jQuery('#wplx-ul').html())( this.model.toJSON());
        this.$el.html(content)
    }

});


var SimpleNavbar = C37FormElement.extend({
    initialize: function()
    {
        _.bindAll(this, "render");
        this.model.bind('change', this.render);
        this.render();
    },


    render: function()
    {
        if (typeof this.model.get('items') === 'undefined')
            this.model.set('items', ['first item2', 'second item']);
        var content = _.template(jQuery('#wplx-simple-navbar').html())( this.model.toJSON());
        this.$el.html(content)
    }
});



var Code = C37FormElement.extend({

    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    },
    render: function () {
        var content = _.template(jQuery('#wplx-code').html())( this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});


var Line = C37FormElement.extend({

    initialize: function(){
        C37FormElement.prototype.initialize.apply(this, arguments);
    },

    render: function () {
        var content = _.template(jQuery('#wplx-line').html())( this.model.toJSON());
        this.$el.html(content);
        return this;
    }
});



var Templates = {
    checkbox: CheckBox,
    radio: Radio,
    textarea: TextArea,
    text: TextInput,
    date: DateInput,
    select: Select,
    label: Label,
    file: File,
    button: Button,
    input_submit: InputSubmit,
    acceptance: Acceptance,
    row: Row,
    section: Section,
    box: Box,
    heading: Heading,
    paragraph: Paragraph,
    step: Step,
    fieldset: FieldSet,
    recaptcha: ReCaptcha,
    image: ImageElement,
    stars: Stars,
    youtube: YouTubeVideo,
    self_hosted_video: SelfHostedVideo,
    ul: UnorderedList,
    form_container: FormContainer,
    code: Code,
    wall: Wall,
    menu: Menu,
    line: Line,
    countdown: Countdown,
    simple_countdown: SimpleCountdown,
    other_videos: OtherVideos,
    simple_navbar: SimpleNavbar,
    icon: Icon,
    image_link: ImageLink,
    image_sliders: ImageSliders
};

/**
 * Created by luis on 9/18/16.
 */

//Edit form classes
var ElementEditView = Backbone.View.extend({
    el: '#element-settings',

    originalEvents: {
        'change .validation input' : 'renderValidation',
        'change .element-action select': 'renderAction',
        'input .element-action input': 'renderAction',
        'change .element-action input[type=checkbox]': 'renderAction',
        'input .css-styles input' : 'renderStyle',
        'change .css-styles select' : 'renderStyle',
        'click .css-styles input[type=checkbox]' : 'renderStyle',
        'click .css-styles input[type=radio]' : 'renderStyle',
        'blur [data-for=custom-css]' : 'applyCustomCSS',
        'blur [data-for=inner-selector]' : 'renderStyle',
        'blur [data-for=extra-classes]' : 'applyExtraClass',
        'blur [data-for=background-video-youtube]' : 'renderBackgroundVideo',
        'click #change-background-image': 'changeImageBg',
        'click #remove-background-image': 'removeImageBg',
        'click [data-for=clear-bg-color]' : 'clearBgColor',
        'click [data-for=background-color] .reset-hover-color' : 'clearHoverBgColor',
        'focus [data-for=border-width]' : 'showBorderOptions',
        'focus [data-for=border-radius]' : 'showBorderRadiusOptions',
        'click [data-for=clear-text-color]' : 'clearTextColor',
        'click [data-for=visibility] input' : 'visibilityManager',

    },

    renderBackgroundVideo: function(){
        /**
         * this function put or remove the video background to the element.
         * If the video ID is valid, it will put the div into the element and add c37-has-yt-bg to the element
         * if the video ID is not valid (empty), it will remove the video div and also the class c37-has-yt-bg from the element
         */
        var YTID = getYouTubeID(this.$el.find('[data-for=background-video-youtube]').val());
        var element = jQuery('#' + this.model.get('editingElementID'));
        this.model.get('cssStyle').videoBg.src.yt = YTID;

        element.find('.c37-yt-bg').remove();
        element.find('.c37-video-bg-overlay').remove();
        element.remove('c37-has-yt-bg');
        if (YTID === '')
        {
            return;
        }
        var insertContent = '<div class="c37-video-bg-overlay c37-hide-in-editor"></div><div class="c37-yt-bg c37-hide-in-editor"><iframe src="https://www.youtube.com/embed/'+YTID+'?controls=0&&mute=1&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=1" frameborder="0" allowfullscreen></iframe>';
        element.addClass('c37-has-yt-bg');

        element.prepend(insertContent);

    },

    visibilityManager: function(){
        var hidePhone = this.$el.find('[data-for=phone]').first().is(":checked");
        var hideDesktop = this.$el.find('[data-for=desktop]').first().is(":checked");
        var hideTablet = this.$el.find('[data-for=tablet]').first().is(":checked");

        //tablet sm
        //desktop md
        //phone xs (default)

        var element = jQuery('#' + this.model.get('editingElementID'));

        //first, remove all visibility classes
        element.removeClass('c37-d-none c37-d-sm-block c37-d-md-none c37-d-sm-none c37-d-md-block');

        if (hidePhone && hideTablet && hideDesktop) //hide all
        {
            element.addClass('c37-d-none');
        } else if (hidePhone && !hideTablet && !hideDesktop) //hide phone only
        {
            element.addClass('c37-d-none c37-d-sm-block');

        }  else if (!hidePhone && !hideTablet && hideDesktop) //hide desktop only
        {
            element.addClass('c37-d-md-none');
            //element.addClass('c37-d-md-none').addClass('c37-d-md-block');
        } else if (!hidePhone && hideTablet && !hideDesktop) //hide tablet only
        {
            element.addClass('c37-d-sm-none c37-d-md-block');
        } else if (!hidePhone && hideTablet && hideDesktop) //hide tablet up
        {
            element.addClass('c37-d-sm-none');
        } else if (hidePhone && hideTablet && !hideDesktop) //hide tablet down
        {
            element.addClass('c37-d-none c37-d-md-block');
        } else if (hidePhone && !hideTablet && hideDesktop) //show on tablet only
        {
            element.addClass('c37-d-none c37-d-sm-block c37-d-md-none');
        }


        this.model.set('hidden', {
            phone: hidePhone,
            tablet: hideTablet,
            desktop: hideDesktop
        })
    },

    applyCustomCSS: function(){
        console.log("entering custom code");
        var customCSS = this.$el.find('[data-for=custom-css]').length ? (this.$el.find('[data-for=custom-css]').val()) : '';

        //save the custom css code to model
        this.model.get('cssStyle').customCSS = encodeURIComponent(customCSS);

        //update custom css to the head
        //remove the current style element in the head of this particular element, if available
        jQuery('[data-custom-css='+this.model.get('editingElementID')+']').remove();
        //add the new style to the head
        jQuery('head').append('<style class="c37-custom-css" data-custom-css="'+this.model.get('editingElementID')+'"> '+ customCSS +' </style>');
    },

    showBorderRadiusOptions: function()
    {
        this.$el.find('#c37-border-width-settings').hide();
        this.$el.find('#c37-border-radius-settings').show();
    },

    showBorderOptions: function(){
        this.$el.find('#c37-border-radius-settings').hide();
        this.$el.find('#c37-border-width-settings').show();
    },

    additionalEvents: {

    },

    events : function() {
        return _.extend({},this.originalEvents,this.additionalEvents);
    },
    clearTextColor: function()
    {
        this.$el.find('[data-for=text-color] input').first().val('#fffffa');
        console.log('clearing text color');
        this.renderStyle();
    },

    clearBgColor: function()
    {
        this.$el.find('[data-for=background-color]').first().val('#fffffa');
        this.renderStyle();
    },

    clearHoverBgColor: function()
    {
        this.$el.find('[data-for=background-color] input.element-hover-bg-color').first().val('#fffffa');
        this.renderStyle();
    },

    removeImageBg: function()
    {
        this.$el.find('.c37-image-preview').first().attr('src', '');
        this.$el.find('[data-for=background-image] input').first().val('');
        //update the model

        this.renderStyle();
    },
    //this function get thess options that user selected (size and expand) and change the size object
    //of the model. The new size object will be used in the renderSize function of the element view
    renderSizeObject: function()
    {
        // var size = {};
        // size.size = this.$el.find('select[data-for=element-width]').val();
        // size.expand = false;
        //
        // if (this.$el.find('input[data-for=expand]').is(':checked'))
        //     size.expand = true;
        // this.model.set({size: size});
    },

    renderValidation: function()
    {
        console.log('render in parent, change event');
        var validationDiv = this.$el.find('.validation').first();
        var required = jQuery(validationDiv).find('input[data-for=required]').first().is(':checked') ? "required" : "";
        var elementID = this.model.get('editingElementID');
        var elementName = this.$el.find('[data-for=name]').val();

        if (required === "required")
            this.model.set({required: true});


        //update the global validation object
        validation[elementID] = {
            name: elementName,
            rules: {
                required: required
            }
        }
    },
    renderAction: function ()
    {
        var currentElement = this;
        var $el = currentElement.$el;

        /**
         * trigger div contains the select box that define the trigger value (click, change)
         * action div contains the select box that define the action (submit form/open link)
         */

        var editingElementID = currentElement.model.get('editingElementID');
        /*
         | if the editing element id is not defined, return, since the current config doesn't associate with
         | a particular element
         */

        if (typeof editingElementID === 'undefined')
        {
            console.log('no element ID');
            return;
        }


        var triggerDiv = $el.find('.element-action [data-for=trigger]').first();
        var actionDiv = $el.find('.element-action [data-for=action]').first();
        var targetURLDiv = $el.find('.element-action [data-for=target-url]').first();
        var targetPopupDiv = $el.find('.element-action [data-for=target-popup]').first();

        /*
        | The @trigger variable is either click or change, currently, it's click only
         */
        var trigger = triggerDiv.find('select').first().val();
        var action = actionDiv.find('select').first().val();

        console.log('trigger: ', trigger);
        console.log('action: ', action);

        /*
         | If the user choose not to set the @trigger to no-trigger, clear the current object contains
         | the action settings for this element
         */
        if (trigger === "no-trigger")
        {
            delete core37Page.pageSettings.elementsActions[editingElementID];
            jQuery(actionDiv).hide();
            jQuery(targetURLDiv).hide();
            return;
        } else if (trigger === 'click')
        {
            actionDiv.show();
            /*
             | If action has two possible values: submit form or open URL. If action is submit form,
             | hide the @targetURLDiv, else, show it
             */
            if (action === 'open-link')
            {
                console.log('open some link');
                targetURLDiv.show();
                targetPopupDiv.hide();
            } else if (action === 'open-popup')
            {
                targetURLDiv.hide();
                targetPopupDiv.show();
            } else
            {
                targetPopupDiv.hide();
                targetURLDiv.hide();
            }

        }


        //construct the new action object based on user's settings
        var actionObject = {};
        var editingElement = jQuery('#' + editingElementID);
        actionObject['element-type'] = editingElement.attr('data-c37-type');
        actionObject['trigger'] = trigger;
        actionObject['action'] = action;
        actionObject['element-id'] = editingElementID;
        actionObject['new-tab'] = targetURLDiv.find('input[type=checkbox]').is(':checked');

        if (action === 'open-link')
            actionObject['target'] = encodeURI(targetURLDiv.find('input').first().val());
        else if (action === 'open-popup')
            actionObject['popup-id'] = targetPopupDiv.find('select').first().val();

        core37Page.pageSettings.elementsActions[editingElementID] = actionObject;
    },

    /**
     * return the measurement with unit based on user input
     * @param input
     * @returns {*}
     */
    getUnitValue: function(input)
    {
        if (typeof input === 'undefined')
            return '';

        if (input.indexOf('em')!== -1 || input.indexOf('%')!== -1 || input.indexOf('pt')!== -1 || input.indexOf('px')!== -1 || input.indexOf('vh')!== -1 || input.indexOf('vw')!== -1 || input.indexOf('rem')!== -1)
            return input;

        if (!isNaN(parseInt(input)))
            return input + 'px';
        return '';
    },

    renderStyle: function()
    {
        /**
         * This is CSS code user put in the custom CSS box of each element
         * @type {string}
         */

        //these are for desktop
        var textColor = this.$el.find('[data-for=text-color]').length ? this.$el.find('[data-for=text-color]').first().val() : '';
        var fontSize = this.$el.find('[data-for=font-size]').length ? this.$el.find('[data-for=font-size]').first().val() : '';

        var fontWeight = this.$el.find('[data-for=font-bold]').length ? this.$el.find('[data-for=font-bold]').first().is(":checked") ? "bold": "" : '';
        var lineHeight = this.$el.find('[data-for=line-height]').length ? this.$el.find('[data-for=line-height]').val() : '';
        var fontItalic = this.$el.find('[data-for=font-italic]').length ? this.$el.find('[data-for=font-italic]').first().is(":checked") ? "italic": "" : '';

        var backgroundAttachment = this.$el.find('[data-for=background-attachment]').first().val();

        var backgroundImage = this.$el.find('#background-image-preview').first().attr('src');
        console.log("bg image is: ", backgroundImage);
        var backgroundColor = this.$el.find('[data-for=background-color]').first().val();
        var backgroundColorOpacity = this.$el.find('[data-for=background-opacity]').first().val();
        console.log("opacity is: ", backgroundColorOpacity);

        //only for background repeat
        var backgroundImageRepeat = this.$el.find('[data-for=background-repeat]').first().val();

        var backgroundSize = this.$el.find('[data-for=background-size]').first().val();

        var backgroundImagePositionX = this.$el.find('[data-for=background-position-x]').first().val();
        var backgroundImagePositionY = this.$el.find('[data-for=background-position-y]').first().val();

        var width = this.$el.find('[data-for=width]').length ? this.$el.find('[data-for=width]').first().val() : '';
        var height = this.$el.find('[data-for=height]').length ? this.$el.find('[data-for=height]').first().val() : '';
        var maxWidth = this.$el.find('[data-for=max-width]').length ? this.$el.find('[data-for=max-width]').first().val() : '';
        var maxHeight = this.$el.find('[data-for=max-height]').length ? this.$el.find('[data-for=max-height]').first().val() : '';


        //box shadow
        var boxShadowInset = this.$el.find('[data-for=box-shadow-inset]').first().is(':checked');
        var boxShadowColor = this.$el.find('[data-for=box-shadow-color]').first().val();
        var boxShadowOpacity = this.$el.find('[data-for=box-shadow-opacity]').first().val();
        var boxShadowOffsetX = this.$el.find('[data-for=box-shadow-offset-x]').first().val();
        var boxShadowOffsetY = this.$el.find('[data-for=box-shadow-offset-y]').first().val();
        var boxShadowBlurRadius = this.$el.find('[data-for=box-shadow-blur-radius]').first().val();
        var boxShadowSpreadRadius = this.$el.find('[data-for=box-shadow-spread-radius]').first().val();


        //background overlay
        var backgroundOverlayColor = this.$el.find('[data-for=background-overlay-color]').first().val();
        var backgroundOverlayOpacity = this.$el.find('[data-for=background-overlay-opacity]').first().val();


        var borderWidth = this.$el.find('#c37-border-settings [data-for=border-width]').first().val();
        var borderColor = this.$el.find('#c37-border-settings [data-for=border-color]').first().val();
        var borderRadius = this.$el.find('#c37-border-settings [data-for=border-radius]').first().val();
        var borderStyle = this.$el.find('#c37-border-settings [data-for=border-style]').first().val();

        var brDimension = {
            topLeft: this.$el.find('#c37-border-radius-settings [data-for=border-top-left-radius]').first().val(),
            topRight: this.$el.find('#c37-border-radius-settings [data-for=border-top-right-radius]').first().val(),
            bottomLeft: this.$el.find('#c37-border-radius-settings [data-for=border-bottom-left-radius]').first().val(),
            bottomRight: this.$el.find('#c37-border-radius-settings [data-for=border-bottom-right-radius]').first().val()
        };




        var singleBorderWidth = {
            top: this.$el.find('#c37-border-width-settings [data-for=border-top-width]').first().val(),
            bottom: this.$el.find('#c37-border-width-settings [data-for=border-bottom-width]').first().val(),
            right: this.$el.find('#c37-border-width-settings [data-for=border-right-width]').first().val(),
            left: this.$el.find('#c37-border-width-settings [data-for=border-left-width]').first().val()
        };



        var marginTop = this.$el.find('#c37-margin-desktop-settings .top').first().val();
        var marginRight = this.$el.find('#c37-margin-desktop-settings .right').first().val();
        var marginBottom = this.$el.find('#c37-margin-desktop-settings .bottom').first().val();
        var marginLeft = this.$el.find('#c37-margin-desktop-settings .left').first().val();

        var tabletMargin = {
            top: this.$el.find('#c37-margin-tablet-settings .top').first().val(),
            right: this.$el.find('#c37-margin-tablet-settings .right').first().val(),
            left: this.$el.find('#c37-margin-tablet-settings .left').first().val(),
            bottom: this.$el.find('#c37-margin-tablet-settings .bottom').first().val()
        };

        var phoneMargin = {
            top: this.$el.find('#c37-margin-phone-settings .top').first().val(),
            right: this.$el.find('#c37-margin-phone-settings .right').first().val(),
            left: this.$el.find('#c37-margin-phone-settings .left').first().val(),
            bottom: this.$el.find('#c37-margin-phone-settings .bottom').first().val()
        };

        var paddingTop = this.$el.find('#c37-padding-desktop-settings .top').first().val();
        var paddingRight = this.$el.find('#c37-padding-desktop-settings .right').first().val();
        var paddingBottom = this.$el.find('#c37-padding-desktop-settings .bottom').first().val();
        var paddingLeft = this.$el.find('#c37-padding-desktop-settings .left').first().val();

        var tabletPadding = {
            top: this.$el.find('#c37-padding-tablet-settings .top').first().val(),
            right: this.$el.find('#c37-padding-tablet-settings .right').first().val(),
            left: this.$el.find('#c37-padding-tablet-settings .left').first().val(),
            bottom: this.$el.find('#c37-padding-tablet-settings .bottom').first().val()
        };


        var phonePadding = {
            top: this.$el.find('#c37-padding-phone-settings .top').first().val(),
            right: this.$el.find('#c37-padding-phone-settings .right').first().val(),
            left: this.$el.find('#c37-padding-phone-settings .left').first().val(),
            bottom: this.$el.find('#c37-padding-phone-settings .bottom').first().val()
        };

        var fontSizeTablet = this.$el.find('#text-size-tablet input').first().val();
        var fontSizePhone = this.$el.find('#text-size-phone input').first().val();

        //if any color is set to the default color (fffffa), set it to '' since user hasn't change its color
        if (borderColor === '#fffffa')
            borderColor = '';

        if (textColor === '#fffffa')
            textColor = '';


        if (backgroundColor === '#fffffa')
            backgroundColor = '';



        var styles = {
            desktop: {
                'border-radius' : this.getUnitValue(borderRadius),
                'border-top-width': this.getUnitValue(singleBorderWidth.top),
                'border-bottom-width': this.getUnitValue(singleBorderWidth.bottom),
                'border-left-width': this.getUnitValue(singleBorderWidth.left),
                'border-right-width': this.getUnitValue(singleBorderWidth.right),
                'height' : this.getUnitValue(height),
                'width' : this.getUnitValue(width),
                'max-width' : this.getUnitValue(maxWidth),
                'max-height' : this.getUnitValue(maxHeight),
                'line-height' : this.getUnitValue(lineHeight),

                'border-top-left-radius': this.getUnitValue(brDimension.topLeft),
                'border-top-right-radius': this.getUnitValue(brDimension.topRight),
                'border-bottom-left-radius': this.getUnitValue(brDimension.bottomLeft),
                'border-bottom-right-radius': this.getUnitValue(brDimension.bottomRight),
                'box-shadow': {
                    'color' : boxShadowColor,
                    'inset' : boxShadowInset,
                    'opacity' : boxShadowOpacity,
                    'offsetX' : this.getUnitValue(boxShadowOffsetX),
                    'offsetY' : this.getUnitValue(boxShadowOffsetY),
                    'blurRadius' : this.getUnitValue(boxShadowBlurRadius),
                    'spreadRadius' : this.getUnitValue(boxShadowSpreadRadius)
                },
                'background-attachment' : backgroundAttachment,
                'color': textColor,
                'background-image': backgroundImage,
                'background-color': {
                    color: backgroundColor,
                    opacity: backgroundColorOpacity
                },
                'background-overlay': {
                    color: backgroundOverlayColor,
                    opacity: backgroundOverlayOpacity
                },
                'background-repeat': backgroundImageRepeat,
                'background-size': backgroundSize,
                'background-position-x': this.getUnitValue(backgroundImagePositionX),
                'background-position-y': this.getUnitValue(backgroundImagePositionY),
                'border-width': this.getUnitValue(borderWidth),
                'border-color': borderColor,
                'border-style': borderStyle,
                'font-weight': fontWeight,
                'font-style': fontItalic,
                'margin-top': this.getUnitValue(marginTop),
                'margin-right': this.getUnitValue(marginRight),
                'margin-bottom': this.getUnitValue(marginBottom),
                'margin-left': this.getUnitValue(marginLeft),
                'padding-top': this.getUnitValue(paddingTop),
                'padding-right': this.getUnitValue(paddingRight),
                'padding-bottom': this.getUnitValue(paddingBottom),
                'padding-left': this.getUnitValue(paddingLeft),
                'element-type': this.model.get('etype'),
                'font-size': this.getUnitValue(fontSize)
            },
            phone: {
                'padding-top': this.getUnitValue(phonePadding.top),
                'padding-left': this.getUnitValue(phonePadding.left),
                'padding-right': this.getUnitValue(phonePadding.right),
                'padding-bottom': this.getUnitValue(phonePadding.bottom),

                'margin-top': this.getUnitValue(phoneMargin.top),
                'margin-left': this.getUnitValue(phoneMargin.left),
                'margin-right': this.getUnitValue(phoneMargin.right),
                'margin-bottom': this.getUnitValue(phoneMargin.bottom),
                'font-size': this.getUnitValue(fontSizePhone)
            },
            tablet: {
                'padding-top': this.getUnitValue(tabletPadding.top),
                'padding-left': this.getUnitValue(tabletPadding.left),
                'padding-right': this.getUnitValue(tabletPadding.right),
                'padding-bottom': this.getUnitValue(tabletPadding.bottom),

                'margin-top': this.getUnitValue(tabletMargin.top),
                'margin-left': this.getUnitValue(tabletMargin.left),
                'margin-right': this.getUnitValue(tabletMargin.right),
                'margin-bottom': this.getUnitValue(tabletMargin.bottom),

                'font-size': this.getUnitValue(fontSizeTablet)
            }

        };
        var cssStyle = this.model.get('cssStyle');

        cssStyle.desktop = styles.desktop;
        cssStyle.tablet = styles.tablet;
        cssStyle.phone = styles.phone;
        cssStyle.innerSelector = this.$el.find('[data-for=inner-selector]').first().val();
        this.model.set('cssStyle', cssStyle);
        console.log("updating style for element: ", this.model.get('editingElementID'));

        this.applyStyle();
    },

    applyExtraClass: function(){

        var elementID = this.model.get('editingElementID');
        //remove current extra classes
        var editingElement = jQuery('#' + elementID);

        editingElement.removeClass(this.model.get('cssStyle').extraClasses);

        //update new value to xtra classes
        this.model.get('cssStyle').extraClasses = this.$el.find('[data-for=extra-classes]').val();

        //add new class to the element
        editingElement.addClass(this.model.get('cssStyle').extraClasses);

    },

    changeImageBg: function() {
            if (!versionNangCap || !isActivated)
            {
                showUpgradeDialog();
                return;
            }
            var model = this.model;

            console.log('image');
            if (this.frame)
            {
                this.frame.open();
                return;
            } else
            {
                var el = this.$el;
                var frame = this.frame;
                var that = this;
                frame = wp.media({
                    'title' : 'select an image',
                    'button' : {
                        text: 'Use this image'
                    },
                    multiple: false
                });

                frame.on('select', function(){
                    var attachment = frame.state().get('selection').first().toJSON();
                    console.log(attachment.url);
                    el.find('.c37-image-preview').first().attr('src', attachment.url);
                    //update the model
                    model.get('cssStyle').desktop['background-image'] = attachment.url;


                    that.renderStyle();

                });

                frame.open();
            }
        },

    applyStyle: function(){
        var model =  this.model;

        var desktop = '';
        var tablet = '';
        var phone = '';

        var cssStyle = model.get('cssStyle');
        //combine style for desktop
        _.each(_.keys(cssStyle.desktop), function(key){

            if (typeof cssStyle.desktop[key] !== 'undefined' && cssStyle.desktop[key]!== '')
            {

                if (key==='background-image')
                {
                    //check if the element has overlay option set
                    var bgOverlay = cssStyle.desktop['background-overlay'];
                    var overlayString= '';

                    if (bgOverlay.color !== '' && bgOverlay.color !=='#fffffa' & !isNaN(bgOverlay.opacity))
                    {
                        overlayString += 'linear-gradient('+c37Hex2rgba(bgOverlay.color, bgOverlay.opacity) + ',' + c37Hex2rgba(bgOverlay.color, bgOverlay.opacity) + '),';//put the trailing comma here instead of in joining string because in case there is no overlay, the background still shows
                    }
                    desktop+= key + ':'+overlayString+' url(' + cssStyle.desktop[key] + ');';
                }
                else if (key==='background-color')
                {
                    var bg = cssStyle.desktop[key];
                    if (bg.color === '' || bg.color === '#fffffa')
                    {
                        // desktop+= key + ': transparent;';
                    } else
                    {
                        if (typeof bg.opacity === 'undefined' || bg.opacity === '')
                            desktop+= key + ':' + bg.color + ';';
                        else
                        {
                            //render rgba color
                            desktop+= key + ':' + c37Hex2rgba(bg.color, bg.opacity) + ';';
                            console.log("rendering rgba");
                        }

                    }
                } else if (key === 'box-shadow')
                {
                    var boxShadow = cssStyle.desktop[key];
                    //get the color, if it's undefined or #fffffa, don't render box shadow
                    if (!(typeof boxShadow.color === 'undefined' || boxShadow.color === '' || boxShadow.color === '#fffffa'))
                    {
                        if (boxShadow.inset)
                        {
                            desktop+= key + ': inset ' + boxShadow.offsetX + ' ' + boxShadow.offsetY + ' ' +  c37Hex2rgba(boxShadow.color, boxShadow.opacity) + ';';
                        } else
                        {
                            desktop+= key + ': ' + boxShadow.offsetX + ' ' + boxShadow.offsetY + ' ' + boxShadow.blurRadius + ' ' + boxShadow.spreadRadius + ' ' + c37Hex2rgba(boxShadow.color, boxShadow.opacity) + ';';
                        }
                    }

                }
                else if (key !== 'background-overlay')
                    desktop+= key + ':' + cssStyle.desktop[key] + ';';
            }
        });

        //combine style for tablet
        _.each(_.keys(cssStyle.tablet), function(key){

            if (cssStyle.tablet[key]!== '')
                tablet+= key + ':' + cssStyle.tablet[key] + ';';

        });


        //combine style for phone
        _.each(_.keys(cssStyle.phone), function(key){

            if (cssStyle.phone[key]!== '')
                phone+= key + ':' + cssStyle.phone[key] + ';';

        });

        var selector = '';

        if (this.model.get('etype') === 'page')
        { //need to include the selector for popup and widget also, by doing so, the outer most style will work on a page template and in widget... make sure to include the .c37-popup-container and c37-widget-container when rendering page content for popup and widget
            selector = '.c37-page-container#page-'+c37GetPageCSSID() +', .c37-widget-container#widget-'+c37GetPageCSSID();
            // selector = '#c37-page-container #' + c37GetPageCSSID() + ', .c37-popup-container #' + c37GetPageCSSID() + ', .c37-widget-container #' + c37GetPageCSSID();
        } else if  (this.model.get('etype') === 'button')
        {
            selector = '#' + c37GetPageCSSID() + ' #' + model.get('editingElementID') + ' '  + (typeof cssStyle.innerSelector!== 'undefined' && cssStyle.innerSelector !== '' ? cssStyle.innerSelector : 'button') + ' ';
        }
        else
            selector = '#' + c37GetPageCSSID() + ' #' + model.get('editingElementID') + ' '  + (typeof cssStyle.innerSelector!== 'undefined' ? cssStyle.innerSelector : '') + ' ';
        var cssRules = '';
        //apply non-size rules for all device (colors ...)
        cssRules += selector + '{' +desktop.replace(/\n/g, ' ')+'}';

        cssRules += '@media only screen and (min-width : 320px) { '+ selector + '{' +phone.replace(/\n/g, ' ')+' } }';
        cssRules += '@media only screen and (min-width : 768px) { '+ selector + '{' +tablet.replace(/\n/g, ' ')+' } }';
        cssRules += '@media only screen and (min-width : 992px) { '+ selector + '{' +desktop.replace(/\n/g, ' ')+' } }';

        //remove the current style element in the head of this particular element, if available
        jQuery('[data-css='+this.model.get('editingElementID')+']').remove();
        //add the new style to the head
        jQuery('head').append('<style class="c37-custom-css" data-css="'+this.model.get('editingElementID')+'"> '+ cssRules +' </style>');
    }

});

// var CountdownEdit = ElementEditView.extend({
//     //countdownEdit
//     el: '#element-settings',
//     initialize: function () {
//         this.render();
//     },
//     editingElement: function () {
//         return jQuery('#'+this.model.get('editingElementID'));
//     },
//     template: _.template(
//         getEditForm('countdownEdit')
//     ),
//     render: function () {
//         this.$el.html(this.template());
//     },
//     additionalEvents: {
//         'input .for-countdown [data-for=count-amount] input[type=number]' : 'updateModel',
//         'click .for-countdown [data-for=count-amount] input[type=checkbox]' : 'updateModel',
//     },
//
//     updateModel: function()
//     {
//         var days = this.$el.find('[data-for=days] input[type=number]').first().val();
//         var hours = this.$el.find('[data-for=hours] input[type=number]').first().val();
//         var minutes = this.$el.find('[data-for=minutes] input[type=number]').first().val();
//         var seconds = this.$el.find('[data-for=seconds] input[type=number]').first().val();
//
//
//         var displayDays = this.$el.find('[data-for=days] input[type=checkbox]').first().is(":checked");
//         var displayHours = this.$el.find('[data-for=hours] input[type=checkbox]').first().is(":checked");
//         var displayMinutes = this.$el.find('[data-for=minutes] input[type=checkbox]').first().is(":checked");
//         var displaySeconds = this.$el.find('[data-for=seconds] input[type=checkbox]').first().is(":checked");
//
//
//
//         //get element ID and store back to the model object
//         var elementID = this.model.get('editingElementID');
//         var data = {
//             days : days,
//             hours: hours,
//             minutes: minutes,
//             seconds: seconds,
//             editingElementID: elementID,
//             displayDays: displayDays,
//             displayHours: displayHours,
//             displayMinutes: displayMinutes,
//             displaySeconds: displaySeconds
//         };
//         this.model.set(data);
//
//     }
//
// });

//
// var FlipCountdownEdit = ElementEditView.extend({
//     //countdownEdit
//     el: '#element-settings',
//     initialize: function () {
//         this.render();
//         this.selectCountType();
//
//     },
//     editingElement: function () {
//         return jQuery('#'+this.model.get('editingElementID'));
//     },
//     template: _.template(
//         getEditForm('flipCountdownEdit')
//     ),
//     render: function () {
//         this.$el.html(this.template(this.model.toJSON()));
//     },
//     additionalEvents: {
//         'input .for-simple-countdown input[type=number]' : 'updateModel',
//         'input .for-simple-countdown input[type=text]' : 'updateModel',
//         'click .for-simple-countdown input[type=checkbox]' : 'updateModel',
//         'change .for-simple-countdown select' : 'updateModel'
//     },
//
//     selectCountType: function()
//     {
//         var countTo = this.$el.find('#count-to').is(":checked");
//         var countAmount = this.$el.find('#count-amount').is(":checked");
//         var countToOptions = this.$el.find('[data-for=count-to]');
//         var countAmountOptions = this.$el.find('[data-for=count-amount]');
//         if (!countTo &&  !countAmount)
//         {
//             countAmountOptions.show();
//             countToOptions.hide();
//         } else if (countTo)
//         {
//             countToOptions.show();
//             countAmountOptions.hide();
//         } else
//         {
//             countAmountOptions.show();
//             countToOptions.hide();
//         }
//
//         return countTo? "countTo" : "countAmount";
//
//     },
//
//     updateModel: function()
//     {
//         var type = this.selectCountType();
//         var days = this.$el.find('[data-for=days] input[type=number]').first().val();
//         var hours = this.$el.find('[data-for=hours] input[type=number]').first().val();
//         var minutes = this.$el.find('[data-for=minutes] input[type=number]').first().val();
//         var seconds = this.$el.find('[data-for=seconds] input[type=number]').first().val();
//         var language = this.$el.find('[data-for=language]').first().val();
//         var clockDisplay = this.$el.find('[data-for=clock-display]').val();
//         console.log(clockDisplay);
//
//         console.log('hours: ' + hours);
//
//
//
//         //get element ID and store back to the model object
//         var elementID = this.model.get('editingElementID');
//         var data = {
//             days : days,
//             hours: hours,
//             minutes: minutes,
//             seconds: seconds,
//             editingElementID: elementID,
//             language: language,
//             clockDisplay: clockDisplay,
//             type: type
//         };
//         this.model.set(data);
//         core37Page.pageSettings.flipCountdown[elementID] = data;
//
//     }
//
// });




var SimpleCountdownEdit = ElementEditView.extend({
    //countdownEdit
    el: '#element-settings',
    initialize: function () {
        this.render();
        this.selectCountType();

    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(
        getEditForm('simpleCountdownEdit')
    ),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    additionalEvents: {
        'input .for-simple-countdown input[type=number]' : 'updateModel',
        'input .for-simple-countdown input[type=text]' : 'updateModel',
        'click .for-simple-countdown input[type=checkbox]' : 'updateModel',
        'click .for-simple-countdown input[type=radio]' : 'updateModel',
        'input .for-simple-countdown input[type=datetime-local]' : 'updateModel',
        'change .for-simple-countdown select' : 'updateModel',
        'input .for-simple-countdown textarea' : 'updateModel'
    },

    selectCountType: function()
    {
        var countTo = this.$el.find('#count-to').is(":checked");
        var countAmount = this.$el.find('#count-amount').is(":checked");
        var countToOptions = this.$el.find('[data-for=count-to]');
        var countAmountOptions = this.$el.find('[data-for=count-amount]');
        if (!countTo &&  !countAmount)
        {
            countAmountOptions.show();
            countToOptions.hide();
        } else if (countTo)
        {
            countToOptions.show();
            countAmountOptions.hide();
        } else
        {
            countAmountOptions.show();
            countToOptions.hide();
        }

        return countTo? "countTo" : "countAmount";

    },

    updateModel: function()
    {
        var type = this.selectCountType();
        var days = this.$el.find('[data-for=days]').first().val();
        var hours = this.$el.find('[data-for=hours]').first().val();
        var minutes = this.$el.find('[data-for=minutes]').first().val();
        var seconds = this.$el.find('[data-for=seconds]').first().val();
        var language = this.$el.find('[data-for=language]').first().val();
        var clockDisplay = this.$el.find('[data-for=clock-display]').val();
        var toDate = this.$el.find('[data-for=datetime-local]').first().val();

        var daysLabel = this.$el.find('[data-for=days-label]').first().val();
        var hoursLabel = this.$el.find('[data-for=hours-label]').first().val();
        var minutesLabel = this.$el.find('[data-for=minutes-label]').first().val();
        var secondsLabel = this.$el.find('[data-for=seconds-label]').first().val();

        var action = this.$el.find('[data-for=action]').first().val();
        var actionValue = encodeURIComponent(this.$el.find('[data-for=action-value]').first().val());

        //get element ID and store back to the model object
        var elementID = this.model.get('editingElementID');
        var data = {
            days : days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            editingElementID: elementID,
            language: language,
            clockDisplay: clockDisplay,
            type: type,
            date: toDate,
            action: action,
            actionValue: actionValue,
            daysLabel: daysLabel,
            hoursLabel: hoursLabel,
            minutesLabel: minutesLabel,
            secondsLabel: secondsLabel
        };
        this.model.set(data);
        core37Page.pageSettings.simpleCountdown[elementID] = data;

    }

});


var OtherVideosEdit = ElementEditView.extend({

    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(
        getEditForm('otherVideosEdit')
    ),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    additionalEvents : {
        'input .for-other-videos [data-for=source]' : 'updateModel'
    },

    updateModel: function () {
        //render basic validation
        var source = encodeURIComponent(this.$el.find('[data-for=source]').first().val());
        var elementID = this.model.get('editingElementID');

        this.model.set({
            source: source,
            editingElementID: elementID
        });
    }


});

var SimpleNavbarEdit = ElementEditView.extend({

    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(
        getEditForm('simpleNavbarEdit')
    ),
    render: function () {
    
        var that = this;
        that.$el.html(this.template(this.model.toJSON()));
        var navEditor = navEditor || CKEDITOR.replace('nav-editor');

        var model = this.model;

        var content = '';

        _.each(this.model.get('items'), function(i){
            content += '<li>' + decodeURIComponent(i) + '</li>';
        });

        content = '<ul>' + content + '</ul>';

        navEditor.on("instanceReady", function(e){

            c37ApplyFontsToEditor(navEditor);
            navEditor.setData(content);

        });

        navEditor.on('change', function(){

            var content = jQuery.parseHTML(navEditor.getData());

            var items = [];
            //console.log(editor.getData());
            //parse the content to get the google webfont

            _.each(content, function(pi){
                if ((typeof jQuery(pi).html()) != "undefined" && jQuery(pi).html() != "")
                {
                    items.push(encodeURIComponent(jQuery(pi).html()));
                } else if (jQuery(pi).is("link"))//if it's a google font
                {
                    c37RenderWebFonts(jQuery(pi).get(0).outerHTML);
                }

            });
            model.set({items: items});

            that.updateModel();
        });

    },
    additionalEvents : {
        'input .for-simple-navbar [data-for=nav-brand]' : 'updateModel',
        'change .for-simple-navbar [data-for=nav-color]' : 'updateModel',
        'change .for-simple-navbar [data-for=nav-style]' : 'updateModel',
        'change .for-simple-navbar [data-for=nav-alignment]' : 'updateModel'
    },

    updateModel: function () {
        //render basic validation
        var brand = this.$el.find('[data-for=nav-brand]').first().val();
        var navColor = this.$el.find('[data-for=nav-color]').first().val();
        var navStyle = this.$el.find('[data-for=nav-style]').first().val();
        var navAlignment = this.$el.find('[data-for=nav-alignment]').first().val();

        this.model.set('color', navColor);
        this.model.set('brand', brand);
        this.model.set('alignment', navAlignment);
        this.model.set('style', navStyle);
    }


});




var TextInputEdit = ElementEditView.extend({

    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('textEdit')),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    additionalEvents : {
        'input .for-text [data-for=placeholder]' : 'updateModel',
        'input .for-text [data-for=name]' : 'updateModel',
        'blur .for-text [data-for=icon]' : 'updateModel',
        'input .for-text [data-for=input-label]' : 'updateModel',
        'input .for-text [data-for=input-value]' : 'updateModel',
        'change .for-text select[data-for=input-type]' : 'updateModel',
        'change .for-text select[data-for=element-width]' : 'updateModel',
        'change .for-text input[data-for=expand]' : 'updateModel',
    },

    updateModel: function () {
        //render basic validation
        ElementEditView.prototype.renderValidation.apply(this);
        var placeholder = this.$el.find('[data-for=placeholder]').first().val();
        var label = this.$el.find('[data-for=input-label]').first().val();
        var type = this.$el.find('select[data-for=input-type]').first().find(':selected').val();
        var name = this.$el.find('[data-for=name]').first().val();
        var required = this.$el.find('.validation input[type=checkbox]').first().is(':checked');
        var icon = this.$el.find('[data-for=icon]').first().val();
        var value = this.$el.find('[data-for=input-value]').first().val();
        console.log('icon is: ' + icon);

        //update the model so the view will be updated
        this.renderSizeObject();
        this.model.set({
            name: name,
            required: required,
            type: type,
            placeholder: placeholder,
            label: label,
            icon: icon,
            value: value
        });

        this.model.set('name', name);
        this.model.set('icon', icon);
        this.model.set('required', required);
        this.model.set('type', type);
        this.model.set('value', value);

        /*

        placeholder: 'enter text here',


        value: '',
        etype: 'input'
         */
    }


});

var CheckBoxEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(
        getEditForm('checkboxEdit')
    ),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    events : {
        'click .for-checkbox .add-option' : 'addOption',
        'input .for-checkbox .options input' : 'updateModel',
        'change .for-checkbox .options input[type=checkbox]' : 'updateModel',
        'input .for-checkbox [data-for=name]': 'updateModel',
        'change .for-checkbox select[data-for=alignment]': 'updateModel',
        'change .for-checkbox select[data-for=element-width]': 'updateModel',
        'change .for-checkbox input[data-for=expand]' : 'updateModel',
        // 'input .css-styles input' : 'renderStyle',
        // 'change .css-styles select' : 'renderStyle',
    },
    addOption: function(){
        this.$el.find('.options').append(
            '<div  class="c37-row single-option">'+
            '<div class="c37-col-7">'+
            '<input class="full" type="text" data-for="value" placeholder="new option"  />'+
            '</div>'+
            '<div class="c37-col-5">'+
            '<label class="control control--checkbox">Checked'+
            '<input type="radio" data-for="checked" name="checkbox-settings" />'+
            '<div class="control__indicator"></div>'+
            '</div>'+
            '</div>'
        )
    },

    updateModel: function () {
        var name = this.$el.find('[data-for=name]').first().val();
        var alignment = this.$el.find('[data-for=alignment]').first().val();

        var options = [];

        this.$el.find('.single-option').each(function(){

            var valueInput = jQuery(this).find('[data-for=value]').first();
            var checked = jQuery(this).find('[data-for=checked]').first().is(':checked')
            var id = jQuery(this).find('[data-for=id]').first();

            console.log(valueInput.val());

            if (valueInput.val() == "")
                return;

            var single = {
                value: encodeURIComponent(valueInput.val()),//URIEncode the value from here
                checked: checked,
                id: id.val()
            };

            options.push(single);
        });

        //update the model
        this.renderSizeObject();
        this.model.set({name: name, options: options, alignment: alignment});

    }

});

//edit form for radio
var RadioEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(
        getEditForm('radioEdit')
    ),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    events : {
        'click .for-radio .add-option' : 'addOption',
        'input .for-radio .options input' : 'updateModel',
        'change .for-radio .options input[type=radio]' : 'updateModel',
        'input .for-radio [data-for=name]': 'updateModel',
        'change .for-radio select[data-for=alignment]': 'updateModel'

    },
    removeElement: removeElement,

    addOption: function(){
        this.$el.find('.options').append(
            '<div  class="c37-row single-option">'+
            '<div class="c37-col-7">'+
            '<input class="full" type="text" data-for="value" placeholder="new option"  />'+
            '</div>'+
            '<div class="c37-col-5">'+
            '<label class="control control--checkbox">Checked'+
            '<input type="radio" data-for="checked" name="radio-settings" />'+
            '<div class="control__indicator"></div>'+
            '</div>'+
            '</div>'
        )
    },

    updateModel: function () {

        var name = this.$el.find('[data-for=name]').first().val();
        var alignment = this.$el.find('[data-for=alignment]').first().val();


        var options = [];

        this.$el.find('.single-option').each(function(){

            var valueInput = jQuery(this).find('[data-for=value]').first();
            var checked = jQuery(this).find('[data-for=checked]').first().is(':checked');

            if (valueInput.val() === "")
                return;

            var single = {
                value: encodeURIComponent(valueInput.val()),
                checked: checked
            };

            options.push(single);
        });

        //update the model
        this.model.set('options', options);
        this.model.set('name', name);
        this.model.set('alignment', alignment);
    }

});

//edit form for label
var LabelEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('labelEdit')),
    render: function () {
        this.$el.html(this.template());
    },
    events: {
        'input .for-label [data-for=label]' : 'updateModel',
        'change .for-label [data-for=required]' : 'updateModel',
        'change .for-label select[data-for=element-width]' : 'updateModel',
        'change .for-label input[data-for=expand]' : 'updateModel',
        'input [data-for=text-color] input' : renderCSS,
        'input [data-for=background-color] input' : renderCSS,
    },

    updateModel: function () {
        ////this function will update the model, the model, in turn, update the view
        var content = this.$el.find('input[data-for=label]').first().val();
        var required = this.$el.find('input[data-for=required]').first().is(':checked');

        console.log(required);
        console.log('label update');

        this.renderSizeObject();
        this.model.set({content: content, required: required});
    }
});

var HeadingEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('headingEdit')),
    render: function () {
        this.$el.html(this.template());
    },
    events: {
        'input .for-heading [data-for=heading]' : 'updateModel',
        'change .for-heading [data-for=tagName]' : 'updateModel',
        'change .for-heading select[data-for=element-width]' : 'updateModel',
        'change .for-heading input[data-for=expand]' : 'updateModel',
        'input [data-for=text-color] input' : 'renderStyle',
        'input [data-for=background-color] input' : 'renderStyle',
    },

    updateModel: function () {
        var content = this.$el.find('input[data-for=heading]').first().val();
        var tagName = this.$el.find('[data-for=tagName]').val();
        console.log(tagName);
        this.model.set({
            content: content,
            tagName: tagName
        });

        this.renderSizeObject();
    }
});

var ParagraphEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('paragraphEdit')),
    render: function () {
        var that = this;
        that.$el.html(this.template(this.model.toJSON()));
        var textEditor = textEditor ||  CKEDITOR.replace('c37-text-edit');

        var model = this.model;
        textEditor.on("instanceReady", function(e){
            textEditor.setData(decodeURIComponent(model.get('content')));
            c37ApplyFontsToEditor(textEditor);

        });

        textEditor.on('change', function(){
            var paragraphHTML  = jQuery.parseHTML(textEditor.getData());
            var content = "";
            _.each(paragraphHTML, function(el){
                if (jQuery(el).is("link"))
                {
                    c37RenderWebFonts(jQuery(el).get(0).outerHTML);
                    jQuery(el).remove();
                } else {
                    if (typeof jQuery(el).html() != "undefined")
                        content += jQuery(el).get(0).outerHTML;
                }
            });

            model.set('content', encodeURIComponent(content));
        });

    },
    additionalEvents: {
        'input .for-paragraph textarea[data-for=paragraph]' : 'updateModel',
        'change .for-paragraph select[data-for=element-width]' : 'updateModel',
        'change .for-paragraph input[data-for=expand]' : 'updateModel',
        'click .for-paragraph [data-for=text-color] .reset-color' : 'clearTextColor',
    },

    updateModel: function () {
        var content = this.$el.find('textarea[data-for=paragraph]').first().val();

        this.model.set('content', content);
    }
});


var IconEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    template: _.template(getEditForm('iconEdit')),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    additionalEvents: {
        'blur .for-icon input[data-for=icon]' : 'updateModel',
        'input .for-icon input[data-for=size]' : 'updateModel',
        'input .for-icon input[data-for=color]' : 'updateModel',
        'change .for-icon select[data-for=icon-alignment]' : 'updateModel'
    },

    updateModel: function () {
        var color = this.$el.find('[data-for=color]').first().val();
        var icon = this.$el.find('[data-for=icon]').first().val();
        var size = this.$el.find('[data-for=size]').first().val();
        var align = this.$el.find('[data-for=icon-alignment]').first().val();

        this.model.set('color', color);
        this.model.set('icon', icon);
        this.model.set('size', size);
        this.model.set('align', align);


    }
});

var TextAreaEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('textAreaEdit')),
    render: function () {
        this.$el.html(this.template());
        //refreshAccordion();
    },
    additionalEvents: {
        'input .for-textarea input[type=text]' : 'updateModel',
        'change .for-textarea input[type=checkbox]' : 'updateModel',
        'change .for-textarea input[data-for=required]' : 'updateModel',
        'input .for-textarea [data-for=input-label]' : 'updateModel',
        'change .for-textarea select[data-for=element-width]' : 'updateModel',
        'change .for-textarea input[data-for=expand]' : 'updateModel'

    },

    updateModel: function () {
        var placeholder = this.$el.find('input[data-for=placeholder]').first().val();
        var name = this.$el.find('input[data-for=name]').first().val();
        var required = this.$el.find('input[data-for=required]').first().is(':checked');
        var label = this.$el.find('[data-for=input-label]').first().val();


        this.model.set({
            name: name,
            required: required,
            placeholder: placeholder,
            label: label
        });

        //update model
        this.renderSizeObject();

    }
});

//Date input
var DateEdit = ElementEditView.extend({

    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(
        getEditForm('dateEdit')
    ),
    render: function () {
        this.$el.html(this.template());
        //refreshAccordion();
    },
    events : {
        'input .for-date [data-for=default-value]' : 'renderDateElement',
        'input .for-date [data-for=name]' : 'renderDateElement',
        'change .for-date select[data-for=element-width]' : 'renderDateElement',
        'change .for-date input[data-for=expand]' : 'renderDateElement',
        'click .for-date .remove-element' : 'removeElement',
        'change .for-date [data-for=date-type]' : 'renderDateElement',
        'input [data-for=text-color] input' : renderCSS,
        'input [data-for=background-color] input' : renderCSS
    },

    renderDateElement: function(){
        //element is the currently edited element
        var element = this.editingElement();
        var value = this.$el.find('[data-for=default-value]').first().val();
        var type = this.$el.find('select[data-for=date-type]').first().find(':selected').val();
        var name = this.$el.find('[data-for=name]').first().val();

        this.model.set({
            value: value,
            type: type,
            name: name
        });

        this.renderSizeObject();
        //update date input type on the setting panel
        this.$el.find('[data-for=default-value]').attr('type', type);

    }

});

// button edit form
var ButtonEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('buttonEdit')),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    additionalEvents: {
        'input .for-button input[data-for=text]' : 'updateModel',
        'blur .for-button input[data-for=icon]' : 'updateModel',
        'input .for-button input[data-for=url]' : 'updateModel',
        'input .for-button input[data-for=name]' : 'updateModel',
        'change .for-button select[data-for=element-width]' : 'updateModel',
        'change .for-button input[data-for=expand]' : 'updateModel',
        'change .for-button #button-presets select' : 'renderPresetStyles',
        'click .for-button .c37-image-picker' : 'openImageSelector',
        'click .for-button .c37-remove-image' : 'removeImage',
    },

    removeImage: function(){
        this.model.set('buttonImage', '');
    },
    renderPresetStyles: function(){
        var style = this.$el.find('#button-presets [data-for=style]').first().val();
        var shape = this.$el.find('#button-presets [data-for=shape]').first().val();
        var color = this.$el.find('#button-presets [data-for=color]').first().val();
        var size = this.$el.find('#button-presets [data-for=size]').first().val();
        this.model.set( 'preset', {
            style: style,
            shape: shape,
            color: color,
            size: size
        });


    },

    openImageSelector : function() {

        if (!versionNangCap)
        {
            showUpgradeDialog();
            return;
        }
        if (this.frame)
        {
            this.frame.open();
            return;
        } else
        {
            var el = this.$el;
            var frame = this.frame;
            var model = this.model;
            frame = wp.media({
                'title' : 'select an image',
                'button' : {
                    text: 'Use this image'
                },
                multiple: false
            });

            frame.on('select', function(){
                var attachment = frame.state().get('selection').first().toJSON();
                el.find('.c37-button-image-preview').first().attr('src', attachment.url);
                //update the model
                model.set('buttonImage',  attachment.url);


            });

            frame.open();
        }
    },

    updateModel: function () {

        var text = this.$el.find('input[data-for=text]').first().val();
        var name = this.$el.find('input[data-for=name]').first().val();
        var icon = this.$el.find('input[data-for=icon]').first().val();
        console.log("icon is: ", icon);
        this.model.set('text', text);
        this.model.set('name', name);
        this.model.set('icon', icon);
    }
});


var InputSubmitEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('buttonEdit')),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

    },
    additionalEvents: {
        'input .for-button input[data-for=text]' : 'updateModel',
        'input .for-button input[data-for=url]' : 'updateModel',
        'input .for-button input[data-for=name]' : 'updateModel',
        'change .for-button select[data-for=element-width]' : 'updateModel',
        'change .for-button input[data-for=expand]' : 'updateModel',
        'change #button-presets select' : 'renderPresetStyles',
    },

    renderPresetStyles: function(){
        var style = this.$el.find('#button-presets [data-for=style]').first().val();
        var shape = this.$el.find('#button-presets [data-for=shape]').first().val();
        var color = this.$el.find('#button-presets [data-for=color]').first().val();
        var size = this.$el.find('#button-presets [data-for=size]').first().val();
        this.model.set( 'preset', {
            style: style,
            shape: shape,
            color: color,
            size: size
        });


    },

    updateModel: function () {

        var text = this.$el.find('input[data-for=text]').first().val();
        var name = this.$el.find('input[data-for=name]').first().val();
        var icon = this.$el.find('input[data-for=icon]').first().val();
        console.log('setting text, ', text);
        this.model.set('text', text);
        this.model.set('name', name);
        this.model.set('icon', icon);
    }
});

var SelectEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(
        getEditForm('selectEdit')
    ),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        //make the setting panel an accordion
        //refreshAccordion();
    },
    events : {
        'click .for-select .add-option' : 'addOption',
        'input .for-select .options input' : 'updateModel',
        'change .for-select .options input[type=radio]' : 'updateModel',
        'input .for-select [data-for=name]': 'updateModel',

    },
    removeElement: removeElement,

    addOption: function(){
        this.$el.find('.options').append(
            '<div  class="row single-option">'+
            '<div class="c37-col-7">'+
            '<input class="full" type="text" data-for="value" placeholder="new option"  />'+
            '</div>'+
            '<div class="c37-col-5">'+
            '<label class="control control--radio">Selected'+
            '<input type="radio" data-for="checked" name="select-settings" />'+
            '<div class="control__indicator"></div>'+
            '</div>'+
            '</div>'
        )
    },

    updateModel: function () {

        var name = this.$el.find('[data-for=name]').first().val();
        var options = [];

        this.$el.find('.single-option').each(function(){

            var valueInput = jQuery(this).find('[data-for=value]').first();
            var selected = jQuery(this).find('[data-for=checked]').first().is(':checked');

            if (valueInput.val() === "")
                return;

            var single = {
                value: encodeURIComponent(valueInput.val()),
                selected: selected
            };

            options.push(single);
        });

        //update the model
        this.model.set('options', options);
        this.model.set('name', name);
    }

});



//acceptance edit
var AcceptanceEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('acceptanceEdit')),
    render: function () {
        this.$el.html(this.template());
    },
    events: {
        'input .for-acceptance [data-for=text]' : 'updateModel',
        'input .for-acceptance [data-for=error]' : 'updateModel',
        'change .for-acceptance input[data-for=expand]' : 'updateModel',
        'change .for-acceptance select[data-for=element-width]' : 'updateModel',
        'input [data-for=text-color] input' : 'renderStyle',
        'input [data-for=background-color] input' : 'renderStyle'
    },

    updateModel: function () {
        var text = this.$el.find('input[data-for=text]').first().val();
        var name = this.$el.find('[data-for=name]').first().val();
        var error_message = this.$el.find('[data-for=error]').first().val();

        this.model.set({
            name: name,
            text: text,
            error_message: error_message
        });

        this.renderSizeObject();

    }
});

//file edit
var FileEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    }
    ,
    template: _.template(getEditForm('fileEdit')),
    render: function () {
        this.$el.html(this.template());
    },
    events: {
        'input .for-file [data-for=name]' : 'updateModel',
        'change .for-file input[data-for=multiple]' : 'updateModel',
        'blur .for-file [data-for=icon]' : 'updateModel',
        'input .for-file [data-for=text]' : 'updateModel',
        'change .for-file .validation select[data-for=file-type]' : 'renderValidation',
        'input [data-for=text-color] input' : 'renderStyle',
        'input [data-for=background-color] input' : 'renderStyle'
    },

    renderValidation: function(){

        ElementEditView.prototype.renderValidation.apply(this);
        var fileType = this.$el.find('.validation select[data-for=file-type]').first().val();
        //var elementID = this.model.get('editingElementID');
        ////add filetype rule
        //validation[elementID]['rules']['file-type'] = fileType;


        //update the accept attribute of file input
        this.model.set({file_type: fileType});
    },

    updateModel: function () {
        var name = this.$el.find('[data-for=name]').first().val();
        var multiple = this.$el.find('[data-for=multiple]').is(':checked');
        var text = this.$el.find('[data-for=text]').first().val();
        var icon = this.$el.find('[data-for=icon]').first().val();
        //file type is an object storing two information: type and details
        //for pre-defined type (videos/audio..) the type and details
        var file_type =
        {
            type: this.$el.find('[data-for=file-type]').first().find(':selected').val(),
            details: ''
        };



        this.model.set({
            name: name,
            multiple: multiple,
            file_type: file_type,
            text: text,
            icon: icon
        });



        this.renderSizeObject();

    }
});

var ImageEdit = ElementEditView.extend({

    el: '#element-settings',
    frame: null,
    initialize: function()
    {
        this.render();
    },

    template: _.template(getEditForm('imageEdit')),

    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));
    },
    getParent: function(){
        return jQuery('#' + this.model.get('editingElementID'));
    },
    additionalEvents: {
        'click .for-image .c37-image-changer' : 'openImageSelector',
        'change [data-for=image-alignment]' : 'updateModel'
    },

    openImageSelector : function() {
        if (this.frame)
        {
            this.frame.open();
            return;
        } else
        {
            var el = this.$el;
            var frame = this.frame;
            var model = this.model;
            frame = wp.media({
                'title' : 'select an image',
                'button' : {
                    text: 'Use this image'
                },
                multiple: false
            });

            frame.on('select', function(){
                var attachment = frame.state().get('selection').first().toJSON();
                console.log(attachment.url);
                el.find('.c37-image-preview').first().attr('src', attachment.url);
                //update the model
                model.set('src',  attachment.url);


            });

            frame.open();
        }
    },
    updateModel: function()
    {
        var alignmentClass = this.$el.find('select[data-for=image-alignment]').val();
        console.log("alignment: ", alignmentClass);
        var parent = this.getParent();
        parent.removeClass('c37-left');
        parent.removeClass('c37-right');
        parent.removeClass('c37-center');

        parent.addClass(alignmentClass);

        this.model.set('alignmentClass', alignmentClass);

    }




});



var ImageSlidersEdit = ElementEditView.extend({

    el: '#element-settings',
    frame: null,
    initialize: function()
    {
        console.log('how are you');
        this.render();
    },

    template: _.template(getEditForm('imageSlidersEdit')),

    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));
    },
    getParent: function(){
        return jQuery('#' + this.model.get('editingElementID'));
    },
    additionalEvents: {
        'click .for-image-sliders .c37-image-changer' : 'openImageSelector',
        'change .for-image-sliders [data-for=image-alignment]' : 'updateModel',
        'click .for-image-sliders .remove-single-slider' : 'removeSingleSlider',
        'click .for-image-sliders .add-image-slider' : 'addSingleSlider',
        'click .for-image-sliders .slider-image': 'changeImage',
        'blur .for-image-sliders input': 'updateModel',

    },

    makeListSortable: function() {
      jQuery('.all-sliders').sortable();
    },

    removeSingleSlider: function(event){
        jQuery(event.target).closest('.single-img-slider').remove();
        this.makeListSortable();
        this.updateModel();

    },

    addSingleSlider: function(event) {
        this.makeListSortable();
        jQuery(event.target).closest('.for-image-sliders').find('.all-sliders').append('<div class="c37-row single-img-slider"> <img class="slider-image" src="https://picsum.photos/200/300" alt=""> <input type="text" value="" placeholder="enter image link"> <i class="fa fa-close remove-single-slider"></i></div>');
        this.updateModel();
    },

    changeImage : function(event) {

        var that = this;
        if (this.frame)
        {
            this.frame.open();
            return;
        } else
        {
            var frame = this.frame;
            frame = wp.media({
                'title' : 'select an image',
                'button' : {
                    text: 'Use this image'
                },
                multiple: false
            });

            frame.on('select', function(){
                var attachment = frame.state().get('selection').first().toJSON();
                console.log(attachment.url);
                jQuery(event.target).attr('src', attachment.url);
                that.updateModel();
            });

            frame.open();
        }
    },
    updateModel: function()
    {
        console.log('updat emodel');
        var images = [];
        _.each(this.$el.find('.single-img-slider'), function(singleRow){
            images.push({
                src: jQuery(singleRow).find('img').attr('src'),
                target: jQuery(singleRow).find('input').val()
            });
        });

        this.model.set('images', images);

    }




});

var ImageLinkEdit = ElementEditView.extend({

    el: '#element-settings',
    frame: null,
    initialize: function()
    {
        this.render();
    },

    template: _.template(getEditForm('imageLinkEdit')),

    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));
    },
    getParent: function(){
        return jQuery('#' + this.model.get('editingElementID'));
    },
    additionalEvents: {
        'click .for-image-link .c37-image-changer' : 'openImageSelector',
        'change .for-image-link [data-for=image-alignment]' : 'updateModel',
        'blur .for-image-link [data-for=url]' : 'updateModel',
        'change .for-image-link [data-for=url-target]' : 'updateModel'
    },

    openImageSelector : function() {
        if (this.frame)
        {
            this.frame.open();
            return;
        } else
        {
            var el = this.$el;
            var frame = this.frame;
            var model = this.model;
            frame = wp.media({
                'title' : 'select an image',
                'button' : {
                    text: 'Use this image'
                },
                multiple: false
            });

            frame.on('select', function(){
                var attachment = frame.state().get('selection').first().toJSON();
                console.log(attachment.url);
                el.find('.c37-image-preview').first().attr('src', attachment.url);
                //update the model
                model.set('src',  attachment.url);


            });

            frame.open();
        }
    },
    updateModel: function()
    {
        var imageAlignment = this.$el.find('select[data-for=image-alignment]').val();
        var parent = this.getParent();
        var url = this.$el.find('[data-for=url]').first().val();
        var target = this.$el.find('[data-for=url-target]').first().val();

        this.model.set('url', url);
        this.model.set('target', target);
        this.model.set('alignmentClass', imageAlignment);
        parent.removeClass('c37-left');
        parent.removeClass('c37-right');
        parent.removeClass('c37-center');

        parent.addClass(imageAlignment);

    }




});


var StarsEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function(){
        this.render();
    },

    template: _.template(getEditForm('starsEdit')),

    render: function()
    {
        this.$el.html(this.template());
    },
    events: {
        'change .for-stars [data-for=theme]' : 'updateModel',
        'input .for-stars [data-for=options]' : 'updateModel',
        'change .for-stars [data-for=initial-rating]' : 'updateInitialValue',
        'change .for-stars [data-for=show-labels]' : 'updateModel',
        'change .for-stars [data-for=show-selected]' : 'updateModel',
        'change .for-stars [data-for=name]' : 'updateModel'
    },

    updateInitialValue: function(){
        if (!versionNangCap)
        {
            showUpgradeDialog();
            return;
        }
        this.model.set({
           initialRating: this.$el.find('[data-for=initial-rating]').first().val()
        });
    },

    updateModel: function()
    {
        if (!versionNangCap)
        {
            showUpgradeDialog();
            return;
        }
        var model =this.model;

        //this function is called on all value changes, except intial value
        var theme = this.$el.find('[data-for=theme]').first().val();
        var name = this.$el.find('[data-for=name]').first().val();

        var showValues = this.$el.find('[data-for=show-labels]').first().is(':checked');
        var showSelectedRating = this.$el.find('[data-for=show-selected]').first().is(':checked');
        var options = [];
        var optionsString = jQuery.trim(this.$el.find('[data-for=options]').first().val());

        //re-render initial value select box
        _.each(optionsString.split("\n"), function(option){
            options.push({
                value: option,
                text: option
            });

        });

        //re-render the initial value select
        var initialSelectHTML = '';

        _.each(options, function(option){
            var selected = option.value == model.get('initialRating') ? "selected" : "";
           initialSelectHTML += '<option '+ selected +' value="'+option.value+'"  >'+option.text+'</option>';
        });

        this.$el.find('select[data-for=initial-rating]').first().html(initialSelectHTML);


        //after re-rendering the list, the initial value may not be in the select anymore
        //thus, updating it is necessaryv
        var initialRating = this.$el.find('[data-for=initial-rating]').first().val();


        //update the model
        this.model.set({
            showValues: showValues,
            options: options,
            theme: theme,
            initialRating: initialRating,
            showSelectedRating: showSelectedRating,
            name: name
        });

    }

});

//Video edit
var YouTubeVideoEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function(){
        this.render();
    },

    additionalEvents: {
        'input .for-video [data-for=video-code]' : 'updateModel',
        'change .for-video [data-for=hide-info]' : 'updateModel',
        'change .for-video [data-for=hide-controls]' : 'updateModel',
        'change .for-video [data-for=auto-play]' : 'updateModel',
        'input .for-video [data-for=width]' : 'updateModel',
        'input .for-video [data-for=height]' : 'updateModel',
    },
    template: _.template(getEditForm('videoEdit')),
    updateModel: function()
    {
        var videoURL = 'https://www.youtube.com/embed/' +getYouTubeID(this.$el.find('[data-for=video-code]').first().val());
        var hideInfo = this.$el.find('[data-for=hide-info]').first().is(':checked');
        var hideControls = this.$el.find('[data-for=hide-controls]').first().is(':checked');
        var autoPlay = this.$el.find('[data-for=auto-play]').first().is(':checked');
        var width = this.$el.find('[data-for=width]').first().val();
        var height = this.$el.find('[data-for=height]').first().val();

        this.model.set({
            videoURL: videoURL,
            hideInfo: hideInfo,
            hideControls: hideControls,
            autoPlay: autoPlay,
            width: width,
            height: height
        });
    },

    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));
    }

});


//Video edit
var SelfHostedVideoEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function(){
        this.render();
    },

    additionalEvents: {
        'input .for-self-hosted-video input[type=url]' : 'updateModel',
        'change .for-self-hosted-video input[type=checkbox]' : 'updateModel'
    },
    template: _.template(getEditForm('selfHostedVideoEdit')),
    updateModel: function()
    {
        var autoplay = this.$el.find('#autoplay').is(":checked");
        var muted = this.$el.find('#muted').is(":checked");
        var controls = this.$el.find('#controls').is(":checked");
        var loop = this.$el.find('#loop').is(":checked");

        var poster = this.$el.find('#video-poster').val();

        var mp4 = this.$el.find('#mp4').val();
        var webm = this.$el.find('#webm').val();
        var ogv = this.$el.find('#ogv').val();

        var data = {
            autoplay: autoplay,
            muted: muted,
            controls: controls,
            loop: loop,
            poster: poster,
            mp4: mp4,
            webm: webm,
            ogv: ogv
        };

        data.editingElementID = this.model.get('editingElementID');
        this.model.set(data);

    },

    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));
    }

});



var MenuEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function(){
        this.render();
    },
    titleEditor: null,

    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('menuEdit')),

    render: function()
    {
        //get list of menus
        // this.$el.html(this.template());

        var that = this;
        that.$el.html(this.template(this.model.toJSON()));

        that.titleEditor = that.titleEditor ||  CKEDITOR.replace('menu-title', {
                removeButtons: 'Superscript,SpecialChar,NumberedList,CreateDiv,-,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Link,Unlink,Anchor'

            });
        var model = this.model;



        that.titleEditor.on("instanceReady", function(e){
            if (typeof model.get('title') !== 'undefined')
            {
                that.titleEditor.setData(decodeURIComponent(model.get('title')));
                c37ApplyFontsToEditor(that.titleEditor);
            }


        });


    },

    additionalEvents: {
        'change .for-menu [data-for=wp-menu]' : 'updateModel',
        'change .for-menu [data-for=menu-styles]' : 'updateModel',
        'click .for-menu .menu-icon-picker' : 'openImageSelector',
        'click .for-menu .menu-icon-remover' : 'removeMenuIcon',
        'input .for-menu [data-for=item-color]' : 'updateModel',
        'blur .for-menu [data-for=item-size]' : 'updateModel',
        'change .for-menu [data-for=uppercase]' : 'updateModel'
    },

    updateModel: function()
    {
        var titleHTML  = jQuery.parseHTML(this.titleEditor.getData());
        var title = "";
        _.each(titleHTML, function(el){
            if (jQuery(el).is("link"))
            {
                c37RenderWebFonts(jQuery(el).get(0).outerHTML);
                jQuery(el).remove();
            } else {
                if (typeof jQuery(el).html() !== "undefined")
                    title += jQuery(el).get(0).outerHTML;
            }
        });

        title = encodeURIComponent(title.trim());


        var menuName = this.$el.find('[data-for=wp-menu]').first().val();
        var style = this.$el.find('[data-for=menu-styles]').first().val();

        var iconUrl = this.$el.find('.c37-menu-icon').first().attr('src');
        var itemSize = this.$el.find('[data-for=item-size]').first().val();
        var itemColor = this.$el.find('[data-for=item-color]').first().val();
        var uppercase = this.$el.find('[data-for=uppercase]').first().is(':checked');

        this.model.set('name', menuName);
        this.model.set('style', style);
        this.model.set('title', title);
        this.model.set('iconUrl', iconUrl);
        this.model.set('uppercase', uppercase);
        this.model.set('itemColor', itemColor);
        this.model.set('itemSize', itemSize);
    },

    openImageSelector: function() {
        var that = this;
        if (!versionNangCap || !isActivated)
        {
            showUpgradeDialog();
            return;
        }

        if (this.frame)
        {
            this.frame.open();
            return;
        } else
        {
            var el = this.$el;
            var frame = this.frame;

            frame = wp.media({
                frame: 'select',
                'title' : 'Select an image',
                'button' : {
                    text: 'Use this image'
                },
                library: {
                    type: 'image'
                },
                multiple: false,
                editing: false
            });

            frame.on('select', function(){

                var attachment = frame.state().get( 'selection' ).first().toJSON();

                if (!attachment)
                    return;

                console.log(attachment.url);
                el.find('.c37-menu-icon').first().attr('src', attachment.url);
                // iterate through selected elements

                that.updateModel();
            });

            frame.open();
        }
    },

    removeMenuIcon: function()
    {
        this.$el.find('.c37-menu-icon').first().attr('src', '');
        this.updateModel();
    }

});


var LineEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function(){
        this.render();
    },

    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
    },

    template: _.template(getEditForm('lineEdit')),

    additionalEvents: {
        'change .for-line [data-for=hr-line-style]' : 'updateModel'
    },

    updateModel: function()
    {
        var lineClass = this.$el.find('[data-for=hr-line-style]').first().val();
        this.model.set({lineClass: lineClass});
    }
});

var ULEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function(){
        this.render();
    },

    template: _.template(getEditForm('ulEdit')),

    render: function()
    {
        var that = this;
        that.$el.html(this.template(this.model.toJSON()));
        var ulEditor = ulEditor || CKEDITOR.replace('ul-editor');

        var model = this.model;

        var content = '';

        _.each(this.model.get('items'), function(i){
            content += '<li>' + decodeURIComponent(i) + '</li>';
        });

        content = '<ul>' + content + '</ul>';

        ulEditor.on("instanceReady", function(e){

            c37ApplyFontsToEditor(ulEditor);
            ulEditor.setData(content);

        });

        ulEditor.on('change', function(){

            var content = jQuery.parseHTML(ulEditor.getData());

            var items = [];
            //console.log(editor.getData());
            //parse the content to get the google webfont

            _.each(content, function(pi){
                if ((typeof jQuery(pi).html()) != "undefined" && jQuery(pi).html() != "")
                {
                    items.push(encodeURIComponent(jQuery(pi).html()));
                } else if (jQuery(pi).is("link"))//if it's a google font
                {
                    c37RenderWebFonts(jQuery(pi).get(0).outerHTML);
                }

            });
            model.set({items: items});

            that.updateModel();
        });
    },

    additionalEvents: {
        'blur .for-ul [data-for=icon]' : 'updateModel',
        'input .for-ul [data-for=icon-color]' : 'updateModel',
        'input .for-ul [data-for=icon-size]' : 'updateModel',
        'input .for-ul [data-for=list-padding]' : 'updateModel',
        'input .for-ul [data-for=left-padding]' : 'updateModel',
        'change .for-ul [data-for=icon-bg-color]' : 'updateModel',
        'change .for-ul [data-for=ul-text-align]' : 'updateModel',
        'click .for-ul [data-for=reset-icon-color]' : 'resetIconColor',
        'click .for-ul [data-for=reset-icon-bg-color]' : 'resetIconBgColor'
    },
    resetIconColor: function(e) {
      this.$el.find('[data-for=icon-color]').first().val('#fffffa');
      this.updateModel();
    },
    resetIconBgColor: function(e) {
      this.$el.find('[data-for=icon-bg-color]').first().val('#fffffa');
      this.updateModel();
    },
    updateModel: function()
    {
        var icon = this.$el.find('[data-for=icon]').first().val();
        var iconColor = this.$el.find('[data-for=icon-color]').first().val();
        var iconBgColor = this.$el.find('[data-for=icon-bg-color]').first().val();
        var textAlign = this.$el.find('[data-for=ul-text-align]').first().val();
        var iconSize = this.$el.find('[data-for=icon-size]').first().val();
        var listPadding = this.$el.find('[data-for=list-padding]').first().val();
        var leftPadding = this.$el.find('[data-for=left-padding]').first().val();

        iconColor = iconColor === '#fffffa' ? '' : iconColor;
        iconBgColor = iconBgColor === '#fffffa'? ''  : iconBgColor;

        this.model.set('icon', icon);
        this.model.set('iconColor', iconColor);
        this.model.set('iconBgColor', iconBgColor);
        this.model.set('iconSize', iconSize);
        this.model.set('align', textAlign);
        this.model.set('listPadding', listPadding);
        this.model.set('leftPadding', leftPadding);
    }

});


//form container edit
var FormContainerEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function()
    {
        this.render();
    },

    template: _.template(getEditForm('formContainerEdit')),

    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));
    },

    additionalEvents: {
        'blur .for-form-container [data-for=form-code]' : 'updateModel',
        'change .for-form-container [data-for=form-style]' : 'updateStyle',
    },

    updateStyle: function(){
        var form = jQuery('#' + this.model.get('editingElementID')).find('form');

        var presetCSSStyle = this.$el.find('[data-for=form-style]').first().val();


        //update style
        _.each(this.$el.find('[data-for=form-style] option'), function(option){

            form.removeClass(jQuery(option).val());

        });
        if (presetCSSStyle !== 'no-style')
            form.addClass(presetCSSStyle);
    },

    updateModel: function()
    {
        var formCode = this.$el.find('[data-for=form-code]').first().val().trim();

        var pattern = /<form[\s\S]*\/form>/i;
        var reg = new RegExp(pattern);

        var result = reg.exec(formCode);

        if (result!=null)
        {
            this.model.set('rawCode', encodeURIComponent(result[0]));
            console.log("code is valid, setting to model");
        } else
        {
            toastr.error('your code is not valid. Please check it again');
        }

    }

});



var CodeEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function () {
        this.render();
    },
    editingElement: function () {
        return jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('codeEdit')),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    events: {
        'blur .for-custom-code [data-for=code]' : 'updateModel'
    },

    updateModel: function () {
        var code = this.$el.find('textarea[data-for=code]').first().val();

        this.model.set({
            code: encodeURIComponent(code.replace(/(\r\n|\n|\r)/gm," ")),
        });

    }
});


//Row edit
var RowEdit = ElementEditView.extend({
    el: '#row-settings',
    initialize: function () {
        this.render();

    },
    editingRow: function () {
        return  jQuery('#'+this.model.get('editingElementID'));
    },
    template: _.template(getEditForm('rowEdit')),

    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));
    },

    additionalEvents: {
        'change .for-row select[data-for=layout]' : 'renderRow',
        'click .for-row .remove-element' : 'removeRow'
    },

    removeRow: function () {
        /*
         | Remove current row. If it is the last row in the step,
         | remove all content of current row
         */
        var currentStep = this.editingRow().parent('.c37-step');

        /*
         | In case there are more than one row in the step, remove the current row
         */
        if (currentStep.find('.c37-row').length > 1)
        {
            this.editingRow().remove();
        } else
        {
            /*
             | In case the selected row is the only row in the step, remove its content
             */
            this.editingRow().find('*').remove();

            //append c37-box so user can drop elements to the form again
            this.editingRow().append('<div class="c37-box c37-col-md-12"></div>');
            makeC37BoxDroppable(jQuery);
        }



    },

    renderRow: function () {
        console.log('calling render row');
        //get the row that currently edited
        var editingRow = this.editingRow();
        // var currentLayout = editingRow.attr('data-c37-layout');
        console.log("row model: ", this.model.toJSON());
        var currentLayout = this.model.get('layout');
        var newLayout = this.$el.find('select[data-for=layout]').first().val();

        this.model.set('layout', newLayout);

        /*
         |   If layout doesn't change, don't do anything
         */
        if (currentLayout === newLayout)
            return;

        /*
         | Layout change logic:
         |   1. If column count doesn't change (e.g. 1.3-2.3 and 1.2-1.2), change the size of the colums
         |   2. If column count increases, (e.g 1.2-1.2 to 1.3-1.3-1.3), add new column, change to new layout
         |       then make c37box droppable
         |   3. If column count decreases, check if there is a blank box, if current box count of row -
         |       blank box count != new box count, show error, otherwise, delete the empty boxes, apply
         |       new layout
         */


        /*
         | Get the current layout class of the element
         | This function is usually used to get the layout class of c37-box. All layout class are
         | c37-col-md (xs-12 is added by default)
         */
        function getLayoutClass(element)
        {

            var classArray = element.attr('class').split(/\s+/);
            var layoutClass = "";
            _.each(classArray, function (c) {
                if (c.indexOf('c37-col-md-')!=-1)
                    layoutClass = c;
            });

            return layoutClass;
        }

        //get blank columns on row
        function getBlankColumns(row)
        {
            var blankColumns = [];
            var boxes = row.children('div');

            _.each(boxes, function (box) {
                if (jQuery(box).find('.c37-item-element').length === 0)
                {
                    blankColumns.push(box);
                }

            });

            return blankColumns;

        }

        //apply new row layout
        function applyRowLayout(row, layoutArray)
        {
            row.children('div').each(function(index){
                //update the model list
                var box = jQuery(this).find('.c37-box');

                var boxID = box.attr('id');
                console.log("layout array: ", layoutArray);
                modelsList[boxID].get('size').desktop = layoutArray[index];


                var newClass = 'c37-col-md-' + layoutArray[index];

                jQuery(this).removeClass(getLayoutClass(jQuery(this))).addClass(newClass);
                //add d-flex
                jQuery(this).addClass('d-flex');
                jQuery(this).addClass('flex-column');//use column flow by default
            });

        }

        //get the array of row layout
        var currentLayoutArray = currentLayout.split('-');
        var newLayoutArray = newLayout.split('-');

        //    Case 1: equal column count
        if (currentLayoutArray.length === newLayoutArray.length)
        {
            applyRowLayout(editingRow, newLayoutArray);

            //Case 2: current layout has more column
        } else if (currentLayoutArray.length > newLayoutArray.length)
        {
            var columnToRemove = currentLayoutArray.length - newLayoutArray.length;
            var blankColumns = getBlankColumns(editingRow);

            /*
             | If number of column to remove less than current blank column, tell users that
             | it is not possible. They need to arrange enough
             */

            if (columnToRemove > blankColumns.length)
            {
                alert('You do not have enough blank box' + columnToRemove + '---' + blankColumns.length);
                return;
            }

            for (var i = columnToRemove; i >0 ; i--)
            {
                //remove the models and json object from model list and modelsJSON

                var column = blankColumns[blankColumns.length-i];
                delete modelsList[jQuery(column).attr('id')];
                delete core37Page.pageSettings.modelsJSON[jQuery(column).attr('id')];

                console.log("removing box: ", jQuery(column).attr('id'));
                jQuery(column).remove();
            }
            applyRowLayout(editingRow, newLayoutArray);

        } else if (currentLayoutArray.length < newLayoutArray.length)
        {
            var columnToAdd = newLayoutArray.length - currentLayoutArray.length;

            //add column to row
            for (var i = 0; i < columnToAdd; i++)
            {
                console.log("columns to add is: ", columnToAdd);
                var boxModel = new BoxModel();
                var newBox = new Box({model: boxModel});
                console.log("creating new box with id", boxModel.getElementID());
                newBox.render();
                editingRow.append(newBox.$el.html());
            }

            applyRowLayout(editingRow, newLayoutArray);
            makeC37BoxDroppable(jQuery);
        }


    }

});


var WallEdit = RowEdit.extend({
    el: '#wall-settings'
});

//Form settings
var PageEdit = ElementEditView.extend({
    el: '#form-settings',

    initialize: function () {
        this.render();
    },

    template: _.template(getEditForm('pageEdit')),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },

    additionalEvents: {
        'input .for-page [data-for=page-width]' : 'updateModel',
        'input .for-page [data-for=page-title]' : 'updateModel',
        'input .for-page [data-for=page-slug]' : 'updateModel',
        'input .for-page #page-codes textarea' : 'updateCodes'
    },

    updateCodes: function()
    {
        var trackingCode = this.$el.find('[data-for=tracking-code]').val();
        var experimentCode = this.$el.find('[data-for=experiment-code]').val();
        var afterBodyOpening = this.$el.find('[data-for=after-body-opening-code]').val();
        var beforeBodyClosing = this.$el.find('[data-for=before-body-closing-code]').val();
        var customCSS = this.$el.find('[data-for=page-css-code]').val();
        var metaCode = this.$el.find('[data-for=meta-code]').val();


        this.model.set('codes', {
            trackingCode: encodeURIComponent(trackingCode),
            experimentCode: encodeURIComponent(experimentCode),
            beforeBodyClosing: encodeURIComponent(beforeBodyClosing),
            afterBodyOpening: encodeURIComponent(afterBodyOpening),
            metaCode: encodeURIComponent(metaCode),
            customCSSCode: encodeURIComponent(customCSS)//css code enter in page->settings->advanced->CSS
        })

    },

    updateModel: function(){
        var title = this.$el.find('[data-for=page-title]').first().val();
        var width = this.$el.find('[data-for=page-width]').first().val();
        var slug = this.$el.find('[data-for=page-slug]').first().val();

        console.log("Slug is: ", slug);

        this.model.set('pageTitle', title);
        this.model.set('width', width);
        this.model.set('pageSlug', slug);
        //update page's width
        var pageElement = jQuery('#'+c37GetPageCSSID());
        if (!isNaN(width) && width > 0)
        {
            pageElement.css('width', width + 'px');
        }
        else
        {
            pageElement.attr('style', '');
        }

    }

});

var SectionEdit = ElementEditView.extend({
    el: '#section-settings',
    initialize: function(){
        this.render();
    },
    template: _.template(getEditForm('sectionEdit')),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()))
    }
});

//edit element for box, contains style mostly
var BoxEdit = ElementEditView.extend({
    el: '#element-settings',
    initialize: function(){
        this.render();
    },
    template: _.template(getEditForm('boxEdit')),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()))
    },
    additionalEvents: {
        'input .for-box .box-size' : 'updateModel',
        'change .for-box [data-for=vertical]': 'renderVerticalAlignment',
        'change .for-box [data-for=horizontal]': 'renderHorizontalAlignment',
        'change .for-box [name=direction]' : 'updateDirection'
    },

    updateDirection : function(){
        console.log("changing direction");
        var directionClass = this.$el.find('[name=direction]:checked').val();
        var box = this.getBox();
        _.each(this.$el.find('[name=direction]'), function(op) {
            box.removeClass(jQuery(op).val());
        });

        box.addClass(directionClass);
        this.model.set('direction', directionClass);
    },

    getBox: function(){
        return jQuery('#' + this.model.get('editingElementID'));
    },

    renderHorizontalAlignment: function(){
        var horizontal = this.$el.find('[data-for=horizontal]').val();
        this.model.set('horizontal', horizontal);

        //remove all alignment classes
        var box = this.getBox();
        _.each(this.$el.find('[data-for=horizontal] option'), function(op){
            box.removeClass(jQuery(op).val());
            console.log(jQuery(op).val());
        });
        //update the new class
        box.addClass(horizontal);

    },
    renderVerticalAlignment: function(){
        var vertical = this.$el.find('[data-for=vertical]').val();
        this.model.set('vertical', vertical);

        //remove all alignment classes
        var box = this.getBox();
        _.each(this.$el.find('[data-for=vertical] option'), function(op){
            box.removeClass(jQuery(op).val());
            console.log(jQuery(op).val());
        });
        //update the new class
        box.addClass(vertical);

    },

    updateModel: function()
    {
        var sizePhone = this.$el.find('[data-for=size-phone]').val();
        var sizeTablet = this.$el.find('[data-for=size-tablet]').val();
        var sizeDesktop = this.$el.find('[data-for=size-desktop]').val();
        var boxSize = {
            desktop: sizeDesktop,
            phone: sizePhone,
            tablet: sizeTablet
        };

        this.model.set("size", boxSize);
        var editingBox = jQuery('#' + this.model.get('editingElementID'));

        //remove current size classes
        for (var i = 1; i <= 12 ; i++)
        {
            editingBox.removeClass('c37-col-md-' + i);
            editingBox.removeClass('c37-col-lg-' + i);
            editingBox.removeClass('c37-col-' + i);
        }
        // add new size class
        editingBox.addClass('c37-col-lg-' + sizeDesktop);
        editingBox.addClass('c37-col-md-' + sizeTablet);
        editingBox.addClass('c37-col-' + sizePhone);



    }


});

var PageList = Backbone.View.extend({

    default: {
        forms: {}
    },
    el: '#forms-list',

    initialize: function()
    {
        //console.log('loading forms');
        this.render();

    },
    template: _.template(
        '<i id="close-edit-panel" class="fa fa-close"></i> <label class="big">All pages</label>' +
        '<ul>'+
        '<% _.each(forms, function(form) { %>'+
            '<li class="form-edit" form-id="<%= form.id %>"> ' +
                '<i title="Edit page" class="fa fa-pencil"></i> ' +
                '<a class="page-url" title="Open page" target="_blank" href="<%= form.url %>"><i class="fa fa-external-link"></i></a> ' +
                //'<i class="fa fa-code"></i> ' +
                '<i class="fa fa-download"></i> ' +
                '<i class="fa fa-gear"></i> ' +
                '<i  title="Delete page" class="fa fa-trash"></i> ' +
                '<%= form.title %>' +
                '<div class="edit-page-url" data-balloon="click to copy the URL"><input  type="url" value="<%= form.url %>" /></div>'+
            '</li>'+
        '<% }) %>'+
        '</ul>'
    ),
    render: function()
    {
        this.$el.html(this.template({
            forms: this.model.get('forms')
        }));
    }

});


//backbone view for list of templates

var TemplateList = Backbone.View.extend({

    default: {
        forms: {}
    },
    el: '#templates-list',

    initialize: function()
    {
        console.log('loading template');
        this.render();

    },
    template: _.template(
        '<i id="close-edit-panel" class="fa fa-close"></i> <label class="big">All templates</label>' +
        '<ul id="all-templates">'+
        '<% var templates = this.model.get("templates"); _.each(templates, function(template) { %>'+
            '<li class="template-edit" template-id="<%= template.id %>"> ' +
                '<i class="fa fa-pencil"></i> ' +
                '<a data-lity href="<%= template.url %>" class="fa fa-eye"></a> ' +
                '<i class="fa fa-trash"></i> ' +
                '<%= template.title %>' +
            '</li>'+
        '<% }) %>'+
        '</ul>'
    ),
    render: function()
    {
        this.$el.html(this.template({
            forms: this.model.get('forms')
        }));
    }

});

/**
 * Created by luis on 18/04/17.
 */
//mapping between model object and its editor object
var eMAP = {
    text: {
        el: TextInput,
        ed: TextInputEdit
    },
    input_submit: {
        el: InputSubmit,
        ed: InputSubmitEdit
    },
    checkbox: {
        el: CheckBox,
        ed: CheckBoxEdit
    },
    radio: {
        el: Radio,
        ed: RadioEdit
    },
    heading: {
        el: Heading,
        ed: HeadingEdit
    },
    paragraph: {
        el: Paragraph,
        ed: ParagraphEdit
    },
    ul: {
        el: UnorderedList,
        ed: ULEdit
    },
    form_container: {
        el: FormContainer,
        ed: FormContainerEdit
    },
    date: {
        el: DateInput,
        ed: DateEdit
    },
    textarea: {
        el: TextArea,
        ed: TextAreaEdit
    },
    button: {
        el: Button,
        ed: ButtonEdit
    },
    select: {
        el: Select,
        ed: SelectEdit
    },
    acceptance: {
        el: Acceptance,
        ed: AcceptanceEdit
    },
    file: {
        el: File,
        ed: FileEdit
    },
    image: {
        el: ImageElement,
        ed: ImageEdit
    },
    stars: {
        el: Stars,
        ed: StarsEdit
    },
    youtube: {
        el: YouTubeVideo,
        ed: YouTubeVideoEdit
    },
    self_hosted_video: {
        el: SelfHostedVideo,
        ed: SelfHostedVideoEdit
    },
    code: {
        el: Code,
        ed: CodeEdit
    },
    menu: {
        el: Menu,
        ed: MenuEdit
    },
    line: {
        el: Line,
        ed: LineEdit
    },
    // countdown: {
    //     el: Countdown,
    //     ed: CountdownEdit
    // },
    // flip_countdown: {
    //     el: FlipCountdown,
    //     ed: FlipCountdownEdit
    // },
    simple_countdown: {
        el: SimpleCountdown,
        ed: SimpleCountdownEdit
    },
    other_videos: {
        el: OtherVideos,
        ed: OtherVideosEdit
    },
    simple_navbar: {
        el: SimpleNavbar,
        ed: SimpleNavbarEdit
    },
    section: {
        el: Section,
        ed: SectionEdit
    },
    page: {
        el: Page,
        ed: PageEdit
    },
    icon: {
        el: Icon,
        ed: IconEdit
    },
    image_link: {
        el: ImageLink,
        ed: ImageLinkEdit
    },
    image_sliders: {
        el: ImageSliders,
        ed: ImageSlidersEdit
    }
};


/**
 * Created by luis on 6/8/16.
 */

 /**
 * Created by luis on 8/31/16.
 */
/**
 * Contains global variables such as form settings, form data...
 */

/**
 * Settings for toastr
 */
if (typeof toastr !== "undefined")
{
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-left", 
        "preventDuplicates": false, 
        "onclick": null,
        "showDuration": "300", 
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}


/**
 * Created by luis on 11/15/16.
 */


/**
 * Created by luis on 6/18/16.
 * Store common functions
 */
function makeFormDroppable(jQuery)
{
    //Make the form droppable for step (not sortable)
    var stepContainer = jQuery('.c37-step-container');
    stepContainer.droppable({
        accept: '.c37-lp-multi-element',
        activeClass: 'active-zone',
        hoverClass: 'drop-zone',
        drop: function(event, ui)
        {
            if (ui.draggable.attr('data-original') == 'false')
                return;
            var elementType = ui.draggable.attr('data-c37-type');
            var elementClass = Templates[elementType];
            var htmlElement = new elementClass();
            htmlElement.render();

            ui.draggable.html(htmlElement.$el);

            //add an ID to the dragged elemet
            var randomID = 'c37-step-id-' + Math.floor(Math.random() * 10000);
            ui.draggable.attr('id', randomID);

            ui.draggable.attr('data-original', 'false');
            
            
            //make the child container droppable
            makeC37StepDroppable(jQuery);
            makeC37BoxDroppable(jQuery);

            
        }
    });

    //stepContainer.sortable({
    //    revert: true,
    //    stop: function (event, ui) {
    //        //remove width and height attribute added by jquery
    //        ui.item.css('width', '');
    //        ui.item.css('height', '')
    //    },
    //    out: function () {
    //        jQuery('.drop-zone').removeClass('drop-zone');
    //    }
    //});


}


function makeC37BoxDroppable(jQuery) {

//make the element container sortable
    var c37Box = jQuery('.c37-box');
    c37Box.sortable({
        revert: true,
        connectWith: ['.c37-box'],
        handle: '.cm-move, .cm-wall-move',
        start: function(event, ui){
            if (ui.item.attr('data-original') === "false")
            {
                ui.item.addClass('c37-sorting-element');
            }

        },

        stop: function (event, ui) {
            //remove width and height attribute added by jquery
            ui.item.css('width', '');
            ui.item.css('height', '');
            jQuery(ui.item).removeAttr('style');

            ui.item.removeClass('c37-sorting-element');
            
            makeC37BoxDroppable(jQuery);
        },
        out: function (e, u) {

            //remove hover class of c37-box
            jQuery(u.sender).removeClass('box-hover-zone');

        }
    });
    c37Box.droppable({
        accept: '.c37-item-element, .c37-wall-element',
        activeClass: 'box-active-zone',
        hoverClass: 'box-hover-zone',
        tolerance: 'pointer',
        //greedy: true,
        drop: function (event, ui) {
            //console.log(localStorage.getItem('dragging-stop'));

            //if the dragged elment is not coming from the left, don't parse the code
            if (ui.draggable.attr('data-original') === 'false')
                return;

            if (ui.draggable.hasClass('c37-premium-element') && !versionNangCap)
            {
                showUpgradeDialog();
                // ui.item = undefined;
                // ui.draggable.replaceWith(htmlElement.$el.html());
                return;
            }

            var elementType = ui.draggable.attr('data-c37-type');
            var elementClass = Templates[elementType];
            console.log("typeof elemet model: ", ModelTemplates);
            console.log("element : ", typeof Templates);
            var elementModel = c37GetElementModel(false, elementType);
            var htmlElement = new elementClass({model: elementModel});
            htmlElement.render();

            if (elementType === 'wall')
                ui.draggable.replaceWith(htmlElement.$el.html());
            ui.draggable.html(htmlElement.$el);

            //add an ID to the dragged elemet
            var elementID = elementModel.get('editingElementID');
            ui.draggable.attr('id', elementID);
            console.log("elementID: ", elementID);
            console.log("element type: ", elementType);

            ui.draggable.attr('data-original', 'false');

            ui.draggable.removeAttr('style');

        },
        out: function () {
            console.log(jQuery(this));
        }
    })
}

function makeFormSortable(jQuery)
{
    var c37LPForm = jQuery('.c37-lp-form');

    c37LPForm.sortable({
        handle: '.cm-move',
        revert: true,
        connectWith: ['form .c37-box'],
        stop: function (event, ui) {
            //remove width and height attribute added by jquery
            ui.item.css('width', '');
            ui.item.css('height', '')
        }
    });
}

function makeC37SectionDroppable(jQuery)
{
    var c37Section = jQuery('.c37-section');
    c37Section.sortable({
        revert: true,
        handle: '.cm-row-move',
        connectWith: ['.c37-section'],
        stop: function (event, ui) {
            ui.item.css('width', '');
            ui.item.css('height', '')
        }

    });


    c37Section.droppable({
        accept: '.c37-row-element',
        activeClass: 'section-active-zone',
        hoverClass: 'section-drop-zone',
        // greedy: true,
        // tolerance: 'fit',
        drop: function (event, ui) {

            console.log("all classes are: ", jQuery(event.srcElement).attr('class'));
            //if the dragged element is not coming from the left, don't parse the code
            if (ui.draggable.attr('data-original') === 'false')
            {
                console.log("no parsing HTML content, already parsed");
                return;
            }

            var rowModel = new RowModel();
            var htmlElement = new Row({model :  rowModel});
            htmlElement.render();
            var htmlContent = htmlElement.$el.html();

            console.log("row rendred!!!");
            console.log("html content is: ", htmlContent);

            ui.draggable.replaceWith(htmlContent);

            //remove default styles added by jquery UI, this will be done in sortable stop
            // ui.draggable.removeAttr('style');
            ui.draggable.attr('data-original', 'false');
            makeC37BoxDroppable(jQuery);
        },
        out: function()
        {
            console.log("seciont aout");
        }
    });


}

function makeC37StepDroppable(jQuery)
{
    var c37Step = jQuery('.c37-step');
    c37Step.sortable({
        revert: true,
        handle: '.cm-section-move',
        connectWith: ['.c37-step'],

        stop: function (event, ui) {
            ui.item.css('width', '');
            ui.item.css('height', '')
        }

    });


    c37Step.droppable({
        accept: '.c37-container-element',
        activeClass: 'step-active-zone',
        hoverClass: 'step-drop-zone',
        greedy: true,
        // tolerance: 'fit',
        tolerance: 'pointer',
        drop: function (event, ui) {

            //if the dragged element is not coming from the left, don't parse the code
            if (ui.draggable.attr('data-original') === 'false')
                return;

            var elementType = ui.draggable.attr('data-c37-type');
            var elementClass = Templates[elementType];
            var elementModel = new ModelTemplates[elementType]();
            var htmlElement = new elementClass({model : elementModel });
            htmlElement.render();

            htmlElement.render();

            var htmlContent = htmlElement.$el.html();

            if (elementModel.get('etype') === 'section')
                ui.draggable.replaceWith(htmlContent);
            else
                ui.draggable.html(htmlContent);

            //add an ID to the dragged elemet
            ui.draggable.attr('id', elementModel.get('editingElementID'));

            //remove default styles added by jquery UI, this will be done in sortable stop
            // ui.draggable.removeAttr('style');
            ui.draggable.attr('data-original', 'false');
            makeC37SectionDroppable(jQuery);
            makeC37BoxDroppable(jQuery);
        },
        out: function(){
            console.log("out on step");
        }

    });


}

function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

//restore star rating to editable mode
function restoreStarsRating(jQuery)
{
    jQuery(function(){

        //apply star ratings to all stars elements
        _.each(jQuery('.c37-lp .c37-star-rating'), function(singleStar){
            var star = jQuery(singleStar);
            //empty current html
            star.siblings('.br-widget').remove();
            console.log(star.find('.br-wrapper').length);
            console.log('star rendered');

            var theme = star.attr('data-theme');
            var showSelectedRating = star.attr('data-show-selected') == 'true';
            var showValues = star.attr('data-show-values') == 'true';
            var initialRating = star.attr('data-initial-rating');
            var id = star.attr('id');

            var starSettings = {
                theme: theme,
                showSelectedRating: showSelectedRating,
                showValues: showValues,
                initialRating: initialRating,
                allowEmpty: true
            };

            console.log(starSettings);

            //jQuery('#' + id).barrating('destroy');
            jQuery('#' + id).barrating(starSettings);

        });

    });

}

function renderFontAwesome()
{
    var icons = [
        "fa-address-book",
        "fa-address-book-o",
        "fa-address-card",
        "fa-address-card-o",
        "fa-bandcamp",
        "fa-bath",
        "fa-bathtub",
        "fa-drivers-license",
        "fa-drivers-license-o",
        "fa-eercast",
        "fa-envelope-open",
        "fa-envelope-open-o",
        "fa-etsy",
        "fa-free-code-camp",
        "fa-grav",
        "fa-handshake-o",
        "fa-id-badge",
        "fa-id-card",
        "fa-id-card-o",
        "fa-imdb",
        "fa-linode",
        "fa-meetup",
        "fa-microchip",
        "fa-podcast",
        "fa-quora",
        "fa-ravelry",
        "fa-s15",
        "fa-shower",
        "fa-snowflake-o",
        "fa-superpowers",
        "fa-telegram",
        "fa-thermometer",
        "fa-thermometer-0",
        "fa-thermometer-1",
        "fa-thermometer-2",
        "fa-thermometer-3",
        "fa-thermometer-4",
        "fa-thermometer-empty",
        "fa-thermometer-full",
        "fa-thermometer-half",
        "fa-thermometer-quarter",
        "fa-thermometer-three-quarters",
        "fa-times-rectangle",
        "fa-times-rectangle-o",
        "fa-user-circle",
        "fa-user-circle-o",
        "fa-user-o",
        "fa-vcard",
        "fa-vcard-o",
        "fa-window-close",
        "fa-window-close-o",
        "fa-window-maximize",
        "fa-window-minimize",
        "fa-window-restore",
        "fa-wpexplorer",
        "fa-address-book",
        "fa-address-book-o",
        "fa-address-card",
        "fa-address-card-o",
        "fa-adjust",
        "fa-american-sign-language-interpreting",
        "fa-anchor",
        "fa-archive",
        "fa-area-chart",
        "fa-arrows",
        "fa-arrows-h",
        "fa-arrows-v",
        "fa-asl-interpreting",
        "fa-assistive-listening-systems",
        "fa-asterisk",
        "fa-at",
        "fa-audio-description",
        "fa-automobile",
        "fa-balance-scale",
        "fa-ban",
        "fa-bank",
        "fa-bar-chart",
        "fa-bar-chart-o",
        "fa-barcode",
        "fa-bars",
        "fa-bath",
        "fa-bathtub",
        "fa-battery",
        "fa-battery-0",
        "fa-battery-1",
        "fa-battery-2",
        "fa-battery-3",
        "fa-battery-4",
        "fa-battery-empty",
        "fa-battery-full",
        "fa-battery-half",
        "fa-battery-quarter",
        "fa-battery-three-quarters",
        "fa-bed",
        "fa-beer",
        "fa-bell",
        "fa-bell-o",
        "fa-bell-slash",
        "fa-bell-slash-o",
        "fa-bicycle",
        "fa-binoculars",
        "fa-birthday-cake",
        "fa-blind",
        "fa-bluetooth",
        "fa-bluetooth-b",
        "fa-bolt",
        "fa-bomb",
        "fa-book",
        "fa-bookmark",
        "fa-bookmark-o",
        "fa-braille",
        "fa-briefcase",
        "fa-bug",
        "fa-building",
        "fa-building-o",
        "fa-bullhorn",
        "fa-bullseye",
        "fa-bus",
        "fa-cab",
        "fa-calculator",
        "fa-calendar",
        "fa-calendar-check-o",
        "fa-calendar-minus-o",
        "fa-calendar-o",
        "fa-calendar-plus-o",
        "fa-calendar-times-o",
        "fa-camera",
        "fa-camera-retro",
        "fa-car",
        "fa-caret-square-o-down",
        "fa-caret-square-o-left",
        "fa-caret-square-o-right",
        "fa-caret-square-o-up",
        "fa-cart-arrow-down",
        "fa-cart-plus",
        "fa-cc",
        "fa-certificate",
        "fa-check",
        "fa-check-circle",
        "fa-check-circle-o",
        "fa-check-square",
        "fa-check-square-o",
        "fa-child",
        "fa-circle",
        "fa-circle-o",
        "fa-circle-o-notch",
        "fa-circle-thin",
        "fa-clock-o",
        "fa-clone",
        "fa-close",
        "fa-cloud",
        "fa-cloud-download",
        "fa-cloud-upload",
        "fa-code",
        "fa-code-fork",
        "fa-coffee",
        "fa-cog",
        "fa-cogs",
        "fa-comment",
        "fa-comment-o",
        "fa-commenting",
        "fa-commenting-o",
        "fa-comments",
        "fa-comments-o",
        "fa-compass",
        "fa-copyright",
        "fa-creative-commons",
        "fa-credit-card",
        "fa-credit-card-alt",
        "fa-crop",
        "fa-crosshairs",
        "fa-cube",
        "fa-cubes",
        "fa-cutlery",
        "fa-dashboard",
        "fa-database",
        "fa-deaf",
        "fa-deafness",
        "fa-desktop",
        "fa-diamond",
        "fa-dot-circle-o",
        "fa-download",
        "fa-drivers-license",
        "fa-drivers-license-o",
        "fa-edit",
        "fa-ellipsis-h",
        "fa-ellipsis-v",
        "fa-envelope",
        "fa-envelope-o",
        "fa-envelope-open",
        "fa-envelope-open-o",
        "fa-envelope-square",
        "fa-eraser",
        "fa-exchange",
        "fa-exclamation",
        "fa-exclamation-circle",
        "fa-exclamation-triangle",
        "fa-external-link",
        "fa-external-link-square",
        "fa-eye",
        "fa-eye-slash",
        "fa-eyedropper",
        "fa-fax",
        "fa-feed",
        "fa-female",
        "fa-fighter-jet",
        "fa-file-archive-o",
        "fa-file-audio-o",
        "fa-file-code-o",
        "fa-file-excel-o",
        "fa-file-image-o",
        "fa-file-movie-o",
        "fa-file-pdf-o",
        "fa-file-photo-o",
        "fa-file-picture-o",
        "fa-file-powerpoint-o",
        "fa-file-sound-o",
        "fa-file-video-o",
        "fa-file-word-o",
        "fa-file-zip-o",
        "fa-film",
        "fa-filter",
        "fa-fire",
        "fa-fire-extinguisher",
        "fa-flag",
        "fa-flag-checkered",
        "fa-flag-o",
        "fa-flash",
        "fa-flask",
        "fa-folder",
        "fa-folder-o",
        "fa-folder-open",
        "fa-folder-open-o",
        "fa-frown-o",
        "fa-futbol-o",
        "fa-gamepad",
        "fa-gavel",
        "fa-gear",
        "fa-gears",
        "fa-gift",
        "fa-glass",
        "fa-globe",
        "fa-graduation-cap",
        "fa-group",
        "fa-hand-grab-o",
        "fa-hand-lizard-o",
        "fa-hand-paper-o",
        "fa-hand-peace-o",
        "fa-hand-pointer-o",
        "fa-hand-rock-o",
        "fa-hand-scissors-o",
        "fa-hand-spock-o",
        "fa-hand-stop-o",
        "fa-handshake-o",
        "fa-hard-of-hearing",
        "fa-hashtag",
        "fa-hdd-o",
        "fa-headphones",
        "fa-heart",
        "fa-heart-o",
        "fa-heartbeat",
        "fa-history",
        "fa-home",
        "fa-hotel",
        "fa-hourglass",
        "fa-hourglass-1",
        "fa-hourglass-2",
        "fa-hourglass-3",
        "fa-hourglass-end",
        "fa-hourglass-half",
        "fa-hourglass-o",
        "fa-hourglass-start",
        "fa-i-cursor",
        "fa-id-badge",
        "fa-id-card",
        "fa-id-card-o",
        "fa-image",
        "fa-inbox",
        "fa-industry",
        "fa-info",
        "fa-info-circle",
        "fa-institution",
        "fa-key",
        "fa-keyboard-o",
        "fa-language",
        "fa-laptop",
        "fa-leaf",
        "fa-legal",
        "fa-lemon-o",
        "fa-level-down",
        "fa-level-up",
        "fa-life-bouy",
        "fa-life-buoy",
        "fa-life-ring",
        "fa-life-saver",
        "fa-lightbulb-o",
        "fa-line-chart",
        "fa-location-arrow",
        "fa-lock",
        "fa-low-vision",
        "fa-magic",
        "fa-magnet",
        "fa-mail-forward",
        "fa-mail-reply",
        "fa-mail-reply-all",
        "fa-male",
        "fa-map",
        "fa-map-marker",
        "fa-map-o",
        "fa-map-pin",
        "fa-map-signs",
        "fa-meh-o",
        "fa-microchip",
        "fa-microphone",
        "fa-microphone-slash",
        "fa-minus",
        "fa-minus-circle",
        "fa-minus-square",
        "fa-minus-square-o",
        "fa-mobile",
        "fa-mobile-phone",
        "fa-money",
        "fa-moon-o",
        "fa-mortar-board",
        "fa-motorcycle",
        "fa-mouse-pointer",
        "fa-music",
        "fa-navicon",
        "fa-newspaper-o",
        "fa-object-group",
        "fa-object-ungroup",
        "fa-paint-brush",
        "fa-paper-plane",
        "fa-paper-plane-o",
        "fa-paw",
        "fa-pencil",
        "fa-pencil-square",
        "fa-pencil-square-o",
        "fa-percent",
        "fa-phone",
        "fa-phone-square",
        "fa-photo",
        "fa-picture-o",
        "fa-pie-chart",
        "fa-plane",
        "fa-plug",
        "fa-plus",
        "fa-plus-circle",
        "fa-plus-square",
        "fa-plus-square-o",
        "fa-podcast",
        "fa-power-off",
        "fa-print",
        "fa-puzzle-piece",
        "fa-qrcode",
        "fa-question",
        "fa-question-circle",
        "fa-question-circle-o",
        "fa-quote-left",
        "fa-quote-right",
        "fa-random",
        "fa-recycle",
        "fa-refresh",
        "fa-registered",
        "fa-remove",
        "fa-reorder",
        "fa-reply",
        "fa-reply-all",
        "fa-retweet",
        "fa-road",
        "fa-rocket",
        "fa-rss",
        "fa-rss-square",
        "fa-s15",
        "fa-search",
        "fa-search-minus",
        "fa-search-plus",
        "fa-send",
        "fa-send-o",
        "fa-server",
        "fa-share",
        "fa-share-alt",
        "fa-share-alt-square",
        "fa-share-square",
        "fa-share-square-o",
        "fa-shield",
        "fa-ship",
        "fa-shopping-bag",
        "fa-shopping-basket",
        "fa-shopping-cart",
        "fa-shower",
        "fa-sign-in",
        "fa-sign-language",
        "fa-sign-out",
        "fa-signal",
        "fa-signing",
        "fa-sitemap",
        "fa-sliders",
        "fa-smile-o",
        "fa-snowflake-o",
        "fa-soccer-ball-o",
        "fa-sort",
        "fa-sort-alpha-asc",
        "fa-sort-alpha-desc",
        "fa-sort-amount-asc",
        "fa-sort-amount-desc",
        "fa-sort-asc",
        "fa-sort-desc",
        "fa-sort-down",
        "fa-sort-numeric-asc",
        "fa-sort-numeric-desc",
        "fa-sort-up",
        "fa-space-shuttle",
        "fa-spinner",
        "fa-spoon",
        "fa-square",
        "fa-square-o",
        "fa-star",
        "fa-star-half",
        "fa-star-half-empty",
        "fa-star-half-full",
        "fa-star-half-o",
        "fa-star-o",
        "fa-sticky-note",
        "fa-sticky-note-o",
        "fa-street-view",
        "fa-suitcase",
        "fa-sun-o",
        "fa-support",
        "fa-tablet",
        "fa-tachometer",
        "fa-tag",
        "fa-tags",
        "fa-tasks",
        "fa-taxi",
        "fa-television",
        "fa-terminal",
        "fa-thermometer",
        "fa-thermometer-0",
        "fa-thermometer-1",
        "fa-thermometer-2",
        "fa-thermometer-3",
        "fa-thermometer-4",
        "fa-thermometer-empty",
        "fa-thermometer-full",
        "fa-thermometer-half",
        "fa-thermometer-quarter",
        "fa-thermometer-three-quarters",
        "fa-thumb-tack",
        "fa-thumbs-down",
        "fa-thumbs-o-down",
        "fa-thumbs-o-up",
        "fa-thumbs-up",
        "fa-ticket",
        "fa-times",
        "fa-times-circle",
        "fa-times-circle-o",
        "fa-times-rectangle",
        "fa-times-rectangle-o",
        "fa-tint",
        "fa-toggle-down",
        "fa-toggle-left",
        "fa-toggle-off",
        "fa-toggle-on",
        "fa-toggle-right",
        "fa-toggle-up",
        "fa-trademark",
        "fa-trash",
        "fa-trash-o",
        "fa-tree",
        "fa-trophy",
        "fa-truck",
        "fa-tty",
        "fa-tv",
        "fa-umbrella",
        "fa-universal-access",
        "fa-university",
        "fa-unlock",
        "fa-unlock-alt",
        "fa-unsorted",
        "fa-upload",
        "fa-user",
        "fa-user-circle",
        "fa-user-circle-o",
        "fa-user-o",
        "fa-user-plus",
        "fa-user-secret",
        "fa-user-times",
        "fa-users",
        "fa-vcard",
        "fa-vcard-o",
        "fa-video-camera",
        "fa-volume-control-phone",
        "fa-volume-down",
        "fa-volume-off",
        "fa-volume-up",
        "fa-warning",
        "fa-wheelchair",
        "fa-wheelchair-alt",
        "fa-wifi",
        "fa-window-close",
        "fa-window-close-o",
        "fa-window-maximize",
        "fa-window-minimize",
        "fa-window-restore",
        "fa-wrench",
        "fa-american-sign-language-interpreting",
        "fa-asl-interpreting",
        "fa-assistive-listening-systems",
        "fa-audio-description",
        "fa-blind",
        "fa-braille",
        "fa-cc",
        "fa-deaf",
        "fa-deafness",
        "fa-hard-of-hearing",
        "fa-low-vision",
        "fa-question-circle-o",
        "fa-sign-language",
        "fa-signing",
        "fa-tty",
        "fa-universal-access",
        "fa-volume-control-phone",
        "fa-wheelchair",
        "fa-wheelchair-alt",
        "fa-hand-grab-o",
        "fa-hand-lizard-o",
        "fa-hand-o-down",
        "fa-hand-o-left",
        "fa-hand-o-right",
        "fa-hand-o-up",
        "fa-hand-paper-o",
        "fa-hand-peace-o",
        "fa-hand-pointer-o",
        "fa-hand-rock-o",
        "fa-hand-scissors-o",
        "fa-hand-spock-o",
        "fa-hand-stop-o",
        "fa-thumbs-down",
        "fa-thumbs-o-down",
        "fa-thumbs-o-up",
        "fa-thumbs-up",
        "fa-ambulance",
        "fa-automobile",
        "fa-bicycle",
        "fa-bus",
        "fa-cab",
        "fa-car",
        "fa-fighter-jet",
        "fa-motorcycle",
        "fa-plane",
        "fa-rocket",
        "fa-ship",
        "fa-space-shuttle",
        "fa-subway",
        "fa-taxi",
        "fa-train",
        "fa-truck",
        "fa-wheelchair",
        "fa-wheelchair-alt",
        "fa-genderless",
        "fa-intersex",
        "fa-mars",
        "fa-mars-double",
        "fa-mars-stroke",
        "fa-mars-stroke-h",
        "fa-mars-stroke-v",
        "fa-mercury",
        "fa-neuter",
        "fa-transgender",
        "fa-transgender-alt",
        "fa-venus",
        "fa-venus-double",
        "fa-venus-mars",
        "fa-file",
        "fa-file-archive-o",
        "fa-file-audio-o",
        "fa-file-code-o",
        "fa-file-excel-o",
        "fa-file-image-o",
        "fa-file-movie-o",
        "fa-file-o",
        "fa-file-pdf-o",
        "fa-file-photo-o",
        "fa-file-picture-o",
        "fa-file-powerpoint-o",
        "fa-file-sound-o",
        "fa-file-text",
        "fa-file-text-o",
        "fa-file-video-o",
        "fa-file-word-o",
        "fa-file-zip-o",
        "fa-circle-o-notch",
        "fa-cog",
        "fa-gear",
        "fa-refresh",
        "fa-spinner",
        "fa-check-square",
        "fa-check-square-o",
        "fa-circle",
        "fa-circle-o",
        "fa-dot-circle-o",
        "fa-minus-square",
        "fa-minus-square-o",
        "fa-plus-square",
        "fa-plus-square-o",
        "fa-square",
        "fa-square-o",
        "fa-cc-amex",
        "fa-cc-diners-club",
        "fa-cc-discover",
        "fa-cc-jcb",
        "fa-cc-mastercard",
        "fa-cc-paypal",
        "fa-cc-stripe",
        "fa-cc-visa",
        "fa-credit-card",
        "fa-credit-card-alt",
        "fa-google-wallet",
        "fa-paypal",
        "fa-area-chart",
        "fa-bar-chart",
        "fa-bar-chart-o",
        "fa-line-chart",
        "fa-pie-chart",
        "fa-bitcoin",
        "fa-btc",
        "fa-cny",
        "fa-dollar",
        "fa-eur",
        "fa-euro",
        "fa-gbp",
        "fa-gg",
        "fa-gg-circle",
        "fa-ils",
        "fa-inr",
        "fa-jpy",
        "fa-krw",
        "fa-money",
        "fa-rmb",
        "fa-rouble",
        "fa-rub",
        "fa-ruble",
        "fa-rupee",
        "fa-shekel",
        "fa-sheqel",
        "fa-try",
        "fa-turkish-lira",
        "fa-usd",
        "fa-won",
        "fa-yen",
        "fa-align-center",
        "fa-align-justify",
        "fa-align-left",
        "fa-align-right",
        "fa-bold",
        "fa-chain",
        "fa-chain-broken",
        "fa-clipboard",
        "fa-columns",
        "fa-copy",
        "fa-cut",
        "fa-dedent",
        "fa-eraser",
        "fa-file",
        "fa-file-o",
        "fa-file-text",
        "fa-file-text-o",
        "fa-files-o",
        "fa-floppy-o",
        "fa-font",
        "fa-header",
        "fa-indent",
        "fa-italic",
        "fa-link",
        "fa-list",
        "fa-list-alt",
        "fa-list-ol",
        "fa-list-ul",
        "fa-outdent",
        "fa-paperclip",
        "fa-paragraph",
        "fa-paste",
        "fa-repeat",
        "fa-rotate-left",
        "fa-rotate-right",
        "fa-save",
        "fa-scissors",
        "fa-strikethrough",
        "fa-subscript",
        "fa-superscript",
        "fa-table",
        "fa-text-height",
        "fa-text-width",
        "fa-th",
        "fa-th-large",
        "fa-th-list",
        "fa-underline",
        "fa-undo",
        "fa-unlink",
        "fa-angle-double-down",
        "fa-angle-double-left",
        "fa-angle-double-right",
        "fa-angle-double-up",
        "fa-angle-down",
        "fa-angle-left",
        "fa-angle-right",
        "fa-angle-up",
        "fa-arrow-circle-down",
        "fa-arrow-circle-left",
        "fa-arrow-circle-o-down",
        "fa-arrow-circle-o-left",
        "fa-arrow-circle-o-right",
        "fa-arrow-circle-o-up",
        "fa-arrow-circle-right",
        "fa-arrow-circle-up",
        "fa-arrow-down",
        "fa-arrow-left",
        "fa-arrow-right",
        "fa-arrow-up",
        "fa-arrows",
        "fa-arrows-alt",
        "fa-arrows-h",
        "fa-arrows-v",
        "fa-caret-down",
        "fa-caret-left",
        "fa-caret-right",
        "fa-caret-square-o-down",
        "fa-caret-square-o-left",
        "fa-caret-square-o-right",
        "fa-caret-square-o-up",
        "fa-caret-up",
        "fa-chevron-circle-down",
        "fa-chevron-circle-left",
        "fa-chevron-circle-right",
        "fa-chevron-circle-up",
        "fa-chevron-down",
        "fa-chevron-left",
        "fa-chevron-right",
        "fa-chevron-up",
        "fa-exchange",
        "fa-hand-o-down",
        "fa-hand-o-left",
        "fa-hand-o-right",
        "fa-hand-o-up",
        "fa-long-arrow-down",
        "fa-long-arrow-left",
        "fa-long-arrow-right",
        "fa-long-arrow-up",
        "fa-toggle-down",
        "fa-toggle-left",
        "fa-toggle-right",
        "fa-toggle-up",
        "fa-arrows-alt",
        "fa-backward",
        "fa-compress",
        "fa-eject",
        "fa-expand",
        "fa-fast-backward",
        "fa-fast-forward",
        "fa-forward",
        "fa-pause",
        "fa-pause-circle",
        "fa-pause-circle-o",
        "fa-play",
        "fa-play-circle",
        "fa-play-circle-o",
        "fa-random",
        "fa-step-backward",
        "fa-step-forward",
        "fa-stop",
        "fa-stop-circle",
        "fa-stop-circle-o",
        "fa-youtube-play",
        "fa-500px",
        "fa-adn",
        "fa-amazon",
        "fa-android",
        "fa-angellist",
        "fa-apple",
        "fa-bandcamp",
        "fa-behance",
        "fa-behance-square",
        "fa-bitbucket",
        "fa-bitbucket-square",
        "fa-bitcoin",
        "fa-black-tie",
        "fa-bluetooth",
        "fa-bluetooth-b",
        "fa-btc",
        "fa-buysellads",
        "fa-cc-amex",
        "fa-cc-diners-club",
        "fa-cc-discover",
        "fa-cc-jcb",
        "fa-cc-mastercard",
        "fa-cc-paypal",
        "fa-cc-stripe",
        "fa-cc-visa",
        "fa-chrome",
        "fa-codepen",
        "fa-codiepie",
        "fa-connectdevelop",
        "fa-contao",
        "fa-css3",
        "fa-dashcube",
        "fa-delicious",
        "fa-deviantart",
        "fa-digg",
        "fa-dribbble",
        "fa-dropbox",
        "fa-drupal",
        "fa-edge",
        "fa-eercast",
        "fa-empire",
        "fa-envira",
        "fa-etsy",
        "fa-expeditedssl",
        "fa-fa",
        "fa-facebook",
        "fa-facebook-f",
        "fa-facebook-official",
        "fa-facebook-square",
        "fa-firefox",
        "fa-first-order",
        "fa-flickr",
        "fa-font-awesome",
        "fa-fonticons",
        "fa-fort-awesome",
        "fa-forumbee",
        "fa-foursquare",
        "fa-free-code-camp",
        "fa-ge",
        "fa-get-pocket",
        "fa-gg",
        "fa-gg-circle",
        "fa-git",
        "fa-git-square",
        "fa-github",
        "fa-github-alt",
        "fa-github-square",
        "fa-gitlab",
        "fa-gittip",
        "fa-glide",
        "fa-glide-g",
        "fa-google",
        "fa-google-plus",
        "fa-google-plus-circle",
        "fa-google-plus-official",
        "fa-google-plus-square",
        "fa-google-wallet",
        "fa-gratipay",
        "fa-grav",
        "fa-hacker-news",
        "fa-houzz",
        "fa-html5",
        "fa-imdb",
        "fa-instagram",
        "fa-internet-explorer",
        "fa-ioxhost",
        "fa-joomla",
        "fa-jsfiddle",
        "fa-lastfm",
        "fa-lastfm-square",
        "fa-leanpub",
        "fa-linkedin",
        "fa-linkedin-square",
        "fa-linode",
        "fa-linux",
        "fa-maxcdn",
        "fa-meanpath",
        "fa-medium",
        "fa-meetup",
        "fa-mixcloud",
        "fa-modx",
        "fa-odnoklassniki",
        "fa-odnoklassniki-square",
        "fa-opencart",
        "fa-openid",
        "fa-opera",
        "fa-optin-monster",
        "fa-pagelines",
        "fa-paypal",
        "fa-pied-piper",
        "fa-pied-piper-alt",
        "fa-pied-piper-pp",
        "fa-pinterest",
        "fa-pinterest-p",
        "fa-pinterest-square",
        "fa-product-hunt",
        "fa-qq",
        "fa-quora",
        "fa-ra",
        "fa-ravelry",
        "fa-rebel",
        "fa-reddit",
        "fa-reddit-alien",
        "fa-reddit-square",
        "fa-renren",
        "fa-resistance",
        "fa-safari",
        "fa-scribd",
        "fa-sellsy",
        "fa-share-alt",
        "fa-share-alt-square",
        "fa-shirtsinbulk",
        "fa-simplybuilt",
        "fa-skyatlas",
        "fa-skype",
        "fa-slack",
        "fa-slideshare",
        "fa-snapchat",
        "fa-snapchat-ghost",
        "fa-snapchat-square",
        "fa-soundcloud",
        "fa-spotify",
        "fa-stack-exchange",
        "fa-stack-overflow",
        "fa-steam",
        "fa-steam-square",
        "fa-stumbleupon",
        "fa-stumbleupon-circle",
        "fa-superpowers",
        "fa-telegram",
        "fa-tencent-weibo",
        "fa-themeisle",
        "fa-trello",
        "fa-tripadvisor",
        "fa-tumblr",
        "fa-tumblr-square",
        "fa-twitch",
        "fa-twitter",
        "fa-twitter-square",
        "fa-usb",
        "fa-viacoin",
        "fa-viadeo",
        "fa-viadeo-square",
        "fa-vimeo",
        "fa-vimeo-square",
        "fa-vine",
        "fa-vk",
        "fa-wechat",
        "fa-weibo",
        "fa-weixin",
        "fa-whatsapp",
        "fa-wikipedia-w",
        "fa-windows",
        "fa-wordpress",
        "fa-wpbeginner",
        "fa-wpexplorer",
        "fa-wpforms",
        "fa-xing",
        "fa-xing-square",
        "fa-y-combinator",
        "fa-y-combinator-square",
        "fa-yahoo",
        "fa-yc",
        "fa-yc-square",
        "fa-yelp",
        "fa-yoast",
        "fa-youtube",
        "fa-youtube-play",
        "fa-youtube-square",
        "fa-ambulance",
        "fa-h-square",
        "fa-heart",
        "fa-heart-o",
        "fa-heartbeat",
        "fa-hospital-o",
        "fa-medkit",
        "fa-plus-square",
        "fa-stethoscope",
        "fa-user-md",
        "fa-wheelchair",
        "fa-wheelchair-alt"
    ];

    if (jQuery('[data-for=icon]').length == 0)
        return;
    jQuery('[data-for=icon]').autocomplete({
        source: icons,
        html: true,
        select: function(event, ui)
        {
            jQuery(this).siblings('i').first().attr('class', 'fa ' + ui.item.value);
        }

    }).data('ui-autocomplete')._renderItem = function(ul, item)
    {
        var content = '<li><i class="fa '+item.value+'"></i> '+item.value+'</li>';

        return jQuery(content)
            .appendTo(ul);
    }
}


function c37ShadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

//get video URL from embed code
function getYouTubeID(url)
{
    if (typeof url === "undefined" || url === "")
        return "";

    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return url;
    }
}

function enableAccordionStyleTab()
{
    console.log('accord');
    jQuery('#style-tab').accordion({
        header: '.section-header',
        heightStyle: 'content',
        collapsible: true
    });
}

function hideEditPanel()
{
    var editPanel = jQuery('#options-window');
    editPanel.html('');
    editPanel.addClass('c37-hidden');

}


function c37Hex2rgb(hex) {
    // long version
    var r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (r) {
        return r.slice(1,4).map(function(x) { return parseInt(x, 16); });
    }
    // short version
    r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (r) {
        return r.slice(1,4).map(function(x) { return 0x11 * parseInt(x, 16); });
    }
    return null;
}

/**
 *
 * @param hex hex color
 * @param opacity number from 0 to 100
 */
function c37Hex2rgba(hex, opacity)
{
    var o = opacity/100;
    return 'rgba('+c37Hex2rgb(hex).join(',') + ',' + o + ')';
}


function toggleOptionsWindowSize()
{
    var optionWindow = jQuery('#options-window');
    optionWindow.toggleClass('options-window-big');
}

/**
 * Find icon class fa- from a string of class of an element
 * @param classString
 * @returns {*}
 */
function findIconClass(classString)
{
    var faIconPattern = /fa[\-\S]{2,30}/i;
    var faRegex = new RegExp(faIconPattern);
    var resultArray = [];
    resultArray = faRegex.exec(classString);

    if (resultArray == null)
        return '';

    return resultArray[0];
}



function c37RenderWebFonts(fontCode)//fontCode in format <link href=""...
{
    //get list of fonts from C37FontManager
    core37Page.pageSettings.webFonts = core37Page.pageSettings.webFonts || [];
    var encodedFont = encodeURIComponent(fontCode);
    if (!_.contains( core37Page.pageSettings.webFonts, encodedFont))
    {
        core37Page.pageSettings.webFonts.push(encodedFont);
        jQuery('head').append(fontCode);
    }
}

function c37LoadWebFontsForPage()
{
    console.log('loading web fonts...');
    jQuery("link[href^='https://fonts.googleapis']").remove();
    if (typeof core37Page.pageSettings.webFonts != "undefined")
    {
        _.each(core37Page.pageSettings.webFonts, function(f){

            jQuery('head').append(decodeURIComponent(f));
        });
    }
}


function c37ApplyFontsToEditor(editor)
{
    if (typeof core37Page.pageSettings.webFonts != "undefined")
    {
        _.each(core37Page.pageSettings.webFonts, function(f){
            var linkElement = jQuery.parseHTML(decodeURIComponent(f));
            console.log(jQuery(linkElement).attr('href'));
            editor.addContentsCss(jQuery(linkElement).attr('href'));
        });

    }
}

/**
 * @param element: jQuery element
 */
function c37MakeTabs(element)
{
    console.log('creating tabs');
    element.tabs({
        active: 0,
        activate: function(event, ui)
        {
            ui.oldTab.find('a').removeClass('active-tab');
            ui.newTab.find('a').addClass('active-tab');
        },
        create: function(event, ui)
        {
            ui.tab.find('a').addClass('active-tab');
        }

    });
}

//evaluate between a varaible and value, return true if _variable == _value
function c37CompareEqual(_variable, _value)
{
    if (typeof _variable !== 'undefined' && _variable === _value)
        return true;
    return false;
}

/**
 *
 * @param varName, variable name, object key...
 * @param defaultValue, default value when varName is null or undefined
 */
function c37GetValue(varName, type, defaultValue)
{
    if (typeof varName === 'undefined')
    {
        return defaultValue;
    }

    if (type==='number')
    {
        if (isNaN(parseInt(varName)))
            return defaultValue;
        return parseInt(varName);
    } else if (type==='string')
    {
        return varName;
    }

}

function c37GetNumber(varName, defaultValue)
{
    if (typeof varName !== 'undefined')
    {
        if (!isNaN(parseInt(varName)))
        {
            return parseInt(varName);
        } else
        {
            return defaultValue;
        }
    }

    return defaultValue;
}

//pass in css style object of an element and return if it has video background option
function c37HasVideoBG(cssStyle)
{
    if (typeof cssStyle === 'undefined')
        return false;

    if (typeof cssStyle.videoBg === 'undefined')
        return false;

    if (typeof cssStyle.videoBg.src === 'undefined')
        return false;

    if (cssStyle.videoBg.type === 'youtube' && cssStyle.videoBg.src.yt !== '')
        return 'youtube';

    if (cssStyle.videoBg.type === 'self-hosted' && (cssStyle.videoBg.src.mp4 !== '' || cssStyle.videoBg.src.webm !== '' || cssStyle.videoBg.src.ogv !== '' ) )
        return 'self-hosted';

    return false;
}

/**
 * take the input, return the correct value to the editor, if the input is undefined, return an empty string,
 * otherwise, return the input
 * @param input
 * @returns {*}
 */
function c37GetValue(input)
{
    if (isNaN(parseInt(input)))
        return '';
    console.log("returning input value: ", input);
    return input;
}


function generateCSSFromObject(object)
{
    console.log('passing onbject is', object);
    var string = '';
    console.log('object is: ', object);
    for (var key in object)
    {
        if (object.hasOwnProperty(key))
        {
            if (typeof object[key] == 'object')
            {
                for (var childKey in object[key])
                {
                    if (typeof object[key]=='undefined')
                        continue;
                    if (object[key][childKey] == 0)
                        continue;

                    string += key + '-' + childKey + ": " +object[key][childKey] + "px; ";
                }
            } else
            {
                if (typeof object[key]!='undefined' && object[key]!=0 && object[key]!="")
                    string+= key + ': ' + object[key] + 'px; ';
            }

        }


    }

    console.log('result string is: ', string);

    return string;
}


function hideTopDropDownMenu()
{
    setTimeout(function(){
        jQuery('.c37-drop-down-menu').hide('slide', {direction: 'up'}, 500);
    }, 200);
}

//create tabs for the background style option of page settings
function backgroundTabs()
{
    jQuery('#c37-bg-options').tabs({
        active: 0,
        activate: function(event, ui)
        {
            ui.oldTab.find('a').removeClass('active-tab');
            ui.newTab.find('a').addClass('active-tab');
        },
        create: function(event, ui)
        {
            ui.tab.find('a').addClass('active-tab');
        }

    });
}

function responsiveTabs()
{

    jQuery('.responsive-tabs').tabs({
        active: 0,
        activate: function(event, ui)
        {
            ui.oldTab.find('a').removeClass('active-tab');
            ui.newTab.find('a').addClass('active-tab');
        },
        create: function(event, ui)
        {
            ui.tab.find('a').addClass('active-tab');
        }
    });
}

function boxSizeTab()
{
    jQuery('#box-size').tabs({
        active: 0,
        activate: function(event, ui)
        {
            ui.oldTab.find('a').removeClass('active-tab');
            ui.newTab.find('a').addClass('active-tab');
        },
        create: function(event, ui)
        {
            ui.tab.find('a').addClass('active-tab');
        }
    });
}


function paddingTabs()
{

    jQuery('#padding-tab').tabs({
        active: 0,
        activate: function(event, ui)
        {
            ui.oldTab.find('a').removeClass('active-tab');
            ui.newTab.find('a').addClass('active-tab');
        },
        create: function(event, ui)
        {
            ui.tab.find('a').addClass('active-tab');
        }
    });
}


function textSizeTabs()
{


    jQuery('#text-size').tabs({
        active: 0,
        activate: function(event, ui)
        {
            ui.oldTab.find('a').removeClass('active-tab');
            ui.newTab.find('a').addClass('active-tab');
        },
        create: function(event, ui)
        {
            ui.tab.find('a').addClass('active-tab');
        }
    });
}

//get attribute from object
function getIntAttribute(object, attributesArray)
{
    var currentBranch = object;
    for (var i =0; i < attributesArray.length; i++)
    {
        if (typeof currentBranch[attributesArray[i]] == 'undefined')
            return 0;
        console.log('attribute css: ', currentBranch[attributesArray[i]]);
        currentBranch = currentBranch[attributesArray[i]];
    }

    if (typeof currentBranch != 'undefined')
        return currentBranch;

    return 0;
}

function getStringAttribute(object, attributesArray)
{
    var currentBranch = object;
    for (var i =0; i < attributesArray.length; i++)
    {
        if (typeof currentBranch[attributesArray[i]] == 'undefined')
            return "";
        console.log('attribute css: ', currentBranch[attributesArray[i]]);
        currentBranch = currentBranch[attributesArray[i]];
    }

    if (typeof currentBranch != 'undefined')
        return currentBranch;

    return "";
}

/**
 *
 */
function elementSettingsTab()
{

    jQuery('#setting-tabs').tabs({
        active: 0,
        activate: function(event, ui)
        {
            ui.oldTab.find('a').removeClass('active-tab');
            ui.newTab.find('a').addClass('active-tab');
        },
        create: function(event, ui)
        {
            ui.tab.find('a').addClass('active-tab');
        }
    });
}



/**
 * Get model object of an element by ID, if available
 * First, check if modelsList[elementID] is set, modelsList is an object storing all elements' models, however,
 * it exists in current session only
 *
 * Then, check if modelsJSON[elementID] is available, this
 * @param elementID
 * @param elementType: will be used to get the object from ModelTemplates
 * @returns {*|boolean}
 */
function c37GetElementModel(elementID, elementType)
{
    //when element first created,
    if (elementID === false)
    {
        console.log("model templates", ModelTemplates);
        console.log("return fresh model");
        return new ModelTemplates[elementType];
        // modelsList[elementID] = freshModel;
        // core37Page.pageSettings.modelsJSON[freshModel.getElementID()] = freshModel.toJSON();

    }

    if (typeof modelsList[elementID] !== 'undefined')
    {
        console.log("model exists in modelsList");
        return modelsList[elementID];
    }

    //in case the model exists in JSON format but not in backbone model format, create a model based on the
    //model JSON
    if (typeof core37Page.pageSettings.modelsJSON[elementID] !== 'undefined')
    {
        console.log("get model form json object");
        return new C37ElementModel(core37Page.pageSettings.modelsJSON[elementID]);
    }

    //finally, when nothing above works, create a fresh model and assign the element id to that model
    console.log("return new model model");
    console.log('element type is: ', elementType);

    //change box id to the new model editingElementID so the next time user click on the square icon to edit the box
    //it will use this model instead of create a new one
    var newModel = new ModelTemplates[elementType];

    var element = jQuery('#' + elementID);
    element.attr('id', newModel.getElementID());


    return  newModel;


}

function c37CleanForm(rawFormCode)
{
    var formElement = jQuery.parseHTML(decodeURIComponent(rawFormCode));

    var elements = [];
    var radio = [];
    var checkbox = [];

    //extract all elements from form and push to the elements array
    _.each(jQuery(formElement).find('input,button,textarea,select'), function(child){
        child = jQuery(child);
        if (child.is('input') || child.is('button') || child.is('textarea') || child.is('select'))
        {
            elements.push(child);
        }

    });




    var formMethod = jQuery(formElement).attr('method') === undefined ? '' : jQuery(formElement).attr('method');
    var formAction = jQuery(formElement).attr('action') === undefined ? '' : jQuery(formElement).attr('action');



    //append to form
    var appendCode = '';
    _.each(elements, function(e){

        if (e.is('input') || e.is('button'))
        {
            //convert other input submit types to input submit (button, image)

            if (e.attr('type') === 'button' || e.attr('type') === 'image' || e.is('button'))
            {
                if (e.is('button'))
                {
                    //change the button to a submit element
                    e = jQuery('<input type="submit" name="'+e.attr('name')+'" value="'+e.text()+'" />');
                } else
                {
                    e.attr('type', 'submit');

                    if (typeof e.attr('value') === "undefined")
                    {
                        e.attr('value', 'submit');
                    }
                }


            }


            if (e.attr('type') === 'submit')
            {
                console.log("we have submit button");
                var submitButtonModel = new SubmitButtonModel({text: e.attr('value')});
                var submitButton = new Button({model: submitButtonModel});
                submitButton.render();
                appendCode += '<div data-original="false" data-c37-type="button" class="c37-lp-element c37-lp-form-child c37-item-element" id="'+submitButtonModel.get('editingElementID')+'">' +
                    submitButton.$el.html() +
                    '</div>';

            }
                /*
                | in case of hidden input, we don't need to have a placeholder.
                | Also, we need to hide the element
                | in addition, value must be set
                 */

            else if (e.attr('type') === 'hidden')
            {
                var value = typeof  e.val() === "undefined" ? '' : e.val();
                appendCode += '<input type="hidden" name="'+e.attr('name')+'" value="'+value+'" />';


            } else if (e.attr('type') === 'radio')
            {
                radio[e.attr('name')] = radio[e.attr('name')] || {};
                radio[e.attr('name')]["options"] = radio[e.attr('name')]["options"] || [];
                radio[e.attr('name')]["options"].push({value: e.attr('value'), id: 'radio_' + Math.floor(Math.random() * 30020)});
                radio[e.attr('name')]["name"] = e.attr('name');


            } else if (e.attr('type') === 'checkbox')
            {
                checkbox[e.attr('name')] = checkbox[e.attr('name')] || {};
                checkbox[e.attr('name')]["options"] = checkbox[e.attr('name')]["options"] || [];
                checkbox[e.attr('name')]["options"].push({value: e.attr('value'), id: 'checkbox_' + Math.floor(Math.random() * 30320)});
                checkbox[e.attr('name')]["name"] = e.attr('name');
            } else
            {
                /*
                 | In case the user uses mailchimp, we need to skip the input that has a very lengthy name
                 */
                if (e.attr('name') !== undefined && e.attr('name').length > 30 && e.attr('tabindex') !== undefined)
                    appendCode += '';
                else
                {
                    var model =  new TextInputModel();
                    model.set('name', e.attr('name'));
                    model.set('placeholder', e.attr('name'));
                    model.set('value', e.attr('value'));
                    var ti = new TextInput({model: model});
                    ti.render();
                    appendCode += '<div  data-original="false" data-c37-type="text" class="c37-lp-element c37-lp-form-child c37-item-element" id="'+model.get('editingElementID')+'">' +
                        ti.$el.html()+
                        '</div>';

                }


            }


        } else if (e.is('textarea'))
        {

            var taModel =  new TextAreaModel();
            var ta = new TextArea({model: taModel});
            ta.render();
            appendCode += '<div  data-original="false" data-c37-type="textarea" class="c37-lp-element c37-lp-form-child c37-item-element" id="'+taModel.get('editingElementID')+'">' +
                ta.$el.html() +
                '</div>';
        } else if (e.is('select'))
        {
            console.log("have select element");
            var selectModel = new SelectModel();
            var sel = new Select({model : selectModel});
            sel.render();
            appendCode += '<div  data-original="false" data-c37-type="select" class="c37-lp-element c37-lp-form-child c37-item-element" id="'+selectModel.get('editingElementID')+'">' +
                sel.$el.html() +
                '</div>';



        }

    });


    //append radio and checkbox
    _.each(_.keys(radio), function(r) {

        var radioModel = new RadioModel();
        radioModel.set('name', radio[r].name);
        radioModel.set('options', radio[r].options);

        var radioElement = new Radio({model: radioModel});
        radioElement.render();
        appendCode += '<div  data-original="false" data-c37-type="radio" class="c37-lp-element c37-lp-form-child c37-item-element" id="'+radioModel.get('editingElementID')+'">' +
            radioElement.$el.html() + 
            '</div>';

    });

    _.each(_.keys(checkbox), function(c) {

        var checkboxModel = new CheckBoxModel();
        checkboxModel.set('name', checkbox[c].name);
        checkboxModel.set('options', checkbox[c].options);
        var checkboxElement = new CheckBox({model: checkboxModel});
        checkboxElement.render();

        appendCode += '<div  data-original="false" data-c37-type="checkbox" class="c37-lp-element c37-lp-form-child c37-item-element" id="'+checkboxModel.get('editingElementID')+'">' +
            checkboxElement.$el.html() +
            '</div>';


    });

    return {
        method: formMethod,
        action: formAction,
        code: appendCode
    };
}


function c37GetPageCSSID()
{
    return jQuery('.c37-lp').attr('id');
}
/**
 * This function runs when creating a new page or edit a new page or load a template. It resets all 
 * the data of the current page
 */
function c37IntNewPage()
{

}

 /**
 * CONTAINS BOOT UP VARIABLES, LOAD FIRST IN EDITOR
 *
 */
var core37Page = {
    pageID: 0,
    pageSlug: '',
    pageContent: {},
    pageSettings: {
        webFonts: [], //list of webfonts (in <link> format)
        modelsJSON: {}, //object contains models of all elements on page//json
        flipCountdown: {},
        simpleCountdown: {},
        elementsActions : {
            /**
             * {
     * element: 'email', //id
     * trigger: 'click',
     * action: 'show',
     * target: 'name'
     * }
             *
             * {
     * element: 'date',
     * trigger: 'change',
     * action: 'show',
     * condition: 'greater'
     * value: '30',
     * }
             *
             */
        },
        jsCodes: {

        },
        compiledCSS: ''
    }

};

/**
 * object to store all models of views in an edit session, this object starts blank and is not saved in database
 */
var modelsList = {};

jQuery(function(){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


    jQuery('#elements-list').tabs();

    //initiate a section so user can start dropping elements in
    var sectionZero = new Section({model: new SectionModel()});
    //replace the c37-step inner html with the sectionZero HTML
    sectionZero.render();
    jQuery('.c37-lp').html(sectionZero.$el.html());

    /**
     * On page load, make the current c37-box boxes droppable
     */
    makeFormDroppable(jQuery);
    makeC37BoxDroppable(jQuery);
    makeC37SectionDroppable(jQuery);
    makeC37StepDroppable(jQuery);
});

//defaultValues is the object that contains all default values (such as image URL, etc.)
var defaultValues = {};
var popupOptions = [];


jQuery.post(
    ajaxurl,
    {
        action: 'core37_lp_get_all_menus'
    },
    function(response){
        core37Page.menus = JSON.parse(response);
    }
);

//get the default parameters
jQuery.post(
    ajaxurl,
    {
        action: 'core37_lp_get_default_parameters'
    },
    function(response)
    {
        Object.assign(defaultValues, JSON.parse(response))
    }

);


//get all popups options so the user can assign buttons to click open popup later
jQuery.post(
    ajaxurl,
    {
        action: 'core37_lp_load_all_popup_options',
        title: 'text'//use text to comply with select2
    },
    function(response)
    {
        console.log('all poups', decodeURIComponent(response));
        popupOptions = JSON.parse(decodeURIComponent(response));
    }

);


/**
 * Save form data:
 * 1. Elements action
 *
 */
/**
 * This is the object that store all action of elements in form
 * @type {{}}
 */



//validation is an array of rules for each element
var validation = {};


(function (jQuery) {


    jQuery(function(){

        jQuery(document).on('mousedown', '.c37-premium-element, .c37-premium-feature', function(){
            if (!versionNangCap)
                showUpgradeDialog(); 
        });

        if (versionNangCap)
        {
            jQuery('#c37-go-popup').show();
            jQuery('#c37-go-widget').show();
        } else {
            jQuery('#c37-go-pro').css('display', 'inline-block');
        }

        jQuery('#help-icon, #help-area-close-icon').on('click', function () {
           jQuery('#help-area').slideToggle();
        });


        jQuery(document).on('click', '.c37-step .c37-item-element', function (e) {
            e.preventDefault();
        });

        //drag n drop of section
        jQuery('.c37-container-element').draggable({
            connectToSortable: '.c37-step',
            helper: 'clone',
            revert: 'invalid',
            addClasses: false,
            iframeFix: true,
            refreshPositions: true
        });

        //drag n drop of row
        jQuery('.c37-row-element').draggable({
            connectToSortable: '.c37-section',
            helper: 'clone',
            revert: 'invalid',
            addClasses: false,
            iframeFix: true,
            refreshPositions: true
        });

        var cancelClass = '';
        if (!versionNangCap)
            cancelClass = '.c37-premium-element';

        //drag n drop of elements
        jQuery('.c37-item-element').draggable({
            connectToSortable: '.c37-box',
            cursor: "move",
            //cursorAt: {top: -12, left: -20},
            helper: 'clone',
            classes: {
                'ui-draggable' : 'c37-brick'
            },
            start: function(event, ui){
                if (ui.helper.hasClass('c37-premium-element') && !versionNangCap)
                    showUpgradeDialog();
            },
            revert: "invalid",
            cancel: cancelClass,
            iframeFix: true,
            addClasses: false,
            refreshPositions: true
        });
        jQuery('.c37-wall-element').draggable({
            connectToSortable: '.c37-box',
            cursor: "move",
            //cursorAt: {top: -12, left: -20},
            helper: 'clone',
            classes: {
                'ui-draggable' : 'c37-brick'
            },
            revert: "invalid",
            cancel: cancelClass,
            iframeFix: true,
            addClasses: false,
            refreshPositions: true,
            drag: function(event, ui)
            {
                ui.helper.width('100px');
            }
        });


        jQuery(document).on('click','#close-edit-panel', function() {
            hideEditPanel();
        });


    });


})(jQuery);
function prepareOptionWindows(optionsWindow) {
    // optionsWindow.hide();
    optionsWindow.removeClass('c37-hidden');

    optionsWindow.resizable({
        handles: "n, e, s, w"
    }).draggable({
        // handle: '#move-panel',
        stop: function(event, ui)
        {
            jQuery(ui.helper).css({width: ''});
        }
    });
}
/**
 * Created by luis on 8/22/16.
 */

(function (jQuery){
    // var model, elementEdit, rowModel, wallModel, wallEdit, rowEdit, formEdit, boxModel, boxEdit;
    var elementContextMenu = jQuery('#wplx-edit-element-context-menu').html();

    //jQuery('[data-c37-type=wall]').append(elementContextMenu.replace('element_title', 'wall'));

    var sectionContextMenu = jQuery('#wplx-edit-section-context-menu').html();
    var wallContextMenu = jQuery('#wplx-edit-wall-context-menu').html();



    /**
     * Load edit form of element when clicked on.
     * @param elementID
     */
    function loadElementEditForm(elementID)
    {
        //selected element is the outer element (c37-lp-element) the container of form element
        var selectedElement = jQuery('#'+elementID);
        var elementType = selectedElement.attr('data-c37-type');
        // var size = getElementSize(selectedElement);

        if (elementType === 'wall')
            return;


        var model = c37GetElementModel(elementID, elementType);

        console.log('model: ', model.toJSON());
        console.log('element type is: ', elementType);

        console.log('element type: ', elementType);
        var ElementView = eMAP[elementType].el;
        var ElementEditView = eMAP[elementType].ed;

        console.log('element is: ', eMAP[elementType].ed);

        //create element and render
        new ElementView({model: model, el: '#' + elementID});

        new ElementEditView({model: model});

        renderFontAwesome();
        //setting tabs behavior
        elementSettingsTab();
        enableAccordionStyleTab();
        backgroundTabs();
        responsiveTabs();
        textSizeTabs();
        //if the element has the action tab and has popup select box in action area, populate the popups
        var popupSelectBox = jQuery("[data-for=target-popup] select");
        if (popupSelectBox.length > 0)
        {
            //populate the popup option if available
            var selectedPopupID = '';
            var tempAction =  core37Page.pageSettings.elementsActions[elementID];
            if (typeof tempAction !== 'undefined')
            {
                if (tempAction.action ==='open-popup')
                {
                    selectedPopupID = tempAction['popup-id'];
                }
            }
            populateDataList(popupSelectBox, popupOptions, selectedPopupID);
        }


    }


    function loadPageEditForm()
    {
        var pageModel = c37GetElementModel('page', 'page');

        new PageEdit({model: pageModel});
        console.log("Page model: ", pageModel);

        var editors = preparePageCodeEditor();
        //setting tabs behavior
        elementSettingsTab(editors);

        jQuery('#page-codes').accordion({
            header: '.section-header',
            heightStyle: 'content',
            collapsible: true
        });

        backgroundTabs();
        responsiveTabs();

        textSizeTabs();


    }


    function loadSectionEditForm(sectionID)
    {
        var sectionModel = c37GetElementModel(sectionID, 'section');

        new SectionEdit({model: sectionModel});
        backgroundTabs();
        responsiveTabs();

    }

    /**
     * load setting for row
     * @param rowID
     */
    function loadRowEditPanel(rowID)
    {
        var rowModel = c37GetElementModel(rowID, 'row');
        new RowEdit({model: rowModel});

        //setting tabs behavior
        elementSettingsTab();
        backgroundTabs();
        responsiveTabs();

        textSizeTabs();

    }

    /**
     * wall is identical to row
     * @param wallID
     * @param wallLayout
     */
    function loadWallEditPanel(wallID)
    {
        console.log("load wall edit form");
        var wallModel = c37GetElementModel(wallID, 'wall');

        new WallEdit({model: wallModel});

        //setting tabs behavior
        elementSettingsTab();
        backgroundTabs();
        responsiveTabs();
    }


    function loadBoxSettings(boxID)
    {
        var boxModel = c37GetElementModel(boxID, 'box');
        new BoxEdit({model: boxModel});

        //setting tabs behavior
        elementSettingsTab();
        enableAccordionStyleTab();
        backgroundTabs();
        responsiveTabs();
        boxSizeTab();
        textSizeTabs();
    }


    //hide the edit menu on button click
    jQuery(document).on('click','#close-panel', function(){
        hideEditPanel();
    });

    jQuery(document).on('click','#maximize-panel', function(){
        toggleOptionsWindowSize();
    });

    /**
        Show/hide the context menu when cursor hover on page element
     */
    jQuery(document).on('mouseover', '.c37-step .c37-item-element', function(){
        var title = jQuery(this).attr('data-c37-type');

        if (typeof title !== 'undefined')
            title = title.replace('/_/g', ' ').toLowerCase();


        if (jQuery(this).find('.c37-element-cm').length === 0)
        {
            jQuery(this).append(elementContextMenu.replace('element_title', title));
            var editMenu = jQuery(this).find('.c37-element-cm');
            // var marginRight = -1 * editMenu.width()/2;
            // var marginTop = -1 * editMenu.height()/2;
            // editMenu.css('margin-right', marginRight + 'px');
            // editMenu.css('margin-top', marginTop + 'px');
        }
    });



    jQuery(document).on('mouseleave', '.c37-step .c37-item-element', function(){
        jQuery(this).find('.c37-element-cm').remove()
    });
    jQuery(document).on('mouseover', '.c37-wall', function(){


        if (jQuery(this).find('.c37-wall-cm').length === 0)
        {
            jQuery(this).append(wallContextMenu);
        }
    });


    jQuery(document).on('mouseleave', '.c37-step .c37-wall', function(){
        jQuery(this).find('.c37-wall-cm').remove()
    });

    /**
     * Show/hide the context menu when cursor hover on column
     */

    jQuery(document).on('mouseover', '.c37-step .c37-row > div > .c37-box', function(){
        if (jQuery(this).find('.c37-section-cm').length === 0)
        {
            var hideSectionMenu = jQuery('#hide-section-menu').is(':checked');
            if (!hideSectionMenu)
            {
                jQuery(this).append(sectionContextMenu);
            }
        }

    });

    jQuery('#dark-theme').on('click', function(){
        var optionsWindow = jQuery('#options-window');
        var elementPanel = jQuery('#elements-panel');
        var topBar = jQuery('#form-general-settings');

        optionsWindow.toggleClass('theme-dark');
        elementPanel.toggleClass('theme-dark');
        topBar.toggleClass('theme-dark');
    });

    jQuery(document).on('mouseleave', '.c37-step .c37-row', function(){
        jQuery(this).find('.c37-section-cm').remove();
    });



    //show the confirmation dialog when user click on del button
    jQuery(document).on('click', '.cm-del', function(){
        var parentElement = jQuery(this).closest('.c37-item-element');


        swal({
            title: 'Delete this element?',
            text: 'This action cannot be undone. Be very careful',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function() {
            parentElement.remove();

            //remove the object of this element in properties
            var elementID = parentElement.attr('id');
            delete(core37Page.pageSettings.modelsJSON[elementID]);
            delete(modelsList[elementID]);
            //delete the simple countdown in case it is a simple countdown
            delete(core37Page.pageSettings.simpleCountdown[elementID]);

            //delete style element associates with this element in the head
            jQuery('[data-css='+elementID+']').remove();
            jQuery('[data-custom-css='+elementID+']').remove();
        });

    });

    /**
     * Clone element on page:
     * What to clone:   - html content
     *                  - css style
     */

    jQuery(document).on('click', '.cm-clone', function() {
        var sourceElement = jQuery(this).closest('.c37-item-element');
        var sourceElementID = sourceElement.attr('id');
        var sourceElementType = sourceElement.attr('data-c37-type');

        var elementModel = ModelTemplates[sourceElementType];

        var sourceModel = c37GetElementModel(sourceElementID, sourceElementType);
        var sourceModelJSON = JSON.parse(JSON.stringify(sourceModel));

        var newElementID = 'c37-'+sourceElementType+'-' + Math.round(Math.random() * 1000000);
        console.log("new ID: ", newElementID);
        sourceModelJSON.editingElementID = newElementID;
        sourceModelJSON.cid = "c" + Math.round(Math.random() * 1000000);



        //create new model based on the attribute of the source model
        var cloneModel = new elementModel(sourceModelJSON);

        var cloneElement = sourceElement.clone();

        cloneElement.attr('id', cloneModel.getElementID());
        cloneElement.insertAfter(sourceElement);
        // applyStyles();

    });

    jQuery(document).on('click', '.cm-clone-row', function() {
        //find all child element and clone then
        //clone row model
        //insert row after current row

        var sourceRow = jQuery(this).closest('.c37-row');
        var sourceRowModel = c37GetElementModel(sourceRow.attr('id'), 'row');

        var cloneRow = sourceRow.clone();

        _.each(cloneRow.find('.c37-item-element, .c37-wall-element'), function(e){
            //clone the models
            var elementType = jQuery(e).attr('data-c37-type');
            var elementID = jQuery(e).attr('id');
            var elementModel = ModelTemplates[elementType];
            console.log("e type: ", elementType);
            console.log("e model: ", elementModel);

            var sourceModel = c37GetElementModel(elementID, elementType);
            var sourceModelJSON = sourceModel.toJSON();
            sourceModelJSON.editingElementID = 'c37-'+elementType+'-' + Math.round(Math.random() * 1000000);

            var cloneModel = new elementModel(sourceModelJSON);

            jQuery(e).attr('id', cloneModel.getElementID());
        });

        //create model for the clone row
        var cloneRowModelJSON = sourceRowModel.toJSON();
        //change the id of the source row to use on the new row
        cloneRowModelJSON.editingElementID = 'c37-row-' + Math.round(Math.random() * 1000000);

        console.log("model templates: ", ModelTemplates['row']);
        var cloneRowModel = new ModelTemplates['row'](cloneRowModelJSON);

        cloneRow.attr('id', cloneRowModel.getElementID());

        cloneRow.insertAfter(sourceRow);





    });

    /**
     * Show edit element form on pencil icon click
     *
     */
    jQuery(document).on('click', '.c37-element-cm .cm-edit', function(){
        //empty setting panel
        var optionsWindow = jQuery('#options-window');
        optionsWindow.html('');
        optionsWindow.append('<div id="element-settings"></div>');

        //var id = jQuery(this).attr('id');
        var id = jQuery(this).closest('.c37-item-element').attr('id');
        loadElementEditForm(id);
        prepareOptionWindows(optionsWindow);

    });

    //delete element
    //jQuery(document).on('click', '.c37-element-cm .cm-del', function(){
    //    var id = jQuery(this).closest('.c37-item-element').attr('id');
    //    deleteElement(id);
    //});

    /**
     * Load current settings on click. The two pieces of info needed when loading settings
     * for a row is:
     *  1. Row ID - this info will be used to update changes to row when user edit
     *  2. Current row layout
     */
    jQuery(document).on('click', '.c37-section-cm .cm-row-edit', function (e) {
        //empty setting panel
        var optionsWindow = jQuery('#options-window');
        var currentRow = jQuery(this).closest('.c37-row');
        optionsWindow.html('');
        optionsWindow.append('<div id="row-settings"></div>');
        var rowID = currentRow.attr('id');

        loadRowEditPanel(rowID);
        enableAccordionStyleTab();
        prepareOptionWindows(optionsWindow);

    });



    /**
     * Load current settings on click. The two pieces of info needed when loading settings
     * for a row is:
     *  1. Row ID - this info will be used to update changes to row when user edit
     *  2. Current row layout
     */
    jQuery(document).on('click', '.c37-section-cm .cm-section-edit', function (e) {
        //empty setting panel
        var optionsWindow = jQuery('#options-window');
        var currentSection = jQuery(this).closest('.c37-section');
        optionsWindow.html('');
        optionsWindow.append('<div id="section-settings"></div>');
        var sectionID = currentSection.attr('id');

        loadSectionEditForm(sectionID)

        enableAccordionStyleTab();
        prepareOptionWindows(optionsWindow);

    });





    //Edit box
    jQuery(document).on('click', '.c37-section-cm .cm-box-edit', function(e){
//empty setting panel
        var optionsWindow = jQuery('#options-window');
        optionsWindow.html('');
        optionsWindow.append('<div id="element-settings"></div>');
        var box = jQuery(this).closest('.c37-box');
        var boxID = box.attr('id');

        loadBoxSettings(boxID);
        prepareOptionWindows(optionsWindow);
    });


    //delete row
    jQuery(document).on('click', '.c37-section-cm .cm-row-del', function(){
        var rowToDelete = jQuery(this).closest('.c37-row');

        swal({
            title: 'Delete this row?',
            text: 'This action cannot be undone. Be very careful',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function() {
            rowToDelete.remove();
        });
    });


    jQuery(document).on('click', '.c37-section-cm .cm-section-del', function(){
        var sectionToDelete = jQuery(this).closest('.c37-section');

        swal({
            title: 'Delete this section?',
            text: 'This action cannot be undone. Be very careful',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function() {
            sectionToDelete.remove();
        });
    });




    //Edit box
    jQuery(document).on('click', '.c37-wall-cm .cm-wall-edit', function(e){
//empty setting panel
        var optionsWindow = jQuery('#options-window');
        optionsWindow.html('');
        optionsWindow.append('<div id="wall-settings"></div>');
        var wall = jQuery(this).closest('.c37-wall');
        var wallID = wall.attr('id');

        loadWallEditPanel(wallID);
        prepareOptionWindows(optionsWindow);
    });


    //delete row
    jQuery(document).on('click', '.c37-section-cm .cm-row-del', function(){
        var rowToDelete = jQuery(this).closest('.c37-row');

        swal({
            title: 'Delete this row?',
            text: 'This action cannot be undone. Be very careful',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function() {
            rowToDelete.remove();
        });
    });



    //show form menu
    jQuery(document).on('click', '#open-page-settings', function(){
        var optionsWindow = jQuery('#options-window');
        optionsWindow.html('');
        optionsWindow.append('<div id="form-settings"></div>');

        //convert background video to object if currently a string or undefined
        // var bgVid = core37Page.pageSettings.backgroundVideo;
        //
        // if (typeof bgVid == 'undefined')
        // {
        //     core37Page.pageSettings.backgroundVideo = {type: 'youtube', source: {}};
        // } else if (typeof bgVid == 'string')
        // {
        //     //if the background video is currently a string, it's youtube video
        //     core37Page.pageSettings.backgroundVideo = {type: 'youtube', source: {yt: bgVid}};
        // }

        loadPageEditForm();
        prepareOptionWindows(optionsWindow);

        c37MakeTabs(jQuery('.c37-tabs'));



    });


    function preparePageCodeEditor()
    {

//         //make code editor looks like code editor
//         var trackingCodeEditor = new CodeFlask;
//         trackingCodeEditor.run('#page-tracking-code', {language: 'javascript'});
//
//         trackingCodeEditor.onUpdate(function(code){
//             modelsList.page.set('trackingCode', encodeURIComponent(code))
//         });
//
//
//         var experimentCodeEditor = new CodeFlask;
//         experimentCodeEditor.run('#experiment-code', {language: 'javascript'});
//
//         experimentCodeEditor.onUpdate(function(code){
//             modelsList.page.set('experimentCode', encodeURIComponent(code))
//         });
//
//         var beforeBodyJSEditor = new CodeFlask;
//         beforeBodyJSEditor.run('#before-body-closing-code', {language: 'javascript'});
//
//         beforeBodyJSEditor.onUpdate(function(code){
//             modelsList.page.set('beforeBodyClosing', encodeURIComponent(code))
//         });
//
//
//         var afterBodyJSEditor = new CodeFlask;
//         afterBodyJSEditor.run('#after-body-opening-code', {language: 'javascript'});
//
//         afterBodyJSEditor.onUpdate(function(code){
//             modelsList.page.set('afterBodyOpening', encodeURIComponent(code))
//         });
//
//
//         var pageCSSEditor = new CodeFlask;
//         pageCSSEditor.run('#page-css-code', {language: 'css'});
//
//         pageCSSEditor.onUpdate(function(code){
//             modelsList.page.set('customCSSCode', encodeURIComponent(code))
//
//             jQuery('head .page-css').remove();
//             jQuery('head').append('<style class="page-css">'+code+'</style>');
//
//         });
//
//
//         var tracking = modelsList.page.trackingCode || '';
//         var experiment = modelsList.page.experimentCode || '';
//         var before = modelsList.page.beforeBodyClosing || '';
//         var after = modelsList.page.afterBodyOpening || '';
//         var css = modelsList.page.customCSSCode || '';
//
//         trackingCodeEditor.update(decodeURIComponent(tracking));
//         experimentCodeEditor.update(decodeURIComponent(experiment));
//         beforeBodyJSEditor.update(decodeURIComponent(before));
//         afterBodyJSEditor.update(decodeURIComponent(after));
//         pageCSSEditor.update(decodeURIComponent(css));

    }



})(jQuery);

/**
 * Created by luis on 6/22/16.
 */
(function (jQuery) {

    /*
    | Get form HTML, collect extra form information and send to server
     */

    //learn to use post with backbone instead
    //http://wordpress.stackexchange.com/questions/119765/using-backbone-with-the-wordpress-ajax-api

    //var savePageOptions = jQuery('#save-page-options');
    jQuery(document).on('click', '.c37-drop-down-button', function() {

        jQuery(this).siblings('.c37-drop-down-menu').toggle('slide', {direction: 'up'}, 500);
    });

    jQuery(document).on('click', '.c37-drop-down-menu li', function(){
        hideTopDropDownMenu();
    });

    jQuery(document).on('blur', '.c37-drop-down-button', function(){
        hideTopDropDownMenu();
    });

    jQuery(document).on('click', '#save-page-options a', function(){

        var isPage = false;

        var saveOption = jQuery(this).attr('id');
        if (saveOption === 'save-as-page')
            isPage = true;

        /**
         * If the user save the page as new page or new post, reset the page ID
         */
        if (saveOption === 'save-as-new-custom-post' || saveOption === 'save-as-new-page')
        {
            core37Page.pageID = 0;
            if (saveOption === 'save-as-new-page')
                isPage = true;
        }


        if (!modelsList.page || jQuery.trim(modelsList.page.get('pageTitle')) === '')
        {
            toastr.error(ERROR_MISSING_PAGE_NAME);
            return;
        }

        /**
         * Compile content from individual steps, this is needed when we have multiple step forms
         * @type {string}
         */
        var pageContent = encodeURIComponent(jQuery('#construction-site').html());
        showLoadingScreen();

        //gather all the custom css code that is in the header
        var cssInHead = '';
        _.each(jQuery('.c37-custom-css'), function(style){
            cssInHead += encodeURIComponent(jQuery(style).text().replace(/\n/g, ' '));
        });

        core37Page.pageSettings.compiledCSS = cssInHead;
        jQuery.post(ajaxurl,
            {
                pageContent: pageContent,
                pageID: core37Page.pageID,
                pageSlug: core37Page.pageSettings.modelsJSON.page.pageSlug,
                pageSettings: JSON.stringify(core37Page.pageSettings),
                pageTitle: core37Page.pageSettings.modelsJSON.page.pageTitle,
                action: 'core37_lp_save_page',
                isPage: isPage
            },
        function(response){
            //update current form ID to the generated ID
            hideLoadingScreen();

            core37Page.pageID = JSON.parse(response).pageID;
            console.log("page slug is: ", JSON.parse(response).pageSlug);
            modelsList.page.set('pageSlug', JSON.parse(response).pageSlug);
            //append the url of the page to the view page button
            jQuery('#preview-landing-page a').attr('href', JSON.parse(response).pageURL);
            jQuery('#preview-landing-page').css('display', 'inline-block');

            toastr.success(SUCCESS_FORM_SAVED);

            //hide the post save options panel
            jQuery('#save-page-options').hide();

        });

    });


        jQuery(document).on('click', '.edit-page-url', function(){
            var input = jQuery(this).find('input').first();
            console.log(input.length);
            console.log("url", input.val());
            input.val(input.val()).select();
            document.execCommand("copy");
            toastr.info('URL copied to clipboard');
    });

        jQuery(document).on('click', '.form-edit .fa-gear', function(){
            jQuery(this).siblings('.edit-page-url').toggle()
        });

    //show all available paegs
    jQuery(document).on('click', '#get-pages', function(response){

        showLoadingScreen();
        jQuery.post(
            ajaxurl,
            {action: 'core37_lp_list_pages'},
            function(response)
            {
                hideLoadingScreen();
                var optionsWindow = jQuery('#options-window');
                optionsWindow.html('');
                optionsWindow.append('<div id="forms-list"></div>');
                var model = new C37ElementModel();
                model.set('forms', JSON.parse(response));
                new PageList({
                    model: model
                });

                optionsWindow.removeClass('c37-hidden');
                optionsWindow.addClass('options-window-big');


            }
        );

    });

    //show all available paegs
    jQuery(document).on('click', '#get-templates', function(response){

        if (!versionNangCap || !isActivated)
        {
            showUpgradeDialog();
          return;
        }
        showLoadingScreen();

        jQuery.post(
            ajaxurl,
            {
              action: 'core37_lp_list_templates'
            },
            function(response)
            {
                hideLoadingScreen();
                var optionsWindow = jQuery('#options-window');
                optionsWindow.html('');
                optionsWindow.append('<div id="templates-list"></div>');
                var model = new C37ElementModel({
                });

                var data = JSON.parse(response);

                if (data.error === 1)
                {
                    toastr.info(data.message);
                    return;
                }


                model.set('templates', JSON.parse(response));
                new TemplateList({
                    model: model
                });

                optionsWindow.removeClass('c37-hidden');

                toastr.remove();
            }
        );

    });


    //load a single form based on form ID
    jQuery(document).on('click', '.form-edit i.fa-pencil', function(){

        var pageID = jQuery(this).closest('li').attr('form-id');

        var pageURL = jQuery(this).closest('li').find('.page-url').first().attr('href');

        //put pageURL into the view page button at the top bar
        jQuery('#preview-landing-page a').attr('href', pageURL);
        jQuery('#preview-landing-page').css('display', 'inline-block');


        jQuery.post(
            ajaxurl,
            {
                action: 'core37_lp_load_page',
                pageID: pageID
            },

            function(response)
            {
                var data = JSON.parse(response);

                try {
                    core37Page.pageSettings = JSON.parse(data.pageSettings);
                } catch (ex)
                {
                    toastr.info('there was an error parsing page settings');
                    console.error(ex);
                    core37Page.pageSettings = {};
                }

                //reset modelsList
                modelsList = [];

                //restore all backbone objects in modelsList, first , get the type of the elmement and re-create the object
                _.each(core37Page.pageSettings.modelsJSON, function(object){
                    var elementType = object.etype;
                    console.log("element type is: ", elementType);
                    console.log("element ", object);
                    if (elementType === 'hr')
                        elementType = 'line';
                    else if (elementType === 'cd')
                        elementType = 'simple_countdown';
                    else if (elementType === 'form')
                        elementType = 'form_container';
                    else if (elementType === 'input')
                    {
                        console.log("hello");
                        elementType = 'text';
                    } else if (elementType === 'text_input')
                    {
                        elementType = 'text';
                    }

                    if (typeof elementType!== 'undefined')
                    {
                        console.log("type is: ", elementType);
                        var elementModelObject = ModelTemplates[elementType];
                        new elementModelObject(object);
                    }

                });

                // modelsList['page'] = new PageModel(core37Page.pageSettings.modelsJSON.page);
                var editedPageCSSID = modelsList['page'].get('cssID');

                c37LoadWebFontsForPage();
                //load css back to the head
                var elements = _.keys(core37Page.pageSettings.modelsJSON);

                _.each(elements, function (elID) {
                    var cssStyle = core37Page.pageSettings.modelsJSON[elID].cssStyle;
                    //apply custom css back
                    jQuery('head').append('<style class="c37-custom-css" data-custom-css="'+elID+'"> '+ (decodeURIComponent(cssStyle.customCSS)) +' </style>');
                    //now start rendering the css into the head
                    console.log('el id is: ', elID);
                    if ( elID!== false && elID !== 'undefined')
                    {

                        var innerSelector = typeof cssStyle.innerSelector === 'undefined' ? '' :  cssStyle.innerSelector;
                        var selector= '';
                        if (elID === 'page')
                            selector = '.c37-page-container#page-'+editedPageCSSID +', .c37-widget-container#widget-'+editedPageCSSID;
                        else
                        {
                            console.log("element id: ", elID, " inner selector: ", innerSelector);
                            selector = '#' + editedPageCSSID + ' #' + elID + ' '  + innerSelector + ' ';
                        }
                        var cssRules = '';

                        var desktop = '';
                        var tablet = '';
                        var phone = '';

                        _.each(_.keys(cssStyle.desktop), function(key){

                            if (cssStyle.desktop[key]!== '')
                            {
                                if (key==='background-image')
                                    desktop+= key + ':url(' + cssStyle.desktop[key] + ');';
                                else if (key==='background-color')
                                {
                                    var bg = cssStyle.desktop[key];
                                    if (bg.color === '' || bg.color === '#fffffa')
                                    {
                                        desktop+= key + ': transparent;';
                                    } else
                                    {
                                        if (typeof bg.opacity === 'undefined' || bg.opacity === '')
                                            desktop+= key + ':' + bg.color + ';';
                                        else
                                        {
                                            //render rgba color
                                            desktop+= key + ':' + c37Hex2rgba(bg.color, bg.opacity) + ';';
                                        }
                                    }
                                } else if (key === 'box-shadow')
                                {
                                    var boxShadow = cssStyle.desktop[key];
                                    //get the color, if it's undefined or #fffffa, don't render box shadow
                                    if (!(typeof boxShadow.color === 'undefined' || boxShadow.color === '' || boxShadow.color === '#fffffa'))
                                    {
                                        if (boxShadow.inset)
                                        {
                                            desktop+= key + ': inset ' + boxShadow.offsetX + ' ' + boxShadow.offsetY + ' ' +  c37Hex2rgba(boxShadow.color, boxShadow.opacity) + ';';
                                        } else
                                        {
                                            desktop+= key + ': ' + boxShadow.offsetX + ' ' + boxShadow.offsetY + ' ' + boxShadow.blurRadius + ' ' + boxShadow.spreadRadius + ' ' + c37Hex2rgba(boxShadow.color, boxShadow.opacity) + ';';
                                        }
                                    }

                                }
                                else
                                    desktop+= key + ':' + cssStyle.desktop[key] + ';';
                            }
                        });

                        //combine style for tablet
                        _.each(_.keys(cssStyle.tablet), function(key){

                            if (cssStyle.tablet[key]!== '')
                                tablet+= key + ':' + cssStyle.tablet[key] + ';';

                        });


                        //combine style for phone
                        _.each(_.keys(cssStyle.phone), function(key){

                            if (cssStyle.phone[key]!== '')
                                phone+= key + ':' + cssStyle.phone[key] + ';';

                        });



                        //apply non-size rules for all device (colors ...)
                        cssRules += selector + '{' + desktop.replace(/\n/g, ' ')+'}';

                        cssRules += '@media only screen and (min-width : 320px) { '+ selector + '{' +phone.replace(/\n/g, ' ')+' } }';
                        cssRules += '@media only screen and (min-width : 768px) { '+ selector + '{' +tablet.replace(/\n/g, ' ')+' } }';
                        cssRules += '@media only screen and (min-width : 992px) { '+ selector + '{' +desktop.replace(/\n/g, ' ')+' } }';

                        //remove the current style element in the head of this particular element, if available
                        jQuery('[data-css='+elID+']').remove();
                        //add the new style to the head
                        jQuery('head').append('<style class="c37-custom-css" data-css="'+elID+'"> '+ cssRules +' </style>');

                    }

                });

                var pageHTML = decodeURIComponent(data.pageData.post_content);
                jQuery('#construction-site').html(pageHTML);

                //update form name
                //update form ID
                core37Page.pageID = pageID;
                //put back css ID of the landing page
                jQuery('.c37-step.c37-lp').attr('id', editedPageCSSID);

                /**
                 * On page load, make the current c37-box boxes droppable
                 */


                makeFormDroppable(jQuery);
                makeC37BoxDroppable(jQuery);
                makeC37SectionDroppable(jQuery);
                makeC37StepDroppable(jQuery);

                makeFormSortable(jQuery);
                //restoreStarsRating(jQuery);

                //hide the list pages panel
                hideEditPanel();
            }
        )

    });

    //delete a form based on form ID
    jQuery(document).on('click', '.form-edit i.fa-trash', function(){
        var pageID = jQuery(this).closest('li').attr('form-id');
        var that = jQuery(this);

        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this form!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true,
            html: false
        }, function(){

            jQuery.post(
                ajaxurl,
                {
                    action: 'core37_lp_delete_page',
                    pageID: pageID
                },

                function()
                {
                    that.closest('.form-edit').hide('slide', {direction: 'up'}, 200);
                    //toastr.success('Your form was deleted');

                }

            );

        });


    });


    jQuery(document).on('click', '.form-edit i.fa-code', function(){
        if (!versionNangCap || !isActivated)
        {
            showUpgradeDialog();
            return;
        }

        var formID = jQuery(this).closest('li').attr('form-id');

        swal("Here is your shortcode", "[core37_lp id=" + formID + "]", "success");
    });

    jQuery(document).on('click', '.form-edit i.fa-download', function(){
      var pageID = jQuery(this).closest('li').attr('form-id');
      jQuery.post(ajaxurl,
        {
          pageID: pageID,
          action: 'core37_lp_export_template'
        },

        function(response){
            toastr.info('export complete');
            var data = JSON.parse(response);

            var linkElement = document.createElement('a');
            linkElement.setAttribute('download', data['file_name']);
            linkElement.setAttribute('href', data['url']);

            linkElement.click();
            linkElement.remove();
        }
      )

    });


    //TEMPLATES EDITING AND DELETING
    //load a single form based on form ID
    jQuery(document).on('click', '.template-edit i.fa-pencil', function(){

        var templateID = jQuery(this).closest('li').attr('template-id');

        jQuery.post(
            ajaxurl,
            {
                action: 'core37_lp_load_template',
                templateID: templateID
            },

            function(response)
            {
                var data = JSON.parse(response);
                core37Page.pageSettings = JSON.parse(data.pageSettings);
                var elementStylesDiv = jQuery('#element-styles');
                elementStylesDiv.remove();
                jQuery('head').append('<style id="element-styles"></style>');
                elementStylesDiv.text(decodeURIComponent(data.pageCSSCode));
                console.log("tnet ", data.pageData.post_content);
                var pageHTML = decodeURIComponent(data.pageData.post_content);

                jQuery('#construction-site').html(pageHTML);

                //update form name
                core37Page.pageTitle = data.pageData.post_title;

                //set pageID to 0 since we are loading from a template, not a page
                core37Page.pageID = 0;

                /**
                 * On page load, make the current c37-box boxes droppable
                 */


                makeFormDroppable(jQuery);
                makeC37BoxDroppable(jQuery);
                makeC37SectionDroppable(jQuery);
                makeC37StepDroppable(jQuery);
                makeFormSortable(jQuery);
                //restoreStarsRating(jQuery);

                //hide the list pages panel
                hideEditPanel();
            }
        )

    });

    jQuery(document).on('click', '.template-edit i.fa-trash', function(){
        var templateID = jQuery(this).closest('li').attr('template-id');
        var that = jQuery(this);

        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this form!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true,
            html: false
        }, function(){

            jQuery.post(
                ajaxurl,
                {
                    action: 'core37_lp_delete_template',
                    templateID: templateID
                },

                function()
                {
                    that.closest('.template-edit').hide('slide', {direction: 'up'}, 200);
                    //toastr.success('Your form was deleted');

                }

            );

        });


    });


})(jQuery);

//# sourceMappingURL=editor-bundle.js.map