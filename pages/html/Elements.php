<!--Heading-->
<script type="text/x-handlebars-template" id="wplx-heading">
	<{{tagName}} class="c37-child">{{content}}</{{tagName}}>
</script>

<!--Paragraph-->
<script type="text/html" id="wplx-paragraph">
    <div class="c37-text-content"><%= decodeURIComponent(content) %></div>
</script>

<!--Line-->
<script type="text/x-handlebars-template" id="wplx-line">
	<hr class="c37-hr <%= lineClass %>"/>
</script>

<!--Other video-->
<script type="text/html" id="wplx-other-video">
	<div class="c37-videos-wrapper"><%= decodeURIComponent(source) %></div>
</script>

<!--Youtube video-->
<script type="text/template" id="wplx-youtube">
    <div class="c37-embed-responsive c37-embed-responsive-16by9">
        <iframe class="c37-embed-responsive-item" width="<%= width %>" height="<%= height %>" src="<%= videoURL %>?rel=0&amp;controls=<%= hideControls ? 1 : 0 %>&amp;showinfo=<%= hideInfo ? 0 : 1  %>&amp;autoplay=<%=  autoPlay ? 1 : 0 %>" frameborder="0" allowfullscreen></iframe>
    </div>
</script>


<!--Other video-->
<script type="text/html" id="wplx-ul">
    <ul class="c37-ul <%= align %>">
        <% _.each(items, function(item){ %>
        <li style="padding-top: <%= listPadding + 'px' %>; padding-bottom: <%= listPadding + 'px' %>;">
            <span  style="display: block; float: left; height: 100%; color: <%= iconColor %>; background-color: <%= iconBgColor %>; font-size: <%= iconSize + 'px' %>;">
                <i class="fa <%=  icon %>"></i>
            </span>
            <span class="li-content" style="display:block; padding-left: <%= leftPadding + 'px' %>;"><%= decodeURIComponent(item) %></span>
            <div style="clear: both;"></div>
        </li>
        <% }); %>
    </ul>
</script>


<script type="text/html" id="wplx-simple-navbar">
    <header id="luxbar" class="<%= style %>">
        <input type="checkbox" class="luxbar-checkbox" id="luxbar-checkbox"/>
        <div class="luxbar-menu <%= alignment %> <%= color %>">
            <ul class="luxbar-navigation">
                <li class="luxbar-header">
                    <a href="#" class="luxbar-brand"><%= brand  %></a>
                    <label class="luxbar-hamburger luxbar-hamburger-doublespin" 
                    id="luxbar-hamburger" for="luxbar-checkbox"> <span></span> </label>
                </li>

                <% _.each(items, function(item){ %>
                    <% console.log(item); %>
                    <li class="luxbar-item"><%= decodeURIComponent(item) %></li>
                <% }); %>

            </ul>
        </div>
    </header>
</script>


<!--icon-->
<script type="text/html" id="wplx-icon">
    <div class="<%= align %>">
        <i class="fa <%= icon %>" style="font-size: <%= size %>; color: <%= color %>;"></i>
    </div>
</script>


<script type="text/html" id="wplx-button">
    <% if(buttonImage!= '') { %>
    <button data-role="submit" class="c37-bare c37-child">
        <img src="<%= buttonImage %>">
    </button>

    <% } else { %>
    <button data-role="submit" class=" c37-child <%= 'button ' +  preset.color + ' ' +  preset.style + ' ' + preset.shape + ' ' + preset.size  %>">
        <%= icon!== ''? '<i class="fa '+icon+'"></i>' : "" %> <%= text %>
    </button>
    <% } %>
</script>

<script type="text/html" id="wplx-input-submit">
    <button type="<%= type  %>" data-role="submit" class="<%= 'button ' +  preset.color + ' ' +  preset.style + ' ' + preset.shape + ' ' + preset.size  %>"><%= icon!== ''? '<i class="fa '+icon+'"></i>' : "" %><%= text %></button>
</script>

<script type="text/html" id="wplx-form-container">
    <form class="c37-child c37-lp-form d-flex flex-column c37-box <%= styleClass %>" action="<%= action %>" method="<%= method %>"><%= code %></form>
</script>

<script type="text/html" id="wplx-image">
    <img class="c37-child <%= alignmentClass %>" src="<%= src %>"/>
</script>

<script type="text/html" id="wplx-image-sliders">
    <div class="wplx-image-slider">
            <% _.each(images, function(img) { %>
            <div class="single-img-slider">
                <img class="slider-image" src="<%= img.src %>" alt="">
            </div>
            <% }); %>

    </div>
</script>


<script type="text/html" id="wplx-image-link">
    <a href="<%= url %>" target="<%= target %>" class="c37-image-link <%= alignmentClass %>">
        <img src="<%= src %>"/>
    </a>
