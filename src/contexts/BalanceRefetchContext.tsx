import React from "react";

export const BalanceRefetchContext = React.createContext<() => void>(() => {});
export const useBalanceRefetch = () => React.useContext(BalanceRefetchContext);