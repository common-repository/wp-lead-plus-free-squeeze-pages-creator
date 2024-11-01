<script type="text/html" id="wplx-edit-border">
    <div class="section-header"><label  class="big">Border</label></div>
    <div class="css-styles">
        <div id="c37-border-settings">
                <div class="d-flex flex-row" >
                    <div class="c37-col">
                        <label for="">Style</label>
                        <div class="select">
                            <select data-for="border-style">
                                <option  <%= typeof cssStyle.desktop['border-style'] === "undefined" || cssStyle.desktop['border-style'] == "" ? "selected" : "" %>  value=""></option>
                                <option  <%= cssStyle.desktop['border-style'] == "none" ? "selected" : "" %>  value="none">none</option>
                                <option  <%= cssStyle.desktop['border-style'] == "solid" ? "selected" : "" %>  value="solid">solid</option>
                                <option  <%= cssStyle.desktop['border-style'] == "dashed" ? "selected" : "" %>  value="dashed">dashed</option>
                                <option  <%= cssStyle.desktop['border-style'] == "dotted" ? "selected" : "" %>  value="dotted">dotted</option>
                            </select>
                            <div class="select__arrow"></div>
                        </div>
                    </div>


                    <div class="c37-col">
                        <label for="">Color</label>
                        <input value="<%= cssStyle.desktop['border-color'] == null || cssStyle.desktop['border-color'] =='' ? '#fffffa' : cssStyle.desktop['border-color'] %>" type="color" data-for="border-color" />
                    </div>

                </div>
            <div class="d-flex flex-row align-items-center justify-content-around" >
                <div class="c37-col">
                    <label for="">Width</label>
                    <input value="<%= c37GetValue(cssStyle.desktop['border-width']) %>" type="text" data-for="border-width" />
                </div>
                <div class="c37-col">
                    <label for="">Radius</label>
                    <input value="<%= c37GetValue(cssStyle.desktop['border-radius']) %>" type="text" data-for="border-radius" />
                </div>

            </div>



            <div id="c37-border-width-settings" class="hidden separate-input c37-col">
                <div class="d-flex flex-row align-items-center  justify-content-around">
                    <input data-for="border-top-width" value="<%= cssStyle.desktop['border-top-width'] %>" type="text" class="top col"/>
                    <input data-for="border-right-width" value="<%= cssStyle.desktop['border-right-width'] %>" type="text" class="right col"/>
                    <input data-for="border-bottom-width" value="<%= cssStyle.desktop['border-bottom-width'] %>" type="text" class="bottom col"/>
                    <input data-for="border-left-width" value="<%= cssStyle.desktop['border-left-width'] %>" type="text" class="left col"/>
                </div>
            </div>

            <!--      border radius          -->
            <div id="c37-border-radius-settings" class="hidden separate-input c37-col">
                <div class="d-flex flex-row align-items-center  justify-content-around">
                    <input data-for="border-top-left-radius" value="<%= c37GetValue(cssStyle.desktop['border-top-left-radius']) %>" type="text" class="top left col"/>
                    <input data-for="border-top-right-radius" value="<%= c37GetValue(cssStyle.desktop['border-top-right-radius']) %>" type="text" class="top right col" />
                    <input data-for="border-bottom-left-radius" value="<%= c37GetValue(cssStyle.desktop['border-bottom-left-radius']) %>" type="text" class="bottom left col"/>
                    <input data-for="border-bottom-right-radius" value="<%= c37GetValue(cssStyle.desktop['border-bottom-right-radius']) %>" type="text" class="bottom right col"/>
                </div>
            </div>
        </div>
    </div>
</script>


<script type="text/html" id="wplx-edit-dimensions">
<div class="css-styles">
    <label for="" class="big">Width & Height</label>
    <div class="d-flex flex-row">
        <div class="c37-col">
            <label for="">Width</label>
            <input value="<%= c37GetValue(cssStyle.desktop['width']) %>" class="full" type="text" data-for="width">
        </div>
        <div class="c37-col">
            <label for="">Height</label>
            <input value="<%= c37GetValue(cssStyle.desktop['height']) %>" class="full" type="text" data-for="height">
        </div>
    </div>

    <div class="d-flex flex-row">
        <div class="c37-col">
            <label for="">Max Width</label>
            <input value="<%= c37GetValue(cssStyle.desktop['max-width']) %>" class="full" type="text" data-for="max-width">
        </div>

        <div class="c37-col">
            <label for="">Max Height</label>
            <input value="<%= c37GetValue(cssStyle.desktop['max-height']) %>" class="full" type="text" data-for="max-height">
        </div>

    </div>
</div>
</script>

<script type="text/html" id="wplx-edit-margin">

        <div class="section-header"><label class="big">Margin</label></div>
        <div class="css-styles" id="c37-margin-padding-settings">
            <div id="margin-tab" class="responsive-tabs">
                <ul class="d-flex flex-row align-items-center  justify-content-around responsive-devices">
                    <li class="c37-col"><a href="#c37-margin-desktop-settings"><i class="fa fa-desktop"></i></a></li>
                    <li class="c37-col"><a href="#c37-margin-tablet-settings"><i class="fa fa-tablet"></i></a></li>
                    <li class="c37-col"><a href="#c37-margin-phone-settings"><i class="fa fa-mobile-phone"></i></a></li>
                </ul>

                <div id="c37-margin-desktop-settings" data-for="margin">
                    <div class="d-flex flex-row align-items-center  justify-content-around separate-input" >
                        <input value="<%= c37GetValue(cssStyle.desktop['margin-top']) %>" type="text" class="top"/>
                        <input value="<%= c37GetValue(cssStyle.desktop['margin-right']) %>" type="text" class="right"/>
                        <input value="<%= c37GetValue(cssStyle.desktop['margin-bottom']) %>" type="text" class="bottom"/>
                        <input value="<%= c37GetValue(cssStyle.desktop['margin-left']) %>" type="text" class="left"/>
                    </div>
                </div>

                <div id="c37-margin-tablet-settings" data-for="margin-tablet">
                    <div class="d-flex flex-row align-items-center  justify-content-around separate-input" >
                        <input value="<%= c37GetValue(cssStyle.tablet['margin-top']) %>" type="text" class="top"/>
                        <input value="<%= c37GetValue(cssStyle.tablet['margin-right']) %>" type="text" class="right"/>
                        <input value="<%= c37GetValue(cssStyle.tablet['margin-bottom']) %>" type="text" class="bottom"/>
                        <input value="<%= c37GetValue(cssStyle.tablet['margin-left']) %>" type="text" class="left"/>
                    </div>
                </div>


                <div id="c37-margin-phone-settings" data-for="margin-phone separate-input">
                    <div class="d-flex flex-row align-items-center  justify-content-around" >
                        <input value="<%= c37GetValue(cssStyle.phone['margin-top']) %>" type="text" class="top"/>
                        <input value="<%= c37GetValue(cssStyle.phone['margin-right']) %>" type="text" class="right"/>
                        <input value="<%= c37GetValue(cssStyle.phone['margin-bottom']) %>" type="text" class="bottom"/>
                        <input value="<%= c37GetValue(cssStyle.phone['margin-left']) %>" type="text" class="left"/>
                    </div>
                </div>

            </div>
        </div>
            <div class="section-header"><label  class="big">Padding</label></div>

            <div class="css-styles responsive-tabs" id="padding-tab">
                <ul class="d-flex flex-row align-items-center  justify-content-around responsive-devices separate-input">
                    <li class="c37-col"><a href="#c37-padding-desktop-settings"><i class="fa fa-desktop"></i></a></li>
                    <li class="c37-col"><a href="#c37-padding-tablet-settings"><i class="fa fa-tablet"></i></a></li>
                    <li class="c37-col"><a href="#c37-padding-phone-settings"><i class="fa fa-mobile-phone"></i></a></li>
                </ul>


                <div id="c37-padding-desktop-settings" data-for="padding" >
                    <div class="d-flex flex-row align-items-center  justify-content-around separate-input" >
                        <input value="<%= c37GetValue(cssStyle.desktop['padding-top']) %>" type="text" class="top col"/>
                        <input value="<%= c37GetValue(cssStyle.desktop['padding-right']) %>" type="text" class="right col"/>
                        <input value="<%= c37GetValue(cssStyle.desktop['padding-bottom']) %>" type="text" class="bottom col"/>
                        <input value="<%= c37GetValue(cssStyle.desktop['padding-left']) %>" type="text" class="left col"/>
                    </div>
                </div>

                <div id="c37-padding-tablet-settings" data-for="padding-tablet">
                    <div class="d-flex flex-row align-items-center  justify-content-around separate-input " >
                        <input value="<%= c37GetValue(cssStyle.tablet['padding-top']) %>" type="text" class="top col"/>
                        <input value="<%= c37GetValue(cssStyle.tablet['padding-right']) %>" type="text" class="right col"/>
                        <input value="<%= c37GetValue(cssStyle.tablet['padding-bottom']) %>" type="text" class="bottom col"/>
                        <input value="<%= c37GetValue(cssStyle.tablet['padding-left']) %>" type="text" class="left col"/>
                    </div>
                </div>


                <div id="c37-padding-phone-settings" data-for="padding-phone">
                    <div class="d-flex flex-row align-items-center  justify-content-around separate-input" >
                        <input value="<%= c37GetValue(cssStyle.phone['padding-top']) %>" type="text" class="top col"/>
                        <input value="<%= c37GetValue(cssStyle.phone['padding-right']) %>" type="text" class="right col"/>
                        <input value="<%= c37GetValue(cssStyle.phone['padding-bottom']) %>" type="text" class="bottom col"/>
                        <input value="<%= c37GetValue(cssStyle.phone['padding-left']) %>" type="text" class="left col"/>
                    </div>
                </div>

            </div>

