import React, { useState } from "react"
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import Script from 'next/script';
import Head from 'next/head'
import * as fbq from '../lib/fpixel'
import { DefaultRealEstateType, RealEstateContext } from "../contexts/RealEstate";
import { FilterContext } from "../contexts/FiltersContext";
import { ReadOnlyContext, defaultReadOnly, ReadOnlyType } from "../contexts/ReadOnlyContext";
import Image from "next/image";
import GoogleAds from '../components/oldSite/GoogleAds';
//tset
export default function App({ Component, pageProps: { session, ...pageProps } }: any) {
  const [selectedProperty, setSelectedProperty] = useState({});
  const [readOnly, setReadOnly] = useState<ReadOnlyType>(defaultReadOnly);
  const [realEstate, setRealEstate] = useState<DefaultRealEstateType>({
    realEstate: [],
    general: { propertyCount: 0 }
  });
  const [filters, setFilters] = useState<any>({
    search: 'Los Angeles, California',
    filters: {
      investorType: "purchase",
      propertyType: "house",
      hasHoaFees: false,
      minBeds: 1,
      minBaths: 1,
      reducedPrice: false,
      hideForeclosure: false,
      hoaMax: '',
      zipCode: '',
      daysOnMarket: 0,
      sort: 'relevant'
    }
  });
  return (
    <>
      {/* Global Site Code Pixel - Facebook Pixel */}
      <Head>
        <title>Fetchit</title>
        <meta name="facebook-domain-verification" content="g7nlwsxlh6kwt7vbpjmjysriwzanzh" />
      </Head>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1331407027430027');
          fbq('track', 'PageView');
          `,
        }}
      />
      <noscript><Image alt='' height="1" width="1" style={{ display: "none" }}
        src="https://www.facebook.com/tr?id=1331407027430027&ev=PageView&noscript=1"
      /></noscript>
      <Script id="tapjndsg" src="https://script.tapfiliate.com/tapfiliate.js" type="text/javascript" async />
      <Script
        id="tapfiliate"
        dangerouslySetInnerHTML={{
          __html: `
          (function(t,a,p){t.TapfiliateObject=a;t[a]=t[a]||function(){
            (t[a].q=t[a].q||[]).push(arguments)}})(window,'tap');
      
            tap('create', '40671-48dd10', { integration: "stripe" });
            tap('detect');
          `,
        }} />
      <Script
        id="rewardful1"
        dangerouslySetInnerHTML={{
          __html: `
        (function(w,r){w._rwq = r;w[r]=w[r]||function(){(w[r].q = w[r].q || []).push(arguments)}})(window,'rewardful'); 
          `,
        }} />
      <Script id="rewardful2" async src='https://r.wdfl.co/rw.js' data-rewardful='3f6c3d' />
      <GoogleAds />
      <ReadOnlyContext.Provider value={[readOnly, setReadOnly]}>
        <FilterContext.Provider value={[filters, setFilters]}>
          <RealEstateContext.Provider value={[realEstate, setRealEstate]}>
            <SessionProvider session={session}>
              <Component {...pageProps} />
            </SessionProvider>
          </RealEstateContext.Provider>
        </FilterContext.Provider>
      </ReadOnlyContext.Provider>
    </>
  )
}
