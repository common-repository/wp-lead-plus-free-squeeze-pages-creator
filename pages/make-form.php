<script>
    var versionNangCap = <?php echo c37LpNangCap? 'true' : 'false'; ?>;
</script>
    <div id="form-general-settings" class="d-flex flex-row no-gutters">
        <div class="c37-col-4" id="logo"><span><i class="fa fa-envira"></i> WP LEAD PLUS X <sup>flex</sup></span></div>
	    <div class="c37-col-8 float-right">
		    <ul id="c37-top-menu">
                <input id="hide-section-menu" type="checkbox"> hide section menu
                <input id="dark-theme" type="checkbox" value="dark"> dark
			    <li id="c37-go-pro">
				    <a href="http://wpleadplus.com/?src=in-free-get-pro" target="_blank"><i class="fa fa-credit-card"></i> Get PRO</a>
			    </li>

			    <li id="preview-landing-page">
				    <a target="_blank"  href="#"><i class="fa fa-eye"></i> &nbsp;View Page</a>
			    </li>

			    <li>
				    <a id="open-page-settings" href="#"><i class="fa fa-gear"></i> &nbsp;Settings</a>
			    </li>

			    <li id="save-page" class="c37-drop-down">
				    <a id="save-page-button" class="c37-drop-down-button" href="#"><i class="fa fa-save"></i> &nbsp;Save as</a>
				    <ul id="save-page-options" class="c37-drop-down-menu">
					    <li>
						    <a href="#" id="save-as-page">Page</a>
					    </li>
					    <li>
						    <a href="#" id="save-as-custom-post">Custom post</a>
					    </li>
					    <li>
						    <a href="#" id="save-as-new-page">New page</a>
					    </li>

					    <li>
						    <a href="#" id="save-as-new-custom-post">New custom post</a>
					    </li>
				    </ul>
			    </li>

			    <li>
				    <a id="get-pages" href="#"><i class="fa fa-pencil"></i> &nbsp;Edit</a>
			    </li>

<!--			    <li>-->
<!--				    <a id="get-templates" href="#"><i class="fa fa-file"></i> &nbsp;Template</a>-->
<!--			    </li>-->

			    <li id="c37-extra" class="c37-drop-down">
				    <a class="c37-drop-down-button" href="#"><i class="fa fa-external-link-square"></i> &nbsp;Extra</a>
				    <ul class="c37-drop-down-menu">
	                    <li>
	                        <a id="get-templates" href="#"><i class="fa fa-file"></i> &nbsp;Template</a>
	                    </li>
					    <li>
						    <a href="<?php echo admin_url(); ?>" target="_blank"><i class="fa fa-dashboard"></i> &nbsp;Dashboard</a>
					    </li>

