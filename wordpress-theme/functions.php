<?php
/**
 * Ascado Multi-NGO Enterprise WordPress Theme
 * Functions and Definitions
 *
 * Supports: WordPress Multisite, Multi-NGO Branding, Custom Post Types,
 * REST API, bKash/Nagad/Rocket Payment Gateways, and Native React SPA.
 *
 * @package Ascado
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

define('ASCADO_VERSION', '1.0.0');
define('ASCADO_THEME_DIR', get_template_directory());
define('ASCADO_THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function ascado_theme_setup() {
    // Make theme available for translation.
    load_theme_textdomain('ascado', ASCADO_THEME_DIR . '/languages');

    // Default RSS feeds
    add_theme_support('automatic-feed-links');

    // Document Title Tag
    add_theme_support('title-tag');

    // Post Thumbnails
    add_theme_support('post-thumbnails');

    // WooCommerce Support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Custom Logo
    add_theme_support('custom-logo', array(
        'height'      => 80,
        'width'       => 280,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Responsive Embeds & HTML5
    add_theme_support('responsive-embeds');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));

    // Navigation Menus
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'ascado'),
        'footer'  => esc_html__('Footer Menu', 'ascado'),
        'mobile'  => esc_html__('Mobile Quick Menu', 'ascado'),
    ));
}
add_action('after_setup_theme', 'ascado_theme_setup');

/**
 * Register Multi-NGO Custom Post Types if companion plugin is not active
 */
