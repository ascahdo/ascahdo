<?php
/**
 * Ascado Theme Functions and Definitions
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

    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title.
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support('post-thumbnails');

    // Enable WooCommerce support if installed.
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Custom Logo Support.
    add_theme_support('custom-logo', array(
        'height'      => 80,
        'width'       => 280,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Responsive Embeds.
    add_theme_support('responsive-embeds');

    // Register Navigation Menus.
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'ascado'),
        'footer'  => esc_html__('Footer Menu', 'ascado'),
        'mobile'  => esc_html__('Mobile Quick Menu', 'ascado'),
    ));

    // Switch default core markup for search form, comment form, and comments to output valid HTML5.
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
}
add_action('after_setup_theme', 'ascado_theme_setup');

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
            'isRTL'          => is_rtl(),
            'locale'         => get_locale(),
            'isUserLoggedIn' => is_user_logged_in(),
            'currentUser'    => $current_user->exists() ? array(
                'id'       => $current_user->ID,
                'name'     => $current_user->display_name,
                'email'    => $current_user->user_email,
                'roles'    => $current_user->roles,
            ) : null,
            'i18n'           => array(
                'appName'        => esc_html__('Ascado', 'ascado'),
                'bloodSOS'       => esc_html__('Blood SOS', 'ascado'),
                'donateNow'      => esc_html__('Donate Now', 'ascado'),
                'cart'           => esc_html__('Cart', 'ascado'),
                'checkout'       => esc_html__('Checkout', 'ascado'),
                'licenseKey'     => esc_html__('License Key', 'ascado'),
                'download'       => esc_html__('Download', 'ascado'),
                'customerVault'  => esc_html__('Customer Digital Vault', 'ascado'),
            )
        )
    );
}
add_action('wp_enqueue_scripts', 'ascado_scripts');

/**
 * Register Custom REST API Endpoints for Headless or Hybrid WP Mode
 */
add_action('rest_api_init', function () {
    // 1. GET /wp-json/ascado/v1/info
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
                'languages'   => array('bn', 'en', 'ar'),
                'active_hubs' => array('marketplace', 'blood_bank', 'charity', 'somiti', 'school', 'real_estate', 'matrimony')
            ), 200);
        },
        'permission_callback' => '__return_true',
    ));

    // 2. GET /wp-json/ascado/v1/ping
    register_rest_route('ascado/v1', '/ping', array(
        'methods'  => 'GET',
        'callback' => function () {
            return new WP_REST_Response(array('pong' => true, 'timestamp' => time()), 200);
        },
        'permission_callback' => '__return_true',
    ));
});

/**
 * Built-in SEO Optimization (Yields automatically if Yoast, RankMath or AIOSEO is active)
 */
function ascado_theme_seo_meta_tags() {
    if (defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION')) {
        return;
    }

    $site_name = get_bloginfo('name');
    $description = get_bloginfo('description');
    if (empty($description)) {
        $description = 'ASCAHDO - Enterprise Multi-NGO Platform, Halal Marketplace, Emergency Blood SOS & School ERP.';
    }

    $current_url = esc_url((is_ssl() ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    ?>
    <!-- Ascado Built-in SEO Meta Tags -->
    <meta name="description" content="<?php echo esc_attr($description); ?>">
    <meta name="keywords" content="ASCAHDO, এসকাডো, হালাল মার্কেটপ্লেস, halal marketplace, রক্তদান, blood bank, সমিতি ও ঋণ, স্কুল সফটওয়্যার, zakat donation">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <link rel="canonical" href="<?php echo $current_url; ?>">

    <!-- Open Graph Protocol -->
    <meta property="og:site_name" content="<?php echo esc_attr($site_name); ?>">
    <meta property="og:title" content="<?php echo esc_attr(wp_get_document_title()); ?>">
    <meta property="og:description" content="<?php echo esc_attr($description); ?>">
    <meta property="og:url" content="<?php echo $current_url; ?>">
    <meta property="og:type" content="<?php echo is_single() ? 'article' : 'website'; ?>">
    <meta property="og:locale" content="<?php echo esc_attr(get_locale()); ?>">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo esc_attr(wp_get_document_title()); ?>">
    <meta name="twitter:description" content="<?php echo esc_attr($description); ?>">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "<?php echo esc_js($site_name); ?>",
        "url": "<?php echo esc_url(site_url()); ?>",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "<?php echo esc_url(site_url('/?s={search_term_string}')); ?>",
            "query-input": "required name=search_term_string"
        }
    }
    </script>
    <?php
}
add_action('wp_head', 'ascado_theme_seo_meta_tags', 1);

/**
 * Ascado WordPress Admin Settings Page
 */
function ascado_add_admin_menu() {
    add_menu_page(
        'Ascado Settings',
        'Ascado Portal',
        'manage_options',
        'ascado-settings',
        'ascado_settings_page_html',
        'dashicons-networking',
        25
    );
}
add_action('admin_menu', 'ascado_add_admin_menu');

