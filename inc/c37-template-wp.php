<?php
/**
 * Template Name: WP Lead Plus X Template
 * @package WP Lead Plus X
 */
$pageID       = get_the_ID();
$pageSettings = json_decode(get_post_meta($pageID, C37LPManager::C37_LP_META_PAGE_SETTINGS, true));

?>

<!DOCTYPE html>
<html>
<head>
	<?php wp_head(); ?>
	<meta charset="UTF-8">

	<?php
	if (isset($pageSettings->experimentCode))
	{
		echo rawurldecode($pageSettings->experimentCode);
	}


	if (isset($pageSettings->webFonts))
	{
		foreach($pageSettings->webFonts as $font)
		{
			echo rawurldecode($font);
		}
	}
	?>

	<title><?php echo get_the_title(); ?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- include the css rules here-->
	<style>
		body, html {
			padding: 0;
			margin: 0;
		}


		/*flipclock*/
		/* Get the bourbon mixin from http://bourbon.io */
		/* Reset */
		.flip-clock-wrapper * {
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			-ms-box-sizing: border-box;
			-o-box-sizing: border-box;
			box-sizing: border-box;
			-webkit-backface-visibility: hidden;
			-moz-backface-visibility: hidden;
			-ms-backface-visibility: hidden;
			-o-backface-visibility: hidden;
			backface-visibility: hidden;
		}

		.flip-clock-wrapper a {
			cursor: pointer;
			text-decoration: none;
			color: #ccc; }

		.flip-clock-wrapper a:hover {
			color: #fff; }

		.flip-clock-wrapper ul {
			list-style: none; }

		.flip-clock-wrapper.clearfix:before,
		.flip-clock-wrapper.clearfix:after {
			content: " ";
			display: table; }

		.flip-clock-wrapper.clearfix:after {
			clear: both; }

		.flip-clock-wrapper.clearfix {
			*zoom: 1; }

		/* Main */
		.flip-clock-wrapper {
			font: normal 11px "Helvetica Neue", Helvetica, sans-serif;
			-webkit-user-select: none; }

		.flip-clock-meridium {
			background: none !important;
			box-shadow: 0 0 0 !important;
			font-size: 36px !important; }

		.flip-clock-meridium a { color: #313333; }

		.flip-clock-wrapper {
			text-align: center;
			position: relative;
			width: 100%;
			margin: 1em;
		}

		.flip-clock-wrapper:before,
		.flip-clock-wrapper:after {
			content: " "; /* 1 */
			display: table; /* 2 */
		}
		.flip-clock-wrapper:after {
			clear: both;
		}

		/* Skeleton */
		.flip-clock-wrapper ul {
			position: relative;
			float: left;
			margin: 5px;
			width: 60px;
			height: 90px;
			font-size: 80px;
			font-weight: bold;
			line-height: 87px;
			border-radius: 6px;
			background: #000;
		}

		.flip-clock-wrapper ul li {
			z-index: 1;
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			line-height: 87px;
			text-decoration: none !important;
		}

		.flip-clock-wrapper ul li:first-child {
			z-index: 2; }

		.flip-clock-wrapper ul li a {
			display: block;
			height: 100%;
			-webkit-perspective: 200px;
			-moz-perspective: 200px;
			perspective: 200px;
			margin: 0 !important;
			overflow: visible !important;
			cursor: default !important; }

		.flip-clock-wrapper ul li a div {
			z-index: 1;
			position: absolute;
			left: 0;
			width: 100%;
			height: 50%;
			font-size: 80px;
			overflow: hidden;
			outline: 1px solid transparent; }

		.flip-clock-wrapper ul li a div .shadow {
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: 2; }

		.flip-clock-wrapper ul li a div.up {
			-webkit-transform-origin: 50% 100%;
			-moz-transform-origin: 50% 100%;
			-ms-transform-origin: 50% 100%;
			-o-transform-origin: 50% 100%;
			transform-origin: 50% 100%;
			top: 0; }

		.flip-clock-wrapper ul li a div.up:after {
			content: "";
			position: absolute;
			top: 44px;
			left: 0;
			z-index: 5;
			width: 100%;
			height: 3px;
			background-color: #000;
			background-color: rgba(0, 0, 0, 0.4); }

		.flip-clock-wrapper ul li a div.down {
			-webkit-transform-origin: 50% 0;
			-moz-transform-origin: 50% 0;
			-ms-transform-origin: 50% 0;
			-o-transform-origin: 50% 0;
			transform-origin: 50% 0;
			bottom: 0;
			border-bottom-left-radius: 6px;
			border-bottom-right-radius: 6px;
		}

		.flip-clock-wrapper ul li a div div.inn {
			position: absolute;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 200%;
			color: #ccc;
			text-shadow: 0 1px 2px #000;
			text-align: center;
			background-color: #333;
			border-radius: 6px;
			font-size: 70px; }

		.flip-clock-wrapper ul li a div.up div.inn {
			top: 0; }

		.flip-clock-wrapper ul li a div.down div.inn {
			bottom: 0; }

		/* PLAY */
		.flip-clock-wrapper ul.play li.flip-clock-before {
			z-index: 3; }

		.flip-clock-wrapper .flip {   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.7); }

		.flip-clock-wrapper ul.play li.flip-clock-active {
			-webkit-animation: asd 0.5s 0.5s linear both;
			-moz-animation: asd 0.5s 0.5s linear both;
			animation: asd 0.5s 0.5s linear both;
			z-index: 5; }

		.flip-clock-divider {
			float: left;
			display: inline-block;
			position: relative;
			width: 20px;
			height: 100px; }

		.flip-clock-divider:first-child {
			width: 0; }

		.flip-clock-dot {
			display: block;
			background: #323434;
			width: 10px;
			height: 10px;
			position: absolute;
			border-radius: 50%;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			left: 5px; }

		.flip-clock-divider .flip-clock-label {
			position: absolute;
			top: -1.5em;
			right: -86px;
			color: black;
			text-shadow: none; }

		.flip-clock-divider.minutes .flip-clock-label {
			right: -88px; }

		.flip-clock-divider.seconds .flip-clock-label {
			right: -91px; }

		.flip-clock-dot.top {
			top: 30px; }

		.flip-clock-dot.bottom {
			bottom: 30px; }

		@-webkit-keyframes asd {
			0% {
				z-index: 2; }

			20% {
				z-index: 4; }

			100% {
				z-index: 4; } }

		@-moz-keyframes asd {
			0% {
				z-index: 2; }

			20% {
				z-index: 4; }

			100% {
				z-index: 4; } }

		@-o-keyframes asd {
			0% {
				z-index: 2; }

			20% {
				z-index: 4; }

			100% {
				z-index: 4; } }

		@keyframes asd {
			0% {
				z-index: 2; }

			20% {
				z-index: 4; }

			100% {
				z-index: 4; } }

		.flip-clock-wrapper ul.play li.flip-clock-active .down {
			z-index: 2;
			-webkit-animation: turn 0.5s 0.5s linear both;
			-moz-animation: turn 0.5s 0.5s linear both;
			animation: turn 0.5s 0.5s linear both; }

		@-webkit-keyframes turn {
			0% {
				-webkit-transform: rotateX(90deg); }

			100% {
				-webkit-transform: rotateX(0deg); } }

		@-moz-keyframes turn {
			0% {
				-moz-transform: rotateX(90deg); }

			100% {
				-moz-transform: rotateX(0deg); } }

		@-o-keyframes turn {
			0% {
				-o-transform: rotateX(90deg); }

			100% {
				-o-transform: rotateX(0deg); } }

		@keyframes turn {
			0% {
				transform: rotateX(90deg); }

			100% {
				transform: rotateX(0deg); } }

		.flip-clock-wrapper ul.play li.flip-clock-before .up {
			z-index: 2;
			-webkit-animation: turn2 0.5s linear both;
			-moz-animation: turn2 0.5s linear both;
			animation: turn2 0.5s linear both; }

		@-webkit-keyframes turn2 {
			0% {
				-webkit-transform: rotateX(0deg); }

			100% {
				-webkit-transform: rotateX(-90deg); } }

		@-moz-keyframes turn2 {
			0% {
				-moz-transform: rotateX(0deg); }

			100% {
				-moz-transform: rotateX(-90deg); } }

		@-o-keyframes turn2 {
			0% {
				-o-transform: rotateX(0deg); }

			100% {
				-o-transform: rotateX(-90deg); } }

		@keyframes turn2 {
			0% {
				transform: rotateX(0deg); }

			100% {
				transform: rotateX(-90deg); } }

		.flip-clock-wrapper ul li.flip-clock-active {
			z-index: 3; }

		/* SHADOW */
		.flip-clock-wrapper ul.play li.flip-clock-before .up .shadow {
			background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.1) 0%, black 100%);
			background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0, 0, 0, 0.1)), color-stop(100%, black));
			background: linear, top, rgba(0, 0, 0, 0.1) 0%, black 100%;
			background: -o-linear-gradient(top, rgba(0, 0, 0, 0.1) 0%, black 100%);
			background: -ms-linear-gradient(top, rgba(0, 0, 0, 0.1) 0%, black 100%);
			background: linear, to bottom, rgba(0, 0, 0, 0.1) 0%, black 100%;
			-webkit-animation: show 0.5s linear both;
			-moz-animation: show 0.5s linear both;
			animation: show 0.5s linear both; }

		.flip-clock-wrapper ul.play li.flip-clock-active .up .shadow {
			background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.1) 0%, black 100%);
			background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0, 0, 0, 0.1)), color-stop(100%, black));
			background: linear, top, rgba(0, 0, 0, 0.1) 0%, black 100%;
			background: -o-linear-gradient(top, rgba(0, 0, 0, 0.1) 0%, black 100%);
			background: -ms-linear-gradient(top, rgba(0, 0, 0, 0.1) 0%, black 100%);
			background: linear, to bottom, rgba(0, 0, 0, 0.1) 0%, black 100%;
			-webkit-animation: hide 0.5s 0.3s linear both;
			-moz-animation: hide 0.5s 0.3s linear both;
			animation: hide 0.5s 0.3s linear both; }

		/*DOWN*/
		.flip-clock-wrapper ul.play li.flip-clock-before .down .shadow {
			background: -moz-linear-gradient(top, black 0%, rgba(0, 0, 0, 0.1) 100%);
			background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, black), color-stop(100%, rgba(0, 0, 0, 0.1)));
			background: linear, top, black 0%, rgba(0, 0, 0, 0.1) 100%;
			background: -o-linear-gradient(top, black 0%, rgba(0, 0, 0, 0.1) 100%);
			background: -ms-linear-gradient(top, black 0%, rgba(0, 0, 0, 0.1) 100%);
			background: linear, to bottom, black 0%, rgba(0, 0, 0, 0.1) 100%;
			-webkit-animation: show 0.5s linear both;
			-moz-animation: show 0.5s linear both;
			animation: show 0.5s linear both; }

		.flip-clock-wrapper ul.play li.flip-clock-active .down .shadow {
			background: -moz-linear-gradient(top, black 0%, rgba(0, 0, 0, 0.1) 100%);
			background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, black), color-stop(100%, rgba(0, 0, 0, 0.1)));
			background: linear, top, black 0%, rgba(0, 0, 0, 0.1) 100%;
			background: -o-linear-gradient(top, black 0%, rgba(0, 0, 0, 0.1) 100%);
			background: -ms-linear-gradient(top, black 0%, rgba(0, 0, 0, 0.1) 100%);
			background: linear, to bottom, black 0%, rgba(0, 0, 0, 0.1) 100%;
			-webkit-animation: hide 0.5s 0.3s linear both;
			-moz-animation: hide 0.5s 0.3s linear both;
			animation: hide 0.5s 0.2s linear both; }

		@-webkit-keyframes show {
			0% {
				opacity: 0; }

			100% {
				opacity: 1; } }

		@-moz-keyframes show {
			0% {
				opacity: 0; }

			100% {
				opacity: 1; } }

		@-o-keyframes show {
			0% {
				opacity: 0; }

			100% {
				opacity: 1; } }

		@keyframes show {
			0% {
				opacity: 0; }

			100% {
				opacity: 1; } }

		@-webkit-keyframes hide {
			0% {
				opacity: 1; }

			100% {
				opacity: 0; } }

		@-moz-keyframes hide {
			0% {
				opacity: 1; }

			100% {
				opacity: 0; } }

		@-o-keyframes hide {
			0% {
				opacity: 1; }

			100% {
				opacity: 0; } }

		@keyframes hide {
			0% {
				opacity: 1; }

			100% {
				opacity: 0; } }

	</style>

	<!--	new css code in page settings	-->
	<style>
		<?php
			if (isset($pageSettings->customCSSCode))
			echo rawurldecode($pageSettings->customCSSCode);
		 ?>
	</style>

	<style>

		<?php
			echo rawurldecode(get_post_meta($pageID, C37LPManager::C37_LP_META_PAGE_CUSTOM_CSS, true));

			if ($pageSettings->backgroundColor != '#fffffa'){
			?>
		body {
			background-color: <?php echo $pageSettings->backgroundColor; ?>;
		}
		<?php }

		echo rawurldecode(C37LPManager::getCSSCodeOfPopupsInElementsAction($pageID));
	 ?>


	</style>

	<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
	<!--	Tracking code	-->
	<?php
	if (isset($pageSettings->trackingCode))
	{
		echo rawurldecode($pageSettings->trackingCode);
	}
	?>

	<?php
	if (get_post_type() == 'core37_lp' || get_post_type() == 'core37_lp_template')
	{
		echo '<meta name="robots" content="noindex, nofollow" />';
	}
	?>
	<?php
	echo C37LPManager::getPageSettingsJSON($pageID);
	?>