</script>

<script type="text/html" id="wplx-edit-element-width">

</script>






<script type="text/html" id="advanced-area">
    <span  class="<%= versionNangCap? 'hidden' : '' %>" >This feature allow you to implement custom CSS and classes and is available in PRO version only. <a href="http://wpleadplus.com/?src=wp-editor-advanced-area" target="_blank">Click here</a> to upgrade</span>
    <div class="advanced-area <%= versionNangCap? '' : 'hidden' %>">
        <label class="full">Element ID</label>
        <input type="text" disabled class="full" value="<%= editingElementID %>">
        <label class="full">Extra classes</label>
        <input  class="full" type="text" value="<%= cssStyle.extraClasses %>" data-for="extra-classes" placeholder="enter extra classes here, separate by space" />
        <label class="full">Inner selector</label>
        <input  class="full" type="text" value="<%= cssStyle.innerSelector %>" data-for="inner-selector" placeholder="CSS selector for inner element, class should start with . " />
        <label  class="full">Custom CSS</label>
        <textarea  class="full" data-for="custom-css" placeholder="Enter your custom CSS for this element here, with full selectors"><%= decodeURIComponent(cssStyle.customCSS) %></textarea>
    </div>
</script>

<script type="text/html" id="wplx-edit-background">
    <div class="section-header"><label class="big">Background</label></div>
    <div class="css-styles">
        <div id="c37-background-settings">
            <div id="c37-bg-options">
                <ul class="d-flex flex-row justify-content-around">
                    <li class="c37-col"><a href="#c37-bg-color"><i class="fa fa-paint-brush"></i> Color</a></li>
                    <li class="c37-col"><a href="#c37-bg-image"><i class="fa fa-picture-o"></i> Image</a></li>
                    <li class="c37-col"><a href="#c37-bg-video"><i class="fa fa-video-camera"></i> Video</a></li>
                </ul>

                <div id="c37-bg-color">
                    <div  class="d-flex flex-row justify-content-around">
                        <div class="c37-col">
                            <label for="">Color</label>
                            <input type="color" data-for="background-color" value="<%= typeof cssStyle.desktop['background-color'].color === 'undefined' || cssStyle.desktop['background-color'].color === '' ? '#fffffa' : cssStyle.desktop['background-color'].color  %>" >
                            <div  data-balloon="clear color" data-balloon-pos="right"><i data-for="clear-bg-color" class="fa fa-hand-paper-o reset-color"></i></div>
                        </div>
                        <div class="c37-col">
                            <label for="">Opacity(0-100)</label>
                            <span <%= !versionNangCap? 'data-balloon="available in pro version only"' : '' %>><input <%= !versionNangCap? 'disabled' : '' %> type="number" min="0" max="100" value="<%= cssStyle.desktop['background-color'].opacity %>" data-for="background-opacity"></span>
                        </div>
                    </div>

                </div>

                <div id="c37-bg-image"  data-for="background-image">
                    <div class="d-flex flex-column c37-col">
                        <img src="<%= cssStyle.desktop['background-image'] %>" id="background-image-preview" class="c37-image-preview" />
                        <label>Pick an image</label>
                        <div class="d-flex flex-row">
                            <i href="#" id="change-background-image" class="fa fa-folder-open c37-image-picker"></i>
                            <i href="#" id="remove-background-image" class="fa fa-close"></i>
                        </div>

                    </div>
                    <div class="d-flex flex-row justify-content-around">

                        <div class="c37-col d-flex flex-column">
                            <label>Repeat</label>
                            <div class="select">
                                <select data-for="background-repeat" class="full">
                                    <option <%= cssStyle.desktop['background-repeat'] == "no-repeat" ? "selected" : "" %> value="no-repeat">no repeat</option>
                                    <option <%= cssStyle.desktop['background-repeat'] == "repeat" ? "selected" : "" %> value="repeat">repeat</option>
                                    <option <%= cssStyle.desktop['background-repeat'] == "repeat-x" ? "selected" : "" %> value="repeat-x">repeat x</option>
                                    <option <%= cssStyle.desktop['background-repeat'] == "repeat-y" ? "selected" : "" %> value="repeat-y">repeat y</option>
                                </select>
                                <div class="select__arrow"></div>
                            </div>
                        </div>

                        <div class="c37-col d-flex flex-column">
                            <label>Size</label>
                            <div class="select">
                                <select data-for="background-size" class="full">
                                    <option <%= cssStyle.desktop['background-size'] == "" ? "selected" : "" %> value=""></option>
                                    <option <%= cssStyle.desktop['background-size'] == "auto" ? "selected" : "" %> value="auto">auto</option>
                                    <option <%= cssStyle.desktop['background-size'] == "cover" ? "selected" : "" %> value="cover">cover</option>
                                    <option <%= cssStyle.desktop['background-size'] == "contain" ? "selected" : "" %> value="contain">contain</option>
                                    <option <%= cssStyle.desktop['background-size'] == "initial" ? "selected" : "" %> value="initial">initial</option>
                                    <option <%= cssStyle.desktop['background-size'] == "inherit" ? "selected" : "" %> value="inherit">inherit</option>
                                </select>
                                <div class="select__arrow"></div>
                            </div>
                        </div>
                    </div>


                    <div class="c37-col"><label>Background position</label></div>

                    <div class="responsive-tabs c37-col">
                        <ul class="d-flex flex-row align-items-center  justify-content-around responsive-devices">
                            <li class="c37-col"><a href="#c37-bg-position-desktop-settings"><i class="fa fa-desktop"></i></a></li>
                            <li class="c37-col"><a href="#c37-bg-position-tablet-settings"><i class="fa fa-tablet"></i></a></li>
                            <li class="c37-col"><a href="#c37-bg-position-phone-settings"><i class="fa fa-mobile-phone"></i></a></li>
                        </ul>

                        <div id="c37-bg-position-desktop-settings">
                            <div class="d-flex flex-row justify-content-around no-gutters separate-input">
                                <div class="c37-col">
                                    <input class="left" value="<%= typeof cssStyle.desktop['background-position-x'] == 'undefined'? 0: cssStyle.desktop['background-position-x'] %>" placeholder="%,px,..." type="text" data-for="background-position-x">
                                </div>
                                <div class="c37-col">
                                    <input class="top" value="<%= typeof cssStyle.desktop['background-position-y'] == 'undefined'? 0: cssStyle.desktop['background-position-y'] %>" placeholder="%,px,..." type="text" data-for="background-position-y">
                                </div>
                            </div>
                        </div>

                        <div id="c37-bg-position-tablet-settings">
                            <div class="d-flex flex-row justify-content-around  no-gutters separate-input">
                                <div class="c37-col">
                                    <input class="left" value="<%= typeof cssStyle.desktop['background-position-x'] == 'undefined'? 50: cssStyle.desktop['background-position-x'] %>" placeholder="%,px,..." type="text" data-for="background-position-x">
                                </div>
                                <div class="c37-col">
                                    <input class="top" value="<%= typeof cssStyle.desktop['background-position-y'] == 'undefined'? 50: cssStyle.desktop['background-position-y'] %>" placeholder="%,px,..." type="text" data-for="background-position-y">
                                </div>
                            </div>
                        </div>

                        <div id="c37-bg-position-phone-settings">
                            <div class="d-flex flex-row justify-content-around  no-gutters separate-input">
                                <div class="c37-col">
                                    <input class="left" value="<%= typeof cssStyle.desktop['background-position-x'] == 'undefined'? 50: cssStyle.desktop['background-position-x'] %>" placeholder="%,px,..." type="text" data-for="background-position-x">
                                </div>
                                <div class="c37-col">
                                    <input class="top" value="<%= typeof cssStyle.desktop['background-position-y'] == 'undefined'? 50: cssStyle.desktop['background-position-y'] %>" placeholder="%,px,..." type="text" data-for="background-position-y">
                                </div>
                            </div>
                        </div>
                    </div>



                    <div class="d-flex flex-column c37-col">
                        <label>Background attachment</label>
                        <div class="d-flex flex-row">
                                <div class="select full">
                                    <select data-for="background-attachment" class="full">
                                        <option <%= cssStyle.desktop['background-attachment'] == "" ? "selected" : "" %> value=""></option>
                                        <option <%= cssStyle.desktop['background-attachment'] == "fixed" ? "selected" : "" %> value="fixed">fixed</option>
                                        <option <%= cssStyle.desktop['background-attachment'] == "scroll" ? "selected" : "" %> value="scroll">scroll</option>

                                    </select>
                                    <div class="select__arrow"></div>
                                </div>
                        </div>
                    </div>

                    <div class="d-flex flex-row">
                        <div class="c37-col">
                            <label>Overlay color</label>
                            <input type="color" data-for="background-overlay-color" value="<%= typeof cssStyle.desktop['background-overlay'].color ==='undefined' || cssStyle.desktop['background-overlay'].color===''? '#fffffa' : cssStyle.desktop['background-overlay'].color  %>"  />
                        </div>

                        <div class="c37-col">
                            <label for="">Overly opacity</label>
                            <input type="number" min="0" max="100" data-for="background-overlay-opacity" value="<%= c37GetValue(cssStyle.desktop['background-overlay'].opacity) %>" >
                        </div>

                    </div>




                </div>

                <div id="c37-bg-video">
                    <input class="c37-premium-feature full" <%= !versionNangCap? "disabled" :"" %> type="text" value="<%= cssStyle.videoBg.src.yt || ''  %>" data-for="background-video-youtube" placeholder="place your youtube video URL here" />
                </div>
                <div class="clearfix"></div>
            </div>
        </div></div>
