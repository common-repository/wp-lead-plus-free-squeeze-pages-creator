<?php

/**
 * Created by PhpStorm.
 * User: luis
 * Date: 11/19/16
 * Time: 1:40 PM
 * All functions to manager the display of popup or widget appear here
 */
class C37_Display_Manager
{

    /**
     * Display the popup on post and page.
     * This function doesn't display the popup on homepage
     *
     * @param
     *            $content
     *            
     * @return string
     */
    public static function display_popup_on_post($content)
    {
        if (is_front_page())
            return $content;
        
        // check if the post has popup shortcode, if yes, return content as is
        if (has_shortcode($content, 'c37_lp_popup')) {
            return $content;
        }
        
        // get popup settings, if the display option is none (instead of whole site), return
        
        $wholeSiteArray = array(
            'post_type' => array(
                'page',
                C37LPPopupManager::C37_LP_POPUP_OPTION_POST_TYPE
            ),
            'meta_key' => C37LPPopupManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
            'meta_query' => array(
                array(
                    'key' => C37LPPopupManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
                    'value' => 'whole_site',
                    'compare' => '='
                )
            ),
            'orderby' => 'date',
            'order' => 'DESC',
            'posts_per_page' => 10
        );
        
        $popupContent = '';
        
        $wholeSiteOptions = new WP_Query($wholeSiteArray);
        
        if ($wholeSiteOptions->have_posts()) {
            
            foreach ($wholeSiteOptions->posts as $p) {
                $popupContent .= C37LPPopupManager::getPopupHTMLContent($p->ID);
            }
        }
        // if ($wholeSiteOptions->have_posts())
        // {
        //
        // $optionID = $wholeSiteOptions->posts[0]->ID;
        // $popupContent = C37LPPopupManager::getPopupHTMLContent($optionID);
        // }
        
        return $content . $popupContent;
    }

    public static function display_popup_on_woo()
    {
        if (is_front_page())
            return;
        
        // get popup settings, if the display option is none (instead of whole site), return
        
        $wholeSiteArray = array(
            'post_type' => array(
                'page',
                C37LPPopupManager::C37_LP_POPUP_OPTION_POST_TYPE
            ),
            'meta_key' => C37LPPopupManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
            'meta_query' => array(
                array(
                    'key' => C37LPPopupManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
                    'value' => 'whole_site',
                    'compare' => '='
                )
            ),
            'orderby' => 'date',
            'order' => 'DESC',
            'posts_per_page' => 10
        );
        
        $popupContent = '';
        
        $wholeSiteOptions = new WP_Query($wholeSiteArray);
        
        if ($wholeSiteOptions->have_posts()) {
            
            foreach ($wholeSiteOptions->posts as $p) {
                $popupContent .= C37LPPopupManager::getPopupHTMLContent($p->ID);
            }
        }
        // if ($wholeSiteOptions->have_posts())
        // {
        //
        // $optionID = $wholeSiteOptions->posts[0]->ID;
        // $popupContent = C37LPPopupManager::getPopupHTMLContent($optionID);
        // }
        
        echo $popupContent;
    }

    /**
     * Display the popup on homepage only
     */
    public static function display_popup_front_page()
    {
        $homepageArray = array(
            'post_type' => array(
                'page',
                C37LPPopupManager::C37_LP_POPUP_OPTION_POST_TYPE
            ),
            'meta_key' => C37LPPopupManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
            'meta_query' => array(
                array(
                    'key' => C37LPPopupManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
                    'value' => 'home_page_only',
                    'compare' => '='
                )
            ),
            'orderby' => 'date',
            'order' => 'DESC',
            'posts_per_page' => - 1
        );
        $wholeSiteArray = array(
            'post_type' => array(
                'page',
                C37LPPopupManager::C37_LP_POPUP_OPTION_POST_TYPE
            ),
            'meta_key' => C37LPPopupManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
            'meta_query' => array(
                array(
                    'key' => C37LPPopupManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
                    'value' => 'whole_site',
                    'compare' => '='
                )
            ),
            'orderby' => 'date',
            'order' => 'DESC'
            // 'posts_per_page' => -1,
        );
        if (is_front_page()) {
            $homepageOptions = new WP_Query($homepageArray);
            
            if ($homepageOptions->have_posts()) {
                $optionID = $homepageOptions->posts[0]->ID;
                echo (C37LPPopupManager::getPopupHTMLContent($optionID));
                // display the homepage popup from here
            } else {
                // in case there is no option for homepage, check if there is an option for whole site, if yes, display that popup
                $wholeSiteOptions = new WP_Query($wholeSiteArray);
                if ($wholeSiteOptions->have_posts()) {
                    // display the popup
                    foreach ($wholeSiteOptions->posts as $p) {
                        echo (C37LPPopupManager::getPopupHTMLContent($p->ID));
                    }
                }
            }
        }
    }