<!--					    <li>-->
<!--						    <a href="http://wpleadplus.com/contact-us/" target="_blank"><i class="fa fa-life-ring"></i> &nbsp;Support</a>-->
<!--					    </li>-->

					    <li id="c37-go-popup">
						    <a href="<?php echo admin_url('admin.php?page=core37-lp-wp-lead-plus-x-popup'); ?>" target="_blank"><i class="fa fa-clone"></i> &nbsp;Popups</a>
					    </li>

					    <li id="c37-go-widget">
						    <a href="<?php echo admin_url('admin.php?page=core37-lp-wp-lead-plus-x-widget'); ?>" target="_blank"><i class="fa fa-gears"></i> &nbsp;Widgets</a>
					    </li>
				    </ul>
			    </li>




		    </ul>

	    </div>
    </div>
    <div class="c37-builder c37-fb d-flex flex-row">
            <!--List of elements-->
            <!--data-original: if the element is on the panel or not-->
            <div  class="left-panel c37-col-2">
                <div class="drawer" id="elements-panel">

                    <div id="elements-list">
                        <ul id="element-tabs" class="d-flex flex-row justify-content-around">
                            <li class="c37-col" data-balloon="common elements" data-balloon-pos="right"><a href="#common-elements"><i class="fa fa-clone"></i></a></li>
                            <li class="c37-col" data-balloon="premium elements" data-balloon-pos="right"><a href="#premium-elements"><i class="fa fa-diamond"></i></a></li>
                            <li class="c37-col" data-balloon="wordpress related elements" data-balloon-pos="right"><a href="#wp-elements"><i class="fa fa-wordpress"></i></a></li>
                        </ul>
                        <div id="common-elements">
                            <div data-original="true" data-c37-type="section" class="c37-container-element">
                                <div data-balloon="Section, container of rows, outer most element" data-balloon-pos="right"><i class="fa fa-hdd-o"></i> <span class="icon-text">Section</span></div>
                            </div>
                            <div data-original="true" data-c37-type="row" class="c37-row-element">
                                <div data-balloon="Row, container of boxes" data-balloon-pos="right"><i class="fa fa-reorder"></i> <span class="icon-text">Row</span></div>
                            </div>

                            <div data-original="true" data-c37-type="paragraph" class="c37-lp-element c37-item-element">
                                <div data-balloon="Text element. You can put any kind of text here" data-balloon-pos="right"><i class="fa fa-edit"></i> <span class="icon-text">Paragraph</span></div>
                            </div>

                            <div data-original="true" data-c37-type="youtube" class="c37-lp-element c37-item-element">
                                <div data-balloon="YouTube video" data-balloon-pos="right"><i class="fa fa-youtube-play"></i> <span class="icon-text">YouTube Video</span></div>
                            </div>

                            <div data-original="true" data-c37-type="ul" class="c37-lp-element c37-item-element">
                                <div data-balloon="Unordered list" data-balloon-pos="right" ><i class="fa fa-list-ul"></i> <span class="icon-text">List</span></div>
                            </div>

                            <div data-original="true" data-c37-type="form_container" class="c37-lp-element c37-item-element">
                                <div data-balloon="Form container, you can put autoresponder code here" data-balloon-pos="right"><i class="fa fa-wpforms"></i> <span  class="icon-text">Form</span></div>
                            </div>

                            <div data-original="true" data-c37-type="image" class="c37-lp-element c37-item-element">
                                <div data-balloon="Image" data-balloon-pos="right"><i class="fa fa-image"></i> <span class="icon-text">Image</span></div>
                            </div>

                            <div data-c37-type="button" class="c37-lp-element c37-item-element">
                                <div data-balloon="Button" data-balloon-pos="right" data-original="true"><i class="fa fa-toggle-right"></i> <span class="icon-text">Button</span></div>
                            </div>

                            <div data-c37-type="image_link" class="c37-lp-element c37-item-element">
                                <div data-balloon="Image inside link" data-balloon-pos="right" data-original="true"><i class="fa fa-file-code-o"></i> <span class="icon-text">Image link</span></div>
                            </div>

                            <div data-original="true" data-c37-type="code" class="c37-lp-element c37-item-element">
                                <div data-balloon="Shortcode from other plugins, HTML code..." data-balloon-pos="right"><i class="fa fa-code"></i> <span class="icon-text">Code</span></div>
                            </div>

                            <div data-original="true" data-c37-type="line" class="c37-lp-element c37-item-element">
                                <div data-balloon="Horizontal line" data-balloon-pos="right"><i class="fa fa-angle-left"></i> <span class="icon-text">Line</span></div>
                            </div>

                            <div data-original="true" data-c37-type="simple_countdown" class="c37-lp-element c37-item-element">
                                <div data-balloon="Simple countdown timer" data-balloon-pos="right"><i class="fa fa-clock-o"></i> <span  class="icon-text">Simple countdown</span></div>
                            </div>


                        </div> <!-- common elements -->

                        <div id="premium-elements">
                            <div data-original="true" data-c37-type="other_videos" class="c37-premium-element c37-lp-element c37-item-element">
                                <div data-balloon="Vimeo and other video services" data-balloon-pos="right"><i class="fa fa-vimeo"></i> <span class="icon-text">Vimeo & Other</span></div>
                            </div>

                            <div data-original="true" data-c37-type="menu" class="c37-lp-element c37-item-element c37-premium-element">
                                <div data-balloon="Responsive menu" data-balloon-pos="right"><i class="fa fa-th-list"></i> <span class="icon-text">Menu</span></div>
                            </div>

                            <div data-original="true" data-c37-type="simple_navbar" class="c37-lp-element c37-item-element c37-premium-element">
                                <div data-balloon="Responsive one level nav bar" data-balloon-pos="right"><i class="fa fa-th-list"></i> <span class="icon-text">Simple navbar</span></div>
                            </div>

                            <div  data-original="true" data-c37-type="wall" class="c37-wall-element c37-premium-element">
                                <div data-balloon="Create layout for boxes" data-balloon-pos="right"><i class="fa fa-barcode"></i> <span class="icon-text">Wall</span></div>
                            </div>

                            <div data-original="true" data-c37-type="self_hosted_video" class="c37-lp-element c37-item-element c37-premium-element">
                                <div data-balloon="Self hosted video" data-balloon-pos="right"><i class="fa fa-video-camera"></i> <span  class="icon-text">Hosted Video</span></div>
                            </div>

                            <div data-original="true" data-c37-type="icon" class="c37-lp-element c37-item-element c37-premium-element">
                                <div data-balloon="Fontawesome icons" data-balloon-pos="right"><i class="fa fa-heart-o"></i> <span  class="icon-text">Icons</span></div>
                            </div>

