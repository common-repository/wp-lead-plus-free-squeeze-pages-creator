<?php

class C37LPManager
{
	const C37_LP_POST_TYPE = 'core37_lp';
	const C37_LP_VARIATION_TYPE = 'core37_lp_variation';
	const C37_LP_TEMPLATE_POST_TYPE = 'core37_lp_template';
	const C37_LP_PAGE_TYPE_META_KEY = 'c37_page_type';//this is the meta key used in update_post_meta, the plugin will base on this key to retrieve list of pages to edit
	const C37_LP_META_PAGE_SETTINGS = 'c37_lp_form_settings';
	const C37_LP_META_DISABLE_YOAST_DESCRIPTION = 'c37_disable_yoast_meta_description';


	public static function registerPostType()
	{
		register_post_type(
			self::C37_LP_POST_TYPE,
			array(
				'labels' => array(
					'name' => __('WP Lead Plus X Landing Pages'),
					'singular_name' => __('WP Lead Plus X Landing Page')
				),
				'public'    => true,
				'rewrite'   => false,
				'show_ui'   => false,
				'exclude_from_search' => true,
				'supports'  => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt' )
			)

		);
	}

	public static function registerVariationType()
	{
		register_post_type(
			self::C37_LP_VARIATION_TYPE,
			array(
				'labels' => array(
					'name' => __('WP Lead Plus X Variations'),
					'singular_name' => __('WP Lead Plus X Variation')
				),
				'public'    => true,
				'rewrite'   => false,
				'exclude_from_search' => true,
				'show_ui'   => false,
				'supports'  => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt' )
			)

		);
	}

	//register a post type to save template
	public static function registerTemplatePostType()
	{
		register_post_type(
			self::C37_LP_TEMPLATE_POST_TYPE,
			array(
				'labels' => array(
					'name' => __('WP Lead Plus X Template', self::C37_LP_TEMPLATE_POST_TYPE),
					'singular_name' => __('WP Lead Plus X Template', self::C37_LP_TEMPLATE_POST_TYPE)
				),
				'public' => true,
				'rewrite' => false,
				'show_in_nav_menus' => false,
				'exclude_from_search' => true,
				'show_ui' => false,
				'publicly_queryable' => true,
				'supports'       => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt' )
			)

		);
	}

	/**
	 * Load a form to display to end user, use in shortcode
	 *
	 * @param $pageID
	 *
	 * @return string
	 */


    /**
     * Get all data from a page, containing its body and css and the page settings object
     * @param $pageID integer id
     * @return array
     */
	public static function getPage($pageID)
    {
        $pageSettingsString = get_post_meta( $pageID, self::C37_LP_META_PAGE_SETTINGS, true);
        $pageData = get_post( $pageID, OBJECT, 'raw');
        return array(
            'pageData' => $pageData,
            'pageSettings' => $pageSettingsString
        );
    }