</script>

<script type="text/html" id="wplx-edit-text-color">
    <div class="section-header"><label class="big">Text</label></div>
    <div class="css-styles">
        <div data-for="text" class="d-flex flex-column">
            <div class="d-flex flex-row">
                <div class="c37-col-4 d-flex flex-column">
                    <label>Color</label>
                    <input data-for="text-color" type="color" value="<%= cssStyle.desktop["color"] == null || cssStyle.desktop['color'] =='' ? "#fffffa" : cssStyle.desktop['color'] %>">
                    <i data-for="clear-text-color" class="fa fa-hand-paper-o reset-color"></i>
                </div>


                <div class="c37-col-8 d-flex flex-column">
                    <label>Font style</label>
                    <div class="d-flex flex-row justify-content-around">
                        <label class="control control--checkbox c37-col-3">Bold
                            <input type="checkbox" data-for="font-bold" <%= cssStyle.desktop["font-weight"] == "bold" ? "checked" : "" %>>
                            <div class="control__indicator"></div>
                        </label>
                        <label class="control control--checkbox">Italic
                            <input type="checkbox" data-for="font-italic" <%= cssStyle.desktop["font-style"] == "italic" ? "checked" : "" %>>
                            <div class="control__indicator"></div>
                        </label>
                    </div>

                </div>

            </div>



            <div class="row">
                <div class="c37-col">
                    <label>Text size </label>
                    <div id="text-size">
                        <ul class="d-flex flex-row responsive-devices">
                            <li class="c37-col"><a href="#text-size-desktop"><i class="fa fa-desktop"></i></a></li>
                            <li class="c37-col"><a href="#text-size-tablet"><i class="fa fa-tablet"></i></a></li>
                            <li class="c37-col"><a href="#text-size-phone"><i class="fa fa-mobile-phone"></i></a></li>
                        </ul>

                        <div id="text-size-desktop">
                            <input class="full" placeholder="on big screen" data-for="font-size" type="text" value="<%= cssStyle.desktop['font-size'] %>" />
                        </div>
                        <div id="text-size-tablet">
                            <input class="full" placeholder="on tablet" type="text" value="<%= cssStyle.tablet['font-size'] %>" />
                        </div>
                        <div id="text-size-phone">
                            <input class="full" placeholder="on phone"  type="text" value="<%= cssStyle.phone['font-size'] %>" />
                        </div>

                    </div>

                </div>
            </div>



        </div>

    </div>
</script>

<script type="text/html" id="wplx-edit-action-area">
    <% var action = core37Page.pageSettings.elementsActions[editingElementID]  || {}  %>
    <div class="element-action d-flex flex-column">
            <label>Trigger</label>
            <div class="select" data-for="trigger">
                <select class="full">
                    <option value="no-trigger"></option>
                    <option <%= action.trigger == "click" ? "selected" : "" %> value="click">On this element click</option>
                </select>
                <div class="select__arrow"></div>
            </div>

            <label>Action</label>
            <div class="select" data-for="action">
                <select class="full">
                    <option  value="do-nothing"></option>
                    <option <%= action.action=="open-link" ? "selected" : "" %> value="open-link">Open Link</option>
                    <option <%= action.action=="submit-form" ? "selected" : "" %> value="submit-form">Submit form</option>
                    <option <%= action.action=="close-popup" ? "selected" : "" %> value="close-popup">Close popup</option>
                    <option <%= action.action=="open-popup" ? "selected" : "" %> value="open-popup">Open popup</option>
                </select>
                <div class="select__arrow"></div>
            </div>


            <div <%= action.action == "open-link" ? "" : 'class="hidden"' %> data-for="target-url">
                <label>Target URL</label>
                <input class="full" type="text" value="<%= action.action== 'open-link'? action.target : '' %>" placeholder="http://your-link.com/">

                <label class="control control--checkbox">new tab
                    <input class="full" type="checkbox" <%= action["new-tab"]? "checked" : "" %> />
                    <div class="control__indicator"></div>
                </label>
            </div>

            <div data-for="target-popup"  <%= action.action == "open-popup" ? "" : 'class="hidden"' %>>
                <label>Popup to open</label>
                <div class="select full">
                    <select class="full"></select>
                    <div class="select__arrow"></div>
                </div>
            </div>

    </div>

</script>


<script type="text/html" id="wplx-edit-self-hosted-video">
    <div id="hosted-video-options" class="d-flex flex-column">
        <label>Video sources</label>
        <label for="mp4">MP4</label>
        <input id="mp4" type="url" class="full" value="<%= mp4 %>" placeholder="enter mp4 file url here" />
        <label for="webm">WEBM</label>
        <input id="webm" type="url"  class="full" value="<%=  webm %>" placeholder="enter webm file url here" />
        <label for="ogv">OGV</label>
        <input id="ogv" type="url"  class="full" value="<%=  ogv  %>" placeholder="enter ogv file url here" />
        <label>Options</label>
        <div class="d-flex flex-row">
            <label class="control control--checkbox c37-col">autoplay
                <input id="autoplay" type="checkbox" <%=  autoplay ? "checked" : "" %> />
                <div class="control__indicator"></div>
            </label>

            <label class="control control--checkbox  c37-col">muted
                <input id="muted" type="checkbox" <%= muted ? "checked" : "" %> />
                <div class="control__indicator"></div>
            </label>
        </div>

        <div class="d-flex flex-row">
            <label class="control control--checkbox  c37-col">show controls
                <input id="controls" type="checkbox" <%=  controls ?  "checked"  : "" %> />
                <div class="control__indicator"></div>
            </label>

            <label class="control control--checkbox  c37-col">loop
                <input id="loop" type="checkbox" <%= loop ? "checked" : "" %> />
                <div class="control__indicator"></div>
            </label>
        </div>









        <label for="video-poster">Poster image</label>
        <input id="video-poster" type="url" <%= poster %> />

    </div>
