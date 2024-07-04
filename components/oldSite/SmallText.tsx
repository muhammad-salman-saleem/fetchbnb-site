import React, { FC } from 'react'

const SmallText: FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <p style={{ fontWeight: 400, fontSize: "12px", lineHeight: "15px"}}>{children}</p>
    )
}

export default SmallText