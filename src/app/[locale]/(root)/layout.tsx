import Footer from "@/components/home/HomeFooter";
import Navigation from "@/components/home/HomeNavigation";
import BackgroundImage from "@/components/ui/background-image";
import { SupportButton } from "@/components/ui/support-button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative overflow-x-hidden bg-light">
      <Navigation />
      {children}
      <Footer />
      <SupportButton />
    </main>
  );
}