</head>
<?php

//this function returns false, string or object
function checkHasVideoBG($bgData)
{
	if (!isset($bgData))
		return false;

	//for backward compatible, previously, $pageSettings->backgroundVideo if available, is a YT ID
	if (gettype($bgData) == 'string' && trim($bgData) != '')
		return $bgData;


	if (gettype($bgData) == 'object')
	{
		if ($bgData->type == 'youtube')
		{
			if (isset($bgData->source->yt) && ($bgData->source->yt != '') )
				return true;
		} else if ($bgData->type == 'self-hosted')
		{
			if (trim($bgData->source->mp4) != '' || trim($bgData->source->webm) != ''  || trim($bgData->source->ogv) != '' )
				return true;
		}
	}

	return false;
}

$hasImageBg = (isset($pageSettings->backgroundImage)) && ($pageSettings->backgroundImage != '');
$hasVideoBg = isset($pageSettings->backgroundVideo) ? checkHasVideoBG($pageSettings->backgroundVideo) : false;

$bgImageRepeat = (isset($pageSettings->backgroundRepeat)) && (trim($pageSettings->backgroundRepeat) != '');


?>
<body data-page-id="<?php echo $pageID; ?>" <?php if ($bgImageRepeat && $hasImageBg && $pageSettings->backgroundRepeat != "no-repeat") { echo 'style="background: url('.$pageSettings->backgroundImage.'); background-repeat: '.$pageSettings->backgroundRepeat.'  ";'; } ?>>
<?php
if (isset($pageSettings->afterBodyOpening))
{
	echo rawurldecode($pageSettings->afterBodyOpening);
}


