<?php
/*
	Plugin Name: WP Lead Plus X
	Plugin URI: http://www.wpleadplus.com/
	Description: WordPress Landing pages builder, squeeze pages, lead generation pages, popup, widgets creator. Responsive pages that work perfectly on all devices. Support new flexbox layout
	Author: core37, codingpuss, landingpagebuilderwizard
	Version: 3.0.24
	Author URI: http://www.binarycarpenter.com/
	Text Domain: wp-lead-plus-x
*/
//pro 	Version: 3.0.26
//free 2.0.13
include_once 'functions.php';
if (!defined('WPLX_HOME_DIR'))
{
	define('WPLX_HOME_DIR', plugin_dir_path(__FILE__));
}

if (!defined('WPLX_HOME_URL'))
{
	define('WPLX_HOME_URL', plugins_url("", __FILE__));
}

//register_activation_hook(__FILE__, 'wplx_activation_hook');
//function wplx_activation_hook()
//{
//	if (function_exists('c37_ajax_url_head'))
//	{
//		deactivate_plugins( plugin_basename( __FILE__ ) );
//		wp_die( 'Please deactivate the free version first' );
//	}
//
//
//
//
//}

//
//function c37_remove_template_post_type($query) {
//
//	if ($query->is_search) {
//
//		$query->set('post_type', 'post', 'page');
//
//	}
//	return $query;
//
//}

//add_filter('pre_get_posts','c37_remove_template_post_type');

//add_action( 'init', 'c37_remove_template_post_type', 99 );
//
//function c37_remove_template_post_type() {
//	global $wp_post_types;
//
//	if ( post_type_exists( 'core37_lp_template' ) ) {
//
//		// exclude from search results
//		$wp_post_types['core37_lp_template']->exclude_from_search = true;
//		$wp_post_types['core37_lp']->exclude_from_search = true;
//	}
//}
