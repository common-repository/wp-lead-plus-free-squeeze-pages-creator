<script>
    var versionNangCap = <?php echo c37LpNangCap? 'true' : 'false'; ?>;
</script>
<script type="text/html" id="wplx-edit-widget-manager">

    <label>Widget option name</label>
    <input data-for="widget-name" type="text" value="<%=  optionName %>" />
    <div><label>Widget content</label></div>
    <div class="select">
        <select data-for="widget-content">
        </select>
        <div class="select__arrow"></div>
    </div>

    <div><label>Where to display?</label></div>
    <div class="d-flex flex-column">
        <label class="control control--radio"> Do not display (to use as shortcode only)
            <input <%= option.whereToDisplay.by == "none" ? "checked" : "" %> type="radio" name="where_to_display" value="none">
            <div class="control__indicator"></div>
        </label>

        <label class="control control--radio">Whole site
            <input <%= option.whereToDisplay.by == "whole_site" ? "checked" : "" %> type="radio" name="where_to_display" value="whole_site">
            <div class="control__indicator"></div>
        </label>

        <div class="<%= option.whereToDisplay.by == 'by_category' ? '': 'hidden' %>" id="category-option">
            <label>Select category</label>


            <div class="select">
                <select data-for="display-category" multiple="multiple"></select>
                <div class="select__arrow"></div>
            </div>
        </div>

    </div>

    <label>Widget alignment</label>
    <div class="d-flex flex-column">


        <label class="control control--radio">Left
            <input <%= option.alignment == "left" ? "checked" : "" %>  type="radio" name="alignment" value="left" />
            <div class="control__indicator"></div>
        </label>

        <label class="control control--radio">Center
            <input <%= option.alignment == "center" ? "checked" : "" %>  type="radio" name="alignment" value="center" />
            <div class="control__indicator"></div>
        </label>

        <label class="control control--radio">Right
            <input <%= option.alignment == "right" ? "checked" : "" %>  type="radio" name="alignment" value="right" />
            <div class="control__indicator"></div>
        </label>

    </div>

<!--    position on a particular page/post -->
    <label>Position on page/post</label>
    <label class="control control--radio">Top
        <input <%= option.positionOnPage.position == "top" ? "checked" : "" %>  type="radio" name="position_on_page" value="top" />
        <div class="control__indicator"></div>
    </label>
    <label class="control control--radio">Bottom
        <input <%= option.positionOnPage.position == "bottom" ? "checked" : "" %>  type="radio" name="position_on_page" value="bottom" />
        <div class="control__indicator"></div>
    </label>

    <label class="control control--radio"> After x paragraph
        <input <%= option.positionOnPage.position == "after_x_paragraph" ? "checked" : "" %>  type="radio" name="position_on_page" value="after_x_paragraph" />
        <div class="control__indicator"></div>
    </label>
    <div id="x-paragraph" class="<%= option.positionOnPage.position != 'after_x_paragraph' ? 'hidden' : '' %>">
        <input placeholder="number of paragraphs" name="paragraph_count"  type="number" value="<%= option.positionOnPage.paragraph %>" />
    </div>




    <div><button id="save-option" class="c37-child c37-button c37-button-small c37-button-primary">Save option</button></div>
</script>