?>


<?php
$post = get_post();

echo do_shortcode(rawurldecode($post->post_content));
?>
<!--	Popup, if any -->
<?php echo  C37LPManager::getPopupByElementsActions($pageID); ?>

<script>
	<?php echo 'var ajaxurl = "' . admin_url('admin-ajax.php') . '";'; ?>
</script>

<script src="<?php echo str_replace('inc/', '',plugin_dir_url(__FILE__)). 'js/frontend.min.js';  ?>"></script>
<script>

	var body = jQuery('body');

	<?php
	//only use video if wordpress is not viewed on mobile
	if ($hasVideoBg && !wp_is_mobile())
	{
	$bgVideo = $pageSettings->backgroundVideo;
	if (gettype($bgVideo) == 'string')
	{
	?>

	body.c47bg({type: 'youtube', container: "body", source: "<?php echo $bgVideo; ?>"});

	<?php
	} else if (gettype($bgVideo) == 'object')
	{
	if ($bgVideo->type == 'youtube')
	{ ?>
	body.c47bg({type: 'youtube', container: "body", source: "<?php echo $bgVideo->source->yt; ?>"});
	<?php
	} else
	{ ?>
	body.c47bg({type: 'self-hosted', container: "body", source: {'mp4': "<?php echo $bgVideo->source->mp4;  ?>", 'ogv' : "<?php echo $bgVideo->source->mp4;  ?>", 'webm' : "<?php echo $bgVideo->source->mp4;  ?>"} });
	<?php
	}
	}

	?>

	<?php
	} else if ($hasImageBg && !($bgImageRepeat && $pageSettings->backgroundRepeat !="no-repeat"))
	{ ?>
	body.c47bg({type: 'image', source: "<?php echo $pageSettings->backgroundImage; ?>", container: 'body'});

	<?php } ?>



	<?php echo "var elementsActions = elementsActions || {};  elementsActions['". (is_object($pageSettings) && property_exists($pageSettings, 'cssID') ? $pageSettings->cssID : '') ."'] = ". rawurldecode(get_post_meta($pageID, C37LPManager::C37_LP_META_ELEMENT_ACTIONS, true)); ?>

	setTimeout(function(){


		jQuery(window).trigger('resize');

	}, 1000);

	//apply video bg to individual page's element
	if (typeof pageSettings.videoBg == "object")
	{
		var keys = Object.keys(pageSettings.videoBg);
		_.each(keys, function(key){
			var singleElement = pageSettings.videoBg[key];
			if (singleElement.source !="")
			{
				console.log('video is: ' + singleElement.source);
				jQuery('#' + key).c47bg({container: 'div', type: singleElement.type, source: singleElement.source});
			}

		});

	}