</script>


<script type="text/html" id="wplx-edit-simple-navbar">
    <label>Brand</label>
    <input data-for="nav-brand" value="<%= brand  %>" type="text"></input>
    <label>Items</label>
    <textarea id="nav-editor"></textarea>
</script>

<script type="text/html" id="wplx-edit-simple-navbar-style-options">
    <div class="section-header">
        <label class="big">Navbar color</label>
    </div>
    <div class="select full">
        <select data-for="nav-color">
        <option value=""></option>
        <option <%= color == ""? "selected" : "" %>  value="">None</option>
        <option <%= color == "luxbar-menu-material-amber"? "selected" : "" %>  value="luxbar-menu-material-amber">Amber</option>
        <option <%= color == "luxbar-menu-material-dark"? "selected" : "" %>  value="luxbar-menu-material-dark">Dark</option>
        <option <%= color == "luxbar-menu-material-light"? "selected" : "" %>  value="luxbar-menu-material-light">Light</option>
        <option <%= color == "luxbar-menu-material-red"? "selected" : "" %>  value="luxbar-menu-material-red">Red</option>
        <option <%= color == "luxbar-menu-material-indigo"? "selected" : "" %>  value="luxbar-menu-material-indigo">Indigo</option>
        <option <%= color == "luxbar-menu-material-cyan"? "selected" : "" %>  value="luxbar-menu-material-cyan">Cyan</option>
        <option <%= color == "luxbar-menu-material-green"? "selected" : "" %>  value="luxbar-menu-material-green">Green</option>
        <option <%= color == "luxbar-menu-material-brown"? "selected" : "" %>  value="luxbar-menu-material-brown">Brown</option>
        <option <%= color == "luxbar-menu-material-bluegrey"? "selected" : "" %>  value="luxbar-menu-material-bluegrey">Blue grey</option>
        </select>
        <div class="select__arrow"></div>
    </div>

    <div class="section-header">
        <label class="big">Navbar style</label>
    </div>
    <div class="select full">
        <select data-for="nav-style"> 
        <option value=""></option>
        <option <%= style == "luxbar-default"? "selected" : "" %>  value="luxbar-default">Default</option>
        <option <%= style == "luxbar-fixed"? "selected" : "" %>  value="luxbar-fixed">Fix top</option>
        </select>
        <div class="select__arrow"></div>
    </div>

    <div class="section-header">
        <label class="big">Navbar item alignment</label>
    </div>
    <div class="select full">
        <select data-for="nav-alignment">
        <option value=""></option>
        <option <%= alignment == "luxbar-menu-left"? "selected" : "" %>  value="luxbar-menu-left">Left</option>
        <option <%= alignment == "luxbar-menu-right"? "selected" : "" %>  value="luxbar-menu-right">Right</option>
        </select>
        <div class="select__arrow"></div>
    </div>


</script>


<script id="wplx-edit-row" type="text/html">
    <div class="d-flex flex-column c37-col">
        <label>Layout</label>
        <div class="select">
            <select data-for="layout" class="full">
                <option <%= layout=="12"? "selected" : "" %> value="12">1</option>
                <option <%= layout=="6-6"? "selected" : "" %> value="6-6">1/2 + 1/2</option>
                <option <%= layout=="4-4-4"? "selected" : "" %> value="4-4-4">1/3 + 1/3 + 1/3</option>
                <option <%= layout=="4-8"? "selected" : "" %> value="4-8">1/3 + 2/3</option>
                <option <%= layout=="8-4"? "selected" : "" %> value="8-4">2/3 + 1/3</option>
                <option <%= layout=="3-3-3-3"? "selected" : "" %> value="3-3-3-3">1/4 + 1/4 + 1/4 + 1/4</option>
                <option <%= layout=="3-3-6"? "selected" : "" %> value="3-3-6">1/4 + 1/4 + 2/4</option>
                <option <%= layout=="3-9"? "selected" : "" %> value="3-9">1/4 + 3/4</option>
                <option <%= layout=="3-6-3"? "selected" : "" %> value="3-6-3">1/4 + 2/4 + 1/4</option>
                <option <%= layout=="6-3-3"? "selected" : "" %> value="6-3-3">2/4 + 1/4 + 1/4</option>
                <option <%= layout=="9-3"? "selected" : "" %> value="9-3">3/4 + 1/4</option>
                <option <%= layout=="5-7"? "selected" : "" %> value="5-7">5/12 + 7/12</option>
                <option <%= layout=="7-5"? "selected" : "" %> value="7-5">7/12 + 5/12</option>
            </select>
            <div class="select__arrow"></div>
        </div>
    </div>


</script>

<script type="text/html" id="wplx-edit-box">
    <div class="section-header">
        <label  class="big">Box size</label>
    </div>
    <div id="box-size">
        <ul class="d-flex flex-row responsive-devices">
            <li class="c37-col"><a href="#c37-box-size-desktop"><i class="fa fa-desktop"></i></a></li>
            <li class="c37-col"><a href="#c37-box-size-tablet"><i class="fa fa-tablet"></i></a></li>
            <li class="c37-col"><a href="#c37-box-size-phone"><i class="fa fa-mobile-phone"></i></a></li>
        </ul>

        <div id="c37-box-size-desktop">
            <input class="box-size full" data-for="size-desktop" type="number" min="0" max="12" value="<%= size.desktop %>">
        </div>
        <div id="c37-box-size-tablet">
            <input class="box-size full" data-for="size-tablet" type="number" min="0" max="12" value="<%= size.tablet %>">
        </div>
        <div id="c37-box-size-phone">
            <input class="box-size full" data-for="size-phone" type="number" min="0" max="12" value="<%= size.phone %>">
        </div>

    </div>

    <label  class="big">Content alignment</label>
    <div class="row flex-row d-flex">
        <div class="c37-col d-flex flex-column">
            <label for="">Horizontal</label>
            <div class="select">
            <select data-for="horizontal" id="">
                <option <%= horizontal=="justify-content-start"? "selected" : "" %> value="justify-content-start">Left</option>
                <option <%= horizontal=="justify-content-center"? "selected" : "" %>  value="justify-content-center">Center</option>
                <option <%= horizontal=="justify-content-end"? "selected" : "" %>  value="justify-content-end">Right</option>
            </select>
            <div class="select__arrow"></div>
            </div>
        </div>

        <div class="c37-col  d-flex flex-column">
            <label for="">Vertical</label>
            <div class="select">
                <select data-for="vertical" id="">
                    <option <%= vertical=="align-items-start"? "selected" : "" %> value="align-items-start">Top</option>
                    <option <%= vertical=="align-items-center"? "selected" : "" %> value="align-items-center">Middle</option>
                    <option <%= vertical=="align-items-end"? "selected" : "" %> value="align-items-end">Bottom</option>
                </select>
                <div class="select__arrow"></div>
            </div>
        </div>

    </div>

    <label class="big">Content direction</label>
    <div class="row flex-row d-flex">
        <div class="c37-col">
            <label class="control control--radio">Row
                <input type="radio" name="direction" <%= direction=="flex-row" ? "checked" : "" %> value="flex-row">
                <div class="control__indicator"></div>
            </label>
        </div>

        <div class="c37-col">
            <label class="control control--radio">Column
                <input type="radio" name="direction" <%= direction=="flex-column" ? "checked" : "" %> value="flex-column">
                <div class="control__indicator"></div>
            </label>
        </div>




    </div>

</script>

