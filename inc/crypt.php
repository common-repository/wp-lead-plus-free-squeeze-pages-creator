<?php

class C37_LP_Crypt {

	
	public static function encrypt($string)
	{
		$pubKey = file_get_contents(plugins_url('inc/pub.key', dirname(__FILE__)));
		openssl_public_encrypt($string, $encrypted, $pubKey);
		return base64_encode($encrypted);
	}
}
