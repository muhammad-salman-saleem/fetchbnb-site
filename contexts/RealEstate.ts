import React from "react";
import { RealEstate } from "../shared/interfaces/RealEstate";

export type DefaultRealEstateType = {
    general: { propertyCount: number },
    realEstate: RealEstate[] | []
};

const defaultRealEstate: DefaultRealEstateType = {
    realEstate: [],
    general: { propertyCount: 0 }
};
const defualtSetRealEstate: any = (x: DefaultRealEstateType) => { };

export const RealEstateContext = React.createContext([defaultRealEstate, defualtSetRealEstate]);