<script type="text/html" id="wplx-edit-button-preset">
    <div class="section-header"><label class="big">Preset Styles</label></div>
    <div class="css-styles">
        <div id="button-presets" class="d-flex flex-column justify-content-around">
            <div class="row">
                <div class="c37-col d-flex flex-column">
                    <label>Style</label>
                    <div class="select">
                        <select data-for="style"  class="full">
                            <option value=""></option>
                            <option <%= preset.style== ""? "selected" : "" %>  value="">None</option>
                            <option <%= preset.style== "c37-button-transparent"? "selected" : "" %>  value="c37-button-transparent">Transparent</option>
                            <option <%= preset.style== "c37-button-3d"? "selected" : "" %>  value="c37-button-3d">3D</option>
                            <option <%= preset.style== "c37-button-raised"? "selected" : "" %> value="c37-button-raised">Raised</option>
                            <option <%= preset.style== "c37-button-glow"? "selected" : "" %> value="c37-button-glow">Glow</option>
                            <option <%= preset.style== "c37-button-border"? "selected" : "" %> value="c37-button-border">Border</option>
                        </select>
                        <div class="select__arrow"></div>
                    </div>
                </div>

                <div class="c37-col d-flex flex-column">
                    <label>Shape</label>
                    <div class="select">
                        <select data-for="shape"  class="full">
                            <option value=""></option>
                            <option <%= preset.shape== "c37-button-square"? "selected" : "" %> value="c37-button-square">square</option>
                            <option <%= preset.shape== "c37-button-box"? "selected" : "" %> value="c37-button-box">box</option>
                            <option <%= preset.shape== "c37-button-circle"? "selected" : "" %> value="c37-button-circle">circle</option>
                            <option <%= preset.shape== "c37-button-rounded"? "selected" : "" %> value="c37-button-rounded">rounded</option>
                            <option <%= preset.shape== "c37-button-pill"? "selected" : "" %> value="c37-button-pill">pill</option>
                        </select>
                        <div class="select__arrow"></div>
                    </div>
                </div>
            </div>


            <div class="row">
                <div class="c37-col d-flex flex-column">
                    <label>Color</label>
                    <div class="select">
                        <select data-for="color" class="full">
                            <option value=""></option>
                            <option <%= preset.color== "c37-button-primary"? "selected" : "" %> value="c37-button-primary">primary</option>
                            <option <%= preset.color== "c37-button-plain"? "selected" : "" %> value="c37-button-plain">plain</option>
                            <option <%= preset.color== "c37-button-inverse"? "selected" : "" %> value="c37-button-inverse">inverse</option>
                            <option <%= preset.color== "c37-button-action"? "selected" : "" %> value="c37-button-action">action</option>
                            <option <%= preset.color== "c37-button-highlight"? "selected" : "" %> value="c37-button-highlight">highlight</option>
                            <option <%= preset.color== "c37-button-caution"? "selected" : "" %> value="c37-button-caution">caution</option>
                            <option <%= preset.color== "c37-button-royal"? "selected" : "" %> value="c37-button-royal">royal</option>
                        </select>
                        <div class="select__arrow"></div>
                    </div>
                </div>

                <div class="c37-col d-flex flex-column">
                    <label>Size</label>
                    <div class="select">
                        <select data-for="size" class="full">
                            <option value=""></option>
                            <option <%= preset.size== "c37-button-giant"? "selected" : "" %>  value="c37-button-giant">giant</option>
                            <option <%= preset.size== "c37-button-jumbo"? "selected" : "" %>  value="c37-button-jumbo">jumbo</option>
                            <option <%= preset.size== "c37-button-large"? "selected" : "" %>  value="c37-button-large">large</option>
                            <option <%= preset.size== "c37-button-normal"? "selected" : "" %>  value="c37-button-normal">normal</option>
                            <option <%= preset.size== "c37-button-small"? "selected" : "" %>  value="c37-button-small">small</option>
                            <option <%= preset.size== "c37-button-tiny"? "selected" : "" %>  value="c37-button-tiny">tiny</option>
                        </select>
                        <div class="select__arrow"></div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</script>


<script type="text/html" id="wplx-edit-line">
    <div class="d-flex flex-column">
        <label>Select Line style</label>
        <div class="select">
            <select data-for="hr-line-style" class="full">
                <option <%= lineClass=='c37-hr-1'? "selected" : "" %> value="c37-hr-1">Style 1</option>
                <option <%= lineClass=='c37-hr-2'? "selected" : "" %> value="c37-hr-2">Style 2</option>
                <option <%= lineClass=='c37-hr-3'? "selected" : "" %> value="c37-hr-3">Style 3</option>
                <option <%= lineClass=='c37-hr-4'? "selected" : "" %> value="c37-hr-4">Style 4</option>
                <option <%= lineClass=='c37-hr-5'? "selected" : "" %> value="c37-hr-5">Style 5</option>
                <option <%= lineClass=='c37-hr-6'? "selected" : "" %> value="c37-hr-6">Style 6</option>
                <option <%= lineClass=='c37-hr-7'? "selected" : "" %> value="c37-hr-7">Style 7</option>
                <option <%= lineClass=='c37-hr-8'? "selected" : "" %> value="c37-hr-8">Style 8</option>
                <option <%= lineClass=='c37-hr-9'? "selected" : "" %> value="c37-hr-9">Style 9</option>
                <option <%= lineClass=='c37-hr-10'? "selected" : "" %> value="c37-hr-10">Style 10</option>
                <option <%= lineClass=='c37-hr-11'? "selected" : "" %> value="c37-hr-11">Style 11</option>
                <option <%= lineClass=='c37-hr-12'? "selected" : "" %> value="c37-hr-12">Style 12</option>
            </select>
            <div class="select__arrow"></div>
        </div>
    </div>

</script>

<script type="text/html" id="wplx-edit-simple-countdown-action">
    <div class="d-flex flex-column">
        <label>After complete action</label>
        <div class="select">
            <select data-for="action" class="full">
            <option <%= action == "do-nothing" ? "selected" : "" %> value="do-nothing">Do nothing</option>
            <option <%= action == "open-url" ? "selected" : "" %> value="open-url">Open url</option>
            <option <%= action == "exec-code" ? "selected" : "" %> value="exec-code">Exec code</option>
            </select>
            <div class="select__arrow"></div>
        </div>
        <label>Javascript code</label>
        <textarea class="full" data-for="action-value"><%= decodeURIComponent(actionValue) %></textarea>
    </div>

</script>

<script type="text/html" id="wplx-edit-simple-countdown">
    <label>Select counter type</label>
    <div class="d-flex flex-row">
        <div class="c37-col-6">
            <label class="control control--radio">Count amount
                <input <%= type == 'countAmount' ? "checked" : "" %> id="count-amount" type="radio" name="type" value="count-amount" />
                <div class="control__indicator"></div>
            </label>
        </div>

        <div class="c37-col-6">
            <label class="control control--radio">Count to date
                <input <%= type == 'countTo' ? "checked" : "" %>id="count-to" type="radio" name="type" value="count-to" />
                <div class="control__indicator"></div>
            </label>
        </div>
    </div>



    <div data-for="count-amount">
        <!--    Days    -->
        <div class="d-flex flex-row">
            <div class="c37-col d-flex flex-column">
                <label>Days</label>
                <input data-for="days" type="number" min="0" value="<%= days %>" />
            </div>
            <div class="c37-col d-flex flex-column">
                <label>Display text</label>
                <input type="text" data-for="days-label" placeholder="label" value="<%= daysLabel%>">
            </div>
        </div>

        <!--    Hours    -->
        <div class="d-flex flex-row">
            <div class="c37-col d-flex flex-column">
                <label>Hours</label>
                <input  data-for="hours" type="number" min="0" value="<%= hours %>"  />
            </div>
            <div class="c37-col d-flex flex-column">
                <label>Display text</label>
                <input type="text" data-for="hours-label" placeholder="label" value="<%= hoursLabel%>">
            </div>
        </div>

        <!--    Minutes    -->
        <div class="d-flex flex-row">
            <div class="c37-col d-flex flex-column">
                <label>Minutes</label>
                <input data-for="minutes" type="number" min="0" value="<%= minutes %>"  />
            </div>
            <div class="c37-col d-flex flex-column">
                <label>Display text</label>
                <input type="text" data-for="minutes-label" placeholder="label" value="<%= minutesLabel%>">
            </div>
        </div>

        <!--    Seconds    -->
        <div class="d-flex flex-row">
            <div class="c37-col d-flex flex-column">
                <label>Seconds</label>
                <input data-for="seconds" type="number" min="0" value="<%= seconds %>"  />
            </div>
            <div class="c37-col d-flex flex-column">
                <label>Display text</label>
                <input type="text" data-for="seconds-label" placeholder="label" value="<%= secondsLabel%>">
            </div>
        </div>

    </div>

    <div data-for="count-to">
        <input type="datetime-local" data-for="datetime-local" />
    </div>

    <div class="d-flex flex-column">
        <label>Clock display</label>
        <div class="select">
            <select data-for="clock-display" class="full">
                <option <%= clockDisplay == "Counter" ? "selected" : "" %> value="Counter" >Generic counter</option>
                <option <%= clockDisplay == "MinuteCounter" ? "selected" : "" %> value="MinuteCounter" >Minute Counter</option>
                <option <%= clockDisplay == "HourlyCounter" ? "selected" : "" %> value="HourlyCounter" >Hour Counter</option>
                <option <%= clockDisplay == "DailyCounter" ? "selected" : "" %> value="DailyCounter" >Day Counter</option>
            </select>
            <div class="select__arrow"></div>
        </div>
    </div>

