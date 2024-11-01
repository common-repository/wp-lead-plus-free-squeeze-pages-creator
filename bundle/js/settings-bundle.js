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
 * Created by luis on 9/27/16.
 */
jQuery(function() {

    jQuery("#settings-page-tabs").tabs();
    jQuery("#activation-options").tabs();

    var loadTemplate = jQuery('#load-templates');
    var useWPTemplateFile = jQuery('#use-wordpress-template');

    useWPTemplateFile.on('change', function(){
        var use = jQuery(this).is(':checked') ? 1 : 0;
        jQuery.post(ajaxurl, {
            action: 'c37_lp_use_wp_template_file',
            use: use
        }, function(response){
            toastr.info('setting saved!');
        });

    });


    loadTemplate.on('click', function(){
      if (!versionNangCap || !isActivated)
      {
        showUpgradeDialog();
        return;
      }

        var loadingNotif = jQuery('#loading-notif');
        loadingNotif.show();

      toastr.info('Importing templates. This may take up to a minute...');
      jQuery.post(ajaxurl,
        {
          action: 'core37_lp_load_local_templates'
        },
        function(response){
          toastr.info(response);
            loadingNotif.hide();

          setTimeout(function(){
            toastr.remove();

          }, 1000);
        }
      )

    });


    //verifycation

    var paypalRadio = jQuery('#paypal-radio');
    var clickbankRadio = jQuery('#clickbank-radio');

    var clickbankDiv = jQuery('#clickbank');
    var paypalDiv = jQuery('#paypal');


    paypalRadio.on('click', function(){

        clickbankDiv.hide();
        paypalDiv.show();

    });

    clickbankRadio.on('click', function(){

        paypalDiv.hide();
        clickbankDiv.show();

    });

    var activateButton = jQuery('#activate-license');

    activateButton.on('click', function() {

        var paymentType = jQuery('[name=payment-type]:checked').val();

        if (typeof paymentType == 'undefined')
            return;
        var email, receipt;

        if (paymentType == 'paypal')
        {
            email = jQuery('#paypal-purchase-email').val().trim();
            receipt = jQuery('#paypal-transaction-id').val().trim();


        } else if (paymentType == 'clickbank')
        {
            email = jQuery('#clickbank-purchase-email').val().trim();
            receipt = jQuery('#clickbank-receipt-number').val().trim();
        }

        toastr.info("Checking your license information. Please wait...");

        jQuery.post(
            ajaxurl,
            {
                action: 'core37_lp_activate_license',
                email: email,
                receipt: receipt,
                type: paymentType
            },
            function(response)
            {
                var data = JSON.parse(response);

                if (data.result)
                {
                    toastr.info(data.message);
                    jQuery('#activation-area').hide();
                } else
                {
                    toastr.error(data.message + data.error) ;
                }
            }

        )



    });

});

//# sourceMappingURL=settings-bundle.js.map