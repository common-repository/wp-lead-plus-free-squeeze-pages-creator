<script>
    var versionNangCap = <?php echo c37LpNangCap? 'true' : 'false'; ?>;
</script>
<script type="text/html" id="wplx-edit-popup-manager">
    <% var option = typeof this.model.get("option") == "undefined" ? {} : this.model.get("option"); %>
    <label>Popup option name</label>
    <input data-for="popup-name" type="text" value="<%=  this.model.get("optionName") %>" />
    <label>Popup content</label>
    <div class="select">
        <select data-for="popup-content">
        </select>
        <div class="select__arrow"></div>
    </div>

    <label>Where to display?</label>
    <div class="select">
        <select data-for="where_to_display">
            <option <%= option.whereToDisplay.by == "none" ? "selected" : "" %> value="none">Do not display</option>
            <option <%= option.whereToDisplay.by == "whole_site" ? "selected" : "" %> value="whole_site"> Whole site</option>
            <option <%= option.whereToDisplay.by == "home_page_only" ? "selected" : "" %> value="home_page_only">Homepage only</option>
        </select>
        <div class="select__arrow"></div>
    </div>
    <div class='<%= option.whereToDisplay.by == "by_category" ? "": "hidden" %>' id="category-option">
        <label>Select category</label>
        <div class="select">
            <select data-for="display-category" multiple="multiple"></select>
            <div class="select__arrow"></div>
        </div>
    </div>

    <label>Position on page</label>

    <div class="select">
        <select data-for="position_on_page">
            <option <%= option.positionOnPage == "top_left" ? "selected" : "" %> value="top_left">top left</option>
            <option <%= option.positionOnPage == "top_right" ? "selected" : "" %> value="top_right">top right</option>
            <option <%= option.positionOnPage == "bottom_left" ? "selected" : "" %> value="bottom_left">bottom left</option>
            <option <%= option.positionOnPage == "bottom_right" ? "selected" : "" %> value="bottom_right">bottom right</option>
            <option <%= option.positionOnPage == "center" ? "selected" : "" %> value="center">center</option>
            <option <%= option.positionOnPage == "center-left" ? "selected" : "" %> value="center-left">center left</option>
            <option <%= option.positionOnPage == "center-right" ? "selected" : "" %> value="center-right">center right</option>
        </select>
        <div class="select__arrow"></div>
    </div>


    <label>Background cover the whole page</label>
    <label class="control control--checkbox c37-col-3">
        <input data-for="cover-whole-bg" type="checkbox" <%= option.coverWholeBg? 'checked' : '' %> />
        <div class="control__indicator"></div>
    </label>


    <label>How to show up?</label>
    <div class="select">
        <select data-for="show_up_trigger">
            <option <%= option.howToShowUp.trigger == "mouse_exits" ? "selected" : "" %> value="mouse_exits">Mouse exits page</option>
            <option <%= option.howToShowUp.trigger == "after_page_load" ? "selected" : "" %> value="after_page_load">After page load</option>
            <option <%= option.howToShowUp.trigger == "vertical_scroll" ? "selected" : "" %> value="vertical_scroll">After vertical scroll</option>
        </select>
        <div class="select__arrow"></div>
    </div>


    <div class="<%= option.howToShowUp.trigger == 'after_page_load' ? '' : 'hidden'  %>" id="delay-settings">
        <input class="inline" value="<%= option.howToShowUp.delay  %>"  data-for="page_load_delay" type="number" min="0" /> <em>seconds</em>
    </div>
    <div class='<%= option.howToShowUp.trigger == "vertical_scroll" ? "" : "hidden"  %>' id="vertical-scroll-settings">
        <input class="inline" value="<%=  option.howToShowUp.scroll.pixel %>" data-for="scroll_pixel" type="number" min="0" /> <em>px</em>
        <input class="inline" value="<%=  option.howToShowUp.scroll.element %>" data-for="scroll_element" placeholder="scroll element (optional)" type="text"/>
        <input class="inline" value="<%=  option.howToShowUp.scroll.scrollEventListener %>" data-for="scroll_event_listener" placeholder="scroll element listener(optional)" type="text"/>
    </div>

    <label>After close/submit</label>

    <div class="select">
        <select data-for="after_close">
            <option <%= option.afterClose.action == "keep_showing"? "selected" : "" %> value="keep_showing">Keep showing</option>
            <option <%= option.afterClose.action == "never_show"? "selected" : "" %> value="never_show">Never show again</option>
