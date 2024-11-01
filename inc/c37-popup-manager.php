<?php
/**
 * Created by PhpStorm.
 * User: luis
 * Date: 11/5/16
 * Time: 6:38 AM
 */

class C37LPPopupManager
{
	const C37_LP_POPUP_OPTION_POST_TYPE = "c37-popup-option";
	const C37_LP_POPUP_META_WHERE_TO_DISPLAY = 'c37_lp_popup_where_to_display';

	public static function registerPopupOptionType()
	{
		register_post_type(
			self::C37_LP_POPUP_OPTION_POST_TYPE,
			array(
				'labels' => array(
					'name' => __('C37 Popup Option', self::C37_LP_POPUP_OPTION_POST_TYPE),
					'singular_name' => __('C37 Popup Option', self::C37_LP_POPUP_OPTION_POST_TYPE)
				),
				'public' => false,
				'has_archive' => false,
				'show_ui' => false,
				'exclude_from_search' => true,
				'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt' )
			)

		);
	}

	public static function saveOption($content)
	{
		//insert post to dp
		$optionID = wp_insert_post(
			array(
				'ID' => $content['optionID'],
				'post_content' => $content['optionContent'],
				'post_type' => self::C37_LP_POPUP_OPTION_POST_TYPE,
				'post_name' => $content['optionName'],
				'post_title' => $content['optionName'],
				'post_status' => 'publish',
			)
		);

		update_post_meta($optionID, self::C37_LP_POPUP_META_WHERE_TO_DISPLAY, $content['whereToDisplay']);

		return $optionID;
	}


	//delete an option
	public static function deleteOption($optionID)
	{
		wp_delete_post($optionID);
		delete_post_meta($optionID, self::C37_LP_POPUP_META_WHERE_TO_DISPLAY);
	}

	public static function loadSingleOption($optionID)
	{
		$option = get_post( $optionID, ARRAY_A, 'raw');
//		return $option;
		return array(
			'content' => $option['post_content'],
			'title' => $option['post_title']
		);
	}

	public static function getAllOptions($title = 'title')
	{
		$data = array(
			'post_type' => self::C37_LP_POPUP_OPTION_POST_TYPE,
			'orderby'          => 'date',
			'order'            => 'DESC',
			'posts_per_page' => -1,
		);

		$result = new WP_Query($data);

		$options = array();

		foreach($result->posts as $post)
		{
			$content = json_decode(urldecode($post->post_content));

			$options[] = array(
				$title => $post->post_title, //use text instead of title
				'id' =>$post->ID,
				'position' => $content->whereToDisplay->by
//				'url' => get_permalink(json_decode(rawurldecode($post->post_content))->contentID)
			);
		}

		return $options;
	}


	//this function returns false, string or object
	public static function checkHasVideoBG($bgData) {
		if ( !isset( $bgData ) ) {
			return false;
		}

		//for backward compatible, previously, $pageSettings->backgroundVideo if available, is a YT ID
		if ( gettype( $bgData ) == 'string' && trim( $bgData ) != '' ) {
			return true;
		}

		if ( gettype( $bgData ) == 'object' ) {
			if ( $bgData->type == 'youtube' ) {
				if ( trim( $bgData->source->yt ) != '' ) {
					return true;
				}
			} else if ( $bgData->type == 'self-hosted' ) {
				if ( trim( $bgData->source->mp4 ) != '' || trim( $bgData->source->webm ) != '' || trim( $bgData->source->ogv ) != '' ) {
					return true;
				}
			}
		}

		return false;

	}
		/**load the popup HTML to print on the page, this is for shortcode or option created on the option page
	 *
*@param $popupContentID : page id
	 * @param $popupOption: the object that determine how the popup to show up on the page, created
	 * in popup manager page
	 * @param $trigger: by default, this is set to option, that means the popup will be shown depending on the
	 * options set when creating popup option. If it set to 'click', that means the popup is triggered by
	 * click on page element
	 * @param $optionID string use this to generate an id to track which option was displayed
	 *
*@return null
	 */
	public static function loadPageHTMLForPopup( $popupContentID, $popupOption, $optionID, $trigger = 'option')
	{
		//check if post exists
		if ( get_post( $popupContentID) == null)
			return "";

		$pageContent = get_post( $popupContentID, ARRAY_A, 'raw');
		$pageSettingsString = get_post_meta( $popupContentID, C37LPManager::C37_LP_META_PAGE_SETTINGS, true);

		if ($pageSettingsString == "")
			return "";

		$pageSettings = json_decode($pageSettingsString);
		$pageContent = C37LPManager::getPageHTML($popupContentID);
		
		$style = '';

        /*
         * var optionContent = {
                contentID: popupContent.val(),
                whereToDisplay: {
                    by: whereToDisplay.val(),
                    id: categoryToDisplay.val()//category ID
                },
                coverWholeBg: coverWholeBackground.is(":checked"),
                positionOnPage: positionOnPage.val(),
                howToShowUp: {
                    trigger: showUpTrigger.val(),
                    delay: pageLoadDelay.val(), //for after page load
                    scroll: {
                        pixel: scrollPixels.val(),
                        trigger: 'pixel',//by pixel or on end of post reached (pixel|end_post|percentage)
                        //at current state, pixel is the only option
                        percentage: '',
                        element: scrollElement.val(),
                        scrollEventListener: scrollEventListener.val()
                    }

                },

                afterClose: {
                    action: afterClose.val(),//keep_showing
                    daysToHide: daysToHide.val()//for hide x day
                },
                animation: animation,
                closeBtn: closeBtn,
                hideDesktop: hideDesktop,
                hideMobile: hideMobile
            };
         */


		switch($popupOption->positionOnPage)
		{

//			case 'top_left':
//				$outerFlexClass = 'justify-content-start';
//				$innerFlexClass = 'align-self-start';
//				break;
//			case 'top_right':
//                $outerFlexClass = 'justify-content-start';
//                $innerFlexClass = 'align-self-end';
//				break;
//			case 'bottom_left':
//                $outerFlexClass = 'justify-content-end';
//                $innerFlexClass = 'align-self-start';
//				break;
//			case 'bottom_right':
//                $outerFlexClass = 'justify-content-end';
//                $innerFlexClass = 'align-self-end';
//				break;
//			case 'center':
//                $outerFlexClass = 'justify-content-center';
//                $innerFlexClass = 'align-self-center';
//				break;
//			default:
//                $outerFlexClass = 'justify-content-start';
//                $innerFlexClass = 'align-self-start';
//				break;

            case 'top_left':

				$innerFlexClass = 'c37-popup-top-left';
				break;
			case 'top_right':

                $innerFlexClass = 'c37-popup-top-right';
				break;
			case 'bottom_left':
                $innerFlexClass = 'c37-popup-bottom-left';
				break;
			case 'bottom_right':
                $innerFlexClass = 'c37-popup-bottom-right';
				break;
			case 'center':
                $innerFlexClass = 'c37-popup-center';
				break;
            case 'center-top':
                $innerFlexClass = 'c37-popup-center-top';
                break;
            case 'center-bottom':
                $innerFlexClass = 'c37-popup-center-bottom';
                break;

            case 'center-left':
                $innerFlexClass = 'c37-popup-center-left';
                break;

            case 'center-right':
                $innerFlexClass = 'c37-popup-center-right';
                break;

			default:
                $innerFlexClass = 'c37-popup-center';
				break;
		}


		//generate a random ID so the popup.js can display the right popup, this is unique across all popups on a page
		$randomID = "c37-popup-". rand(1,10000);

		//check if there are rules set for background image or video
        $cssRules = $pageSettings->modelsJSON->page->cssStyle->desktop;
        $ruleString = '';

        if ($cssRules != null)
        {
            foreach($cssRules as $k=>$v)
            {
                if (stripos($k, 'background-')===0)
                {
                    if ($v!='')
                    {
                        if ($k=='background-image')
                            $ruleString .= $k . ':url(' . $v . ');';
                        else
                        {
                            if (is_string($v))
                            {
                                $ruleString .= $k . ':' . $v . ';';
                            }
                        }
                    }
                }
            }
        }


        $ruleString = "<style> #$randomID {".$ruleString."}</style>";

		$pageCustomCSS = $pageSettings->compiledCSS;

        $popupCustomCSS = '<style class="c37-popup-css"> '.rawurldecode($pageCustomCSS).' </style>';

        //render style for the outer div, this is the fixed div that cover

		//install webfonts on page
		if (isset($pageSettings->webFonts))
		{
			foreach($pageSettings->webFonts as $font)
			{
				$pageContent.= rawurldecode($font);
			}
		}


		$closeButtonDiv = '';
		$closePopupScript = '';



		if (isset($popupOption->closeBtn))
		{
			if ($popupOption->closeBtn->position != 'c37-cbtn-none')
			{
				$closeButtonClass = '';
				$closeButtonImageFolder = rtrim(plugin_dir_url(__FILE__), "inc/") . '/bundle/css/images/close-btn/';
				$closeButtonImage = $closeButtonImageFolder  . 'c37-c0.png';
				if (isset($popupOption->closeBtn))
				{
					$closeButtonClass .=  $popupOption->closeBtn->position;
					$closeButtonImage =  $closeButtonImageFolder . $popupOption->closeBtn->cssClass.'.png';
				}
                $closeButtonCorner = isset($popupOption->closeBtn->corner) ? $popupOption->closeBtn->corner : 'c37-cbtn-corner-top-left';
				//add a close button to the popup
				$closeButtonDiv = '<div class="c37-lp-close-popup '.$closeButtonClass. ' ' .$closeButtonCorner. '"><img src='.$closeButtonImage.' /></div>';
				//		$closePopupScript =  '<script> jQuery(function(){ jQuery(\''.$closeButtonDiv.'\').insertBefore(jQuery("#'.$randomID.' .c37-step > div").first()) }) </script>';
				$closePopupScript = '';
			}
		}


		//print the display object so the script in front/popup.js can display the popup
//		var_dump($popupOption);
        $popupOption->popupID = $randomID;
		if ($trigger == 'option')
		{
            $pageContent .= "<script> var howToShowUp = howToShowUp || {}; howToShowUp['$randomID'] = ".json_encode($popupOption). "  </script>";
		}
		else //if there the trigger is an action object,
		{
			$pageContent .= "<script>var c37PopupTrigger = c37PopupTrigger || {}; c37PopupTrigger['".$trigger->{'element-id'}."'] = '".$randomID."';</script>";
		}

		$coverWholePageClass = $popupOption->coverWholeBg ? "c37-popup-cover" : "";
		$video = '';

		$pageCSSObject = $pageSettings->modelsJSON->page->cssStyle;

		if (isset($pageCSSObject->videoBg) && $pageCSSObject->videoBg->src->yt!= "" && !wp_is_mobile())
		{
			$video .= '<div class="c37-background-video c37-video-bg has-video-bg c37-has-yt-bg"><div class="c37-yt-bg c37-hide-in-editor"><iframe allow="autoplay; fullscreen" src="https://www.youtube.com/embed/'.$pageCSSObject->videoBg->src->yt.'?controls=0&mute=1&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=1&playlist='. $pageCSSObject->videoBg->src->yt.'" frameborder="0" allowfullscreen></iframe></div></div>';
		}

        $pageContent =
            '<div data-popup-option-id="'.$optionID.'" id="'.$randomID.'" class="c37-d-none c37-popup-container c37-lp-popup-outer d-flex flex-column '.$coverWholePageClass.'" >'.$video.'<div class="c37-lp-popup-inner '.$innerFlexClass.' ">'.$closeButtonDiv.$pageContent.'</div></div>';
		//include $popupOption->positionOnPage to outer class solely for positioning the close button


		//print a js value to see if the user is currently view on mobile or desktop
        $isMobile = '<script> var c37isMobile = '.(wp_is_mobile()? 'true' : 'false').';</script>';

		return $pageContent . $popupCustomCSS . $closePopupScript.$ruleString.$isMobile;
	}

    /**
     * @param $optionID
     * @param string $trigger there are two possible value for this variable, option or click, if the trigger
     * is set to click, it will show when visitor click on an element
     * @return null|string
     */
	public static function getPopupHTMLContent($optionID, $trigger = 'option')
	{
		$option = get_post($optionID);

		if (!is_object($option))
			return '';

		$popupOption = json_decode(rawurldecode($option->post_content));
		if (!is_object($popupOption))
			return '';

		return self::loadPageHTMLForPopup($popupOption->contentID, $popupOption, $optionID, $trigger);
	}

	/**
	 * This function get the custom css content of the page (content) of the popup
	 * The content returned will be used on the landing page created by this plugin
	 * (@see c37-template.php)
	 * @param $optionID: Popup option ID
	 *
	 * @return string
	 */
	public static function getPageCSSByPopupID($optionID)
	{
		$option = get_post($optionID);

		if (!is_object($option))
			return '';

		$popupOption = json_decode(rawurldecode($option->post_content));
		if (!is_object($popupOption))
			return '';

		return C37LPManager::getPageCustomCSS($popupOption->contentID);

	}

}