function ascado_register_theme_cpts() {
    if (post_type_exists('ngo_project')) {
        return; // Already registered by plugin
    }

    // Projects & Programs
    register_post_type('ngo_project', array(
        'labels' => array(
            'name'          => __('Projects & Programs', 'ascado'),
            'singular_name' => __('Project', 'ascado'),
            'add_new_item'  => __('Add New Project', 'ascado'),
            'menu_name'     => __('NGO Projects', 'ascado'),
        ),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-portfolio',
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
    ));

    // Member & Volunteer Management
    register_post_type('ngo_member', array(
        'labels' => array(
            'name'          => __('Members & Volunteers', 'ascado'),
            'singular_name' => __('Member', 'ascado'),
            'add_new_item'  => __('Add New Member', 'ascado'),
            'menu_name'     => __('NGO Members', 'ascado'),
        ),
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-groups',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
    ));

    // Committee Management
    register_post_type('ngo_committee', array(
        'labels' => array(
            'name'          => __('Committee Directory', 'ascado'),
            'singular_name' => __('Committee Member', 'ascado'),
            'add_new_item'  => __('Add Committee Member', 'ascado'),
            'menu_name'     => __('NGO Committee', 'ascado'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-businessman',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
    ));

    // Training & Courses
    register_post_type('ngo_course', array(
        'labels' => array(
            'name'          => __('Courses & Training', 'ascado'),
            'singular_name' => __('Course', 'ascado'),
            'add_new_item'  => __('Add Course', 'ascado'),
            'menu_name'     => __('NGO Courses', 'ascado'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-welcome-learn-more',
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
    ));

    // Blood Donors
    register_post_type('ngo_donor', array(
        'labels' => array(
            'name'          => __('Blood Donors', 'ascado'),
            'singular_name' => __('Blood Donor', 'ascado'),
            'add_new_item'  => __('Register Blood Donor', 'ascado'),
            'menu_name'     => __('Blood Donors', 'ascado'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-heart',
        'supports'     => array('title', 'custom-fields'),
    ));

    // Notices & News
    register_post_type('ngo_notice', array(
        'labels' => array(
            'name'          => __('Notices & News', 'ascado'),
            'singular_name' => __('Notice', 'ascado'),
            'add_new_item'  => __('Publish Notice', 'ascado'),
            'menu_name'     => __('NGO Notices', 'ascado'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-megaphone',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
    ));

    // Branch Management
    register_post_type('ngo_branch', array(
        'labels' => array(
            'name'          => __('Branch Network', 'ascado'),
            'singular_name' => __('Branch', 'ascado'),
            'add_new_item'  => __('Add Branch', 'ascado'),
            'menu_name'     => __('NGO Branches', 'ascado'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-location-alt',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
    ));

    // Gallery
    register_post_type('ngo_gallery', array(
        'labels' => array(
            'name'          => __('Photo Gallery', 'ascado'),
            'singular_name' => __('Gallery Item', 'ascado'),
            'add_new_item'  => __('Add Photo', 'ascado'),
            'menu_name'     => __('NGO Gallery', 'ascado'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-format-gallery',
        'supports'     => array('title', 'thumbnail', 'custom-fields'),
    ));
}
add_action('init', 'ascado_register_theme_cpts', 5);

/**
 * Multi-NGO Configuration Helper
 */
function ascado_get_ngo_config() {
    $defaults = array(
        'name'            => get_bloginfo('name'),
        'nameBn'          => 'আসকাডো মাল্টি-এনজিও প্ল্যাটফর্ম',
        'slogan'          => get_bloginfo('description'),
        'sloganBn'        => 'স্বচ্ছতা • সেবা • মানবকল্যাণ ও ডিজিটাল সমাজ উন্নয়ন',
        'logoUrl'         => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=240&auto=format&fit=crop&q=80',
        'faviconUrl'      => '',
        'regNo'           => 'NGO-AB-2026/09',
        'establishedYear' => '2018',
        'primaryColor'    => '#047857', // Emerald
        'secondaryColor'  => '#065f46',
        'accentColor'     => '#10b981',
        'phone'           => '+880 1711-000000',
        'hotline'         => '16256',
        'whatsapp'        => '+8801711000000',
        'email'           => get_bloginfo('admin_email'),
        'address'         => 'Central NGO Complex, Level 4, Dhaka-1000, Bangladesh',
        'addressBn'       => 'সেন্ট্রাল এনজিও কমপ্লেক্স, লেভেল-৪, ঢাকা-১০০০',
        'facebook'        => 'https://facebook.com',
        'youtube'         => 'https://youtube.com',
        'twitter'         => '',
        'bkashNumber'     => '01711000000',
        'nagadNumber'     => '01811000000',
        'rocketNumber'    => '01911000000',
        'bankDetails'     => 'Islami Bank Bangladesh Ltd, A/C: 2050XXXXXXXXX, Motijheel Branch',
        'heroTitle'       => 'Empowering Communities, Transforming Lives',
        'heroTitleBn'     => 'মানবতার কল্যাণে আমরা সদা জাগ্রত ও নিবেদিত',
        'heroSubtitle'    => 'Empowering society through education, healthcare, emergency blood support, and microcredit.',
        'heroSubtitleBn'  => 'শিক্ষা, জরুরি রক্তদান, দক্ষতা উন্নয়ন ও স্বাবলম্বিতা সৃষ্টির মাধ্যমে আত্মনির্ভরশীল সমাজ বিনির্মাণ।',
        'heroCtaText'     => 'Join as Member',
        'heroCtaTextBn'   => 'সদস্য হোন',
        'heroCtaLink'     => '#register',
        'heroBannerUrl'   => 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&auto=format&fit=crop&q=80',
        'statMembers'     => '১২,৫০০+',
        'statProjects'    => '১৪০+',
        'statBlood'       => '৩,২০০+',
        'statStudents'    => '৪,৮০০+',
        'modules'         => array(
            'ngo_management'   => true,
            'member_mgmt'      => true,
            'blood_bank'       => true,
            'training_courses' => true,
            'education_erp'    => true,
            'microcredit'      => true,
            'committee_mgmt'   => true,
            'registration'     => true,
            'payment_gateways' => true,
            'notices'          => true,
            'news'             => true,
            'gallery'          => true,
            'reports'          => true,
            'certificates'     => true,
            'branches'         => true,
        ),
    );

    $saved = get_option('ascado_ngo_config', array());
    return wp_parse_args($saved, $defaults);
}

/**
 * Enqueue scripts and styles.
 */
function ascado_scripts() {
    // Main Theme stylesheet.
    wp_enqueue_style('ascado-style', get_stylesheet_uri(), array(), ASCADO_VERSION);

    // Google Fonts (Hind Siliguri for Bangla, Inter for English, Amiri for Arabic)
    wp_enqueue_style(
        'ascado-fonts',
        'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Hind+Siliguri:wght@400;600;700&family=Inter:wght@400;600;800&display=swap',
        array(),
        null
    );

    // Scan for production compiled React CSS and JS bundle
    $possible_dirs = array(
        ASCADO_THEME_DIR . '/dist/assets' => ASCADO_THEME_URI . '/dist/assets/',
        ASCADO_THEME_DIR . '/assets'      => ASCADO_THEME_URI . '/assets/',
    );

    $js_file = '';
    $css_file = '';
    $asset_uri = '';

    foreach ($possible_dirs as $dir_path => $dir_uri) {
        if (is_dir($dir_path)) {
            $scanned = scandir($dir_path);
            foreach ($scanned as $file) {
                if (empty($js_file) && preg_match('/^index-.*\.js$/i', $file)) {
                    $js_file = $file;
                    $asset_uri = $dir_uri;
                }
                if (empty($css_file) && preg_match('/^index-.*\.css$/i', $file)) {
                    $css_file = $file;
                }
            }
            if (!empty($js_file)) {
                break;
            }
        }
    }

    if ($css_file && $asset_uri) {
        wp_enqueue_style('ascado-bundle-css', $asset_uri . $css_file, array(), ASCADO_VERSION);
    }

    if ($js_file && $asset_uri) {
        wp_enqueue_script('ascado-bundle-js', $asset_uri . $js_file, array(), ASCADO_VERSION, true);
    }

    // Config options
    $cloud_url = get_option('ascado_cloud_url', 'https://ais-pre-rwxbwksjszfduuryafono5-612448757717.asia-southeast1.run.app');
    $api_url = rtrim($cloud_url, '/') . '/api/v1';
    $embed_mode = get_option('ascado_embed_mode', 'spa');
    $default_lang = get_option('ascado_default_lang', 'bn');
    $ngo_config = ascado_get_ngo_config();

    // Pass WordPress data into JavaScript (window.ascadoWP)
    $current_user = wp_get_current_user();
    wp_localize_script(
        $js_file ? 'ascado-bundle-js' : 'ascado-style',
        'ascadoWP',
        array(
            'siteUrl'        => esc_url(site_url()),
            'restUrl'        => esc_url(get_rest_url(null, 'ascado/v1/')),
            'wpRestUrl'      => esc_url(get_rest_url()),
            'nonce'          => wp_create_nonce('wp_rest'),
            'themeUri'       => ASCADO_THEME_URI,
            'cloudUrl'       => esc_url($cloud_url),
            'apiUrl'         => esc_url($api_url),
            'embedMode'      => esc_attr($embed_mode),
            'defaultLang'    => esc_attr($default_lang),
            'isMultisite'    => is_multisite(),
            'siteId'         => get_current_blog_id(),
            'isRTL'          => is_rtl(),
            'locale'         => get_locale(),
            'ngoConfig'      => $ngo_config,
            'isUserLoggedIn' => is_user_logged_in(),
            'currentUser'    => $current_user->exists() ? array(
                'id'       => $current_user->ID,
                'name'     => $current_user->display_name,
                'email'    => $current_user->user_email,
                'roles'    => $current_user->roles,
            ) : null,
        )
    );
}
add_action('wp_enqueue_scripts', 'ascado_scripts');

/**
 * Register Custom REST API Endpoints for Multi-NGO Architecture
 */
add_action('rest_api_init', function () {
    // GET /wp-json/ascado/v1/ngo-profile
    register_rest_route('ascado/v1', '/ngo-profile', array(
        'methods'  => 'GET',
        'callback' => function () {
            $config = ascado_get_ngo_config();
            return new WP_REST_Response(array(
                'status'     => 'ok',
                'multisite'  => is_multisite(),
                'site_id'    => get_current_blog_id(),
                'ngo'        => $config,
            ), 200);
        },
        'permission_callback' => '__return_true',
    ));

    // GET /wp-json/ascado/v1/info
    register_rest_route('ascado/v1', '/info', array(
        'methods'  => 'GET',
        'callback' => function () {
            $cloud_url = get_option('ascado_cloud_url', 'https://ais-pre-rwxbwksjszfduuryafono5-612448757717.asia-southeast1.run.app');
            return new WP_REST_Response(array(
                'status'      => 'ok',
                'name'        => get_bloginfo('name'),
                'description' => get_bloginfo('description'),
                'url'         => site_url(),
                'version'     => ASCADO_VERSION,
                'cloud_url'   => $cloud_url,
                'api_url'     => rtrim($cloud_url, '/') . '/api/v1',
                'multisite'   => is_multisite(),
            ), 200);
        },
        'permission_callback' => '__return_true',
    ));
});

/**
 * Multi-NGO WordPress Admin Dashboard Menu & Customizer
 */
function ascado_register_admin_menus() {
    // Top Level Menu
    add_menu_page(
        'Ascado Multi-NGO Admin',
        'Multi-NGO Portal',
        'manage_options',
        'ascado-ngo-settings',
        'ascado_ngo_settings_page_html',
        'dashicons-networking',
        20
    );

    add_submenu_page(
        'ascado-ngo-settings',
        'NGO Branding & Colors',
        'Branding & Theme Colors',
        'manage_options',
        'ascado-ngo-settings',
        'ascado_ngo_settings_page_html'
    );

    add_submenu_page(
        'ascado-ngo-settings',
        'Payments & Gateways',
        'bKash / Nagad / Payments',
        'manage_options',
        'ascado-ngo-payments',
        'ascado_ngo_payments_page_html'
    );

    add_submenu_page(
        'ascado-ngo-settings',
        'Multi-NGO Modules',
        '15 NGO Modules',
        'manage_options',
        'ascado-ngo-modules',
        'ascado_ngo_modules_page_html'
    );

    add_submenu_page(
        'ascado-ngo-settings',
        'WordPress Multisite Guide',
        'Multisite Network',
        'manage_options',
        'ascado-ngo-multisite',
        'ascado_ngo_multisite_page_html'
    );
}
add_action('admin_menu', 'ascado_register_admin_menus');

/**
 * Render Settings Page 1: Branding & Theme Colors
 */
function ascado_ngo_settings_page_html() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['ascado_save_ngo_branding']) && check_admin_referer('ascado_ngo_verify')) {
        $config = ascado_get_ngo_config();

        $config['name']            = sanitize_text_field($_POST['ngo_name'] ?? '');
        $config['nameBn']          = sanitize_text_field($_POST['ngo_name_bn'] ?? '');
        $config['slogan']          = sanitize_text_field($_POST['ngo_slogan'] ?? '');
        $config['sloganBn']        = sanitize_text_field($_POST['ngo_slogan_bn'] ?? '');
        $config['logoUrl']         = esc_url_raw($_POST['ngo_logo_url'] ?? '');
        $config['regNo']           = sanitize_text_field($_POST['ngo_reg_no'] ?? '');
        $config['establishedYear'] = sanitize_text_field($_POST['ngo_est_year'] ?? '');
        $config['primaryColor']    = sanitize_hex_color($_POST['ngo_primary_color'] ?? '#047857');
        $config['secondaryColor']  = sanitize_hex_color($_POST['ngo_secondary_color'] ?? '#065f46');
        $config['accentColor']     = sanitize_hex_color($_POST['ngo_accent_color'] ?? '#10b981');
        $config['phone']           = sanitize_text_field($_POST['ngo_phone'] ?? '');
        $config['whatsapp']        = sanitize_text_field($_POST['ngo_whatsapp'] ?? '');
        $config['email']           = sanitize_email($_POST['ngo_email'] ?? '');
        $config['address']         = sanitize_textarea_field($_POST['ngo_address'] ?? '');
        $config['facebook']        = esc_url_raw($_POST['ngo_facebook'] ?? '');
        $config['youtube']         = esc_url_raw($_POST['ngo_youtube'] ?? '');

        update_option('ascado_ngo_config', $config);
        echo '<div class="notice notice-success is-dismissible"><p><strong>NGO Branding, Colors & Contact updated successfully!</strong></p></div>';
    }

    $config = ascado_get_ngo_config();
    ?>
    <div class="wrap" style="max-width: 960px;">
        <div style="background: linear-gradient(135deg, <?php echo esc_attr($config['primaryColor']); ?> 0%, <?php echo esc_attr($config['secondaryColor']); ?> 100%); color: #fff; padding: 24px 28px; border-radius: 12px; margin: 20px 0 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                <div>
                    <h1 style="color: #fff; margin: 0 0 6px; font-weight: 800; font-size: 24px;">🏢 Multi-NGO Branding & Theme Customizer</h1>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">Customize this NGO's Name, Logo, Theme Colors, Slogan, and Contact Details.</p>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 700;">
                    <?php echo is_multisite() ? 'Multisite Sub-Site Active' : 'Single Site Mode'; ?>
                </div>
            </div>
        </div>

        <form method="post" action="" style="background: #fff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <?php wp_nonce_field('ascado_ngo_verify'); ?>
            <h3 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0;">1. Organization Identity</h3>
            <table class="form-table">
                <tr>
                    <th><label>NGO Name (English)</label></th>
                    <td><input type="text" name="ngo_name" value="<?php echo esc_attr($config['name']); ?>" class="regular-text" style="width: 100%; max-width: 480px;" required></td>
                </tr>
                <tr>
                    <th><label>সংগঠনের নাম (বাংলায়)</label></th>
                    <td><input type="text" name="ngo_name_bn" value="<?php echo esc_attr($config['nameBn']); ?>" class="regular-text" style="width: 100%; max-width: 480px;"></td>
                </tr>
                <tr>
                    <th><label>Slogan / Tagline</label></th>
                    <td><input type="text" name="ngo_slogan" value="<?php echo esc_attr($config['slogan']); ?>" class="regular-text" style="width: 100%; max-width: 480px;"></td>
                </tr>
                <tr>
                    <th><label>স্লোগান (বাংলায়)</label></th>
                    <td><input type="text" name="ngo_slogan_bn" value="<?php echo esc_attr($config['sloganBn']); ?>" class="regular-text" style="width: 100%; max-width: 480px;"></td>
                </tr>
                <tr>
                    <th><label>NGO Logo URL</label></th>
                    <td>
                        <input type="url" name="ngo_logo_url" value="<?php echo esc_attr($config['logoUrl']); ?>" class="regular-text" style="width: 100%; max-width: 480px;">
                        <p class="description">Upload in Media Library and paste the Image URL here.</p>
                    </td>
                </tr>
                <tr>
                    <th><label>Govt Registration No</label></th>
                    <td><input type="text" name="ngo_reg_no" value="<?php echo esc_attr($config['regNo']); ?>" class="regular-text"></td>
                </tr>
            </table>

            <h3 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 30px;">2. Theme Brand Colors</h3>
            <table class="form-table">
                <tr>
                    <th><label>Primary Theme Color</label></th>
                    <td>
                        <input type="color" name="ngo_primary_color" value="<?php echo esc_attr($config['primaryColor']); ?>" style="height: 38px; width: 60px; vertical-align: middle; border: none; cursor: pointer;">
                        <span style="font-family: monospace; font-weight: bold; margin-left: 10px;"><?php echo esc_html($config['primaryColor']); ?></span>
                    </td>
                </tr>
                <tr>
                    <th><label>Secondary Theme Color</label></th>
                    <td>
                        <input type="color" name="ngo_secondary_color" value="<?php echo esc_attr($config['secondaryColor']); ?>" style="height: 38px; width: 60px; vertical-align: middle; border: none; cursor: pointer;">
                        <span style="font-family: monospace; font-weight: bold; margin-left: 10px;"><?php echo esc_html($config['secondaryColor']); ?></span>
                    </td>
                </tr>
                <tr>
                    <th><label>Accent Highlight Color</label></th>
                    <td>
                        <input type="color" name="ngo_accent_color" value="<?php echo esc_attr($config['accentColor']); ?>" style="height: 38px; width: 60px; vertical-align: middle; border: none; cursor: pointer;">
                        <span style="font-family: monospace; font-weight: bold; margin-left: 10px;"><?php echo esc_html($config['accentColor']); ?></span>
                    </td>
                </tr>
            </table>

            <h3 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 30px;">3. Contact & Social Links</h3>
            <table class="form-table">
                <tr>
                    <th><label>Contact Phone</label></th>
                    <td><input type="text" name="ngo_phone" value="<?php echo esc_attr($config['phone']); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label>WhatsApp Number</label></th>
                    <td><input type="text" name="ngo_whatsapp" value="<?php echo esc_attr($config['whatsapp']); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label>Official Email</label></th>
                    <td><input type="email" name="ngo_email" value="<?php echo esc_attr($config['email']); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label>Head Office Address</label></th>
                    <td><textarea name="ngo_address" rows="3" class="large-text"><?php echo esc_textarea($config['address']); ?></textarea></td>
                </tr>
                <tr>
                    <th><label>Facebook Page Link</label></th>
                    <td><input type="url" name="ngo_facebook" value="<?php echo esc_attr($config['facebook']); ?>" class="regular-text" style="width: 100%; max-width: 480px;"></td>
                </tr>
                <tr>
                    <th><label>YouTube Channel Link</label></th>
                    <td><input type="url" name="ngo_youtube" value="<?php echo esc_attr($config['youtube']); ?>" class="regular-text" style="width: 100%; max-width: 480px;"></td>
                </tr>
            </table>

            <p class="submit">
                <input type="submit" name="ascado_save_ngo_branding" class="button button-primary" value="Save NGO Branding & Colors" style="background: <?php echo esc_attr($config['primaryColor']); ?>; border-color: <?php echo esc_attr($config['primaryColor']); ?>; padding: 4px 24px; font-weight: bold; height: 38px;">
            </p>
        </form>
    </div>
    <?php
}

/**
 * Render Settings Page 2: Payments & Gateways (bKash / Nagad / Rocket)
 */
function ascado_ngo_payments_page_html() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['ascado_save_ngo_payments']) && check_admin_referer('ascado_ngo_payments_verify')) {
        $config = ascado_get_ngo_config();
        $config['bkashNumber']  = sanitize_text_field($_POST['bkash_number'] ?? '');
        $config['nagadNumber']  = sanitize_text_field($_POST['nagad_number'] ?? '');
        $config['rocketNumber'] = sanitize_text_field($_POST['rocket_number'] ?? '');
        $config['bankDetails']  = sanitize_textarea_field($_POST['bank_details'] ?? '');
        update_option('ascado_ngo_config', $config);
        echo '<div class="notice notice-success is-dismissible"><p><strong>Payment gateways updated!</strong></p></div>';
    }

    $config = ascado_get_ngo_config();
    ?>
    <div class="wrap" style="max-width: 860px;">
        <h2>💳 NGO Payment Gateways (Donations, Course Fees & Zakat)</h2>
        <p>Set up your organization's verified numbers for bKash, Nagad, Rocket, and Bank accounts.</p>

        <form method="post" action="" style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <?php wp_nonce_field('ascado_ngo_payments_verify'); ?>
            <table class="form-table">
                <tr>
                    <th><label>bKash (Merchant / Personal)</label></th>
                    <td>
                        <input type="text" name="bkash_number" value="<?php echo esc_attr($config['bkashNumber']); ?>" class="regular-text">
                        <span style="display: inline-block; margin-left: 10px; color: #e11d48; font-weight: bold;">bKash Send Money / Merchant</span>
                    </td>
                </tr>
                <tr>
                    <th><label>Nagad (Merchant / Personal)</label></th>
                    <td>
                        <input type="text" name="nagad_number" value="<?php echo esc_attr($config['nagadNumber']); ?>" class="regular-text">
                        <span style="display: inline-block; margin-left: 10px; color: #ea580c; font-weight: bold;">Nagad Account</span>
                    </td>
                </tr>
                <tr>
                    <th><label>Rocket Number</label></th>
                    <td>
                        <input type="text" name="rocket_number" value="<?php echo esc_attr($config['rocketNumber']); ?>" class="regular-text">
                        <span style="display: inline-block; margin-left: 10px; color: #7c3aed; font-weight: bold;">Rocket 12-digit Number</span>
                    </td>
                </tr>
                <tr>
                    <th><label>Bank Account Details</label></th>
                    <td>
                        <textarea name="bank_details" rows="3" class="large-text"><?php echo esc_textarea($config['bankDetails']); ?></textarea>
                        <p class="description">Bank Name, Account Title, Account Number, Branch & Routing Number.</p>
                    </td>
                </tr>
            </table>

            <p class="submit">
                <input type="submit" name="ascado_save_ngo_payments" class="button button-primary" value="Save Payment Gateways">
            </p>
        </form>
    </div>
    <?php
}

/**
 * Render Settings Page 3: 15 NGO Modules
 */
function ascado_ngo_modules_page_html() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['ascado_save_ngo_modules']) && check_admin_referer('ascado_ngo_modules_verify')) {
        $config = ascado_get_ngo_config();
        $submitted_modules = $_POST['modules'] ?? array();
        
        $module_keys = array(
            'ngo_management', 'member_mgmt', 'blood_bank', 'training_courses',
            'education_erp', 'microcredit', 'committee_mgmt', 'registration',
            'payment_gateways', 'notices', 'news', 'gallery', 'reports', 'certificates', 'branches'
        );

        foreach ($module_keys as $mk) {
            $config['modules'][$mk] = !empty($submitted_modules[$mk]);
        }

        update_option('ascado_ngo_config', $config);
        echo '<div class="notice notice-success is-dismissible"><p><strong>NGO Modules configuration saved!</strong></p></div>';
    }

    $config = ascado_get_ngo_config();
    $mods = $config['modules'] ?? array();
    ?>
    <div class="wrap" style="max-width: 900px;">
        <h2>⚙️ 15 Core Multi-NGO Modules</h2>
        <p>Enable or disable modules according to this NGO's activities:</p>

        <form method="post" action="" style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <?php wp_nonce_field('ascado_ngo_modules_verify'); ?>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
                <?php
                $modules_list = array(
                    'ngo_management'   => '🏢 NGO Central Management',
                    'member_mgmt'      => '👥 Member / Volunteer Management',
                    'blood_bank'       => '🩸 Emergency Blood Bank & SOS',
                    'training_courses' => '🎓 Training & Vocational Courses',
                    'education_erp'    => '📚 Education / Madrasa & School ERP',
                    'microcredit'      => '💰 Microcredit & Somiti Savings',
                    'committee_mgmt'   => '📋 Executive Committee Management',
                    'registration'     => '📝 Online Membership Registration',
                    'payment_gateways' => '💳 bKash / Nagad Fee & Donation Collection',
                    'notices'          => '📢 Official Notice Board',
                    'news'             => '📰 News & Press Releases',
                    'gallery'          => '📸 Event Photo Gallery',
                    'reports'          => '📊 Activity & Financial Reports',
                    'certificates'     => '📄 Digital Certificate Verification',
                    'branches'         => '📍 District & Upazila Branches',
                );

                foreach ($modules_list as $key => $title) {
                    $checked = !empty($mods[$key]);
                    ?>
                    <label style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
                        <input type="checkbox" name="modules[<?php echo esc_attr($key); ?>]" value="1" <?php checked($checked); ?>>
                        <strong style="font-size: 13.5px; color: #1e293b;"><?php echo esc_html($title); ?></strong>
                    </label>
                    <?php
                }
                ?>
            </div>

            <p class="submit" style="margin-top: 25px;">
                <input type="submit" name="ascado_save_ngo_modules" class="button button-primary" value="Save Active Modules">
            </p>
        </form>
    </div>
    <?php
}

/**
 * Render Settings Page 4: Multisite Architecture Guide
 */
function ascado_ngo_multisite_page_html() {
    ?>
    <div class="wrap" style="max-width: 900px;">
        <h2>🌐 WordPress Multisite Multi-NGO Architecture</h2>
        <div style="background: #fff; padding: 24px 28px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h3 style="color: #047857; margin-top: 0;">How WordPress Multisite Works for Multiple NGOs:</h3>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                With WordPress Multisite, a single WordPress installation can host <strong>hundreds of distinct NGOs or organizations</strong>.
                Each sub-site gets its own isolated admin dashboard, logo, theme colors, members, blood donors, courses, and committee members!
            </p>

            <pre style="background: #0f172a; color: #38bdf8; padding: 16px; border-radius: 8px; font-size: 13px; overflow-x: auto;">
Main Central Portal (Network Admin)
  ├── Sub-site 1: Anjuman NGO (anjuman.yourdomain.com) -> Custom Logo, Green Theme, Its Own Members
  ├── Sub-site 2: Al-Falah Welfare (alfalah.yourdomain.com) -> Custom Logo, Blue Theme, Blood Bank Focus
  └── Sub-site 3: Barisal Somiti (somiti.yourdomain.com) -> Microcredit, Savings & Loan Ledger
            </pre>

            <h4 style="margin-top: 20px;">Steps to Enable WordPress Multisite on your Hosting:</h4>
            <ol style="font-size: 13.5px; line-height: 1.8; color: #334155;">
                <li>Open your <code>wp-config.php</code> file and add:
                    <code style="background: #f1f5f9; padding: 2px 6px; font-weight: bold;">define('WP_ALLOW_MULTISITE', true);</code>
                </li>
                <li>Go to WordPress Dashboard &rarr; <strong>Tools &rarr; Network Setup</strong>.</li>
                <li>Choose Sub-domains (e.g., <code>ngo1.domain.com</code>) or Sub-directories (e.g., <code>domain.com/ngo1/</code>).</li>
                <li>Copy the provided lines to your <code>wp-config.php</code> and <code>.htaccess</code>.</li>
                <li>Now go to <strong>My Sites &rarr; Network Admin &rarr; Sites &rarr; Add New</strong> to create a site for each NGO!</li>
            </ol>
        </div>
    </div>
    <?php
}
