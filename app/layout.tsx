import type React from "react"
import "./globals.css";

export const metadata = {
  
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
      
        {children}
   
  
      </body>
    </html>
  )
}




