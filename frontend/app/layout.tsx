import type { Metadata } from "next"; 
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import the Navbar component
import { AuthProvider } from "@/lib/AuthContext"; // Import AuthProvider

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Suhani Bus",
  description: "Book your bus tickets with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Navbar /> {/* Render the Navbar component */}
          <main  >{children}</main>
        </AuthProvider> {/* Close AuthProvider */}
      </body>
    </html>
  );
}
