export {};

declare global {
  interface Window {
    fbq: any;
    gtag: any;
    gtag_report_conversion: any;
  }
}