    /**
     * Display the widget on page, posts.
     * Widgets don't appear on homepage, only on page or posts
     *
     * @param
     *            $content
     * @return null
     */
    public static function display_widget_on_post($content)
    {
        if (is_front_page())
            return $content;
        
        // check if the post has popup shortcode, if yes, return content as is
        if (has_shortcode($content, 'c37_lp_widget')) {
            return $content;
        }
        
        $wholeSiteArray = array(
            'post_type' => array(
                'page',
                C37LPWidgetManager::C37_LP_WIDGET_OPTION_POST_TYPE
            ),
            'meta_key' => C37LPWidgetManager::C37_LP_WIDGET_META_WHERE_TO_DISPLAY,
            'meta_query' => array(
                array(
                    'key' => C37LPWidgetManager::C37_LP_WIDGET_META_WHERE_TO_DISPLAY,
                    'value' => 'whole_site',
                    'compare' => '='
                )
            ),
            'orderby' => 'date',
            'order' => 'DESC',
            'posts_per_page' => - 1
        );
        //
        // $byCategoryArray = array(
        // 'post_type' => array('page', C37LPWidgetManager::C37_LP_POPUP_OPTION_POST_TYPE),
        // 'meta_key' => C37LPWidgetManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
        // 'meta_query' =>
        // array(
        // array(
        // 'key' => C37LPWidgetManager::C37_LP_POPUP_META_WHERE_TO_DISPLAY,
        // 'value' => 'by_category',
        // 'compare' => '='
        // )
        // ),
        // 'orderby' => 'date',
        // 'order' => 'DESC',
        // 'posts_per_page' => -1,
        // );
        
        $wholeSiteOptions = new WP_Query($wholeSiteArray);
        
        if ($wholeSiteOptions->have_posts()) {
            for ($i = 0; $i < count($wholeSiteOptions->posts); $i ++) {
                $widgetOption = json_decode(rawurldecode($wholeSiteOptions->posts[$i]->post_content));
                $widgetHTML = C37LPWidgetManager::loadPageHTMLForWidget($widgetOption);
                
                $position = $widgetOption->positionOnPage->position;
                $afterParagraph = $widgetOption->positionOnPage->paragraph;
                if ($position == 'top') {
                    $content = $widgetHTML . $content;
                } else if ($position == 'bottom') {
                    $content = $content . $widgetHTML;
                } else {
                    $contentArray = explode("\n", $content);
                    
                    if ($afterParagraph >= count($contentArray))
                        $content = $content . $widgetHTML;
                    else if ($afterParagraph <= 0)
                        $content = $widgetHTML . $content;
                    else {
                        array_splice($contentArray, $widgetOption->positionOnPage->paragraph, 0, $widgetHTML);
                        $content = implode("\n", $contentArray);
                    }
                }
            }
        }
        // if ($wholeSiteOptions->have_posts())
        // {
        // while ($wholeSiteOptions->have_posts())
        // {
        // var_dump(the_post());
        // // //get only the first option
        // // $optionID = $wholeSiteOptions->posts[0]->ID;
        // // $popupContent = (C37LPWidgetManager::getWidgetHTMLContent($optionID));
        // }
        // }
        
        return $content;
    }
}