</script>

<script type="text/html" id="wplx-edit-other-video">
    <label>Put the iframe embed code in the box below</label>
    <textarea class="full" data-for="source"><%= decodeURIComponent(source)  %></textarea>
</script>

<script id="wplx-edit-menu-general" type="text/html">
    <div  class="d-flex flex-column">
        <label>Select menu</label>
        <div class="select">
            <select data-for="wp-menu" class="full">
                <option></option>
                <% core37Page.menus.forEach(function(menu){ %>
                <option <%= menu == name ? "selected" : "" %> value="<%= menu %>"> <%= menu %> </option>
                <% }); %>
            </select>
            <div class="select__arrow"></div>
        </div>
    </div>
    <div class="c37-col-5  c37-col-xs-push-1">
        <label>Menu icon</label>
        <div>
            <img class="c37-menu-icon" src="<%= iconUrl %>">
            <i class="fa fa-folder-open menu-icon-picker"></i>
            <i class="fa fa-close menu-icon-remover"></i>
        </div>
    </div>
    <label>Menu title</label>
    <textarea id="menu-title">Menu title</textarea>
    <button id="update-title">Update title</button>
</script>

<script id="wplx-edit-menu-item-style" type="text/html">
    <div class="section-header"><label class="big">List item styles</label></div>
    <div>
        <div class="d-flex flex-column">
            <label class="control control--checkbox">Uppercase?
                <input <%= typeof uppercase !=='undefined' && uppercase ? "checked" : "" %> type="checkbox" data-for="uppercase" />
                <div class="control__indicator"></div>
            </label>

            <div class="c37-row">
                <div class="c37-col">
                    <label for="">item color</label>
                    <input type="color" value="<%= !itemColor ? "#fffffa" : itemColor %>"  data-for="item-color">
                </div>

                <div class="c37-col">
                    <label for="">item size(rem, px...)</label>
                    <input type="text" value="<%= !itemSize? '' : itemSize  %>" data-for="item-size">
                </div>
            </div>



        </div>
    </div>


</script>



<script type="text/html" id="wplx-edit-ul-list-items-style">
        <div class="section-header"><label class="big">List item styles</label></div>
        <div>
            <label>Select icon</label>
            <div class="fa-icon"><i class="fa <%= icon %>"></i><input type="text" data-for="icon" class="icon-value" value="<%= icon %>"  /></div>

            <div class="d-flex flex-row">
                <div class="c37-col-5 d-flex flex-column">
                    <label>Icon color</label>
                    <div class="d-flex flex-row align-items-center">
                        <input type="color" value="<%= !iconColor ? "#fffffa" : iconColor %>"  data-for="icon-color">
                        <i data-for="reset-icon-color" class="fa fa-hand-paper-o reset-color"></i>
                    </div>

                </div>
                <div class="c37-col  d-flex flex-column">
                    <label>Icon bg color</label>
                    <div class="d-flex flex-row align-items-center">
                        <input type="color"  value="<%= !iconBgColor ? "#fffffa" : iconBgColor %>"  data-for="icon-bg-color">
                        <i data-for="reset-icon-bg-color" class="fa fa-hand-paper-o reset-color"></i>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row">
                <div class="c37-col-5  d-flex flex-column">
                    <label>Icon size</label>
                    <div><input placeholder="font size, in px" type="number" value="<%= iconSize %>"  data-for="icon-size"></div>
                </div>
                <div class="c37-col-6 d-flex flex-column">
                    <label>Text align</label>
                    <div class="select">
                        <select data-for="ul-text-align">
                            <option <%= align == ""? "selected" : "" %> value=""></option>
                            <option <%= align == "c37-left"? "selected" : "" %> value="c37-left">left</option>
                            <option <%= align == "c37-center"? "selected" : "" %> value="c37-center">center</option>
                            <option <%= align == "c37-right"? "selected" : "" %> value="c37-right">right</option>
                        </select>
                        <div class="select__arrow"></div>
                    </div>
                </div>
            </div>


            <div class="d-flex flex-row">
                <div class="c37-col-5">
                    <label>List item padding</label>
                    <div><input placeholder="padding, in px" type="number" value="<%= listPadding %>"  data-for="list-padding"></div>
                </div>
                <div class="c37-col-6">
                    <label>content left padding</label>
                    <div><input placeholder="padding left, in px" type="number" value="<%= leftPadding %>"  data-for="left-padding"></div>
                </div>
            </div>
        </div>
</script>


<script type="text/html" id="wplx-edit-youtube">
    <div id="youtube-options">
        <label>Video URL/Embed code</label>
        <textarea data-for="video-code" class="full"><%= videoURL %></textarea>
        <label class="control control--checkbox">Hide info (title)
            <input <%= hideInfo ? "checked" : "" %> type="checkbox" data-for="hide-info" />
            <div class="control__indicator"></div>
        </label>

        <label class="control control--checkbox">Hide controls
            <input <%= hideControls ? "checked" : "" %> type="checkbox" data-for="hide-controls" />
            <div class="control__indicator"></div>
        </label>

        <label class="control control--checkbox">Autoplay
            <input <%= autoPlay ? "checked" : "" %> type="checkbox" data-for="auto-play" />
            <div class="control__indicator"></div>
        </label>

        <div class="d-flex flex-row">
            <div class="c37-col-5 d-flex flex-column">
                <label>Width</label>
                <input class="full" type="number" value="<%= width %>" data-for="width" placeholder="video width" />
            </div>
            <div class="c37-col-5 c37-offset-1 d-flex flex-column">
                <label>Height</label>
                <input class="full" value="<%= height %>" type="number" data-for="height" placeholder="video height" />

            </div>
        </div>
    </div>
</script>


<script type="text/html" id="wplx-edit-image-general">

    <div class="c37-col">
        <label class="full">Select image</label>
        <div class="d-flex flex-row align-items-end">
            <img class="c37-image-preview" src="<%= src %>" />
            <button class="c37-image-changer">Change image...</button>
        </div>
    </div>

    <div class="c37-col">
        <label class="full">Image alignment</label>
        <div class="select">
            <select data-for="image-alignment">
                <option <%= alignmentClass == "c37-left"? "selected" : "" %> value="c37-left">Left</option>
                <option <%= alignmentClass == "c37-center"? "selected" : "" %> value="c37-center">Center</option>
                <option <%= alignmentClass == "c37-right"? "selected" : "" %> value="c37-right">Right</option>
            </select>
            <div class="select__arrow"></div>
        </div>
    </div>

</script>


<script type="text/html" id="wplx-edit-image-link-general">

    <div class="d-flex flex-row">
        <div class="c37-col">
            <label class="full">Select image</label>
            <img class="c37-image-preview" src="<%= src %>" />
            <button class="c37-image-changer">Change image...</button>
        </div>

        <div class="c37-col">
            <label class="full">Element alignment</label>
            <div class="select">
                <select data-for="image-alignment">
                    <option <%= alignmentClass == "c37-left"? "selected" : "" %> value="c37-left">Left</option>
                    <option <%= alignmentClass == "c37-center"? "selected" : "" %> value="c37-center">Center</option>
                    <option <%= alignmentClass == "c37-right"? "selected" : "" %> value="c37-right">Right</option>
                </select>
                <div class="select__arrow"></div>
            </div>
        </div>
    </div>

    <div class="d-flex flex-row">
        <div class="c37-col">
            <label for="">Target url</label>
            <input data-for="url" type="url" value="<%= url %>">
            <label for="">Open in</label>
            <div class="select">
                <select data-for="url-target">
                    <option <%= target=="_blank"? "selected" : "" %> value="_blank">New window</option>
                    <option <%= target!="_blank"? "selected" : "" %> value="_self">Current window</option>
                </select>
                <div class="select__arrow"></div>
            </div>

        </div>

    </div>


