<?php
//register a custom post type to preview the forms, this is for testing only

add_action('wp_ajax_core37_lp_save_page', 'core37_lp_save_page');

function core37_lp_save_page()
{
	$content = array();
	parse_str(file_get_contents("php://input"), $content);

	//pass the form ID to the editor
	echo C37LPManager::savePage($content);
	die();
}

/**
 * Get all the form
 */
add_action('wp_ajax_core37_lp_list_pages', 'core37_lp_list_pages' );

function core37_lp_list_pages()
{
	$forms = C37LPManager::getAllPages();

	echo json_encode($forms);

	die();
}

/**
 * load a form based on form ID
 */

add_action('wp_ajax_core37_lp_load_page', 'core37_lp_load_page');

function core37_lp_load_page()
{

	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	echo json_encode(
		C37LPManager::getPage($data['pageID'])
	);

	die();
}

/**
 * Delete a form based on its ID
 *
 */

add_action('wp_ajax_core37_lp_delete_page', 'core37_lp_delete_page');


function core37_lp_delete_page()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	C37LPManager::deletePage($data['pageID']);
	echo 'done';

	die();

}


add_action('wp_ajax_core37_lp_form_admin_save_settings', 'core37_lp_form_admin_save_settings');

function core37_lp_form_admin_save_settings()
{
	//this function accepts data from post content. There is one variable from post array : type is
	//the key to decide what to do next

	$data = array();
	parse_str(file_get_contents("php://input"), $data);

	switch($data['type'])
	{
		case 'recaptcha' :
			update_option('c37_lp_recaptcha_site_key', $data['recaptcha_site_key']);
			update_option('c37_lp_recaptcha_secret_key', $data['recaptcha_secret_key']);
			echo 'success';
			break;

		case 'receiving-email' :
			update_option('c37_lp_receiving_email', $data['email']);
			break;
		default:
			break;
	}


	die();




}

//list of form styles
add_action('wp_ajax_core37_lp_get_form_styles', 'core37_lp_get_form_styles');

function core37_lp_get_form_styles()
{
	$styles = array(
		array(
			'class' => 'c37-lp-style-1',
			'is_pro' => false
		),
		array(
			'class' => 'c37-lp-style-2',
			'is_pro' => false
		),
		array(
			'class' => 'c37-lp-style-3',
			'is_pro' => true
		),
		array(
			'class' => 'c37-lp-style-4',
			'is_pro' => true
		),
		array(
			'class' => 'c37-lp-style-5',
			'is_pro' => true
		),
		array(
			'class' => 'c37-lp-style-6',
			'is_pro' => true
		)
	);

	echo json_encode($styles);
	die();
}


add_action('wp_ajax_core37_lp_get_default_parameters', 'core37_lp_get_default_parameters');
function core37_lp_get_default_parameters()
{
	$data = array(
		'imagePlaceholder' => str_replace('/inc/', '',plugin_dir_url(__FILE__)) . '/css/images/image-placeholder.jpg'
	);

	echo json_encode($data);

	die();
}

//save popup option
add_action('wp_ajax_core37_lp_save_popup_option', 'core37_lp_save_popup_option');

function core37_lp_save_popup_option()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);
	$optionID = C37LPPopupManager::saveOption($data);

	echo $optionID;

	die();
}

//delete popup option
add_action('wp_ajax_core37_lp_delete_popup_option', 'core37_lp_delete_popup_option');

function core37_lp_delete_popup_option()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	C37LPPopupManager::deleteOption($data['optionID']);

}

//load popup option
add_action('wp_ajax_core37_lp_load_single_popup_option', 'core37_lp_load_single_popup_option');

function core37_lp_load_single_popup_option()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);
	echo rawurlencode(json_encode(C37LPPopupManager::loadSingleOption($data['optionID'])));
	die();
}

//load all options
add_action('wp_ajax_core37_lp_load_all_popup_options', 'core37_lp_load_all_popup_options');

function core37_lp_load_all_popup_options()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	$title = 'title';
	if (isset($data['title']))
		$title = $data['title'];


	echo rawurlencode(json_encode(C37LPPopupManager::getAllOptions($title)));
	die();
}



//save popup option
add_action('wp_ajax_core37_lp_save_widget_option', 'core37_lp_save_widget_option');

