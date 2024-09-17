"use client";

const { useContext, createContext, useState } = require("react");
const DataContext = createContext();

export default function ContextProvider({ children }) {
    const [innerWidth, setInnerWidth] = useState(2200);
    return (
        <DataContext.Provider value={{ innerWidth, setInnerWidth }}>
            {children}
        </DataContext.Provider>
    )
}
export const useDataContext = () => useContext(DataContext);