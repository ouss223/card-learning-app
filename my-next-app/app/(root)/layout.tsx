import Navbar from "../components/Navbar";
import React from 'react';
import "../globals.css";

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default Layout;
