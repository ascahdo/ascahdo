<?php
/**
 * Header template for Ascado Multi-NGO Theme
 *
 * @package Ascado
 */
if (!defined('ABSPATH')) {
    exit;
}
$ngo_config = function_exists('ascado_get_ngo_config') ? ascado_get_ngo_config() : array();
$primary_color = !empty($ngo_config['primaryColor']) ? $ngo_config['primaryColor'] : '#047857';
$secondary_color = !empty($ngo_config['secondaryColor']) ? $ngo_config['secondaryColor'] : '#065f46';
$accent_color = !empty($ngo_config['accentColor']) ? $ngo_config['accentColor'] : '#10b981';
?><!DOCTYPE html>
<html <?php language_attributes(); ?> <?php if (is_rtl()) echo 'dir="rtl"'; ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <style id="ascado-ngo-vars">
        :root {
            --ngo-primary: <?php echo esc_attr($primary_color); ?>;
            --ngo-secondary: <?php echo esc_attr($secondary_color); ?>;
            --ngo-accent: <?php echo esc_attr($accent_color); ?>;
        }
    </style>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