</script>

<script type="text/html" id="wplx-edit-box-shadow">
    <div class="d-flex flex-row separate-input">
        <div class="col d-flex flex-column">
            <label>Offset x</label>
            <input type="number" data-for="offset-x">
        </div>

        <div class="col d-flex flex-column">
            <label>Offset y</label>
            <input type="number" data-for="offset-y">
        </div>

        <div class="col d-flex flex-column">
            <label>Blur</label>
            <input type="number" data-for="blur-radius">
        </div>

        <div class="col d-flex flex-column">
            <label>Spread</label>
            <input type="number" data-for="spread-radius">
        </div>

    </div>


</script>

<script type="text/html" id="wplx-edit-text-input-general">
    <div class="d-flex flex-column">
        <label>Placeholder: </label>
        <input type="text" data-for="placeholder" value="<%= placeholder %>" />
        <label>Label</label>
        <input type="text" value="<%= label %>" data-for="input-label" placeholder="enter label" />
        <label>Value</label>
        <input type="text" value="<%= value %>" data-for="input-value" placeholder="enter value" />

        <label>Type:</label>
        <div class="select">
            <select data-for="input-type">
                <option <%= type=="text"? "selected" : "" %> value="text">Text</option>
                <option <%= type=="email"? "selected" : "" %> value="email">Email</option>
                <option <%= type=="url"? "selected" : "" %> value="url">URL</option>
                <option <%= type=="number"? "selected" : "" %> value="number">Number</option>
                <option <%= type=="password"? "selected" : "" %> value="password">Password</option>
                <option <%= type=="tel"? "selected" : "" %> value="tel">Phone</option>
                <option <%= type=="submit"? "selected" : "" %> value="submit">Submit</option>
            </select>
            <div class="select__arrow"></div>
        </div>
        <label>Icon</label>
        <div class="fa-icon"><i class="fa <%= icon %>"></i><input class="full icon-value" data-for="icon" value="<%= icon? icon: '' %> " type="text" id="fa-icon-input" /> </div>

    </div>

</script>

<script type="text/html" id="wplx-edit-icon">
    <label>Icon</label>
    <div class="fa-icon"><i class="fa <%= icon %>"></i><input class="full icon-value" data-for="icon" value="<%= icon %> " type="text"/> </div>

    <div class="c37-row">
        <div class="c37-col">
            <label for="">Icon size</label>
            <input type="text" data-for="size" value="<%= size %>">
        </div>

        <div class="c37-col">
            <label for="">Icon color</label>
            <input type="color" data-for="color" value="<%= color %>">
        </div>

        <div class="c37-col">
            <label for="">Alignment</label>
            <div class="select">
                <select data-for="icon-alignment">
                    <option <%= align == ""? "selected" : "" %> value=""></option>
                    <option <%= align == "c37-left"? "selected" : "" %> value="c37-left">left</option>
                    <option <%= align == "c37-center"? "selected" : "" %> value="c37-center">center</option>
                    <option <%= align == "c37-right"? "selected" : "" %> value="c37-right">right</option>
                </select>
                <div class="select__arrow"></div>
            </div>
        </div>
    </div>


</script>


<script type="text/html" id="wplx-edit-text-advanced">
    <div class="d-flex flex-column">
        <label>Field name:</label>
        <input type="text" data-for="name" value="<%= name %>" />
        <label class="control control--checkbox">Required
            <input data-for="required" type="checkbox" <%= required? "checked" : "" %> />
            <div class="control__indicator"></div>
        </label>

    </div>
</script>

<script type="text/html" id="wplx-edit-radio-general">

    <div class="options">
        <div class="row">
            <label class="c37-col-5">Value</label>
            <label class="c37-col-5 c37-offset-2">Select</label>
        </div>

        <% _.each(options, function(o){ %>
        <div  class="row single-option">
            <div class="c37-col-7">
                <input class="full" type="text" data-for="value" value="<%= decodeURIComponent(o.value) %>" />
            </div>
            <div class="c37-col-5">
                <label class="control control--checkbox">Checked
                <input type="radio" data-for="checked" name="radio-settings" <%= o.checked? "checked" : "" %> />
                <div class="control__indicator"></div>
            </div>
        </div>
        <% }) %>
    </div>
    <button class="add-option"><i class="fa fa-plus"></i> Add option</button>





</script>


<script type="text/html" id="wplx-edit-checkbox-general">
    <div class="options">
        <div class="row">
            <label class="c37-col-5">Value</label>
            <label class="c37-col-5 c37-offset-2">Checked</label>
        </div>

        <% _.each(options, function(o){ %>
        <div  class="row single-option">
            <div class="c37-col-7">
                <input class="full" type="text" data-for="value" value="<%= decodeURIComponent(o.value) %>" />
            </div>
            <div class="c37-col-5">
                <label class="control control--checkbox">Checked
                    <input type="checkbox" data-for="checked" name="checkbox-settings" <%= o.checked? "checked" : "" %> />
                    <div class="control__indicator"></div>
            </div>
        </div>
        <% }) %>
    </div>
    <button class="add-option"><i class="fa fa-plus"></i> Add option</button>
</script>

<script type="text/html" id="wplx-edit-cb-radio-alignment">

    <div class="d-flex flex-column">
        <label>Name</label>
        <input data-for="name" type="text" value="<%= name %>" placeholder="enter a name for your field" />
        <label>Options alignment</label>
        <div class="select">
        <select data-for="alignment">
            <option <%= alignment=="c37-vertical"? "selected" : "" %> value="c37-vertical">Vertical</option>
            <option <%= alignment=="c37-horizontal"? "selected" : "" %> value="c37-horizontal">Horizontal</option>
        </select>
        <div class="select__arrow"></div>
        </div>
    </div>

</script>

<script type="text/html" id="wplx-edit-button-general">
    <div class="c37-col">
        <label>Button Text: </label>
        <input class="full" type="text" data-for="text" placeholder="button text" value="<%= text %>" />
        <label>Select icon</label>
        <div class="fa-icon">
            <i class="fa <%= icon %>"></i>
            <input class="full icon-value" type="text" data-for="icon" value="<%= icon %>"  />
        </div>

        <label>Use image</label>
        <img class="c37-button-image-preview" src="<%= buttonImage %>">
        <i class="fa fa-folder-open c37-image-picker"></i>
        <i class="fa fa-close c37-remove-image"></i>
    </div>
</script>


<script type="text/html" id="wplx-edit-visibility">
    <div class="">
        <div class="section-header">
            <label for="" class="big">Visibility</label>
        </div>
        <div data-for="visibility" class="c37-visibility d-flex flex-row justify-content-around">
            <label class="control control--checkbox">Hide on phone
                <input data-for="phone" type="checkbox" <%= hidden.phone? "checked" : "" %> data-for="hide-phone" > <!-- xs .c37-d-none  -->
                <div class="control__indicator"></div>
            </label>
            <label class="control control--checkbox">Hide on tablet
                <input data-for="tablet" type="checkbox" <%= hidden.tablet? "checked" : "" %>  data-for="hide-tablet" > <!-- sm -->
                <div class="control__indicator"></div>
            </label>

            <label class="control control--checkbox">Hide on desktop
                <input data-for="desktop" type="checkbox" <%= hidden.desktop? "checked" : "" %>  data-for="font-bold" > <!-- md -->
                <div class="control__indicator"></div>
            </label>
        </div>
    </div>

</script>

<script type="text/html" id="wplx-edit-page-general">
    <div class="controls-container">
        <label>Page title</label>
        <input class="full" id="page-title" type="text" value="<%= pageTitle %>" placeholder="page title" data-for="page-title" />
        <label>Page slug</label>
        <input class="full" id="page-slug" type="text" value="<%= typeof pageSlug=='undefined'? '' : pageSlug %>" placeholder="page slug (url)" data-for="page-slug" />

        <label>Page width (<small><em>in px, leave blank for full width</em></small>)</label>
        <input class="full" type="number" value="<%= width %>" data-for="page-width" />
    </div>