<!--                            <div data-original="true" data-c37-type="image_sliders" class="c37-lp-element c37-item-element c37-premium-element">-->
<!--                                <div data-balloon="Image Sliders" data-balloon-pos="right"><i class="fa fa-laptop"></i> <span  class="icon-text">Image Sliders</span></div>-->
<!--                            </div>-->

<!--                            <div data-original="true" data-c37-type="slider" class="c37-lp-element c37-item-element c37-premium-element">-->
<!--                                <div data-balloon="Image slider" data-balloon-pos="right"><i class="fa fa-clone"></i> <span  class="icon-text">Slider</span></div>-->
<!--                            </div>-->

                        </div>

                        <div id="wp-elements">

                        </div>

                    </div>
                </div>

            </div>
            <!--Main builder-->
            <div id="construction-site" class="c37-col-8">
                <div id="<?php echo "c37-lp-" . rand(0,900000) ?>" style="width: 700px;" class="c37-lp c37-step">

                </div>
            </div>
			<!-- display the setting windows of current element -->
			<!-- options-window contains element settings, row settings, step settings, form
			settings, column settings-->
		    <div id="options-window" class="c37-hidden">

		    </div>
        <div class="c37-hidden" data-balloon="show elements panel" id="show-elements-panel" data-balloon-pos="right"><i  class="fa fa-eye"></i></div>

	        <div id="help-area">
		        <i id="help-area-close-icon" class="fa fa-chevron-up"></i>
		        <h4>Contact support</h4>
		        <p>If you have any questions, please <a href="http://wpleadplus.com/contact-us" target="_blank">send a message</a></p>
                <p>Whatsapp: +84942.906.209</p>

		        <h4>Quick start guide</h4>
		        <p>If you are new to WP Lead Plus X, please watch the videos below</p>
		        <p>
		            <ul>
			            <li><a href="https://www.youtube.com/watch?v=-V3KWL2VV-0" target="_blank">WP Lead Plus X quick start guide</a></li>
		            </ul>
		        </p>

	        </div>

            <div id="loading-screen" class="hidden">
                <h1>Processing your request...</h1>
                <img src="<?php echo admin_url('images/wpspin_light-2x.gif'); ?>" >
            </div>
        </div>

 <?php
 include_once 'html/Elements.php';
 include_once 'html/EditForms.php';

 ?>