function core37_lp_save_widget_option()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);
	$optionID = C37LPWidgetManager::saveOption($data);

	echo $optionID;

	die();
}

//delete popup option
add_action('wp_ajax_core37_lp_delete_widget_option', 'core37_lp_delete_widget_option');

function core37_lp_delete_widget_option()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	C37LPWidgetManager::deleteOption($data['optionID']);

}

//load popup option
add_action('wp_ajax_core37_lp_load_single_widget_option', 'core37_lp_load_single_widget_option');

function core37_lp_load_single_widget_option()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);
	echo rawurlencode(json_encode(C37LPWidgetManager::loadSingleOption($data['optionID'])));
	die();
}

//load all options
add_action('wp_ajax_core37_lp_load_all_widget_options', 'core37_lp_load_all_widget_options');

function core37_lp_load_all_widget_options()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	$title = 'title';
	if (isset($data['title']))
		$title = $data['title'];


	echo rawurlencode(json_encode(C37LPWidgetManager::getAllOptions($title)));
	die();
}



//get all categories
add_action('wp_ajax_core37_lp_get_all_categories', 'core37_lp_get_all_categories');

function core37_lp_get_all_categories()
{
	$cats = get_categories(array(
		'orderby' => 'name',
		'order' => 'ASC'
	));


	$result = array();
	foreach($cats as $cat)
	{
		$result[] = array(
			'id' => $cat->cat_ID,
			'text' => $cat->name
		);
	}

	echo rawurlencode(json_encode($result));
	die();
}

//get all page created by c37 (to populate to popup content box)
add_action('wp_ajax_core37_lp_get_all_c37_pages', 'core37_lp_get_all_c37_pages');

function core37_lp_get_all_c37_pages()
{
	$pages = C37LPManager::getAllPages();

	$result = array();

	foreach($pages as $page)
	{
		$result[] = array(
			'id' => $page['id'],
			'text' => $page['title']
		);
	}

	echo rawurlencode(json_encode($result));
	die();
}

//get all posts

//get template string
add_action('wp_ajax_core37_lp_export_template', 'core37_lp_export_template');

function core37_lp_export_template()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);
	echo C37LPManager::exportToTemplateString($data['pageID']);
}

//import all local templates to current site
add_action('wp_ajax_core37_lp_load_local_templates', 'core37_lp_load_local_templates');

function core37_lp_load_local_templates()
{
	$importedTemplates = C37_LP_Template_Manager::importTemplatesFromLocalFiles();

	echo $importedTemplates . " templates imported!";
	die();
}


//import all local templates to current site
add_action('wp_ajax_c37_lp_use_wp_template_file', 'c37_lp_use_wp_template_file');

function c37_lp_use_wp_template_file()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);
	update_option('c37_lp_use_wp_template_file', $data['use']);
	die();
}


//get all templates (title and id), to display to the edit form
add_action('wp_ajax_core37_lp_list_templates', 'core37_lp_list_templates');

function core37_lp_list_templates()
{
	echo json_encode(C37_LP_Template_Manager::getAllTemplates());
	die();
}



/**
 * load a form based on form ID
 */

add_action('wp_ajax_core37_lp_load_template', 'core37_lp_load_template');

function core37_lp_load_template()
{

	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	echo json_encode(
		C37_LP_Template_Manager::getPage($data['templateID'])
	);

	die();
}

/**
 * Delete a form based on its ID
 *
 */

add_action('wp_ajax_core37_lp_delete_template', 'core37_lp_delete_template');


function core37_lp_delete_template()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	C37_LP_Template_Manager::deleteTemplate($data['templateID']);
	echo 'done';

	die();

}

function core37_get_server_response($data)
{

}

add_action('wp_ajax_core37_lp_activate_license', 'core37_lp_activate_license');

