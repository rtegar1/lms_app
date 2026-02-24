// app/(main)/layout.tsx
import NavbarLandingPage from "@/components/navbar-landingpage";
import FooterLandingPage from "@/components/footer-landingpage";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarLandingPage />
      {children}
      <FooterLandingPage />
    </>
  );
}