export const event = async (url: string) => {
    try {
        await window.gtag_report_conversion(undefined);
    } catch (e) {
        throw new Error("gtag error");
    }
}