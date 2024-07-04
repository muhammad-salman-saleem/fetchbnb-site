import Script from 'next/script'
import React from 'react'

const GoogleAds = () => {
    return (
        <>
            <Script id="Google-ads-one" async src="https://www.googletagmanager.com/gtag/js?id=G-S0LE3XBP83" />
            <Script id="Google-ads-two">
                {` window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'AW-654253494');`}
            </Script>
            <Script id="manual-tracking">
                {
                    `function gtag_report_conversion(url) {
                var callback = function () {
                    if (typeof(url) != 'undefined') {
                    window.location = url;
                    }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-654253494/yrJSCM7NzoYYELa7_LcC',
                    'event_callback': callback
                });
                return false;
                }`
                }
            </Script>

        </>
    )
}

export default GoogleAds