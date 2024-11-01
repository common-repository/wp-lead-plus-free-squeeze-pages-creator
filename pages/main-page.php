<div id="c37-lp-settings-page">
	<div id="settings-page-tabs">
		<ul class="tab-pills">
			<li><a href="#main">Main</a></li>
			<li><a href="#templates">Templates</a> </li>
			<li><a href="#settings">Settings</a> </li>
		</ul>
<script>
    var versionNangCap = <?php echo c37LpNangCap; ?>;
</script>
<!-- FREE VERSION-->
<?php if (!c37LpNangCap): ?>
		<div id="main">
			<h1>Thanks for using WP Lead Plus X</h1>
			<p>If you have any question, please send a message here: <a target="_blank" href="mailto:dat.tm24@gmail.com">contact us</a></p>
			<p>You can also find a list of tutorials of WP Lead Plus X <a target="_blank" href="https://www.youtube.com/playlist?list=PLlMUKQq5jx5_cSsO8Q_koMnYPWImyPlya">here</a></p>
			<p>This is a totally new version of WP Lead Plus. If you want to use the old version (which is no longer supported), please download it <a href="https://wpleadplus.com/archive/wp-lead-plus-free-squeeze-pages-creator.zip">here</a> and ignore all future updates.</p>
			<p>You can also find the instructions to re-install the old version <a href="https://youtu.be/5N-8epI90M0">here</a></p>

			<p>In case you need a really good autoresponder service, <a target="_blank" href="http://www.getresponse.com/index/datmt">GetResponse.com</a> is the perfect choice. <a target="_blank" href="http://www.getresponse.com/index/datmt">Get started for free here</a></p>
		</div>

		<div id="templates">
			<p>Pre-designed templates are available in the PRO version only. <a href="https://wpleadplus.com/?src=in-free-use-template">Please upgrade to use this feature</a></p>
		</div>
<?php else: ?>
<!--	END OF FREE	-->

<!--	PRO version-->



		<div id="main">
			<h1>Thanks for purchasing WP Lead Plus X</h1>
			<p>If you have any question, please send a message here: <a target="_blank" href="http://wpleadplus.com/contact-us/">contact us</a></p>
			<p>You can also find a list of tutorials of WP Lead Plus X <a target="_blank" href="https://www.youtube.com/playlist?list=PLlMUKQq5jx5_cSsO8Q_koMnYPWImyPlya">here</a></p>
		<p>In case you need a really good autoresponder service, <a target="_blank" href="http://www.getresponse.com/index/datmt">GetResponse.com</a> is a perfect choice. <a target="_blank" href="http://www.getresponse.com/index/datmt">Get started for free here</a></p>
			<div id="activation-area" class="<?php echo (get_option('c37_form_license_activated') == false ? '' : 'hidden'); ?>">
				<h1>Please activate your license</h1>
                <p>Select one of the methods below to activate your license</p>
                <div id="activation-options">
                    <ul class="tab-pills">
                        <li class="long-pill"><a href="#purchase-info">Activate using your purchase info</a></li>
                        <li class="long-pill"><a href="#activation-file">Activate using an activation code</a></li>
                    </ul>


                    <div id="purchase-info">
                        <label>How did you pay for the license?</label>

                        <input type="radio" name="payment-type" value="paypal" id="paypal-radio" /> via PayPal
                        <input type="radio" name="payment-type" value="clickbank" id="clickbank-radio" /> via Clickbank

                        <div class="hidden" id="clickbank">

                            <label>Email you used when making the purchase</label>
                            <input id="clickbank-purchase-email" type="text">

                            <label>Clickbank receipt number</label>
                            <input type="text" id="clickbank-receipt-number" />
                        </div>

                        <div class="hidden" id="paypal">
                            <label>Your PayPal email</label>
                            <input id="paypal-purchase-email" type="text">
                            <label>PayPal Transaction ID/Profile ID</label>
                            <input type="text" id="paypal-transaction-id" />

                            <small class="c37-alert c37-alert-info">Can't find your transaction ID? <a target="_blank" href="http://wpleadplus.com/services/lookup.php">click here</a></small>
                        </div>

                        <div>
                            <button id="activate-license">Activate license</button>
                        </div>
                    </div>
                    <div id="activation-file">
                        <p>Please use this url <strong style="display: inline-block; background: #c9ffd7; padding: 10px;"><?php echo site_url(); ?></strong> to put into the site URL field in the following form to get your site's license code</p>
                        <p><a target="_blank" href="https://wpleadplus.com/services/generate-license.php">Click here to get your license code</a></p>
                        <form enctype='multipart/form-data' method="post" action="<?php echo esc_url( admin_url('admin-post.php') ); ?>">
                            <input type="text" name="activation_code" placeholder="enter your activation code here"/>
                            <input type="hidden" name="action" value="c37_wpl_activate_license_code" />
                            <input type="hidden" name="request_url" value="<?php echo esc_url(admin_url('admin.php')) .'?page='. get_current_screen()->parent_base; ?>" />
                            <div></div>
                            <input type="submit" value="Activate license"/>
                        </form>
                    </div>
                </div>



			</div>

		</div>

		<div id="templates">
			<h3>Load templates</h3>
			<p>Please click the "Load templates" button to load all the templates come with this plugin</p>
			<div id="loading-notif" class="hidden">Importing templates. Please wait...</div>
			<button id="load-templates">Load templates</button>

			<h3>Load templates from file</h3>
			<p>If you acquire templates from files (someone exported it and share it to you), you can import them by uploading here</p>
			<form enctype='multipart/form-data' method="post" action="<?php echo esc_url( admin_url('admin-post.php') ); ?>">
				<input type="file" name="files_name[]"  accept=".tpl" multiple placeholder="select .tpl files" />
				<input type="hidden" name="action" value="c37_wpl_import_template" />
				<input type="hidden" name="request_url" value="<?php echo esc_url(admin_url('admin.php')) .'?page='. get_current_screen()->parent_base; ?>" />
				<div></div>
				<input type="submit" value="Import templates"/>
			</form>

		</div>

		<div>
			<?php if (isset($_GET['import']) && $_GET['import'] == 'success') {
				echo '<div class="updated notice is-dismissable"> The template(s) was successfully imported</div>';

			} ?>

		</div>

        <?php endif; ?>

<!--END OF PRO-->

		<div id="settings">
			<div>


			</div>


		</div>


	</div> <!-- end of tabs -->

</div>