<!--            <option <%= option.afterClose.action == "show_again_in_next_session"? "selected" : "" %> value="show_again_in_next_session">Show in next session</option>-->
            <option <%= option.afterClose.action == "hide_x_day"? "selected" : "" %> value="hide_x_day">Show after X days</option>
        </select>
        <div class="select__arrow"></div>
    </div>

    <div class='<%= option.afterClose.action == "hide_x_day" ? "" : "hidden" %>' id="days-to-hide">
    <label>days to hide</label>
    <input value="<%= option.afterClose.daysToHide %>" data-for="days_to_hide" type="number"  />

    </div>
    <div class="hidden" id="advanced-options">

        <div class="d-flex flex-column">
            <% var closeBtn = typeof option.closeBtn == "undefined" ? {cssClass : "default", position: "outside"} : option.closeBtn %>
            <label>Close button style</label>
            <div class="select">
                <select data-for="close-btn-class">
                <option <%= closeBtn.cssClass == "c37-c0" ? "selected" : ""   %> >default</option>
                    <option <%= closeBtn.cssClass == "c37-c1" ? "selected" : ""   %> value="c37-c1" >1</option>
                    <option <%= closeBtn.cssClass == "c37-c2" ? "selected" : ""   %> value="c37-c2" >2</option>
                    <option <%= closeBtn.cssClass == "c37-c3" ? "selected" : ""   %> value="c37-c3" >3</option>
                    <option <%= closeBtn.cssClass == "c37-c4" ? "selected" : ""   %> value="c37-c4" >4</option>
                    <option <%= closeBtn.cssClass == "c37-c5" ? "selected" : ""   %> value="c37-c5" >5</option>
                    <option <%= closeBtn.cssClass == "c37-c6" ? "selected" : ""   %> value="c37-c6" >6</option>
                    <option <%= closeBtn.cssClass == "c37-c7" ? "selected" : ""   %> value="c37-c7" >7</option>
                    <option <%= closeBtn.cssClass == "c37-c8" ? "selected" : ""   %> value="c37-c8" >8</option>
                    <option <%= closeBtn.cssClass == "c37-c9" ? "selected" : ""   %> value="c37-c9" >9</option>
                    <option <%= closeBtn.cssClass == "c37-c10" ? "selected" : ""   %> value="c37-c10" >10</option>
                    <option <%= closeBtn.cssClass == "c37-c11" ? "selected" : ""   %> value="c37-c11" >11</option>
                    <option <%= closeBtn.cssClass == "c37-c12" ? "selected" : ""   %> value="c37-c12" >12</option>
                    <option <%= closeBtn.cssClass == "c37-c13" ? "selected" : ""   %> value="c37-c13" >13</option>
                    <option <%= closeBtn.cssClass == "c37-c14" ? "selected" : ""   %> value="c37-c14" >14</option>
                    <option <%= closeBtn.cssClass == "c37-c15" ? "selected" : ""   %> value="c37-c15" >15</option>
                    <option <%= closeBtn.cssClass == "c37-c16" ? "selected" : ""   %> value="c37-c16" >16</option>
                    <option <%= closeBtn.cssClass == "c37-c17" ? "selected" : ""   %> value="c37-c17" >17</option>
                    <option <%= closeBtn.cssClass == "c37-c18" ? "selected" : ""   %> value="c37-c18" >18</option>
                    <option <%= closeBtn.cssClass == "c37-c19" ? "selected" : ""   %> value="c37-c19" >19</option>
                </select>
                <div class="select__arrow"></div>
            </div>
            <label>Close button position</label>

            <label>Inside/outside</label>
            <div class="select">
                <select data-for="close-btn-position">
                    <option <%= closeBtn.position == "c37-cbtn-none" ? "selected" : ""   %> value="c37-cbtn-none">no button</option>
                    <option <%= closeBtn.position == "c37-cbtn-outside" ? "selected" : ""   %> value="c37-cbtn-outside">outside</option>
                    <option <%= closeBtn.position == "c37-cbtn-inside" ? "selected" : ""   %> value="c37-cbtn-inside">inside</option>
                </select>
                <div class="select__arrow"></div>
            </div>

            <label>At corner</label>
            <div class="select">
                <select data-for="close-btn-corner">
                    <option <%= closeBtn.corner == "c37-cbtn-corner-top-left" ? "selected" : ""   %> value="c37-cbtn-corner-top-left">top left</option>
                    <option <%= closeBtn.corner == "c37-cbtn-corner-top-right" ? "selected" : ""   %> value="c37-cbtn-corner-top-right">top right</option>
                    <option <%= closeBtn.corner == "c37-cbtn-corner-bottom-left" ? "selected" : ""   %> value="c37-cbtn-corner-bottom-left">bottom left</option>
                    <option <%= closeBtn.corner == "c37-cbtn-corner-bottom-right" ? "selected" : ""   %> value="c37-cbtn-corner-bottom-right">bottom right</option>
                </select>
                <div class="select__arrow"></div>
            </div>


            <a href="<?php echo plugin_dir_url(__FILE__) . '../../src/css/images/close-btn/all-buttons.png'  ?>" data-lity>view buttons</a>



        <label>Entrance animation</label>

        <% var animation = typeof option.animation == "undefined" ? "default" : option.animation %>
        <div class="select">
            <select data-for="animation">
                <option <%= animation == "default" ? "selected" : ""   %> value="default">default</option>
                <option <%= animation == "slide_in_left" ? "selected" : ""   %> value="slide_in_left">slide in left</option>
                <option <%= animation == "slide_in_right" ? "selected" : ""   %> value="slide_in_right">slide in right</option>
                <option <%= animation == "slide_in_bottom" ? "selected" : ""   %> value="slide_in_bottom">slide in bottom</option>
                <option <%= animation == "slide_in_top" ? "selected" : ""   %> value="slide_in_top">slide in top</option>
                <option <%= animation == "swoosh_left" ? "selected" : ""   %> value="swoosh_left">swoosh left</option>
                <option <%= animation == "swoosh_right" ? "selected" : ""   %> value="swoosh_right">swoosh right</option>
                <option <%= animation == "splash_left" ? "selected" : ""   %> value="splash_left">splash left</option>
                <option <%= animation == "splash_right" ? "selected" : ""   %> value="splash_right">splash right</option>
            </select>
            <div class="select__arrow"></div>
        </div>


        <label>Devices' visibility</label>
        <label class="control control--checkbox c37-col-3"> Hide on laptop/desktop
            <input data-for="hide-desktop" type="checkbox" <%= option.hideDesktop? 'checked' : '' %> />
            <div class="control__indicator"></div>
        </label>

        <label class="control control--checkbox c37-col-3"> Hide on mobile
            <input data-for="hide-mobile" type="checkbox" <%= option.hideMobile? 'checked' : '' %> />
            <div class="control__indicator"></div>
        </label>
    </div>

    </div>

    <span id="show-advanced-options" >Advanced options</span>
    <button id="save-option" class="c37-child c37-button c37-button-small c37-button-primary c37-button-rounded">Save option</button>

</script>