</script>

<script type="text/html" id="wplx-code">
    <div data-content="" class="c37-code-container"><%= decodeURIComponent(code) %></div>
</script>

<script type="text/html" id="wplx-simple-countdown">
    <div class="<%= 1 %>">
        <ul  class="c37-simple-countdown">
            <li class="<%= clockDisplay == 'HourlyCounter' || clockDisplay == 'MinuteCounter' ? 'hidden' : ''  %>">
                <span class="simple-countdown-days simple-countdown-element">
                    <span class="cd-number"><%= days %></span>
                    <span class="simple-countdown-label"><%= daysLabel  %></span>
                </span>
            </li>
            <li class="<%= clockDisplay == 'MinuteCounter' ? 'hidden' : ''  %>">
                <span class="simple-countdown-hours simple-countdown-element">
                    <span class="cd-number"><%= hours %></span>
                    <span class="simple-countdown-label"><%= hoursLabel %></span>
                </span>
            </li>
            <li>
                <span class="simple-countdown-minutes simple-countdown-element">
                    <span class="cd-number"><%= minutes %></span>
                    <span class="simple-countdown-label"><%= minutesLabel %></span>
                </span>
            </li>
            <li>
                <span class="simple-countdown-seconds simple-countdown-element">
                    <span class="cd-number"><%= seconds %></span>
                    <span class="simple-countdown-label"><%= secondsLabel %></span>
                </span>
            </li>
        </ul>
        </div>
</script>

<script type="text/html" id="wplx-self-hosted">
    <div class="c37-video-wrapper">
        <video <%= muted ? 'muted' : '' %> <%= autoplay ? 'autoplay' : ''%> <%= loop ? 'loop' : ''%>  <%= controls? 'controls' : '' %> controlsList="nodownload" poster="<%= poster %>"   >
        <source type="video/mp4" src="<%= mp4 %>">
        <source type="video/webm" src="<%= webm %>">
        <source type="video/ogg" src="<%= ogv %>">
        </video>
    </div>
</script>


<script type="text/html" id="wplx-text-input">
    <div class="c37-single-text-input">
        <% if (type==='hidden') { %>
        <input class="c37-child" id="<%= id %>" name="<%= name %>" type="<%= type %>" placeholder="<%= placeholder %>" />
        <% } else { %>
        <i class="fa <%= icon %> c37-suggest-icon"></i><input class="c37-child" id="<%= id %>" name="<%= name %>" type="<%= type %>" placeholder="<%= placeholder %>" />
        <% } %>
    </div>

</script>

<script type="text/html" id="wplx-radio">
    <div class="<%= alignment %>">
    <% _.each(options, function(item){ %>
        <label class="control control--radio"><%= decodeURIComponent(item.value) %>
            <input id="<% item.id %>" type="radio" <%= item.checked? "checked" : "" %> value="<%= decodeURIComponent(item.value) %>" name="<%= item.name %>">
            <div class="control__indicator"></div>
        </label>
    <% }) %>
    </div>
</script>

<script type="text/html" id="wplx-select">
        <div class="select full">
            <select>
                <% _.each(options, function(item){ %>
                <option <%= item.selected? 'selected' : '' %> value="<%= decodeURIComponent(item.value) %>"><%= decodeURIComponent(item.value) %></option>
                <% }) %>
            </select>
            <div class="select__arrow"></div>
        </div>
</script>

<script type="text/html" id="wplx-checkbox">
    <div class="<%= alignment %>">
        <% _.each(options, function(item){ %>
        <label class="control control--checkbox"> <%= decodeURIComponent(item.value) %>
            <input id="<% item.id %>" type="checkbox" <%= item.checked? "checked" : "" %> value="<%= decodeURIComponent(item.value) %>" name="<%= item.name %>">
            <div class="control__indicator"></div>
        </label>

        <% }) %>
    </div>
</script>

<script type="text/html" id="wplx-row">
    <div class="c37-row d-flex flex-row"  id="<%= editingElementID %>">
        boxPlaceholder
    </div>
</script>


<script type="text/html" id="wplx-wall">
    <div class="c37-wall d-flex flex-row"  id="<%= editingElementID %>">
        boxPlaceholder
    </div>
</script>

<script type="text/html" id="wplx-section">
    <section class="<%= containerClass %> c37-section"  id="<%= editingElementID %>">
        rowPlaceholder
    </section>
</script>


<script type="text/html" id="wplx-box">
    <div class="c37-col-md-<%= size.desktop %> c37-col-sm-<%= size.tablet %> c37-col-<%= size.phone %>">
        <div id="<%= editingElementID %>" class="c37-box <%= direction %> d-flex flex-column">

        </div>
    </div>

</script>