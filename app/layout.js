import { Inter,Prompt } from "next/font/google";
import "./globals.css";
import Header from "./Pages/Header";
import Footer from "./Pages/Footer";
import "animate.css"
import NextAuthProvider from "./providers/NextAuthProvider";
const inter = Inter({ subsets: ["latin"] });
const prompt = Prompt({ subsets: ["latin"], weight: '400' });


export const metadata = {
  title: "EdHotel",
  description: "Hotel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" >
      <head>
      <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
      </head>
      <body className={`${prompt.className}`}>
        <NextAuthProvider>
          <div className="sticky top-0   z-10">
            <Header />
          </div>
          {children}
          <Footer />
        </NextAuthProvider>

      </body>
    </html>
  );
}
