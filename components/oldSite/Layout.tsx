import React, { FC } from 'react'

const Layout: FC<{ children: React.ReactNode, style: any }> = ({ children, style }) => {
    return (
        <div style={{ maxWidth: "1074px", padding: "0px 45px", margin: "0 auto", height: "100%", width: "100%", ...style }}>{children}</div>
    )
}

export default Layout