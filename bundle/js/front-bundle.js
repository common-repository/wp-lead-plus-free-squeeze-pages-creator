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

/*!
 * The Final Countdown for jQuery v2.1.0 (http://hilios.github.io/jQuery.countdown/)
 * Copyright (c) 2015 Edson Hilios
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function(factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define([ "jquery" ], factory);
    } else {
        factory(jQuery);
    }
})(function($) {
    "use strict";
    var instances = [], matchers = [], defaultOptions = {
        precision: 100,
        elapse: false
    };
    matchers.push(/^[0-9]*$/.source);
    matchers.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
    matchers.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
    matchers = new RegExp(matchers.join("|"));
    function parseDateString(dateString) {
        if (dateString instanceof Date) {
            return dateString;
        }
        if (String(dateString).match(matchers)) {
            if (String(dateString).match(/^[0-9]*$/)) {
                dateString = Number(dateString);
            }
            if (String(dateString).match(/\-/)) {
                dateString = String(dateString).replace(/\-/g, "/");
            }
            return new Date(dateString);
        } else {
            throw new Error("Couldn't cast `" + dateString + "` to a date object.");
        }
    }
    var DIRECTIVE_KEY_MAP = {
        Y: "years",
        m: "months",
        n: "daysToMonth",
        w: "weeks",
        d: "daysToWeek",
        D: "totalDays",
        H: "hours",
        M: "minutes",
        S: "seconds"
    };
    function escapedRegExp(str) {
        var sanitize = str.toString().replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        return new RegExp(sanitize);
    }
    function strftime(offsetObject) {
        return function(format) {
            var directives = format.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
            if (directives) {
                for (var i = 0, len = directives.length; i < len; ++i) {
                    var directive = directives[i].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/), regexp = escapedRegExp(directive[0]), modifier = directive[1] || "", plural = directive[3] || "", value = null;
                    directive = directive[2];
                    if (DIRECTIVE_KEY_MAP.hasOwnProperty(directive)) {
                        value = DIRECTIVE_KEY_MAP[directive];
                        value = Number(offsetObject[value]);
                    }
                    if (value !== null) {
                        if (modifier === "!") {
                            value = pluralize(plural, value);
                        }
                        if (modifier === "") {
                            if (value < 10) {
                                value = "0" + value.toString();
                            }
                        }
                        format = format.replace(regexp, value.toString());
                    }
                }
            }
            format = format.replace(/%%/, "%");
            return format;
        };
    }
    function pluralize(format, count) {
        var plural = "s", singular = "";
        if (format) {
            format = format.replace(/(:|;|\s)/gi, "").split(/\,/);
            if (format.length === 1) {
                plural = format[0];
            } else {
                singular = format[0];
                plural = format[1];
            }
        }
        if (Math.abs(count) === 1) {
            return singular;
        } else {
            return plural;
        }
    }
    var Countdown = function(el, finalDate, options) {
        this.el = el;
        this.$el = $(el);
        this.interval = null;
        this.offset = {};
        this.options = $.extend({}, defaultOptions);
        this.instanceNumber = instances.length;
        instances.push(this);
        this.$el.data("countdown-instance", this.instanceNumber);
        if (options) {
            if (typeof options === "function") {
                this.$el.on("update.countdown", options);
                this.$el.on("stoped.countdown", options);
                this.$el.on("finish.countdown", options);
            } else {
                this.options = $.extend({}, defaultOptions, options);
            }
        }
        this.setFinalDate(finalDate);
        this.start();
    };
    $.extend(Countdown.prototype, {
        start: function() {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            var self = this;
            this.update();
            this.interval = setInterval(function() {
                self.update.call(self);
            }, this.options.precision);
        },
        stop: function() {
            clearInterval(this.interval);
            this.interval = null;
            this.dispatchEvent("stoped");
        },
        toggle: function() {
            if (this.interval) {
                this.stop();
            } else {
                this.start();
            }
        },
        pause: function() {
            this.stop();
        },
        resume: function() {
            this.start();
        },
        remove: function() {
            this.stop.call(this);
            instances[this.instanceNumber] = null;
            delete this.$el.data().countdownInstance;
        },
        setFinalDate: function(value) {
            this.finalDate = parseDateString(value);
        },
        update: function() {
            if (this.$el.closest("html").length === 0) {
                this.remove();
                return;
            }
            var hasEventsAttached = $._data(this.el, "events") !== undefined, now = new Date(), newTotalSecsLeft;
            newTotalSecsLeft = this.finalDate.getTime() - now.getTime();
            newTotalSecsLeft = Math.ceil(newTotalSecsLeft / 1e3);
            newTotalSecsLeft = !this.options.elapse && newTotalSecsLeft < 0 ? 0 : Math.abs(newTotalSecsLeft);
            if (this.totalSecsLeft === newTotalSecsLeft || !hasEventsAttached) {
                return;
            } else {
                this.totalSecsLeft = newTotalSecsLeft;
            }
            this.elapsed = now >= this.finalDate;
            this.offset = {
                seconds: this.totalSecsLeft % 60,
                minutes: Math.floor(this.totalSecsLeft / 60) % 60,
                hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
                days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
                daysToWeek: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
                daysToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 % 30.4368),
                totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
                weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
                months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30.4368),
                years: Math.abs(this.finalDate.getFullYear() - now.getFullYear())
            };
            if (!this.options.elapse && this.totalSecsLeft === 0) {
                this.stop();
                this.dispatchEvent("finish");
            } else {
                this.dispatchEvent("update");
            }
        },
        dispatchEvent: function(eventName) {
            var event = $.Event(eventName + ".countdown");
            event.finalDate = this.finalDate;
            event.elapsed = this.elapsed;
            event.offset = $.extend({}, this.offset);
            event.strftime = strftime(this.offset);
            this.$el.trigger(event);
        }
    });
    $.fn.countdown = function() {
        var argumentsArray = Array.prototype.slice.call(arguments, 0);
        return this.each(function() {
            var instanceNumber = $(this).data("countdown-instance");
            if (instanceNumber !== undefined) {
                var instance = instances[instanceNumber], method = argumentsArray[0];
                if (Countdown.prototype.hasOwnProperty(method)) {
                    instance[method].apply(instance, argumentsArray.slice(1));
                } else if (String(method).match(/^[$A-Z_][0-9A-Z_$]*$/i) === null) {
                    instance.setFinalDate.call(instance, method);
                    instance.start();
                } else {
                    $.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi, method));
                }
            } else {
                new Countdown(this, argumentsArray[0], argumentsArray[1]);
            }
        });
    };
});
/*! modernizr 3.4.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-backgroundsize-bgpositionshorthand-bgpositionxy-bgsizecover-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,s,i,a;for(var l in b)if(b.hasOwnProperty(l)){if(e=[],n=b[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,s=0;s<e.length;s++)i=e[s],a=i.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),C.push((o?"":"no-")+a.join("-"))}}function s(e){var n=x.className,t=Modernizr._config.classPrefix||"";if(w&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),w?x.className.baseVal=n:x.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):w?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function a(e,n){return!!~(""+e).indexOf(n)}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function u(e,n){return function(){return e.apply(n,arguments)}}function f(e,n,t){var o;for(var s in e)if(e[s]in n)return t===!1?e[s]:(o=n[e[s]],r(o,"function")?u(o,t||n):o);return!1}function c(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(n,t,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,n,t);var s=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(s){var i=s.error?"error":"log";s[i].call(s,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&n.currentStyle&&n.currentStyle[r];return o}function p(){var e=n.body;return e||(e=i(w?"svg":"body"),e.fake=!0),e}function m(e,t,r,o){var s,a,l,u,f="modernizr",c=i("div"),d=p();if(parseInt(r,10))for(;r--;)l=i("div"),l.id=o?o[r]:f+(r+1),c.appendChild(l);return s=i("style"),s.type="text/css",s.id="s"+f,(d.fake?d:c).appendChild(s),d.appendChild(c),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(n.createTextNode(e)),c.id=f,d.fake&&(d.style.background="",d.style.overflow="hidden",u=x.style.overflow,x.style.overflow="hidden",x.appendChild(d)),a=t(c,e),d.fake?(d.parentNode.removeChild(d),x.style.overflow=u,x.offsetHeight):c.parentNode.removeChild(c),!!a}function g(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];o--;)s.push("("+c(n[o])+":"+r+")");return s=s.join(" or "),m("@supports ("+s+") { #modernizr { position: absolute; } }",function(e){return"absolute"==d(e,null,"position")})}return t}function v(e,n,o,s){function u(){c&&(delete T.style,delete T.modElem)}if(s=r(s,"undefined")?!1:s,!r(o,"undefined")){var f=g(e,o);if(!r(f,"undefined"))return f}for(var c,d,p,m,v,y=["modernizr","tspan","samp"];!T.style&&y.length;)c=!0,T.modElem=i(y.shift()),T.style=T.modElem.style;for(p=e.length,d=0;p>d;d++)if(m=e[d],v=T.style[m],a(m,"-")&&(m=l(m)),T.style[m]!==t){if(s||r(o,"undefined"))return u(),"pfx"==n?m:!0;try{T.style[m]=o}catch(h){}if(T.style[m]!=v)return u(),"pfx"==n?m:!0}return u(),!1}function y(e,n,t,o,s){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+z.join(i+" ")+i).split(" ");return r(n,"string")||r(n,"undefined")?v(a,n,o,s):(a=(e+" "+P.join(i+" ")+i).split(" "),f(a,n,t))}function h(e,n,r){return y(e,t,t,n,r)}var C=[],b=[],S={_version:"3.4.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){b.push({name:e,fn:n,options:t})},addAsyncTest:function(e){b.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=S,Modernizr=new Modernizr;var x=n.documentElement,w="svg"===x.nodeName.toLowerCase();Modernizr.addTest("bgpositionshorthand",function(){var e=i("a"),n=e.style,t="right 10px bottom 10px";return n.cssText="background-position: "+t+";",n.backgroundPosition===t});var _="Moz O ms Webkit",z=S._config.usePrefixes?_.split(" "):[];S._cssomPrefixes=z;var P=S._config.usePrefixes?_.toLowerCase().split(" "):[];S._domPrefixes=P;var k={elem:i("modernizr")};Modernizr._q.push(function(){delete k.elem});var T={style:k.elem.style};Modernizr._q.unshift(function(){delete T.style}),S.testAllProps=y,S.testAllProps=h,Modernizr.addTest("bgpositionxy",function(){return h("backgroundPositionX","3px",!0)&&h("backgroundPositionY","5px",!0)}),Modernizr.addTest("backgroundsize",h("backgroundSize","100%",!0)),Modernizr.addTest("bgsizecover",h("backgroundSize","cover")),o(),s(C),delete S.addTest,delete S.addAsyncTest;for(var E=0;E<Modernizr._q.length;E++)Modernizr._q[E]();e.Modernizr=Modernizr}(window,document);
/**
 * Bounce.js 0.8.2
 * MIT license
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Bounce=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
    var Component, EasingClasses, Matrix4D;

    Matrix4D = _dereq_("../math/matrix4d");

    EasingClasses = {
        bounce: _dereq_("../easing/bounce"),
        sway: _dereq_("../easing/sway"),
        hardbounce: _dereq_("../easing/hardbounce"),
        hardsway: _dereq_("../easing/hardsway")
    };

    Component = (function() {
        Component.prototype.easing = "bounce";

        Component.prototype.duration = 1000;

        Component.prototype.delay = 0;

        Component.prototype.from = null;

        Component.prototype.to = null;

        function Component(options) {
            options || (options = {});
            if (options.easing != null) {
                this.easing = options.easing;
            }
            if (options.duration != null) {
                this.duration = options.duration;
            }
            if (options.delay != null) {
                this.delay = options.delay;
            }
            if (options.from != null) {
                this.from = options.from;
            }
            if (options.to != null) {
                this.to = options.to;
            }
            this.easingObject = new EasingClasses[this.easing](options);
        }

        Component.prototype.calculateEase = function(ratio) {
            return this.easingObject.calculate(ratio);
        };

        Component.prototype.getMatrix = function() {
            return new Matrix4D().identity();
        };

        Component.prototype.getEasedMatrix = function(ratio) {
            return this.getMatrix();
        };

        Component.prototype.serialize = function() {
            var key, serialized, value, _ref;
            serialized = {
                type: this.constructor.name.toLowerCase(),
                easing: this.easing,
                duration: this.duration,
                delay: this.delay,
                from: this.from,
                to: this.to
            };
            _ref = this.easingObject.serialize();
            for (key in _ref) {
                value = _ref[key];
                serialized[key] = value;
            }
            return serialized;
        };

        return Component;

    })();

    module.exports = Component;


},{"../easing/bounce":6,"../easing/hardbounce":7,"../easing/hardsway":8,"../easing/sway":10,"../math/matrix4d":13}],2:[function(_dereq_,module,exports){
    var Component, Matrix4D, Rotate, Vector2D,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    Matrix4D = _dereq_("../math/matrix4d");

    Vector2D = _dereq_("../math/vector2d");

    Component = _dereq_("./index");

    Rotate = (function(_super) {
        __extends(Rotate, _super);

        Rotate.prototype.from = 0;

        Rotate.prototype.to = 90;

        function Rotate() {
            Rotate.__super__.constructor.apply(this, arguments);
            this.diff = this.to - this.from;
        }

        Rotate.prototype.getMatrix = function(degrees) {
            var c, radians, s;
            radians = (degrees / 180) * Math.PI;
            c = Math.cos(radians);
            s = Math.sin(radians);
            return new Matrix4D([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        };

        Rotate.prototype.getEasedMatrix = function(ratio) {
            var easedAngle, easedRatio;
            easedRatio = this.calculateEase(ratio);
            easedAngle = this.from + this.diff * easedRatio;
            return this.getMatrix(easedAngle);
        };

        return Rotate;

    })(Component);

    module.exports = Rotate;


},{"../math/matrix4d":13,"../math/vector2d":14,"./index":1}],3:[function(_dereq_,module,exports){
    var Component, Matrix4D, Scale, Vector2D,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    Matrix4D = _dereq_("../math/matrix4d");

    Vector2D = _dereq_("../math/vector2d");

    Component = _dereq_("./index");

    Scale = (function(_super) {
        __extends(Scale, _super);

        Scale.prototype.from = {
            x: 0.5,
            y: 0.5
        };

        Scale.prototype.to = {
            x: 1,
            y: 1
        };

        function Scale() {
            Scale.__super__.constructor.apply(this, arguments);
            this.fromVector = new Vector2D(this.from.x, this.from.y);
            this.toVector = new Vector2D(this.to.x, this.to.y);
            this.diff = this.toVector.clone().subtract(this.fromVector);
        }

        Scale.prototype.getMatrix = function(x, y) {
            var z;
            z = 1;
            return new Matrix4D([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
        };

        Scale.prototype.getEasedMatrix = function(ratio) {
            var easedRatio, easedVector;
            easedRatio = this.calculateEase(ratio);
            easedVector = this.fromVector.clone().add(this.diff.clone().multiply(easedRatio));
            return this.getMatrix(easedVector.x, easedVector.y);
        };

        return Scale;

    })(Component);

    module.exports = Scale;


},{"../math/matrix4d":13,"../math/vector2d":14,"./index":1}],4:[function(_dereq_,module,exports){
    var Component, Matrix4D, Skew, Vector2D,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    Matrix4D = _dereq_("../math/matrix4d");

    Vector2D = _dereq_("../math/vector2d");

    Component = _dereq_("./index");

    Skew = (function(_super) {
        __extends(Skew, _super);

        Skew.prototype.from = {
            x: 0,
            y: 0
        };

        Skew.prototype.to = {
            x: 20,
            y: 0
        };

        function Skew() {
            Skew.__super__.constructor.apply(this, arguments);
            this.fromVector = new Vector2D(this.from.x, this.from.y);
            this.toVector = new Vector2D(this.to.x, this.to.y);
            this.diff = this.toVector.clone().subtract(this.fromVector);
        }

        Skew.prototype.getMatrix = function(degreesX, degreesY) {
            var radiansX, radiansY, tx, ty;
            radiansX = (degreesX / 180) * Math.PI;
            radiansY = (degreesY / 180) * Math.PI;
            tx = Math.tan(radiansX);
            ty = Math.tan(radiansY);
            return new Matrix4D([1, tx, 0, 0, ty, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        };

        Skew.prototype.getEasedMatrix = function(ratio) {
            var easedRatio, easedVector;
            easedRatio = this.calculateEase(ratio);
            easedVector = this.fromVector.clone().add(this.diff.clone().multiply(easedRatio));
            return this.getMatrix(easedVector.x, easedVector.y);
        };

        return Skew;

    })(Component);

    module.exports = Skew;


},{"../math/matrix4d":13,"../math/vector2d":14,"./index":1}],5:[function(_dereq_,module,exports){
    var Component, Matrix4D, Translate, Vector2D,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    Matrix4D = _dereq_("../math/matrix4d");

    Vector2D = _dereq_("../math/vector2d");

    Component = _dereq_("./index");

    Translate = (function(_super) {
        __extends(Translate, _super);

        Translate.prototype.from = {
            x: 0,
            y: 0
        };

        Translate.prototype.to = {
            x: 0,
            y: 0
        };

        function Translate() {
            Translate.__super__.constructor.apply(this, arguments);
            this.fromVector = new Vector2D(this.from.x, this.from.y);
            this.toVector = new Vector2D(this.to.x, this.to.y);
            this.diff = this.toVector.clone().subtract(this.fromVector);
        }

        Translate.prototype.getMatrix = function(x, y) {
            var z;
            z = 0;
            return new Matrix4D([1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1]);
        };

        Translate.prototype.getEasedMatrix = function(ratio) {
            var easedRatio, easedVector;
            easedRatio = this.calculateEase(ratio);
            easedVector = this.fromVector.clone().add(this.diff.clone().multiply(easedRatio));
            return this.getMatrix(easedVector.x, easedVector.y);
        };

        return Translate;

    })(Component);

    module.exports = Translate;


},{"../math/matrix4d":13,"../math/vector2d":14,"./index":1}],6:[function(_dereq_,module,exports){
    var BounceEasing, Easing,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    Easing = _dereq_("./index");

    BounceEasing = (function(_super) {
        __extends(BounceEasing, _super);

        BounceEasing.prototype.bounces = 4;

        BounceEasing.prototype.stiffness = 3;

        function BounceEasing(options) {
            var threshold;
            if (options == null) {
                options = {};
            }
            BounceEasing.__super__.constructor.apply(this, arguments);
            if (options.stiffness != null) {
                this.stiffness = options.stiffness;
            }
            if (options.bounces != null) {
                this.bounces = options.bounces;
            }
            this.alpha = this.stiffness / 100;
            threshold = 0.005 / Math.pow(10, this.stiffness);
            this.limit = Math.floor(Math.log(threshold) / -this.alpha);
            this.omega = this.calculateOmega(this.bounces, this.limit);
        }

        BounceEasing.prototype.calculate = function(ratio) {
            var t;
            if (ratio >= 1) {
                return 1;
            }
            t = ratio * this.limit;
            return 1 - this.exponent(t) * this.oscillation(t);
        };

        BounceEasing.prototype.calculateOmega = function(bounces, limit) {
            return (this.bounces + 0.5) * Math.PI / this.limit;
        };

        BounceEasing.prototype.exponent = function(t) {
            return Math.pow(Math.E, -this.alpha * t);
        };

        BounceEasing.prototype.oscillation = function(t) {
            return Math.cos(this.omega * t);
        };

        BounceEasing.prototype.serialize = function() {
            return {
                stiffness: this.stiffness,
                bounces: this.bounces
            };
        };

        return BounceEasing;

    })(Easing);

    module.exports = BounceEasing;


},{"./index":9}],7:[function(_dereq_,module,exports){
    var BounceEasing, HardBounceEasing,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    BounceEasing = _dereq_("./bounce");

    HardBounceEasing = (function(_super) {
        __extends(HardBounceEasing, _super);

        function HardBounceEasing() {
            return HardBounceEasing.__super__.constructor.apply(this, arguments);
        }

        HardBounceEasing.prototype.oscillation = function(t) {
            return Math.abs(Math.cos(this.omega * t));
        };

        return HardBounceEasing;

    })(BounceEasing);

    module.exports = HardBounceEasing;


},{"./bounce":6}],8:[function(_dereq_,module,exports){
    var HardSwayEasing, SwayEasing,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    SwayEasing = _dereq_("./sway");

    HardSwayEasing = (function(_super) {
        __extends(HardSwayEasing, _super);

        function HardSwayEasing() {
            return HardSwayEasing.__super__.constructor.apply(this, arguments);
        }

        HardSwayEasing.prototype.oscillation = function(t) {
            return Math.abs(Math.sin(this.omega * t));
        };

        return HardSwayEasing;

    })(SwayEasing);

    module.exports = HardSwayEasing;


},{"./sway":10}],9:[function(_dereq_,module,exports){
    var Easing, MathHelpers;

    MathHelpers = _dereq_("../math/helpers");

    Easing = (function() {
        function Easing() {}

        Easing.prototype.calculate = function(ratio) {
            return ratio;
        };

        Easing.prototype.serialize = function() {
            return {};
        };

        Easing.prototype.findOptimalKeyPoints = function(threshold, resolution) {
            var area, halfway, i, keyPoint, keyPoints, loops, result, values;
            if (threshold == null) {
                threshold = 1.0;
            }
            if (resolution == null) {
                resolution = 1000;
            }
            keyPoints = [0];
            values = (function() {
                var _i, _results;
                _results = [];
                for (i = _i = 0; 0 <= resolution ? _i < resolution : _i > resolution; i = 0 <= resolution ? ++_i : --_i) {
                    _results.push(this.calculate(i / resolution));
                }
                return _results;
            }).call(this);
            keyPoints = keyPoints.concat(MathHelpers.findTurningPoints(values));
            keyPoints.push(resolution - 1);
            i = 0;
            loops = 1000;
            while (loops--) {
                if (i === keyPoints.length - 1) {
                    break;
                }
                area = MathHelpers.areaBetweenLineAndCurve(values, keyPoints[i], keyPoints[i + 1]);
                if (area <= threshold) {
                    i++;
                } else {
                    halfway = Math.round(keyPoints[i] + (keyPoints[i + 1] - keyPoints[i]) / 2);
                    keyPoints.splice(i + 1, 0, halfway);
                }
            }
            if (loops === 0) {
                return [];
            }
            return result = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = keyPoints.length; _i < _len; _i++) {
                    keyPoint = keyPoints[_i];
                    _results.push(keyPoint / (resolution - 1));
                }
                return _results;
            })();
        };

        return Easing;

    })();

    module.exports = Easing;


},{"../math/helpers":12}],10:[function(_dereq_,module,exports){
    var BounceEasing, SwayEasing,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    BounceEasing = _dereq_("./bounce");

    SwayEasing = (function(_super) {
        __extends(SwayEasing, _super);

        function SwayEasing() {
            return SwayEasing.__super__.constructor.apply(this, arguments);
        }

        SwayEasing.prototype.calculate = function(ratio) {
            var t;
            if (ratio >= 1) {
                return 0;
            }
            t = ratio * this.limit;
            return this.exponent(t) * this.oscillation(t);
        };

        SwayEasing.prototype.calculateOmega = function(bounces, limit) {
            return this.bounces * Math.PI / this.limit;
        };

        SwayEasing.prototype.oscillation = function(t) {
            return Math.sin(this.omega * t);
        };

        return SwayEasing;

    })(BounceEasing);

    module.exports = SwayEasing;


},{"./bounce":6}],11:[function(_dereq_,module,exports){
    var Bounce, ComponentClasses, Matrix4D;

    Matrix4D = _dereq_("./math/matrix4d");

    ComponentClasses = {
        scale: _dereq_("./components/scale"),
        rotate: _dereq_("./components/rotate"),
        translate: _dereq_("./components/translate"),
        skew: _dereq_("./components/skew")
    };

    Bounce = (function() {
        Bounce.FPS = 30;

        Bounce.counter = 1;

        Bounce.prototype.components = null;

        Bounce.prototype.duration = 0;

        function Bounce() {
            this.components = [];
        }

        Bounce.prototype.scale = function(options) {
            return this.addComponent(new ComponentClasses["scale"](options));
        };

        Bounce.prototype.rotate = function(options) {
            return this.addComponent(new ComponentClasses["rotate"](options));
        };

        Bounce.prototype.translate = function(options) {
            return this.addComponent(new ComponentClasses["translate"](options));
        };

        Bounce.prototype.skew = function(options) {
            return this.addComponent(new ComponentClasses["skew"](options));
        };

        Bounce.prototype.addComponent = function(component) {
            this.components.push(component);
            this.updateDuration();
            return this;
        };

        Bounce.prototype.serialize = function() {
            var component, serialized, _i, _len, _ref;
            serialized = [];
            _ref = this.components;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                component = _ref[_i];
                serialized.push(component.serialize());
            }
            return serialized;
        };

        Bounce.prototype.deserialize = function(serialized) {
            var options, _i, _len;
            for (_i = 0, _len = serialized.length; _i < _len; _i++) {
                options = serialized[_i];
                this.addComponent(new ComponentClasses[options.type](options));
            }
            return this;
        };

        Bounce.prototype.updateDuration = function() {
            return this.duration = this.components.map(function(component) {
                return component.duration + component.delay;
            }).reduce(function(a, b) {
                return Math.max(a, b);
            });
        };

        Bounce.prototype.define = function(name) {
            this.name = name || Bounce.generateName();
            this.styleElement = document.createElement("style");
            this.styleElement.innerHTML = this.getKeyframeCSS({
                name: this.name,
                prefix: true
            });
            document.body.appendChild(this.styleElement);
            return this;
        };

        Bounce.prototype.applyTo = function(elements, options) {
            var css, deferred, element, prefix, prefixes, _i, _j, _len, _len1, _ref;
            if (options == null) {
                options = {};
            }
            this.define();
            if (!elements.length) {
                elements = [elements];
            }
            prefixes = this.getPrefixes();
            deferred = null;
            if (window.jQuery && window.jQuery.Deferred) {
                deferred = new window.jQuery.Deferred();
            }
            for (_i = 0, _len = elements.length; _i < _len; _i++) {
                element = elements[_i];
                _ref = prefixes.animation;
                for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                    prefix = _ref[_j];
                    css = [this.name, "" + this.duration + "ms", "linear", "both"];
                    if (options.loop) {
                        css.push("infinite");
                    }
                    element.style["" + prefix + "animation"] = css.join(" ");
                }
            }
            if (!options.loop) {
                setTimeout(((function(_this) {
                    return function() {
                        if (options.remove) {
                            _this.remove();
                        }
                        if (typeof options.onComplete === "function") {
                            options.onComplete();
                        }
                        if (deferred) {
                            return deferred.resolve();
                        }
                    };
                })(this)), this.duration);
            }
            return deferred;
        };

        Bounce.prototype.remove = function() {
            var _ref;
            if (!this.styleElement) {
                return;
            }
            if (this.styleElement.remove) {
                return this.styleElement.remove();
            } else {
                return (_ref = this.styleElement.parentNode) != null ? _ref.removeChild(this.styleElement) : void 0;
            }
        };

        Bounce.prototype.getPrefixes = function(force) {
            var prefixes, style;
            prefixes = {
                transform: [""],
                animation: [""]
            };
            style = document.createElement("dummy").style;
            if (force || (!("transform" in style) && "webkitTransform" in style)) {
                prefixes.transform = ["-webkit-", ""];
            }
            if (force || (!("animation" in style) && "webkitAnimation" in style)) {
                prefixes.animation = ["-webkit-", ""];
            }
            return prefixes;
        };

        Bounce.prototype.getKeyframeCSS = function(options) {
            var animations, key, keyframeList, keyframes, matrix, prefix, prefixes, transformString, transforms, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
            if (options == null) {
                options = {};
            }
            this.name = options.name || Bounce.generateName();
            prefixes = {
                transform: [""],
                animation: [""]
            };
            if (options.prefix || options.forcePrefix) {
                prefixes = this.getPrefixes(options.forcePrefix);
            }
            keyframeList = [];
            keyframes = this.getKeyframes(options);
            _ref = this.keys;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                key = _ref[_i];
                matrix = keyframes[key];
                transformString = "matrix3d" + matrix;
                transforms = [];
                _ref1 = prefixes.transform;
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    prefix = _ref1[_j];
                    transforms.push("" + prefix + "transform: " + transformString + ";");
                }
                keyframeList.push("" + (Math.round(key * 100 * 100) / 100) + "% { " + (transforms.join(" ")) + " }");
            }
            animations = [];
            _ref2 = prefixes.animation;
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                prefix = _ref2[_k];
                animations.push("@" + prefix + "keyframes " + this.name + " { \n  " + (keyframeList.join("\n  ")) + " \n}");
            }
            return animations.join("\n\n");
        };

        Bounce.prototype.getKeyframes = function(options) {
            var component, componentKeys, currentTime, frames, i, key, keyframes, keys, matrix, ratio, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1;
            if (options == null) {
                options = {};
            }
            keys = [0, 1];
            if (options.optimized) {
                _ref = this.components;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    component = _ref[_i];
                    componentKeys = component.easingObject.findOptimalKeyPoints().map((function(_this) {
                        return function(key) {
                            return (key * component.duration / _this.duration) + (component.delay / _this.duration);
                        };
                    })(this));
                    if (component.delay) {
                        componentKeys.push((component.delay / this.duration) - 0.001);
                    }
                    keys = keys.concat(componentKeys);
                }
            } else {
                frames = Math.round((this.duration / 1000) * Bounce.FPS);
                for (i = _j = 0; 0 <= frames ? _j <= frames : _j >= frames; i = 0 <= frames ? ++_j : --_j) {
                    keys.push(i / frames);
                }
            }
            keys = keys.sort(function(a, b) {
                return a - b;
            });
            this.keys = [];
            keyframes = {};
            for (_k = 0, _len1 = keys.length; _k < _len1; _k++) {
                key = keys[_k];
                if (keyframes[key]) {
                    continue;
                }
                matrix = new Matrix4D().identity();
                _ref1 = this.components;
                for (_l = 0, _len2 = _ref1.length; _l < _len2; _l++) {
                    component = _ref1[_l];
                    currentTime = key * this.duration;
                    if ((component.delay - currentTime) > 1e-8) {
                        continue;
                    }
                    ratio = (key - component.delay / this.duration) / (component.duration / this.duration);
                    matrix.multiply(component.getEasedMatrix(ratio));
                }
                this.keys.push(key);
                keyframes[key] = matrix.transpose().toFixed(3);
            }
            return keyframes;
        };

        Bounce.generateName = function() {
            return "animation-" + (Bounce.counter++);
        };

        Bounce.isSupported = function() {
            var property, propertyIsSupported, propertyList, propertyLists, style, _i, _j, _len, _len1;
            style = document.createElement("dummy").style;
            propertyLists = [["transform", "webkitTransform"], ["animation", "webkitAnimation"]];
            for (_i = 0, _len = propertyLists.length; _i < _len; _i++) {
                propertyList = propertyLists[_i];
                propertyIsSupported = false;
                for (_j = 0, _len1 = propertyList.length; _j < _len1; _j++) {
                    property = propertyList[_j];
                    propertyIsSupported || (propertyIsSupported = property in style);
                }
                if (!propertyIsSupported) {
                    return false;
                }
            }
            return true;
        };

        return Bounce;

    })();

    module.exports = Bounce;


},{"./components/rotate":2,"./components/scale":3,"./components/skew":4,"./components/translate":5,"./math/matrix4d":13}],12:[function(_dereq_,module,exports){
    var MathHelpers;

    MathHelpers = (function() {
        function MathHelpers() {}

        MathHelpers.prototype.sign = function(value) {
            if (value < 0) {
                return -1;
            }
            return 1;
        };

        MathHelpers.prototype.findTurningPoints = function(values) {
            var i, signA, signB, turningPoints, _i, _ref;
            turningPoints = [];
            for (i = _i = 1, _ref = values.length - 1; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
                signA = this.sign(values[i] - values[i - 1]);
                signB = this.sign(values[i + 1] - values[i]);
                if (signA !== signB) {
                    turningPoints.push(i);
                }
            }
            return turningPoints;
        };

        MathHelpers.prototype.areaBetweenLineAndCurve = function(values, start, end) {
            var area, curveValue, i, length, lineValue, yEnd, yStart, _i;
            length = end - start;
            yStart = values[start];
            yEnd = values[end];
            area = 0;
            for (i = _i = 0; 0 <= length ? _i <= length : _i >= length; i = 0 <= length ? ++_i : --_i) {
                curveValue = values[start + i];
                lineValue = yStart + (i / length) * (yEnd - yStart);
                area += Math.abs(lineValue - curveValue);
            }
            return area;
        };

        return MathHelpers;

    })();

    module.exports = new MathHelpers;


},{}],13:[function(_dereq_,module,exports){
    var Matrix4D;

    Matrix4D = (function() {
        Matrix4D.prototype._array = null;

        function Matrix4D(array) {
            this._array = (array != null ? array.slice(0) : void 0) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }

        Matrix4D.prototype.equals = function(matrix) {
            return this.toString() === matrix.toString();
        };

        Matrix4D.prototype.identity = function() {
            this.setArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            return this;
        };

        Matrix4D.prototype.multiply = function(matrix) {
            var i, j, k, res, value, _i, _j, _k;
            res = new Matrix4D;
            for (i = _i = 0; _i < 4; i = ++_i) {
                for (j = _j = 0; _j < 4; j = ++_j) {
                    for (k = _k = 0; _k < 4; k = ++_k) {
                        value = res.get(i, j) + this.get(i, k) * matrix.get(k, j);
                        res.set(i, j, value);
                    }
                }
            }
            return this.copy(res);
        };

        Matrix4D.prototype.transpose = function() {
            var a;
            a = this.getArray();
            this.setArray([a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]]);
            return this;
        };

        Matrix4D.prototype.get = function(row, column) {
            return this.getArray()[row * 4 + column];
        };

        Matrix4D.prototype.set = function(row, column, value) {
            return this._array[row * 4 + column] = value;
        };

        Matrix4D.prototype.copy = function(matrix) {
            this._array = matrix.getArray();
            return this;
        };

        Matrix4D.prototype.clone = function() {
            return new Matrix4D(this.getArray());
        };

        Matrix4D.prototype.getArray = function() {
            return this._array.slice(0);
        };

        Matrix4D.prototype.setArray = function(array) {
            this._array = array;
            return this;
        };

        Matrix4D.prototype.toString = function() {
            return "(" + (this.getArray().join(", ")) + ")";
        };

        Matrix4D.prototype.toFixed = function(n) {
            var value;
            this._array = (function() {
                var _i, _len, _ref, _results;
                _ref = this._array;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    value = _ref[_i];
                    _results.push(parseFloat(value.toFixed(n)));
                }
                return _results;
            }).call(this);
            return this;
        };

        return Matrix4D;

    })();

    module.exports = Matrix4D;


},{}],14:[function(_dereq_,module,exports){
    var Vector2D;

    Vector2D = (function() {
        Vector2D.prototype.x = 0;

        Vector2D.prototype.y = 0;

        function Vector2D(x, y) {
            this.x = x != null ? x : 0;
            this.y = y != null ? y : 0;
        }

        Vector2D.prototype.add = function(vector) {
            if (!Vector2D.isVector2D(vector)) {
                return this._addScalar(vector);
            }
            this.x += vector.x;
            this.y += vector.y;
            return this;
        };

        Vector2D.prototype._addScalar = function(n) {
            this.x += n;
            this.y += n;
            return this;
        };

        Vector2D.prototype.subtract = function(vector) {
            if (!Vector2D.isVector2D(vector)) {
                return this._subtractScalar(vector);
            }
            this.x -= vector.x;
            this.y -= vector.y;
            return this;
        };

        Vector2D.prototype._subtractScalar = function(n) {
            return this._addScalar(-n);
        };

        Vector2D.prototype.multiply = function(vector) {
            if (!Vector2D.isVector2D(vector)) {
                return this._multiplyScalar(vector);
            }
            this.x *= vector.x;
            this.y *= vector.y;
            return this;
        };

        Vector2D.prototype._multiplyScalar = function(n) {
            this.x *= n;
            this.y *= n;
            return this;
        };

        Vector2D.prototype.divide = function(vector) {
            if (!Vector2D.isVector2D(vector)) {
                return this._divideScalar(vector);
            }
            this.x /= vector.x;
            this.y /= vector.y;
            return this;
        };

        Vector2D.prototype._divideScalar = function(n) {
            return this._multiplyScalar(1 / n);
        };

        Vector2D.prototype.clone = function() {
            return new Vector2D(this.x, this.y);
        };

        Vector2D.prototype.copy = function(vector) {
            this.x = vector.x;
            this.y = vector.y;
            return this;
        };

        Vector2D.prototype.equals = function(vector) {
            return vector.x === this.x && vector.y === this.y;
        };

        Vector2D.prototype.toString = function() {
            return "(" + this.x + ", " + this.y + ")";
        };

        Vector2D.prototype.toFixed = function(n) {
            this.x = parseFloat(this.x.toFixed(n));
            this.y = parseFloat(this.y.toFixed(n));
            return this;
        };

        Vector2D.prototype.toArray = function() {
            return [this.x, this.y];
        };

        Vector2D.isVector2D = function(item) {
            return item instanceof Vector2D;
        };

        return Vector2D;

    })();

    module.exports = Vector2D;


},{}]},{},[11])
(11)
});
/**
 * Created by luis on 12/23/16.
 */

