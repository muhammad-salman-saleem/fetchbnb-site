import React from "react";
import styles from '../styles/HistoricalGraph.module.css';
import { ResponsiveLine } from '@nivo/line'

const HistoricalGraph: React.FC<{ data: any, color: string[] }> = ({ data, color }) => {
    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 0, bottom: 30, left: 0 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            yFormat=" >-.2f"
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            enableGridY={false}
            enableGridX={false}
            colors={color}
            pointSize={5}
            pointColor={{ from: 'color', modifiers: [] }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableCrosshair={true}
            crosshairType="x"
            useMesh={true}
            legends={[]}
            motionConfig="stiff"
            tooltip={(tooltip) => {
                return (
                    <div className={styles.historical__label}>
                        <span className={styles.historical__graphfont}>Beds: {parseInt(tooltip.point.id)}</span>
                        <br />
                        <span className={styles.historical__graphfont}>{tooltip.point.data.xFormatted}: {tooltip.point.data.yFormatted}</span>
                    </div>
                )
            }}
        />
    )
}

export default HistoricalGraph;