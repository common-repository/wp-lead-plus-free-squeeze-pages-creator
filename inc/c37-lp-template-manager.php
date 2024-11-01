<?php
/**
 * Created by PhpStorm.
 * User: luis
 * Date: 11/9/16
 * Time: 10:26 AM
 */

class C37_LP_Template_Manager extends C37LPManager{
	/**
	 * @param $url, URL from remote server, (core37)
	 * @return string: the path after uploading
	 */
	public static function importImage($url)
	{
		// Need to require these files
		if ( !function_exists('media_handle_upload') ) {
			require_once(ABSPATH . "wp-admin" . '/includes/image.php');
			require_once(ABSPATH . "wp-admin" . '/includes/file.php');
			require_once(ABSPATH . "wp-admin" . '/includes/media.php');
		}

		$tmp = download_url( $url );
		if( is_wp_error( $tmp ) ){
			return "";
		}
		$post_id = 1;
		$desc = "";
		$file_array = array();

		// Set variables for storage
		// fix file filename for query strings
		preg_match('/[^\?]+\.(jpg|jpe|jpeg|gif|png)/i', $url, $matches);
		$file_array['name'] = basename($matches[0]);
		$file_array['tmp_name'] = $tmp;

		// If error storing temporarily, unlink
		if ( is_wp_error( $tmp ) ) {
			@unlink($file_array['tmp_name']);
			$file_array['tmp_name'] = '';
		}

		// do the validation and storage stuff
		$id = media_handle_sideload( $file_array, $post_id, $desc );

		// If error storing permanently, unlink
		if ( is_wp_error($id) ) {
			@unlink($file_array['tmp_name']);
			return "";
		}

		$src = wp_get_attachment_url( $id );

		return $src;
	}


	/**
	 * @param $templateString string,  template content, in rawurlencoded, JSON encoded format
	 * @return integer, 1 if success, 0 if failed.
	 * This number will be added to the report to the user about how many templates were imported
	 */
	public static function importTemplateFromString($templateString)
	{
		//the task is to get the images in
		$page = json_decode(rawurldecode($templateString));

//		pageTitle (must be unique)
//		pageContent
//		pageSettings
		/*
		| in order to import all the images to the new site,
		| we need first to filter all the images from page content then download and return the URL.
		| after that, replace the old image paths with the new one. The images are (possibly) in pageContent
		| and pageSettings (background image)
		*/
		$pageContent = $page->pageContent;

		//if page content is blank, it means the template file was not read
		if ($pageContent == "")
			return 0;

			/*
			| Check if the template was imported before, do this to skip image importing repeatedly
			| the template all start with C37_LP_Template so the chance that they conflict with other pages
			| created by user is 0 (.xx)
			*/

		$templateImported = false;
		$templateData = get_page_by_title($page->pageTitle, OBJECT, C37LPManager::C37_LP_TEMPLATE_POST_TYPE);
		if ($templateData != NULL)
		{
			$templateImported = true;
		}

		if (!$templateImported)
        {
            //now, parse image urls from the $pageContent
            $pattern = '~(http.*\.)(jpe?g|png|[tg]iff?|svg)~i';

            preg_match_all($pattern,$pageContent,$matches);

            if (count($matches[0]) > 0)
            {
                $newImages = array();

                foreach ($matches[0] as $singleImage)
                {
                    $newImage = self::importImage($singleImage);

                    $newImages[] = array(
                        'old' => $singleImage,
                        'new' => $newImage
                    );
                }

                //replace the old images with the new images
                foreach($newImages as $img)
                {
                    $pageContent = str_replace($img['old'], $img['old'], $pageContent);
                }

                $page->pageContent = $pageContent;

            }


        }



        /*
         | Now, import the post
         */

		$templateID = $templateData == null ? 0 : $templateData->ID;

		//insert post to dp
		$templateID = wp_insert_post(
			array(
				'ID' => $templateID,
				'post_content' => $page->pageContent,
				'post_type' => self::C37_LP_TEMPLATE_POST_TYPE,
				'post_name' => $page->pageTitle,
				'post_title' => $page->pageTitle,
				'post_status' => 'draft',
			)
		);

		update_post_meta($templateID, self::C37_LP_META_PAGE_SETTINGS, $page->pageSettings);
		return 1;
	}

	public static function importTemplateFromURL($url)
	{
		$content = wp_remote_get($url);
		self::importTemplateFromString($content);
	}

	public static function export($templateID)
	{

	}


	public static function submitTemplateToRepository()
	{

	}

	public static function importTemplatesFromLocalFiles()
	{
		$templateFiles = scandir(plugin_dir_path(__FILE__) . "templates");
		$importedTemplates = 0;
		foreach ($templateFiles as $file)
		{
			if (stripos($file, ".tpl") != false)
			{
				//result either 0 or 1 (fail or success)
				$templateContent = (file_get_contents(plugin_dir_path(__FILE__) . "templates/" . $file));
				$result = self::importTemplateFromString($templateContent);
				$importedTemplates+=$result;
			}

		}

		return $importedTemplates;

	}

	public static function getAllTemplates()
	{
		$data = array(
			'post_type' => self::C37_LP_TEMPLATE_POST_TYPE,
			'orderby'          => 'date',
			'order'            => 'DESC',
			'posts_per_page' => -1,
		);

		$result = new WP_Query($data);

		$templates = array();

		if ($result->post_count == 0)
		{
			$message = array(
				'error' => 1,
				'message' => 'Please go to WP Lead Plus X->Templates->Load templates to load the templates first'
			);

			echo json_encode($message);

			die();
		}


		foreach($result->posts as $post)
		{
			$templates[] = array(
				'title' => $post->post_title,
				'id' =>$post->ID,
				'url' => $post->guid
			);
		}

		return $templates;
	}

	public static function deleteTemplate($templateID)
	{
		wp_delete_post($templateID, true);
		delete_post_meta($templateID, self::C37_LP_META_PAGE_SETTINGS);
	}

	public static function loadTemplateForEditing($templateID)
	{
		return self::getPage($templateID);
	}

}
