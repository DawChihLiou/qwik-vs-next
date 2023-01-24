import Footer from "~/components/Footer";
import Header from "~/components/Header";
import "~/styles/globals.css";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="night">
      <body>
        <main>
          <Header />
          <div className="container mx-auto px-4">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
