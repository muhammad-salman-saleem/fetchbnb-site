import React, { FC, useState } from 'react'
import Image from 'next/image'
import useWindowDimensions from './hooks/useWindowDimensions';

const MainFeatureImages: FC<{ selectedFeature: string, showMobileFeatureImage: boolean, isMainFeaturesMobile: boolean }> = ({ selectedFeature, showMobileFeatureImage, isMainFeaturesMobile }) => {
    let width = 570;
    let height = 540;
    const images = ['/imgs/feature_1.svg', '/imgs/Ordinances image.svg', '/imgs/Coaching image.svg', '/imgs/Property Insights image.svg'];
    const isMobileState = useWindowDimensions();

    if (isMobileState.generalSize !== 'desktop') {
        width = 300;
        height = 300;
    }
    if (showMobileFeatureImage && isMainFeaturesMobile) {
        console.log("AAVVV")
        return (
            <Image src={images[parseInt(selectedFeature) - 1]} width={width} height={height} alt='' />
        )
    } else if (isMainFeaturesMobile === false && showMobileFeatureImage) {
        console.log("AAVVVB")
        return (
            <Image src={images[parseInt(selectedFeature) - 1]} width={width} height={height} alt='' />
        )
    }
    return <></>
}

export default MainFeatureImages