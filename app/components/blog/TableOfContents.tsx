"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Get all h2 and h3 elements from the article
    const elements = document.querySelectorAll("article h2, article h3");
    const items: Heading[] = Array.from(elements).map((el) => {
      // Ensure each heading has an id
      if (!el.id) {
        el.id = el.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: parseInt(el.tagName[1]),
      };
    });
    setHeadings(items);

    // Setup intersection observer to track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
        目录
      </h4>
      <ul className="space-y-2 border-l border-border">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block text-sm py-1 px-4 transition-all hover:text-primary relative",
                heading.level === 3 && "ml-4",
                activeId === heading.id
                  ? "text-primary font-medium border-l-2 border-primary -ml-[2px]"
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