    /**
     * @param $pageID
     * get html content of a page, ready to display on any pages, mostly used in c37-template
     * @return string
     */
    public static function getPageHTML($pageID)
    {
        $page = self::getPage($pageID);
        $pageContent = rawurldecode($page['pageData']->post_content);

        //print popup from elements action, if available
        $pageContent.=self::getPopupByElementsActions($pageID);

        //print page css
        $pageSettings = json_decode(($page['pageSettings']));

		$pageContent.='<!-- print css from page manager --><style>'.urldecode($pageSettings->compiledCSS). '</style>';
		//print elements actions here to avoid printing in template files
		$pageJSON = $pageSettings->modelsJSON->page;
		$pageContent.="<script>var elementsActions = elementsActions || {};  elementsActions['". $pageJSON->cssID ."'] = ". json_encode((($pageSettings->elementsActions))). "</script>";

		$countdown = '';	
		if ( isset($pageSettings->simpleCountdown) && is_object($pageSettings->simpleCountdown))
		{
			$countdown.= "<script>jQuery(function(){ ";
			$countdown.= "var countdown = " . json_encode($pageSettings->simpleCountdown) . ";";
			$countdown.= "console.log('countdown', countdown);";
			$countdown.= "_.each(countdown, function(v, k, o){
			var clock = o[k];

			var second = 1000,
			minute = second * 60,
			hour = minute * 60,
			day = hour * 24;

			var distance = 0;

			var element = jQuery('#' + clock['editingElementID']);
			console.log(element);
			var days = jQuery(element).find('.simple-countdown-days .cd-number').first();
			var hours = jQuery(element).find('.simple-countdown-hours .cd-number').first();
			var minutes = jQuery(element).find('.simple-countdown-minutes .cd-number').first();
			var seconds = jQuery(element).find('.simple-countdown-seconds .cd-number').first();

			var futureDate;
			if (clock['type'] == 'countAmount')
			{
				distance = (parseInt(clock['days']) * 3600 * 24 +
							parseInt(clock['hours']) * 3600+
							parseInt(clock['minutes']) * 60 +
							parseInt(clock['seconds'])) * 1000;
			} else
			{
				distance = new Date(clock['date']) - new Date().getTime();
			}

			var interval = setInterval(function() {
					distance -= 1000;

					if (distance >=0)
					{
						days.html(Math.floor(distance / (day)) < 10 ? \"0\" + Math.floor(distance / (day)) : Math.floor(distance / (day)));
						hours.html(Math.floor((distance % (day)) / (hour)) < 10 ? \"0\" + Math.floor((distance % (day)) / (hour)) : Math.floor((distance % (day)) / (hour)));
						minutes.html(Math.floor((distance % (hour)) / (minute)) < 10 ? \"0\" + Math.floor((distance % (hour)) / (minute)) : Math.floor((distance % (hour)) / (minute)) );
						seconds.html(Math.floor((distance % (minute)) / second) < 10 ? \"0\" + Math.floor((distance % (minute)) / second) : Math.floor((distance % (minute)) / second));

					} else {
					clearInterval(interval);
							if (clock['action'] == 'open-url')
							{
								window.open(clock['actionValue']);
							} else if (clock['action'] == 'exec-code')
							{
							eval(decodeURIComponent(clock['actionValue']));
							}


					}
					


				}, second);

			})";
			$countdown.="});</script>";


		}
		// $video = '';
		//if the page has youtube video set
		// $pageCSSObject = $pageSettings->modelsJSON->page->cssStyle;
		// if (isset($pageCSSObject->videoBg) && $pageCSSObject->videoBg->src->yt!= "" && !wp_is_mobile())
    	// {
		// 	$video.='
        // <div id="c37-background-video" class="c37-video-bg has-video-bg c37-has-yt-bg">
        //     <div class="c37-yt-bg c37-hide-in-editor"><iframe allow="autoplay; fullscreen" src="https://www.youtube.com/embed/'. $pageCSSObject->videoBg->src->yt.'?controls=0&mute=1&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=1&playlist='.$pageCSSObject->videoBg->src->yt.'" frameborder="0" allowfullscreen></iframe></div>
        // </div>';

    	// }

        return $pageContent.$countdown;
    }

    /**
     * @param $pageID
     * @return string this function will ouput page settings as a json object, it will be used later
     * in page template
     */
	public static function getPageSettingsJSON($pageID)
	{
		$pageSettingsString = get_post_meta( $pageID, self::C37_LP_META_PAGE_SETTINGS, true);
//		$pageSettings = json_decode($pageSettingsString);
		return '<script>var pageSettings  = '.rawurldecode($pageSettingsString).'</script>';
	}

	public static function escapeJS($string)
	{
		return str_replace("'", "\x27", $string);
	}

    /**
     * This function get all the pages created to edit in make pages
     * @return array
     */
	public static function getAllPages()
	{
		$data = array(
			'post_type' => array('page', self::C37_LP_POST_TYPE),
			'meta_key' => self::C37_LP_META_PAGE_SETTINGS,
			'meta_query' =>
			array(
				array(
					'key' => C37LPManager::C37_LP_META_PAGE_SETTINGS,
					'compare' => 'EXISTS'
				)
			),
			'orderby'          => 'date',
			'order'            => 'DESC',
			'posts_per_page' => -1,
			'author' => wp_get_current_user()->ID
		);

		$result = new WP_Query($data);

		$pages = array();

		foreach($result->posts as $post)
		{
			if (get_post_type($post->ID) == 'page')
			{
				$url = get_page_link($post->ID);
			} else {
				$url = get_permalink($post->ID);
			}

			$pages[] = array(
				'title' => $post->post_title,
				'id' =>$post->ID,
				'url' => $url

			);
		}

		return $pages;
	}

	/**
	 * Save form when user click on save form button
	 * @param $content
	 *
	 * @return mixed
	 */
	public static function savePage($content)
	{

		//the variable isPage decide whether to store the post as a page or not,
		$postType = isset($content['isPage']) && $content['isPage'] == 'true' ? 'page' : C37LPManager::C37_LP_POST_TYPE;

		$pageSlug = (isset($content['pageSlug']) && $content['pageSlug'] !='' && $content['pageSlug'] != 'undefined')? $content['pageSlug'] : $content['pageTitle'];
		//insert post to dp
		$pageID = wp_insert_post(
			array(
				'ID' => $content['pageID'],
				'post_content' => $content['pageContent'],
				'post_type' => $postType,
				'post_name' => $pageSlug,
				'post_title' => $content['pageTitle'],
				'post_status' => 'publish',
			)
		);


		update_post_meta($pageID, self::C37_LP_META_PAGE_SETTINGS, $content['pageSettings']);

		//disable the meta description on posts created by wplx by default
		update_post_meta($pageID, self::C37_LP_META_DISABLE_YOAST_DESCRIPTION, 0);
		$pageSlug = get_post($pageID)->post_name;
		return json_encode(array(
			'pageID' => $pageID,
			'pageURL' => get_permalink($pageID),
			'pageSlug' => $pageSlug
		));
	}


	public static function deletePage($pageID)
	{
		wp_delete_post($pageID, true);
		delete_post_meta($pageID, self::C37_LP_META_PAGE_SETTINGS);
	}

    /**
     * @param $pageSettings object
     * @return string
     */
	public static function getPageCSSID($pageSettings)
    {
        return $pageSettings->modelsJSON->page->cssID;
    }

	public static function getPageCustomCSS($pageID)
	{

		return json_decode(rawurldecode(get_post_meta($pageID, self::C37_LP_META_PAGE_SETTINGS, true)))->compiledCSS;
	}

	/**
	| Function to print importable string of a particular page to console.
	 * @param $pageID, page ID
     * @return string url to the template file
	*/

	public static function exportToTemplateString($pageID)
	{
			$pageData = get_post( $pageID, OBJECT, 'raw');

			$page = array(
				"pageContent" => $pageData->post_content,
				"pageTitle"  => $pageData->post_title,
				"pageSettings" => get_post_meta( $pageID, self::C37_LP_META_PAGE_SETTINGS, true),
			);

			//write the template to file
			$fileName = preg_replace("/[^A-Za-z0-9]/", '_', strtolower($pageData->post_title)) . '.tpl';

			$uploadDir = wp_upload_dir();
			$templateDir = ($uploadDir['basedir'] . "/wplx/templates/");
			if ($templateDir)
				wp_mkdir_p($templateDir);

			$path = $templateDir .$fileName;
			file_put_contents($path, rawurlencode(json_encode($page)));
			$url = $uploadDir['baseurl'] . "/wplx/templates/" .$fileName;

			echo json_encode(array('url' =>$url, 'file_name' => $fileName));
			die();
	}

	public static function getPopupByElementsActions($pageID)
	{
		$elementsAction = json_decode(get_post_meta($pageID, self::C37_LP_META_PAGE_SETTINGS, true))->elementsActions;
		$popupString = '';
		foreach($elementsAction as $a)
		{
			if ($a->action == 'open-popup')
			{
				//passing the action object
				$popupString .= C37LPPopupManager::getPopupHTMLContent($a->{'popup-id'}, $a);
			}
		}

		return $popupString;
	}

	//get css of the popups to print out to the template file
	public static function getCSSCodeOfPopupsInElementsAction($pageID)
	{
        $elementsAction = json_decode(get_post_meta($pageID, self::C37_LP_META_PAGE_SETTINGS, true))->elementsActions;

		$customCSSString = '';
		foreach($elementsAction as $a)
		{
			if ($a->action == 'open-popup')
			{
//				var_dump($a);
				//passing the action object
				$customCSSString .= C37LPPopupManager::getPageCSSByPopupID($a->{'popup-id'});
			}
		}

		return $customCSSString;
	}
}