(function($, window){
    /**
     * This variable contains the state of the YouTube Frame API. Since the function onYouTubeIframeAPIReady is called
     * only once, we set this variable for videos that added later
     */
    window.c47YTIframeReady = false;

    /**
     * An array contains all YouTube players
     */
    window.c47YTPlayers = [];

    /**
     * This is the outer class of the video background. The background contains 3 levels of block elements
     * -- most outer (relative position, z-index -9999)
     *   -- c37-ultimate-bg (absolute position)
     *     -- the video iframe/video tag (html5)/img (image) z-index: 0;
     *     -- the overlay div to cover the video/image to avoid clicking on the video z-index: 1
     */
    var outerDivClass = 'c47-ultimate-bg';

    /**
     * This is the exception class. It contains the error message that report back to user when errors occur
     */
    function C47Exception(message)
    {
        this.name = "UltimateBackgroundException";
        this.message = message;
    }

    /**
     * This function calculate the optimal width and height of the background div base on the ration 16/9.
     * -- When the div that needs the background is short (height less than 9), then the background will have the
     * width of the div and a calculated height based on ration 16/9. Doing so will avoid black border around videos
     * and image stretches
     *
     * -- When the div that needs the background is narrow (width is less than 16), then the background will use
     * the height of the div and the width is calculated based on the ratio. A part of the the background is cut off
     * but the video and the image will not be stretched in a different ratio other than the native 16/9
     */
    function perfectDimensions(element, options)
    {
        //these are the width and height of the element that we want to apply background to

        var width = element.outerWidth();
        var height = element.outerHeight();
        console.log('option is: ', options);
        if (options.container == 'body')
        {
            width = window.outerWidth;
            height = window.outerHeight;
            console.log('body height:  ' + height);
        }

        if (height > width)
            options.ratio = 2/3;

        //first, we calculate the width and height for a full page background based on the ratio
        var calculatedHeight = Math.floor(width * 1/(options.ratio));
        var calculatedWidth = Math.floor(height * options.ratio);


            var appliedWidth, appliedHeight;

            if (options.container == 'body')
            {
                console.log('for body bg');
                if (options.type=='image')
                {
                    var cwidth = Math.ceil($(window).height() * options.ratio);
                    if (cwidth < width)
                        return [width, calculatedHeight];
                    else
                        return [cwidth, $(window).height()];

                }
                if (options.type == 'youtube')
                {
                    var cwidth = Math.ceil($(window).height() * options.ratio);
                    if (cwidth < width)
                        return [width, calculatedHeight];
                    else
                        return [cwidth, $(window).height()];

                }
            }


            if (height >= calculatedHeight)
            {

                appliedHeight = height;
                appliedWidth = calculatedWidth;
                console.log('using original height and calculated width', appliedWidth, appliedHeight);
            } else if (calculatedHeight >=height)
            {

                appliedWidth = width;
                appliedHeight = calculatedHeight;
                console.log('using original width and calculated height', appliedWidth, appliedHeight);
            }
            console.log('calculated width and height: ', [appliedWidth, appliedHeight]);
            return [appliedWidth, appliedHeight];


    }

    /**
     * This function populate youtube video into a div with divID.
     */
    function populateYouTubeVideo(divID, videoSource, width, height)
    {
        var nPlayer = new YT.Player(divID, {
            videoId: videoSource,
            width: width,
            height: height,
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'showinfo': 0,
                'loop': 1,
                'start': 0,
                'rel' : 0,
                'modestbranding': 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        window.c47YTPlayers = window.c47YTPlayers || [];

        window.c47YTPlayers.push(nPlayer);
    }


    $.fn.c47bg = function(options)
    {
        var element = this;

        var defaults = {
            ratio: 16/9, // usually either 4/3 or 16/9 -- tweak as needed
            mute: true,
            repeat: true,
            crop: true
            // container: "body",//body or div. If body, we will set the positioning of the video/image container to fixed, otherwise, set it to absolute
            // type: 'youtube',//image, self-hosted, youtube
        };
        //element.css('position', 'relative');
        options = $.extend(options, defaults);
        /**
         * Remove margin, padding of the body and HTML IF container is body. Otherwise, if
         * the container is div, removing padding and margin for body and html may cause conflicts
         */
        //if (this.prop('tagName').toLowerCase === "body")
        //{
        //    console.log('removing padding and margin in body and html');
        //    $('body,html').css('margin', 0);
        //    $('body,html').css('padding', 0);
        //}

        //if (options.container != 'body')
        //    element.css('position','relative');

        /**
         * Get the width and height of the element that we want to apply the video background to
         * (the container)
         */


        var dimensions = perfectDimensions(element, options);
        var width = dimensions[0];
        var height = dimensions[1];

        /**
         * Create a random ID to associate with the video/image container
         * @type {string}
         */
        var randomID = 'c47-random-' + Math.floor(Math.random() * 100000);

        /**
         * make the excess part of the video hidden. Only apply this when the container is a div
         * Otherwise, it will disable scrolling of the body, which is undesirable
         */

        if (options.crop && options.container != "body")
        {
            //console.log('we are cropping');
            //element.css('overflow', 'hidden');
        }

        if ( options.type == "youtube")
        {
            //insert the script tag to access YouTube iFrame API
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            element.find('.' + outerDivClass).remove();

            var videoPosition = options.container=='body' ?'fixed;' : 'absolute';

            videoContainer =
                '<div style="position: absolute; top: 0; left: 0; overflow: hidden; z-index: -1;" class="'+outerDivClass+'">' +
                '<div style="-webkit-backface-visibility: hidden; backface-visibility: hidden;position:'+videoPosition+';" id="'+randomID+'" ></div>' +
                '</div>';
            element.prepend(videoContainer);

            var checkIframeReady = setInterval(function(){
                if (window.c47YTIframeReady)
                {
                    clearInterval(checkIframeReady);
                    populateYouTubeVideo(randomID, options.source, width, height);
                }

            }, 10);

            window.onYouTubeIframeAPIReady = function() {
                window.c47YTIframeReady = true;
            };

            window.onPlayerReady = function(event)
            {
                event.target.playVideo();
                event.target.mute();
            };

            window.onPlayerStateChange = function(state)
            {
                if (state.data === 0 && options.repeat) {

                    console.log('ok to repeat', window.c47YTPlayers.length);
                    for (var i =0 ; i < window.c47YTPlayers.length; i++)
                    {
                        console.log(window.c47YTPlayers[i].getPlayerState());
                        if (window.c47YTPlayers[i].getPlayerState() == 0)
                            window.c47YTPlayers[i].seekTo(0);
                    }
                }
            }


        } else if (options.type == "self-hosted")
        {
            /**
             * In case the user wants to use html5 video as background, the source property needs
             * to be an object. {mp4: url, webm: url}
             */
            if (typeof options.source != "object")
                throw new C47Exception('The source property needs to be an object. Please go to https://github.com/datmt/ultimate-background for documentation');

            var source = options.source;


            var poster = '', mp4Source = '', ogvSource = '', webmSource = '';

            if (typeof options.poster != "undefined")
                poster = options.poster;

            if (typeof source.mp4 != "undefined")
                mp4Source = '<source src="'+source.mp4+'" type="video/mp4">';

            if (typeof source.ogv != "undefined")
                ogvSource = '<source src="'+source.ogv+'" type="video/ogg">';

            if (typeof source.webm != "undefined")
                webmSource = '<source src="'+source.webm+'" type="video/webm">';


            if (mp4Source == '' && ogvSource == '' && webmSource == '')
                throw new C47Exception('Please provide at least one video source');

            var parentElementHeight = element.outerHeight;
            var videoContainer =
                '<div class="'+outerDivClass+'" style="z-index: -1;position: relative; height: '+parentElementHeight+'px; top: 0; left: 0; overflow: hidden">'+
                        '<video style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;"  autoplay="1" loop="1" muted="1" id="'+randomID+'" width="'+width+'" poster="'+poster+'" >'+
                        mp4Source + ogvSource + webmSource +
                        'Your browser doesn\'t support HTML5 video tag.'+
                        '</video>' +
                '</div>';

            element.prepend(videoContainer);
        } else if (options.type == "image")
        {
            var position = options.container == "body" ? "fixed" : "absolute";
            var imageContainer =
                '<div style="position: absolute; top: 0; left: 0; z-index: -1;" class="'+outerDivClass+'">' +
                '<img style="position: '+position+'; top: 0; left: 0;" id="'+randomID+'" src="'+options.source+'" />' +
                '</div>';

            element.prepend(imageContainer);

        }
        //apply width and height to the video, image element


        $(function(){

            //apply z-index to the background div
            var backgroundDiv = $('.' + outerDivClass);

            //create an absolute overlay div to cover the video (avoid clicking) and also apply transparent image if needed
            var overlayClass = typeof options.overlayClass == "undefined" ? "b1" :  options.overlayClass;

            //create an absolute overlay div to cover the video (avoid clicking) and also apply transparent image if needed
            var overlayPosition = options.container == "body" ? "fixed" : "absolute";
            if (backgroundDiv.find('.c47-overlay').length ==0)
                backgroundDiv.append('<div class="c47-overlay '+overlayClass+'" style="position: '+overlayPosition+'; padding: 0; margin: 0; top: 0; bottom: 0; right: 0; left: 0; width: '+width+'px; height: '+height+'px; z-index: 100;"></div>');


            try
            {
                $('.c47-overlay').addEventListener('touchmove', function(e) {

                    e.preventDefault();

                }, false);

                backgroundDiv.addEventListener('touchmove', function(e) {

                    e.preventDefault();

                }, false);
            } catch (e)
            {

            }

            //on resize, change the width and height of the video to match the size of its parent
            $(window).bind('load resize orientationchange', function(){

                console.log('resizing bg...;');
                var dimensions = perfectDimensions($(this), options);

                var appliedWidth = dimensions[0];
                var appliedHeight = dimensions[1];

                var bg;
                var outerDiv = $(element).find('.'+outerDivClass).first();
                //outerDiv.css('height', $(element).outerHeight());
                outerDiv.css('width', '100%');

                if (options.type == 'youtube')
                {
                    bg = outerDiv.find('iframe').first();
                    bg.attr('width', appliedWidth);
                    bg.attr('height', appliedHeight);
                    bg.css('top', 0);
                    bg.css('left', 0);

                } else if (options.type == 'image')
                {
                    bg = outerDiv.find('img').first();
                    bg.css('width', appliedWidth + 'px');
                    bg.css('height', appliedHeight + 'px');

                    var marginLeft = appliedWidth/2 - $(window).width()/2;

                    if (marginLeft > 0 && $(window).height()/$(window).width() >1.4)
                    {
                        bg.css('margin-left', '-'+marginLeft+'px');
                    } else
                    {
                        bg.css('margin-left', '0');
                    }

                } else if (options.type == 'self-hosted')
                {
                    bg =outerDiv.find('video');
                    bg.attr('width', appliedWidth);
                    bg.attr('height', appliedHeight);
                }

                bg.siblings('.c47-overlay').css('width', appliedWidth + 'px');
                bg.siblings('.c47-overlay').css('height', appliedHeight + 'px');

            });

            $(function(){
                $(element).trigger('resize');
            });

        });

        return this;
    };


}(jQuery, window));

/**
 * Created by luis on 9/12/16.
 */

//settings for toastr
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
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


/**
 * Created by luis on 19/07/17.
 */

/**
 * How does tracking work
 * 1. On squeeze page
 * On page load, one session ID will be created, the tracking script will send this
 *
 * 2. On popup
 * On appear, create a session ID associated with the popup, use this session to track further
 * actions
 *
 * 3. On widget
 * On element visible, send hit with session ID
 */


/**
 * send on page load, popup showed, widget visible
 * @param pageID: pageID in case of page, option ID in case of popup and wiget
 * @param sessionID
 * @param pageType: page or popup or widget
 * @param eventName: page open or page close
 */
function c37TrackingPageOpen(pageID, sessionID, pageType)
{
    console.log('sending open request');
    //send ajax post
    //send ajax post
    jQuery.post(ajaxurl, {
        pageID: pageID,
        pageType: pageType,
        eventName: 'open',
        sessionID: sessionID,
        receivedElement: 'whole_page',//action name is available on element click
        action: 'wplx_save_hit',
        url: window.location.href

    }, function(response){
        console.log(response);
    });
}

function c37TrackingPopupOpen(pageID, sessionID, pageType)
{
    console.log('sending open popup request');
    //send ajax post
    //send ajax post
    jQuery.post(ajaxurl, {
        pageID: pageID,
        pageType: pageType,
        eventName: 'open',
        sessionID: sessionID,
        receivedElement: 'whole_popup',//action name is available on element click
        action: 'wplx_save_hit',
        url: window.location.href

    }, function(response){
        console.log(response);
    });
}


function c37TrackingPopupClose(pageID, sessionID)
{
    console.log('sending close popup request');

    //send ajax post
    //send ajax post
    jQuery.post(ajaxurl, {
        pageID: pageID,
        pageType: 'popup',
        eventName: 'close',
        sessionID: sessionID,
        receivedElement: 'whole_popup',//action name is available on element click
        action: 'wplx_save_hit',
        url: window.location.href

    }, function(response){
        console.log(response);
    });
}


/**
 * send on page unload, popup closed
 * @param pageID: pageID in case of page, option ID in case of popup and wiget
 * @param sessionID
 * @param pageType: page or popup or widget
 * @param eventName: page open or page close
 */
function c37TrackingPageClose(pageID, sessionID, pageType)
{
    //send ajax post
    jQuery.post(ajaxurl, {
        pageID: pageID,
        pageType: pageType,
        eventName: 'close',
        sessionID: sessionID,
        receivedElement: 'whole_page',//action name is available on element click
        action: 'wplx_save_hit',
        url: window.location.href

    }, function(response){
        console.log(response);
    });
}

//pageID: parent.parentID,
//    pageType: parent.parentType,
//    eventName: 'click',
//    sessionID: sessionID,
//    actionName: actionName,
//    url: window.location.href,
//    action: 'wplx_save_hit'


/**
 *
 * @param element: the element that got clicked
 * @param elementName: name of the clicked element, set by user, in case of close button of popup
 * it is set to 'close-popup'
 */
function c37SendClick(element, elementName)
{
    if (typeof elementName == 'undefined')
        elementName = element.attr('c37-element-name');
    var sessionID = getSessionID(element);
    var parent = getParent(element);
    console.log('parent is', parent);

    if (parent === false || parent == {})
    {
        console.log('invalid parent object');
        return;
    }

    //send action
    jQuery.post(ajaxurl, {
        pageID: parent.parentID,
        pageType: parent.parentType,
        eventName: 'click',
        sessionID: sessionID,
        receivedElement: elementName,
        url: window.location.href,
        action: 'wplx_save_hit'
    }, function(response) {
        console.log('response');
    });
}

/**
 * the sessionID is associated with a parentID. We can get the sessionID by parentID
 * this is the trackingObject
 * {
 *  parentID_1: sessionID_1,
 *  parentID_2: sessionID_2
 * }
 * @param element
 * @returns {boolean}
 */
function getSessionID(element)
{
    if (typeof trackingObject != 'undefined')
    {
        var parentID = '';
        //check if the element is child of a popup
        if (element.closest('[data-popup-option-id]').length > 0)
        {
            parentID = element.closest('[data-popup-option-id]').attr('data-popup-option-id');
        } else if (element.closest('.c37-lp-popup-outer').length > 0)
        {
            parentID = element.closest('[data-widget-option-id]').attr('data-widget-option-id');
        } else if (element.closest('[data-page-id]').length > 0)
        {
            parentID = element.closest('[data-page-id]').attr('data-page-id');
        }

        console.log('parent ID is ', parentID);

        if (typeof trackingObject[parentID] == 'undefined')
            return false;

        return trackingObject[parentID];
    }

    return false;
}

function c37GenerateSessionID()
{
    return 'session-' + Math.round(Math.random() * 462020) + '-'+ Math.round(Math.random() * 512020) + '-' + Math.round(Math.random() * 92020);
}
//return an object of parent type and parent id
function getParent(element)
{
    console.log('finding parent');
    console.log('tracking object is: ', typeof trackingObject);
    if (typeof trackingObject != 'undefined')
    {
        var parentType= '';
        var parentID = '';
        //check if the element is child of a popup
        if (element.closest('[data-popup-option-id]').length > 0)
        {
            console.log('closest element is popup');
            parentType = 'popup';
            parentID = element.closest('[data-popup-option-id]').attr('data-popup-option-id');
        } else if (element.closest('.c37-lp-popup-outer').length > 0)
        {
            console.log('closest element is widget');
            parentType = 'widget';
            parentID = element.closest('[data-widget-option-id]').attr('data-widget-option-id');
        } else if (element.closest('[data-page-id]').length > 0)
        {
            parentType = 'page';
            parentID = element.closest('[data-page-id]').attr('data-page-id');
        } else
        {
            console.log('closest element is nobody');
        }


        console.log('parent ID is ', parentID);

        if (typeof trackingObject[parentID] == 'undefined')
            return false;

        return {
            parentType: parentType,
            parentID: parentID
        }
    }

    return {};
}


jQuery(function(){
    //tracking click action on every element with c37-action-name
    jQuery(document).on('click', '[c37-action-name]', function(){
        //get the right session ID and send
        c37SendClick(jQuery(this));
    });

});


(function($){
    console.log('loggin from full bg');
    function c37RenderBackgroundVideo()
    {
        var hasVideoBgElements = $('.c37-has-yt-bg');
        _.each(hasVideoBgElements, function(e) {
            var outerElementWidth = $(e).outerWidth();
            var outerElementHeight = $(e).outerHeight();

            console.log("outer element width: ", outerElementWidth, ' outer element height: ', outerElementHeight);

            var videoBgWidth = 0;
            var videoBgHeight = 0;
            //if width/height > 16/9, width of the bg = the width of the outer element, height of the bg = width * 9/16
            if (outerElementWidth/outerElementHeight >= 16/9)
            {
                videoBgWidth = outerElementWidth;
                videoBgHeight = outerElementWidth * 9/16;
                console.log("div like flat");
            } //if (width/height) < 16/9 (the element is more similar to a square), video height = outerElementHeight, video width = outerElementHeight * 16/9
            else {
                console.log("div like square");
                videoBgWidth = outerElementHeight * 16/9;
                videoBgHeight = outerElementHeight;
            }

            var bgElement = $(e).find('.c37-yt-bg iframe');
            bgElement.outerHeight(videoBgHeight);
            bgElement.outerWidth(videoBgWidth);

            //center the video element
            bgElement.css('margin-left', ( outerElementWidth - videoBgWidth ) / 2);
            bgElement.css('margin-top', ( outerElementHeight - videoBgHeight ) / 2);


            var overlayElement = $(e).find('.c37-video-bg-overlay');
            overlayElement.outerHeight(videoBgHeight);
            overlayElement.outerWidth(videoBgWidth);

        });
    }

    $(function(){
        c37RenderBackgroundVideo();
        $(window).on('resize', c37RenderBackgroundVideo);
    });

})(jQuery);
(function($){

    var form = $('.c37-lp form input');

    if (form.length > 1)
        form.parsley();

})(jQuery);
/**
 * Created by luis on 11/7/16.
 */
(function(){

    var showedPopupInCurrentSession = [];
    /**
     * from an popup option, check if the popup can be shown,
     * the decision is made based on option value of after close
     * @param popupOption
     * @param popupOptionID
     */
    function canShow(popupOptionID, popupOption)
    {
        console.log("checking if poupp can be shown");
        var popup = jQuery('#' + popupOption.popupID);
        console.log("popup ID is: ", popupOption.popupID);
        console.log("can we show again: ", popupOption.afterClose.action);
        console.log("this was shown? ", isPopupShowedInLifeTime(popup));

        if (popupOption.afterClose.action === 'never_show' && isPopupShowedInLifeTime(popupOptionID))
        {
            console.log('popup not showing because it was set to be shown once');
            return false;
        }

        if (_.contains(showedPopupInCurrentSession, popupOptionID))
        {
            console.log('popup not showing because it was shown in current session');
            return false;
        }

        //if the popup was shown, however, it hasn't passed the hibernate period, don't show again
        if (popupOption.afterClose.action==='hide_x_day')
        {
            if (getTimePopupLastShown(popupOptionID) !== null)
            {
                var today = new Date();
                var timeDiff = Math.abs(today.getTime() - getTimePopupLastShown(popupOptionID).getTime());
                console.log("time diff is: ", timeDiff);
                var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                console.log("Days difference is: ", diffDays);

                if (diffDays < popupOption.afterClose.daysToHide)
                    return false;
            }
        }

        //1. if the popup has shown in current session, don't show it again

        //in case
        return true;
    }

    /**
     * get the value of last_showed of popup in the localstorage object, return null if not available
     * @param popupOptionID
     */
    function getTimePopupLastShown(popupOptionID)
    {
        var objectList = getWPLXShownPopups();
        if (typeof objectList[popupOptionID] === 'undefined')
            return null;
        if (typeof objectList[popupOptionID].last_showed === 'undefined')
            return null;

        //last_showed is the string value of the last time the popup was showed
        return new Date(objectList[popupOptionID].last_showed);

    }

    /**
     * get the object of shown popup stored in localstorage
     * @returns {any}
     */
    function getWPLXShownPopups()
    {
        return JSON.parse(localStorage.getItem('wplx_list_shown_popups') || "{}");
    }

    function isPopupShowedInLifeTime(popupOptionID)
    {
        var recordedOptions = getWPLXShownPopups();
        console.log("recorded option", recordedOptions);
        console.log("popup id: ", popupOptionID);
        return  (typeof recordedOptions[popupOptionID] !== 'undefined');
    }

    /**
     * record popups options that showed in this format:
     * {
     *  popup_option_id :
     *  {
     *      last_showed: 'time that popup last showed'
     *  }
     * }
     * @param popupOptionID
     */
    function recordPopupShowed(popupOptionID)
    {
        var string = localStorage.getItem('wplx_list_shown_popups') || "{}";
        var recordedOptions =  [];

        try {
            recordedOptions = JSON.parse(string);
        } catch (err)
        {
            console.error(err);
            localStorage.setItem('wplx_list_shown_popups', '{}');
        }


        recordedOptions[popupOptionID] = { 'last_showed' : (new Date()).toISOString() };
        localStorage.setItem('wplx_list_shown_popups', JSON.stringify(recordedOptions));

    }

    jQuery(function(){
        var trackingObject = trackingObject || {};
        /**
         * currentSessionPopupShowed is set to false on every session (page, visit)
         * It prevents the popup from showing up multiple time in one page load
         */

        function showPopup(popup, displayOption)
        {

            var popupOptionID = popup.attr('data-popup-option-id');

            if (!canShow(popupOptionID, displayOption))
            {
                return;
            } else
            {
                console.log("we can show it: ", popupOptionID, " and the display option: ", displayOption);
            }

            console.log("popup option is: ", displayOption);

            //create session ID
            var sessionID = c37GenerateSessionID();
            trackingObject[popupOptionID] = sessionID;
            console.log('tracking object', trackingObject);

            //send hit event
            // c37TrackingPopupOpen(popupOptionID, sessionID, 'popup');

            recordPopupShowed(popupOptionID);
            showedPopupInCurrentSession.push(displayOption.popupID);
            //now show the popup
            if (displayOption.animation === 'default' || !Bounce.isSupported())
            {
                console.log('popup show using basic animation, no bounce');
                // popup.show();
                popup.removeClass('c37-d-none');
            }
            else
            {
                var bounce = new Bounce();

                switch(displayOption.animation)
                {
                    case "slide_in_left":
                        bounce.translate({
                            from: {x : -1000, y: 0},
                            to: {x: 0, y: 0},
                            duration: 2000
                        });
                        break;

                    case "slide_in_right":
                        bounce.translate({
                            from: {x : 1000, y: 0},
                            to: {x: 0, y: 0},
                            duration: 2000
                        });
                        break;

                    case "slide_in_bottom" :
                        bounce.translate({
                            from: {x : 0, y: 1000},
                            to: {x: 0, y: 0},
                            duration: 2000
                        });
                        break;
                    case "slide_in_top":
                        bounce.translate({
                            from: {x : 0, y: -1000},
                            to: {x: 0, y: 0},
                            duration: 2000
                        });
                        break;

                    case "swoosh_left":
                        bounce.translate({
                            from: {x : -1000, y: 0},
                            to: {x: 0, y: 0},
                            easing: "bounce",

                            duration: 2000
                        }).scale({
                            from: {x: 1, y: 1},
                            to: {x: 15, y: 1},
                            easing: "sway"
                        });
                        break;

                    case "swoosh_right":
                        bounce.translate({
                            from: {x : 1000, y: 0},
                            to: {x: 0, y: 0},
                            easing: "bounce",
                            duration: 2000
                        }).scale({
                            from: {x: 1, y: 1},
                            to: {x: 15, y: 1},
                            easing: "sway"
                        });
                        break;

                    case "splash_left":
                        bounce.translate({
                            from: {x : -1000, y: 0},
                            to: {x: 0, y: 0},
                            easing: "bounce",
                            duration: 2000
                        }).scale({
                            from: {x: 1, y: 1},
                            to: {x: 0.1, y: 2.3},
                            easing: "sway",
                            duration: 800,
                            delay: 65
                        }).scale({
                            from: {x: 1, y: 1},
                            to: {x: 5, y: 1},
                            easing: "sway",
                            duration: 300,
                            delay: 65
                        });
                        break;
                    case "splash_right":
                        bounce.translate({
                            from: {x : 1000, y: 0},
                            to: {x: 0, y: 0},
                            easing: "bounce",
                            duration: 2000
                        }).scale({
                            from: {x: 1, y: 1},
                            to: {x: 0.1, y: 2.3},
                            easing: "sway",
                            duration: 800,
                            delay: 65
                        }).scale({
                            from: {x: 1, y: 1},
                            to: {x: 5, y: 1},
                            easing: "sway",
                            duration: 300,
                            delay: 65
                        });
                        break;

                    default:
                        bounce.translate({
                            from: {x : -2000, y: 0},
                            to: {x: 0, y: 0},
                            easing: "bounce",

                            duration: 2000
                        }).scale({
                            from: {x: 1, y: 1},
                            to: {x: 15, y: 1},
                            easing: "sway"
                        });
                        break;

                }

                // popup.show();
                popup.removeClass('c37-d-none');
                bounce.applyTo(popup.find('.c37-lp-popup-inner').first());
            }

            jQuery(popup).trigger('resize');
            console.log('popup showed!');
        }

        jQuery(document).on('click', '.c37-lp-close-popup', function(){

            var popup = jQuery(this).closest('.c37-lp-popup-outer');
            var pageID = popup.attr('data-popup-option-id');
            console.log('on close, tracking object is: ', trackingObject);
            console.log('page id is : ', pageID);

            // var sessionID = trackingObject[popup.attr('data-popup-option-id')];
            // c37TrackingPopupClose(pageID, sessionID);
            jQuery(this).closest('.c37-lp-popup-outer').remove();
        });

        //the howToShowUp settings is printed when create the popup (c37-popup-manager)
        if (typeof howToShowUp !== 'undefined')
        {
            var display = howToShowUp;

            _.each(display, function(d){
                var popup = jQuery('#'+d.popupID);


                if (d.hideMobile && d.hideDesktop)
                    return;
                else if (d.hideMobile)
                {
                    if (c37isMobile)
                        return;
                } else if (d.hideDesktop)
                {
                    if (!c37isMobile)
                        return;
                }

                if (d.howToShowUp.trigger === 'mouse_exits')
                {
                    jQuery(document).on('mouseleave', function(e){
                        console.log(e.clientY);
                        if (e.clientY < 100)
                        {
                            console.log('showing popup on mouse leave, exit intent');
                            showPopup(popup, d);
                            jQuery(window).trigger('resize');
                        }

                    });
                } else if (d.howToShowUp.trigger === 'after_page_load')
                {
                    console.log("timer is: ", d);
                    setTimeout(function(){
                        console.log('showing popup on page load');
                        showPopup(popup, d);
                        //send a fake resize event so the background can update and fill the whole page
                        jQuery(window).trigger('resize');
                    }, d.howToShowUp.delay * 1000);
                } else if (d.howToShowUp.trigger === 'vertical_scroll')
                {
                    console.log('popup is set to show on vertical scroll');
                    //don't show the popup if the trigger is undefined
                    var scrollObject = d.howToShowUp.scroll;
                    if (typeof scrollObject.trigger === 'undefined')
                    {
                        console.error('trigger is undefined!');
                        return;
                    }

                    //if user set the trigger to scroll to a specific pixel, create a
                    //scroll listener and trigger the popup
                    if (scrollObject.trigger === 'pixel')
                    {
                        var scrollListener = typeof scrollObject.scrollEventListener === "undefined" || scrollObject.scrollEventListener === "" ? window : scrollObject.scrollEventListener;

                        if (scrollListener === "document")
                            scrollListener = document;

                        console.log(scrollObject);

                        console.log('Scroll listener is: ' + scrollListener);

                        jQuery(scrollListener).on('scroll', function(){

                            var distanceFromTop;
                            //in case the use set an element for scrolling, use of offset of that element
                            //to trigger

                            if (typeof scrollObject.element !== "undefined" && scrollObject.element !=="")
                            {
                                distanceFromTop = Math.abs(jQuery(scrollObject.element).offset().top);
                            } else
                            {
                                distanceFromTop = jQuery('body').scrollTop();
                            }

                            console.log('distance from top is: ' + distanceFromTop + 'px');

                            if (distanceFromTop >= scrollObject.pixel)
                            {
                                console.log('showing popup on scroll');
                                showPopup(popup, d);
                            }

                        });

                    }

                }

            });



        }
        //close the popup on the button/any element with class c37-close-popup clicked


    });

})();
/**
 * Created by luis on 9/4/16.
 */
//define actions responses for users' interactions
//to handle click
(function(){ 

    //handle action on element click
    /**
     * The key to handle click is this. The elementsActions object registered the action for
     * landing page -> container element (.c37-item-element). When then c37-child is clicked, it will
     * find in the elementsAction the object has the name by .c37-item-element ID
     * Illustration can be found here: https://drive.google.com/open?id=0B1dTAFXQBPD2b29oWWFYa0dKQW8
     */
    jQuery(document).on('click', '.c37-lp .c37-child', function(){
        if (typeof elementsActions === 'undefined')
            return;

        var page = jQuery(this).closest('.c37-lp');

        var pageID = page.attr('id');

        var parentID = jQuery(this).closest('.c37-item-element').attr('id');

        var formActionObject = elementsActions[pageID];

        if (!_.isEmpty(formActionObject)) 
        {

            var elementAction = formActionObject[parentID];

            /*this is a typical elementAction object
             |
             | https://drive.google.com/open?id=0B1dTAFXQBPD2b29oWWFYa0dKQW8
             |
             */

            if (typeof elementAction !== "object")
            {
                return;
            }

            if (elementAction.action === 'open-link')
            {
                console.log('open link');
                if (elementAction['new-tab'])
                {
                    window.open(elementAction.target);
                } else
                {
                    window.location.href = elementAction.target;
                }

            } else if (elementAction.action === 'submit-form')
            {
                /*
                 | Submit current form
                 */
                jQuery(this).closest('form').submit();

            } else if (elementAction.action === 'open-popup')
            {

                console.log('open popup');
                /**
                 * c37PopupTrigger is an object set in c37-popup-manager.php
                 *
                 */
                if (typeof c37PopupTrigger != 'undefined')
                {
                    //need to add tracking here for popup open and close

                    var id = '#'+c37PopupTrigger[elementAction['element-id']];
                    jQuery(id).removeClass('c37-d-none');
                    // jQuery(id).css("display", "block");


                } else
                {
                    console.log('c37 popup trigger is undefined')
                }
            } else if(elementAction.action == 'close-popup')
            {
                //close the popup
                console.log('id is: ', '#' + elementAction['element-id']);
                jQuery('#' + elementAction['element-id']).closest('.c37-lp-popup-outer').remove();
            }
        }



    });
})();


/**
 * Created by luis on 15/06/17.
 */
jQuery(function () {
    jQuery('.menu-toggle').on('click', function(){
        jQuery('.c37-icon-one').toggleClass('active-one');
        //find the right menu
        var menuItems =  jQuery(this).closest('.c37-lp-menu').find('.c37-menu-right-content').first();
        var menuLeftContent = jQuery('.c37-left-content');
        menuItems.toggleClass('c37-menu-mobile-visible');
    });
});
//# sourceMappingURL=front-bundle.js.map