function ascado_settings_page_html() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['ascado_save_settings']) && check_admin_referer('ascado_settings_verify')) {
        $cloud_url = sanitize_text_field($_POST['ascado_cloud_url']);
        $embed_mode = sanitize_text_field($_POST['ascado_embed_mode']);
        $default_lang = sanitize_text_field($_POST['ascado_default_lang']);

        update_option('ascado_cloud_url', $cloud_url);
        update_option('ascado_embed_mode', $embed_mode);
        update_option('ascado_default_lang', $default_lang);

        echo '<div class="notice notice-success is-dismissible"><p><strong>Ascado Portal settings updated successfully!</strong></p></div>';
    }

    $current_url = get_option('ascado_cloud_url', 'https://ais-pre-rwxbwksjszfduuryafono5-612448757717.asia-southeast1.run.app');
    $current_mode = get_option('ascado_embed_mode', 'spa');
    $current_lang = get_option('ascado_default_lang', 'bn');
    ?>
    <div class="wrap" style="max-width: 900px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;">
        <div style="background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; padding: 24px 28px; border-radius: 12px; margin: 20px 0 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                <div>
                    <h1 style="color: #fff; margin: 0 0 6px; font-weight: 800; font-size: 24px; letter-spacing: -0.5px;">ASCAHDO Integrated Portal Settings</h1>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">Connect and configure your Halal Marketplace, Emergency Blood SOS, School ERP & Community Welfare engine.</p>
                </div>
                <div style="background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700;">
                    v<?php echo ASCADO_VERSION; ?> Active
                </div>
            </div>
        </div>
        
        <form method="post" action="" style="background: #fff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <?php wp_nonce_field('ascado_settings_verify'); ?>
            <table class="form-table" style="margin-top: 0;">
                <tr>
                    <th scope="row" style="font-weight: 700; color: #1e293b; width: 220px;"><label for="ascado_cloud_url">Ascado Cloud / API URL</label></th>
                    <td>
                        <input name="ascado_cloud_url" type="url" id="ascado_cloud_url" value="<?php echo esc_attr($current_url); ?>" class="regular-text" style="width: 100%; max-width: 550px; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;" required>
                        <p class="description" style="margin-top: 8px; color: #64748b;">
                            This URL serves live data and powers the backend API (Halal Marketplace, Blood Donors, School ERP, Donations, AI Robot Assistant).
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row" style="font-weight: 700; color: #1e293b;">Portal Render Mode</th>
                    <td>
                        <fieldset>
                            <label style="display: block; margin-bottom: 10px; cursor: pointer;">
                                <input type="radio" name="ascado_embed_mode" value="spa" <?php checked($current_mode, 'spa'); ?>>
                                <strong style="color: #047857;">Native React App (Recommended)</strong>
                                <span style="display: block; color: #64748b; font-size: 13px; margin-left: 24px;">Loads bundled React assets directly in WordPress (#root). Fastest performance and seamless theme blending.</span>
                            </label>
                            <label style="display: block; cursor: pointer;">
                                <input type="radio" name="ascado_embed_mode" value="iframe" <?php checked($current_mode, 'iframe'); ?>>
                                <strong style="color: #0284c7;">Cloud Embed Iframe</strong>
                                <span style="display: block; color: #64748b; font-size: 13px; margin-left: 24px;">Loads cloud container inside a responsive full-screen iframe. Zero local asset footprint.</span>
                            </label>
                        </fieldset>
                    </td>
                </tr>

                <tr>
                    <th scope="row" style="font-weight: 700; color: #1e293b;"><label for="ascado_default_lang">Default Platform Language</label></th>
                    <td>
                        <select name="ascado_default_lang" id="ascado_default_lang" style="padding: 6px 14px; border-radius: 8px; border: 1px solid #cbd5e1;">
                            <option value="bn" <?php selected($current_lang, 'bn'); ?>>বাংলা (Bengali - Default)</option>
                            <option value="en" <?php selected($current_lang, 'en'); ?>>English</option>
                            <option value="ar" <?php selected($current_lang, 'ar'); ?>>العربية (Arabic RTL)</option>
                        </select>
                    </td>
                </tr>
            </table>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0 10px;">
                <h4 style="margin: 0 0 8px; color: #334155; font-size: 14px; font-weight: 700;">Diagnostic & System Information:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 13px; color: #64748b;">
                    <div>PHP Version: <strong><?php echo esc_html(phpversion()); ?></strong></div>
                    <div>WordPress: <strong><?php echo esc_html(get_bloginfo('version')); ?></strong></div>
                    <div>REST API: <strong style="color: #047857;">Active (/wp-json/ascado/v1)</strong></div>
                    <div>WooCommerce: <strong><?php echo class_exists('WooCommerce') ? '<span style="color:#047857">Installed</span>' : 'Optional'; ?></strong></div>
                </div>
            </div>
            
            <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <input type="submit" name="ascado_save_settings" id="submit" class="button button-primary" value="Save Configuration" style="background: #047857; border-color: #047857; padding: 4px 20px; font-weight: bold; height: 38px;">
                <a href="<?php echo esc_url($current_url); ?>" target="_blank" class="button button-secondary" style="height: 38px; line-height: 36px; font-weight: 600;">Test Live Cloud App &rarr;</a>
                <a href="<?php echo esc_url(site_url('/')); ?>" target="_blank" class="button button-secondary" style="height: 38px; line-height: 36px; font-weight: 600;">Visit Website Frontpage &rarr;</a>
            </div>
        </form>
    </div>
    <?php
}
