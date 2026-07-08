import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MessageSection } from "@/components/site/message-section";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center pt-32">
        <MessageSection
          title="This page isn't here."
          body="The link may be broken, or the page may have moved. Either way, there's nothing at this address."
          cta={{ label: "Go back home", href: "/" }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
