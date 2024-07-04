import { useState, useEffect } from 'react';

export type ViewPortSettings = {
    width: number;
    height: number;
    generalSize: string;
    microAdjustments: {
        isMainFeaturesMobile: boolean;
    }
}


function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
function getIsMobile() {
    if (getWindowDimensions().width < 501) {
        return 'mobile';
    }
    if (getWindowDimensions().width < 990) {
        return 'tablet';
    }
    return 'desktop';
}

function getMicroAdjustments() {
    const { width, height } = getWindowDimensions();
    return {
        isMainFeaturesMobile: width <= 756
    }
}

export default function useWindowDimensions(): ViewPortSettings {
    const [windowDimensions, setWindowDimensions] = useState({ width: 991, height: 969 });
    const [isMobile, setIsMobile] = useState('desktop');
    const [microAdjustments, setMicroAdjustments] = useState<ViewPortSettings['microAdjustments']>({ isMainFeaturesMobile: false });

    useEffect(() => {
        setWindowDimensions(getWindowDimensions());
        setIsMobile(getIsMobile());

        function handleResize() {
            console.log('resize');

            setWindowDimensions(getWindowDimensions());
            const currentMobile = getIsMobile();
            if (currentMobile === 'tablet') {
                setIsMobile('tablet');
            } else if (currentMobile === 'mobile') {
                setIsMobile('mobile');
            } else {
                setIsMobile('desktop');
            }
            setMicroAdjustments(getMicroAdjustments());
        }
        setMicroAdjustments(getMicroAdjustments());

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width: windowDimensions.width,
        height: windowDimensions.height,
        generalSize: isMobile,
        microAdjustments
    }
}