</script>
<script type="text/html" id="wplx-edit-page-advanced">
    <div id="page-codes">
        <div class="section-header"><label class="big">Tracking code <small>(GA, FB pixel)</small></label></div>
        <div><textarea class="c37-code-editor full" data-for="tracking-code"><%= decodeURIComponent(codes.trackingCode) %></textarea></div>

        <div class="section-header"><label class="big">Meta</label></div>
        <div><textarea class="c37-code-editor full" data-for="meta-code"><%= decodeURIComponent(codes.metaCode) %></textarea></div>

        <div class="section-header"><label class="big">Google Experiment Code (A/B Testing)</label></div>
        <div><textarea class="c37-code-editor full" data-for="experiment-code"><%= decodeURIComponent(codes.experimentCode) %></textarea></div>

        <div class="section-header"><label class="big">After body opening tag</label></div>
        <div><textarea class="c37-code-editor full" data-for="after-body-opening-code"><%= decodeURIComponent(codes.afterBodyOpening) %></textarea></div>

        <div class="section-header"><label class="big">Before body closing tag</label></div>
        <div><textarea class="c37-code-editor full" data-for="before-body-closing-code" ><%= decodeURIComponent(codes.beforeBodyClosing) %></textarea></div>

        <div class="section-header"><label class="big">CSS code</label></div>
        <div><textarea class="c37-code-editor full" data-for="page-css-code"><%= decodeURIComponent(codes.customCSSCode) %></textarea></div>
    </div>
</script>

<script type="text/html" id="wplx-edit-boxshadow">
    <div class="section-header"><label class="big">Box Shadow</label></div>
    <div class="css-styles">
        <span  class="<%= versionNangCap? 'hidden' : '' %>" >This feature allow you to create beautiful shadow around elements and is available in PRO version only. <a href="http://wpleadplus.com/?src=wp-editor-box-shadow" target="_blank">Click here</a> to upgrade</span>
        <div id="box-shadow-settings" class="<%= !versionNangCap? 'hidden' : '' %>">
            <div class="d-flex flex-row justify-content-around">
                <div class="d-flex flex-column">
                    <label>Inset</label>
                    <label class="control control--checkbox c37-col-3">
                        <input type="checkbox" data-for="box-shadow-inset" <%= cssStyle.desktop['box-shadow'].inset ? 'checked' : '' %>>
                        <div class="control__indicator"></div>
                    </label>
                </div>

                <div class="d-flex flex-column">
                    <label>Shadow color</label>
                    <input type="color" data-for="box-shadow-color" value="<%= typeof cssStyle.desktop['box-shadow'].color ==='undefined' || cssStyle.desktop['box-shadow'].color===''? '#fffffa' : cssStyle.desktop['box-shadow'].color  %>"  />
                </div>

                <div class="d-flex flex-column">
                    <label for="">Opacity</label>
                    <input type="number" min="0" max="100" data-for="box-shadow-opacity" value="<%= c37GetValue(cssStyle.desktop['box-shadow'].opacity) %>" >
                </div>
            </div>

            <div class="d-flex flex-row align-items-center separate-input">
                <div class="d-flex flex-column">
                    <label for="">Offset X</label>
                    <input type="text" data-for="box-shadow-offset-x" value="<%= c37GetValue(cssStyle.desktop['box-shadow'].offsetX) %>"/>
                </div>

                <div class="d-flex flex-column">
                    <label for="">Offset Y</label>
                    <input type="text" value="<%= c37GetValue(cssStyle.desktop['box-shadow'].offsetY) %>"  data-for="box-shadow-offset-y"/>
                </div>

                <div class="d-flex flex-column">
                    <label for="">Blur</label>
                    <input type="text"  value="<%= c37GetValue(cssStyle.desktop['box-shadow'].blurRadius) %>" data-for="box-shadow-blur-radius"/>
                </div>

                <div class="d-flex flex-column">
                    <label for="">Spread</label>
                    <input  type="text" value="<%= c37GetValue(cssStyle.desktop['box-shadow'].spreadRadius) %>"  data-for="box-shadow-spread-radius"/>
                </div>

            </div>
        </div>
    </div>

</script>

<script type="text/html" id="wplx-edit-form-style">
    <div class="section-header">Preset styles</div>
    <div class="select full">
        <select data-for="form-style">
            <option value="c37-form-style-1">Style 1</option>
            <option value="c37-form-style-2">Style 2</option>
            <option value="c37-form-style-3">Style 3</option>
        </select>
        <div class="select__arrow"></div>
    </div>
</script>

<script type="text/html" id="wplx-edit-select-general">
    <div class="options">
        <div class="row">
            <label class="c37-col-5">Value</label>
            <label class="c37-col-5 c37-offset-2">Select</label>
        </div>

        <% _.each(options, function(o){ %>
        <div  class="row single-option">
            <div class="c37-col-7">
                <input class="full" type="text" data-for="value" value="<%= decodeURIComponent(o.value) %>" />
            </div>
            <div class="c37-col-5">
                <label class="control control--radio">Selected
                    <input type="radio" data-for="checked" name="select-settings" <%= o.checked? "checked" : "" %> />
                    <div class="control__indicator"></div>
                </label>
            </div>



        </div>
        <% }) %>
    </div>
    <button class="add-option"><i class="fa fa-plus"></i> Add option</button>

</script>

<script type="text/html" id="wplx-edit-paragraph">
    <div class="d-flex flex-column c37-col css-styles">
        <textarea id="c37-text-edit" data-for="paragraph" placeholder="enter text content"><% content %></textarea>
        <label for="">Line height(%,px...)</label>
        <input type="text" class="full" data-for="line-height" value="<%= c37GetValue(cssStyle.desktop['line-height']) %>">
    </div>
</script>

<script type="text/html" id="wplx-edit-section-context-menu">
    <div class="c37-section-cm">
        <div>
            <span class="section-cm-title" data-balloon="options for section" class="cm-section-edit cm-header">section</span>
            <span data-balloon="move this section" class="cm-section-move"><i class="fa fa-arrows"></i></span>
            <span data-balloon="edit this section" class="cm-section-edit"><i class="fa fa-pencil"></i></span>
            <span data-balloon="delete this section" class="cm-section-del"><i class="fa fa-trash"></i></span>
        </div>

        
        <div>
            <span class="section-cm-title" data-balloon="options for row" class="cm-title cm-header">row</span>
            <span data-balloon="move row" class="cm-row-move"><i class="fa fa-arrows"></i></span>
            <span data-balloon="edit this row" class="cm-row-edit"><i class="fa fa-pencil"></i></span>
            <span data-balloon="delete this row" class="cm-row-del"><i class="fa fa-trash"></i></span>
            <span data-balloon="clone this row" class="cm-clone-row"><i class="fa fa-copy"></i></span>
        </div>

        
        <div>
            <span class="section-cm-title" data-balloon="options for box" class="cm-box-edit cm-header">box</span>
            <span data-balloon="edit this box" class="cm-box-edit cm-edit"><i class="fa fa-pencil"></i></span>
        </div>

    </div>
</script>

<script type="text/html" id="wplx-edit-element-context-menu">
    <div class="c37-element-cm">
        <span title="title" class="cm-title">element_title</span>
        <span title="move" class="cm-move"><i class="fa fa-arrows"></i></span>
        <span title="edit" class="cm-edit"><i class="fa fa-pencil"></i></span>
        <span title="clone" class="cm-clone"><i class="fa fa-copy"></i></span>
        <span title="delete" class="cm-del"><i class="fa fa-trash"></i></span>
    </div>
</script>

<script type="text/html" id="wplx-edit-wall-context-menu">
    <div class="c37-wall-cm">
        <span title="title" class="cm-wall-title">wall</span>
        <span title="move" class="cm-wall-move"><i class="fa fa-arrows"></i></span>
        <span title="edit" class="cm-wall-edit"><i class="fa fa-pencil"></i></span>
        <span title="delete" class="cm-wall-del"><i class="fa fa-trash"></i></span>
    </div>
</script>



<script type="text/html" id="wplx-edit-image-sliders-general">
        <div class="all-sliders">
            <% _.each(images, function(img) { %>
            <div class="c37-row single-img-slider">
                <img class="slider-image" src="<%= img.src %>" alt="">
                <input placeholder="enter image link" type="text" value="<%= img.target %>">
                <i class="fa fa-close remove-single-slider"></i>
            </div>
            <% }); %>
        </div>

        <button class="add-image-slider"><i class="fa fa-plus "></i> Add slider</button>

</script>