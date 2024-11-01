<?php include_once 'html/PopupManagerPage.php'?>
<div class="container">
    <div class="d-flex flex-row">
        <div class="c37-col-3">
            <button id="create-popup-option" class="c37-button c37-button-small c37-button-action c37-button-pill"><i class="fa fa-plus"></i> Create popup</button>
            <ul id="popup-list">

            </ul>
        </div>

        <div id="popup-options-container" class="c37-col-9"> <!-- popup options -->
            <div id="popup-options" class="d-flex flex-column"></div>

            <div  class="hidden"><img id="popup-buttons" src="<?php echo plugin_dir_url(__FILE__) . '../src/css/images/close-btn/all-buttons.png'  ?>" /></div>
        </div>

    </div>



</div>