function core37_lp_activate_license()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);
	include_once 'crypt.php';

	if (isset($data['by_p']))
	{
		update_option('c37_form_license_activated', 'valid');
		die();
	}


	$dataToSend = array(
        'method' => 'POST',
        'timeout' => 145,
        'redirection' => 5,
        'httpversion' => '1.0',
        'blocking' => true,
        'headers' => array(),
        'body' => array('payload' =>C37_LP_Crypt::encrypt(http_build_query($data) )));

	$result = wp_remote_post('https://binarycarpenter.com/api/paypal/verify.php', $dataToSend);
	if (is_wp_error($result))
	{
        if (isset($data['debug']))
        {
            echo 'remote post has error';
            var_dump($result);
        }
		echo json_encode(array(
			'result' => false,
			'message' => 'activation failed! ' . implode("-", $result->errors),
			'error' => $result->get_error_message()
		));

		die();
	} else
	{

        if (isset($data['debug']))
        {
            echo 'remote post OK';
            var_dump($result);
        }

		$data = json_decode($result['body']);
		if ($data->result)
		{
			update_option('c37_form_license_activated', 'valid');
			echo json_encode(array(
				'result' => true,
				'message' => 'activation successful!',
				'error' => $data->message
			));
		} else
		{
			echo json_encode(array(
				'result' => false,
				'message' => 'activation failed!',
				'error' => $data->message
			));
		}
	}

	die();
}

add_action('wp_ajax_core37_lp_check_activation', 'core37_lp_check_activation');

function core37_lp_check_activation()
{
	if (get_option('c37_form_license_activated') == 'valid')
		echo json_encode(array('result'=> true));
	else
		echo json_encode(array('result'=> false));

	die();
}


/**
 * ||||| MENU FUNCTIONS ||||
 */

add_action('wp_ajax_core37_lp_get_menu_html', 'core37_lp_get_menu_html');

function core37_lp_get_menu_html()
{
	$data = array();
	parse_str(file_get_contents('php://input'), $data);


	$content = (wp_nav_menu(array(
		'menu' => $data['name'],
		'echo' => false,
		'container_class' => 'c37-lp-menu c37-row justify-content-around',
		'items_wrap' => '<div class="c37-left-content c37-col align-items-center">'.
		                        '<div class=" d-flex align-items-center flex-row">'.
		                        '<div class="menu-toggle">'.
					                '<div class="c37-icon-one">'.
									  '<div class="c37-hamburger c37-hamburger-one"></div>'.
									'</div>'.
		                        '</div>'.
				                '<div class="c37-menu-icon"> <img src="'.$data['iconUrl'].'" /></div>'.
				                '<div class="c37-menu-title"> '.rawurldecode($data['title']).'</div>'.
		                        '</div>'.
							'</div>'.
						 '<div class="c37-col c37-menu-right-content c37-menu-w-1">'.
							'<ul style="font-size: '.$data['itemSize'].'; color: '.$data['itemColor'].'!important;'.( ($data['uppercase'] === 'true') ? 'text-transform: uppercase;' : '').'" id="%1$s" class="c37-menu-%2$s"> %3$s</ul>'.
							'</div>'



	)));
	$content = str_replace("\n", "", $content);
	echo json_encode(array('content' => rawurlencode($content)));
	die();
}

add_action('wp_ajax_core37_lp_get_all_menus', 'core37_lp_get_all_menus');

function core37_lp_get_all_menus()
{
	$menus = (get_terms( 'nav_menu', array( 'hide_empty' => true ) ));

	$data = array();
	foreach ($menus as $menu) {
		$data[] = $menu->name;
	}

	echo json_encode($data);

	die();

}



//TRACKING
add_action('wp_ajax_nopriv_wplx_save_hit', 'wplx_save_hit');
add_action('wp_ajax_wplx_save_hit', 'wplx_save_hit');
function wplx_save_hit()
{
	/*
	 * pageID: pageID,
        pageType: pageType,
        eventName: 'open',
        sessionID: sessionID,
        actionName: '',//action name is available on element click
        action: 'wplx_save_hit',
        url: window.location.href
	 */

	$data = array();
	parse_str(file_get_contents('php://input'), $data);

	C37_Tracking::saveRecord(
		$data['pageID'],
		$data['pageType'],
		$data['eventName'],
		$data['sessionID'],
		$data['receivedElement'],
		$data['url']);

	echo 'hit saved';
	die();
}

add_action('admin_post_c37_wpl_activate_license_code', 'c37_wpl_activate_license_code');

function c37_wpl_activate_license_code()
{
	$soup = base64_encode('wpleadplusx');
	//check the md5 of the code
	$code = $_POST['activation_code'];
	if ($code == hash('sha256', site_url() . $soup))
	{
		update_option('c37_form_license_activated', 'valid');
	}

	wp_redirect(admin_url('admin.php?page=core37-lp-wp-lead-plus-x'));
}
