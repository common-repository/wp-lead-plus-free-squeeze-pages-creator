<?php
/**
 * Created by PhpStorm.
 * User: luis
 * Date: 9/1/16
 * Time: 2:35 PM
 */

add_shortcode('c37_lp_popup', 'c37_lp_popup_display');

function c37_lp_popup_display($atts)
{
	shortcode_atts(array(
		'id' => ''
	), $atts);

	//dont' do shortcode on homepage
	if (is_home())
		return '';
	return C37LPPopupManager::getPopupHTMLContent($atts['id']);
}

add_shortcode('c37_lp_widget', 'c37_lp_widget_display');

function c37_lp_widget_display($atts)
{
	shortcode_atts(array(
		'id' => ''
	), $atts);

	//dont' do shortcode on homepage
//	if (is_front_page())
//		return '';
	return C37LPWidgetManager::getWidgetHTMLContent($atts['id']);
}


////
//
//add_action('wp_head', 'c37_lp_print_custom_css');
//
//function c37_lp_print_custom_css()
//{
//	$posts = new WP_Query(array(
//		'post_type' => C37LPManager::C37_LP_POST_TYPE
//	));
//
//	$customCSS = '';
//	foreach ($posts as $post)
//	{
//		if (is_object($post) && property_exists($post, 'ID'))
//			$customCSS .= C37LPManager::getPageCustomCSS($post->ID);
//	}
//
//	echo '<style id="c37-lp-custom-css">'.$customCSS.'</style>';
//}
//
