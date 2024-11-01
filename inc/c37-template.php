<?php
/**
 * Template Name: WP Lead Plus X Template
 * @package WP Lead Plus X
 */
	$pageID       = get_the_ID();
	$pageSettings = json_decode(get_post_meta($pageID, C37LPManager::C37_LP_META_PAGE_SETTINGS, true));
    $codes = $pageSettings->modelsJSON->page->codes;
    $pageCSSObject = $pageSettings->modelsJSON->page->cssStyle;
    $pageJSON = $pageSettings->modelsJSON->page;

?>

<!DOCTYPE html>
<html>
	<head>
        <?php

        //print meta codes here(meta desc, meta title og:... meta tags)

        if (isset($codes->metaCode))
        {
	        echo rawurldecode($codes->metaCode);
        }

        ?>
        <title><?php echo get_the_title(); ?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?php wp_head(); ?>

		<meta charset="UTF-8">
		<?php
		if (isset($codes->experimentCode))
		{
			echo rawurldecode($codes->experimentCode);
		}


		if (isset($pageSettings->webFonts))
		{
			foreach($pageSettings->webFonts as $font)
			{
				echo rawurldecode($font);
			}
		}
		?>


	<!-- include the css rules here-->
		<style>
			html, body {
				padding: 0 !important;
				margin: 0 !important;
                background-color: transparent !important;
                min-height: 100% !important;
                height: 100%;
			}

            #wpadminbar{
                display: none;
            }

            .c37-page-container {
                margin: 0;
                padding: 0;
                min-height: 100%;
                overflow: auto;
            }

		</style>

        <!--   style for page     -->

		<style>

			<?php
				if (isset($codes->customCSSCode))
				echo rawurldecode($codes->customCSSCode);
			 ?>
		</style>


<!--	Tracking code	-->
		<?php
		if (isset($pageSettings->modelsJSON->page->codes->trackingCode))
		{
			echo rawurldecode($pageSettings->modelsJSON->page->codes->trackingCode);
		}
		?>

		<?php
		if (get_post_type() == 'core37_lp' || get_post_type() == 'core37_lp_template')
		{
			echo '<meta name="robots" content="noindex, nofollow" />';
		}
		 ?>

        <style>
            body {
                position: relative;
            }
        </style>


	</head>

	<body data-page-id="<?php echo $pageID; ?>" >

    <?php
    //c37-has-yt-bg
    if (isset($pageCSSObject->videoBg) && $pageCSSObject->videoBg->src->yt!= "" && !wp_is_mobile())
    { ?>
        <div class="c37-background-video c37-video-bg has-video-bg c37-has-yt-bg">
            <div class="c37-yt-bg c37-hide-in-editor"><iframe allow="autoplay; fullscreen" src="https://www.youtube.com/embed/<?php echo $pageCSSObject->videoBg->src->yt; ?>?controls=0&mute=1&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=1&playlist=<?php echo $pageCSSObject->videoBg->src->yt; ?>" frameborder="0" allowfullscreen></iframe></div>
        </div>

    <?php }

    ?>
    <div class="c37-page-container" id="page-<?php echo $pageSettings->modelsJSON->page->cssID; ?>">
	<?php
	if (isset($codes->afterBodyOpening))
	{
		echo rawurldecode($codes->afterBodyOpening);
	}

//		$post = get_post($pageID);
//		echo do_shortcode(rawurldecode($post->post_content));
    echo do_shortcode(C37LPManager::getPageHTML($pageID));
	?>
<!--	Popup, if any -->
	<?php echo  C37LPManager::getPopupByElementsActions($pageID); ?>

	<script>
		<?php echo 'var ajaxurl = "' . admin_url('admin-ajax.php') . '";'; ?>
	</script>

	<script>
		<?php
            echo "var elementsActions = elementsActions || {};  elementsActions['". $pageJSON->cssID ."'] = ". json_encode((($pageSettings->elementsActions)));
            ?>
	</script>

	<?php
	if (isset($codes->beforeBodyClosing))
	{
		echo rawurldecode($codes->beforeBodyClosing);
	}
	?>

    </div>
    <?php wp_footer() ?>
	</body>

</html>