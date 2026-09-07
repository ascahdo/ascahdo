<?php
/**
 * Template Name: Ascado Full Multi-Hub Portal
 * Description: Displays the full unified Ascado multi-hub platform (all services & hubs).
 *
 * @package Ascado
 * @version 1.0.0
 */
get_header();
$embed_mode = get_option('ascado_embed_mode', 'spa');
$cloud_url = get_option('ascado_cloud_url', 'https://ais-pre-rwxbwksjszfduuryafono5-612448757717.asia-southeast1.run.app');
?>

<script>
    window.ascadoDefaultView = 'home';
</script>

<main id="ascado-main-wrapper" role="main" style="width: 100%; min-height: 100vh; position: relative; background: #f8fafc;">
<?php if ($embed_mode === 'iframe') : ?>
    <iframe
        id="ascado-portal-frame"
        src="<?php echo esc_url($cloud_url); ?>"
        style="width: 100%; min-height: 100vh; height: calc(100vh - var(--wp-admin--admin-bar--height, 0px)); border: none; outline: none; display: block;"
        allow="geolocation; microphone; camera; payment; clipboard-write;"
        loading="eager"
        title="Ascado Full Multi-Hub Portal"
    ></iframe>
<?php else : ?>
    <div id="root" style="min-height: 100vh; width: 100%;">
        <div style="min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Hind Siliguri', -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 40px 20px;">
            <div style="width: 52px; height: 52px; border: 4px solid #e2e8f0; border-top-color: #047857; border-radius: 50%; animation: ascado-spin 0.8s linear infinite; margin-bottom: 20px;"></div>
            <h2 style="color: #047857; font-size: 22px; font-weight: 800; margin: 0 0 10px; letter-spacing: -0.5px;">ASCAHDO Integrated Platform</h2>
            <p style="color: #64748b; font-size: 15px; margin: 0 0 20px; max-width: 480px; line-height: 1.6;">হালাল মার্কেটপ্লেস, রক্তদান SOS, স্কুল ERP ও সার্বিক সমাজকল্যাণ পোর্টাল প্রস্তুত হচ্ছে...</p>
            <noscript>
                <div style="background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 14px 20px; border-radius: 8px; font-size: 14px; max-width: 500px;">
                    পোর্টালটি ব্যবহার করতে অনুগ্রহ করে আপনার ব্রাউজারের জাভাস্ক্রিপ্ট (JavaScript) সক্রিয় করুন।
                </div>
            </noscript>
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
