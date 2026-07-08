// Shared navigation config for the public site header + footer.

// Desktop header nav (Insights intentionally lives in the footer + mobile only).
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// Mobile sheet nav — same as desktop plus Insights.
export const mobileNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export const servicesNav = [
  { label: "Executive Coaching", href: "/executive-coaching" },
  { label: "Keynote Speaking", href: "/speaking" },
  { label: "Emerging Leaders", href: "/emerging-leaders" },
  { label: "Programs", href: "/programs" },
] as const;

export const companyNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalNav = [
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
] as const;

export const BOOK_CALL_HREF = "/contact";
export const LINKEDIN_URL = "https://www.linkedin.com/in/vajiraweerasekera/";
