import React from "react";
import { HistoricalOverview } from "../shared/interfaces/historicalOverview";

export type ReadOnlyType = {
    propertyTitle: string,
    historicalOverview: HistoricalOverview[]
};

export const defaultReadOnly: ReadOnlyType = {
    propertyTitle: "Los Angeles, CA",
    historicalOverview: []
};
const defaultSetReadOnly: any = (x: ReadOnlyType) => { };

export const ReadOnlyContext = React.createContext([defaultReadOnly, defaultSetReadOnly]);