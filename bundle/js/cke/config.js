
CKEDITOR.editorConfig = function( config ) {
    config.toolbar = [
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'lineheight', 'Superscript', 'TextColor', 'BGColor', 'SpecialChar'] },
        '/',
        { name: 'paragraph', items: [ 'NumberedList', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
        '/',
        { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] }
    ];


    config.removeDialogTabs = 'link:advanced';

    config.extraPlugins = 'richcombo';
    config.extraPlugins = 'lineheight';
    config.extraPlugins = 'ckeditor-gwf-plugin';
    config.extraPlugins = 'colordialog';
    config.font_names = 'GoogleWebFonts;' + config.font_names;
    config.line_height="1em;1.1em;1.2em;1.3em;1.4em;1.5em;1.8em" ;
};