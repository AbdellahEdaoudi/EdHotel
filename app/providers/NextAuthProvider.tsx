'use client' ;
// Import necessary modules
import { SessionProvider } from "next-auth/react";
// Define your custom session provider component
const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  );
};

// Export the custom session provider component as default
export default NextAuthProvider;
