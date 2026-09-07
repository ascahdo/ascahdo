<?php
/**
 * Plugin Name: Ascado Multi-NGO Core Engine
 * Plugin URI: https://ascado.org
 * Description: Core database models, Custom Post Types, and business logic for Multi-NGO Management: Members, Blood Bank, Training & Courses, Committee, Microcredit, Branches, and Payment Gateways (bKash, Nagad, Rocket).
 * Version: 1.0.0
 * Author: Ascado Foundation
 * Author URI: https://ascado.org
 * Text Domain: ascado-ngo-core
 * Domain Path: /languages
 * License: GPLv2 or later
 *
 * @package AscadoNGOCore
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ASCADO_NGO_CORE_VERSION', '1.0.0');
define('ASCADO_NGO_CORE_PATH', plugin_dir_path(__FILE__));
define('ASCADO_NGO_CORE_URL', plugin_dir_url(__FILE__));

/**
 * Register Custom Post Types for Multi-NGO Architecture
 */
function ascado_ngo_register_cpts() {
    // 1. Projects & Programs (প্রকল্প ও কার্যক্রম)
    register_post_type('ngo_project', array(
        'labels' => array(
            'name'               => __('Projects', 'ascado-ngo-core'),
            'singular_name'      => __('Project', 'ascado-ngo-core'),
            'add_new'            => __('Add New Project', 'ascado-ngo-core'),
            'add_new_item'       => __('Add New NGO Project', 'ascado-ngo-core'),
            'edit_item'          => __('Edit Project', 'ascado-ngo-core'),
            'all_items'          => __('All Projects', 'ascado-ngo-core'),
            'menu_name'          => __('NGO Projects', 'ascado-ngo-core'),
        ),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-portfolio',
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
    ));

    // 2. Member & Volunteer Management (সদস্য ও ভলান্টিয়ার)
    register_post_type('ngo_member', array(
        'labels' => array(
            'name'               => __('Members & Volunteers', 'ascado-ngo-core'),
            'singular_name'      => __('Member', 'ascado-ngo-core'),
            'add_new'            => __('Add New Member', 'ascado-ngo-core'),
            'add_new_item'       => __('Add New Member', 'ascado-ngo-core'),
            'all_items'          => __('All Members', 'ascado-ngo-core'),
            'menu_name'          => __('NGO Members', 'ascado-ngo-core'),
        ),
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-groups',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
    ));

    // 3. Committee Management (কমিটি পরিচালনা)
    register_post_type('ngo_committee', array(
        'labels' => array(
            'name'               => __('Committees', 'ascado-ngo-core'),
            'singular_name'      => __('Committee Member', 'ascado-ngo-core'),
            'add_new'            => __('Add Committee Member', 'ascado-ngo-core'),
            'all_items'          => __('Committee Directory', 'ascado-ngo-core'),
            'menu_name'          => __('Committee', 'ascado-ngo-core'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-businessman',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
    ));

    // 4. Training & Skill Courses (প্রশিক্ষণ ও কোর্স)
    register_post_type('ngo_course', array(
        'labels' => array(
            'name'               => __('Training & Courses', 'ascado-ngo-core'),
            'singular_name'      => __('Course', 'ascado-ngo-core'),
            'add_new'            => __('Add New Course', 'ascado-ngo-core'),
            'all_items'          => __('All Courses', 'ascado-ngo-core'),
            'menu_name'          => __('Courses & ERP', 'ascado-ngo-core'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-welcome-learn-more',
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
    ));

    // 5. Blood Donors (ব্লাড ব্যাংক ও ডোনার)
    register_post_type('ngo_donor', array(
        'labels' => array(
            'name'               => __('Blood Donors', 'ascado-ngo-core'),
            'singular_name'      => __('Blood Donor', 'ascado-ngo-core'),
            'add_new'            => __('Register Donor', 'ascado-ngo-core'),
            'all_items'          => __('Donor Directory', 'ascado-ngo-core'),
            'menu_name'          => __('Blood Donors', 'ascado-ngo-core'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-heart',
        'supports'     => array('title', 'custom-fields'),
    ));

    // 6. Notices & Press Releases (নোটিশ ও বিজ্ঞপ্তি)
    register_post_type('ngo_notice', array(
        'labels' => array(
            'name'               => __('Notices', 'ascado-ngo-core'),
            'singular_name'      => __('Notice', 'ascado-ngo-core'),
            'add_new'            => __('Publish Notice', 'ascado-ngo-core'),
            'all_items'          => __('All Notices', 'ascado-ngo-core'),
            'menu_name'          => __('Notices & News', 'ascado-ngo-core'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-megaphone',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
    ));

    // 7. Branches (শাখা ব্যবস্থাপনা)
    register_post_type('ngo_branch', array(
        'labels' => array(
            'name'               => __('Branches', 'ascado-ngo-core'),
            'singular_name'      => __('Branch', 'ascado-ngo-core'),
            'add_new'            => __('Add New Branch', 'ascado-ngo-core'),
            'all_items'          => __('All Branches', 'ascado-ngo-core'),
            'menu_name'          => __('Branch Network', 'ascado-ngo-core'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-location-alt',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
    ));

    // 8. Photo & Event Gallery (ফটো গ্যালারি)
    register_post_type('ngo_gallery', array(
        'labels' => array(
            'name'               => __('Galleries', 'ascado-ngo-core'),
            'singular_name'      => __('Gallery Item', 'ascado-ngo-core'),
            'add_new'            => __('Upload Photo', 'ascado-ngo-core'),
            'all_items'          => __('Photo Gallery', 'ascado-ngo-core'),
            'menu_name'          => __('Photo Gallery', 'ascado-ngo-core'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-format-gallery',
        'supports'     => array('title', 'thumbnail', 'custom-fields'),
    ));

    // Register Taxonomies
    register_taxonomy('project_category', array('ngo_project'), array(
        'labels'       => array('name' => __('Project Categories', 'ascado-ngo-core')),
        'hierarchical' => true,
        'show_in_rest' => true,
    ));

    register_taxonomy('blood_group', array('ngo_donor'), array(
        'labels'       => array('name' => __('Blood Groups', 'ascado-ngo-core')),
        'hierarchical' => true,
        'show_in_rest' => true,
    ));

    register_taxonomy('district_zone', array('ngo_donor', 'ngo_branch', 'ngo_member'), array(
        'labels'       => array('name' => __('Districts / Zones', 'ascado-ngo-core')),
        'hierarchical' => true,
        'show_in_rest' => true,
    ));
}
add_action('init', 'ascado_ngo_register_cpts', 0);

/**
 * Register REST API Endpoints for Multi-NGO Data
 */
add_action('rest_api_init', function () {
    // Member Registration Endpoint
    register_rest_route('ascado-ngo/v1', '/register-member', array(
        'methods'  => 'POST',
        'callback' => 'ascado_ngo_handle_member_registration',
        'permission_callback' => '__return_true',
    ));

    // Blood Request / Donor Registration Endpoint
    register_rest_route('ascado-ngo/v1', '/register-donor', array(
        'methods'  => 'POST',
        'callback' => 'ascado_ngo_handle_donor_registration',
        'permission_callback' => '__return_true',
    ));
});

function ascado_ngo_handle_member_registration($request) {
    $params = $request->get_json_params();
    $name = sanitize_text_field($params['name'] ?? '');
    $phone = sanitize_text_field($params['phone'] ?? '');
    $email = sanitize_email($params['email'] ?? '');
    $designation = sanitize_text_field($params['designation'] ?? 'General Member');
    $blood_group = sanitize_text_field($params['blood_group'] ?? '');
    $district = sanitize_text_field($params['district'] ?? '');

    if (empty($name) || empty($phone)) {
        return new WP_Error('missing_fields', 'Name and Phone are required', array('status' => 400));
    }

    $post_id = wp_insert_post(array(
        'post_title'   => $name,
        'post_type'    => 'ngo_member',
        'post_status'  => 'publish',
        'meta_input'   => array(
            '_member_phone'       => $phone,
            '_member_email'       => $email,
            '_member_designation' => $designation,
            '_member_blood_group' => $blood_group,
            '_member_district'    => $district,
            '_registered_at'      => current_time('mysql'),
        ),
    ));

    if (is_wp_error($post_id)) {
        return new WP_Error('insert_failed', 'Failed to register member', array('status' => 500));
    }

    return new WP_REST_Response(array(
        'success'   => true,
        'member_id' => $post_id,
        'message'   => 'Member registered successfully!',
    ), 201);
}

function ascado_ngo_handle_donor_registration($request) {
    $params = $request->get_json_params();
    $name = sanitize_text_field($params['name'] ?? '');
    $phone = sanitize_text_field($params['phone'] ?? '');
    $blood_group = sanitize_text_field($params['blood_group'] ?? '');
    $district = sanitize_text_field($params['district'] ?? '');

    if (empty($name) || empty($phone) || empty($blood_group)) {
        return new WP_Error('missing_fields', 'Name, Phone and Blood Group are required', array('status' => 400));
    }

    $post_id = wp_insert_post(array(
        'post_title'   => $name . ' (' . $blood_group . ')',
        'post_type'    => 'ngo_donor',
        'post_status'  => 'publish',
        'meta_input'   => array(
            '_donor_phone'       => $phone,
            '_donor_blood_group' => $blood_group,
            '_donor_district'    => $district,
            '_donor_available'   => 'yes',
        ),
    ));

    return new WP_REST_Response(array(
        'success'  => true,
        'donor_id' => $post_id,
        'message'  => 'Blood donor registered in database!',
    ), 201);
}