</script>

<?php
if (isset($pageSettings->beforeBodyClosing))
{
	echo rawurldecode($pageSettings->beforeBodyClosing);
}
?>


<script>
	//create a tracking object to store all page ID and session ID
	var trackingObject = trackingObject || {};
	trackingObject['<?php $pageID ?>'] = sessionID;

	//create session ID to save all tracking in one session
	var sessionID = c37GenerateSessionID();



	//on page load, send hit
	jQuery(function(){
		c37TrackingPageOpen(<?php echo $pageID ?>, sessionID, 'page');

		//send event on unload
		jQuery(window).on('unload', function(){
			c37TrackingPageClose(<?php echo $pageID ?>, sessionID, 'page');
		});
	});


	//initialize the countdown, if any

</script>

<script>
	jQuery(function(){




		<?php
		if ( isset($pageSettings->flipCountdown) && is_object($pageSettings->flipCountdown))
		{
			echo "var countdown = " . json_encode($pageSettings->flipCountdown) . ";";

			echo "_.each(countdown, function(v, k, o){

					var clockData = o[k];
					var clock;
			        var clockDisplay = clockData['clockDisplay'];
			        var totalTime = parseInt(clockData['days']) * 3600 * 24 +
			            parseInt(clockData['hours']) * 3600 +
			            parseInt(clockData['minutes']) * 60 +
			            parseInt(clockData['seconds']);
			        var language = clockData['language'];

			        var element = jQuery('#'+clockData['editingElementID']);
			        clock = element.FlipClock({
			            clockFace: clockDisplay,
			            autoStart: false,
			            language: language,
			            countdown: true,
			            callbacks: {
			                stop: function() {
			                    console.log('heel');
			                }
			            }
			        });

			        clock.setTime(totalTime);
			        clock.setCountdown(true);
			        clock.start();


				})";




		}


		?>



		<?php
		if ( isset($pageSettings->simpleCountdown) && is_object($pageSettings->simpleCountdown))
		{

//				echo "(function(_){ ";
			echo "var countdown = " . json_encode($pageSettings->simpleCountdown) . ";";







			echo "_.each(countdown, function(v, k, o){

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


//				echo " })(_)";

		}


		?>

	});

</script>


<?php wp_footer(); ?>
</body>

</html>