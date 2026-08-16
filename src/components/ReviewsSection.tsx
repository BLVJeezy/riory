import { useEffect, useRef } from "react";

const JOTFORM_SCRIPT_URL =
  "https://www.jotform.com/website-widgets/embed/01a00a8013e870008dcb68202b3014aa71c2";

const ReviewsSection = () => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const container = document.getElementById(
      "JFWebsiteWidget-01a00a8013e870008dcb68202b3014aa71c2"
    );
    if (!container || scriptLoaded.current) return;

    const script = document.createElement("script");
    script.src = JOTFORM_SCRIPT_URL;
    script.async = true;
    container.appendChild(script);
    scriptLoaded.current = true;

    return () => {
      script.remove();
    };
  }, []);

  return (
    <section id="reviews" className="section-padding bg-background overflow-hidden">
      <div className="section-container px-4 sm:px-6 md:px-8">
        <div
          id="JFWebsiteWidget-01a00a8013e870008dcb68202b3014aa71c2"
          className="w-full min-h-[200px]"
        />
      </div>
    </section>
  );
};

export default ReviewsSection;
