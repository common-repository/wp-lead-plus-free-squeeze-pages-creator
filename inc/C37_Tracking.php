<?php

/**
 * Created by PhpStorm.
 * User: luis
 * Date: 20/07/17
 * Time: 14:14
 */
class C37_Tracking {

	const TBL_NAME = 'wplx_tracking';
	public static function saveRecord($pageID, $pageType, $eventName, $sessionID, $receivedElement, $url)
	{
		global $wpdb;
		$data = array(
			'page_id' => $pageID,
			'page_type' => $pageType,
			'event_name' => $eventName,
			'session_id' => $sessionID,
			'received_element' => $receivedElement,
			'url' => $url
		);

		$wpdb->insert($wpdb->prefix . self::TBL_NAME, $data);

	}

	public static function deleteRecord()
	{

	}

	public static function createDatabase()
	{
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();
		$table_name = $wpdb->prefix . self::TBL_NAME;


		/**
		 * page_id:
		 */
		$sql = "CREATE TABLE $table_name (
		  id int(9) NOT NULL AUTO_INCREMENT,
		  page_id INTEGER NOT NULL,
		  page_type VARCHAR(50) NOT NULL,
		  event_name VARCHAR(50) NOT NULL,
		  session_id VARCHAR(50) NOT NULL,
		  received_element VARCHAR(50) NOT NULL,
		  url varchar(55) DEFAULT '' NOT NULL,
		  time_occur TIMESTAMP default CURRENT_TIMESTAMP,
		  PRIMARY KEY  (id)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}


}