<?php
/**
 * Template Name: Ascado School & Madrasa ERP
 * Description: Displays the Islamic School & Madrasa Management ERP directly within WordPress.
 *
 * @package Ascado
 * @version 1.0.0
 */
get_header();
$embed_mode = get_option('ascado_embed_mode', 'spa');
$cloud_url = get_option('ascado_cloud_url', 'https://ais-pre-rwxbwksjszfduuryafono5-612448757717.asia-southeast1.run.app');
?>

<script>
    window.ascadoDefaultView = 'school';
</script>

<main id="ascado-main-wrapper" role="main" style="width: 100%; min-height: 100vh; position: relative; background: #f8fafc;">
<?php if ($embed_mode === 'iframe') : ?>
    <iframe
        id="ascado-portal-frame"
        src="<?php echo esc_url($cloud_url . '#school'); ?>"
        style="width: 100%; min-height: 100vh; height: calc(100vh - var(--wp-admin--admin-bar--height, 0px)); border: none; outline: none; display: block;"
        allow="geolocation; microphone; camera; payment; clipboard-write;"
        loading="eager"
        title="Ascado School ERP"
    ></iframe>
<?php else : ?>
    <div id="root" style="min-height: 100vh; width: 100%;">
        <div style="min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Hind Siliguri', -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 40px 20px;">
            <div style="width: 52px; height: 52px; border: 4px solid #e0f2fe; border-top-color: #0284c7; border-radius: 50%; animation: ascado-spin 0.8s linear infinite; margin-bottom: 20px;"></div>
            <h2 style="color: #0284c7; font-size: 22px; font-weight: 800; margin: 0 0 10px;">স্কুল ও মাদ্রাসা ERP প্রস্তুত হচ্ছে...</h2>
            <p style="color: #64748b; font-size: 15px; margin: 0 0 20px; max-width: 480px; line-height: 1.6;">অনলাইন ভর্তি, ডিজিটাল ফি কালেকশন, রেজাল্ট শিট ও শিক্ষক-অভিভাবক পোর্টাল...</p>
        </div>
    </div>
<?php endif; ?>
</main>

<style>
@keyframes ascado-spin { to { transform: rotate(360deg); } }
html, body { margin: 0 !important; padding: 0 !important; overflow-x: hidden; width: 100%; min-height: 100%; background-color: #f8fafc; }
#ascado-main-wrapper { display: block; width: 100%; min-height: 100vh; }
</style>

<?php
get_footer();
