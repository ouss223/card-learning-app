import Navbar from "../components/Navbar";
import React from 'react';
import NavbarWrapper from "../components/NavbarWrapper";

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        
        <div>
            <NavbarWrapper />
            {children}
        </div>
    );
};

export default Layout;
