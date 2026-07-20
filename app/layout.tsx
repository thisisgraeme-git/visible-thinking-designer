import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Visible Thinking Designer",
    template: "%s · Visible Thinking Designer",
  },
  description:
    "A design workbench for making consequential learner thinking visible.",
  openGraph: {
    title: "Visible Thinking Designer",
    description:
      "Design learning that leaves consequential learner thinking visible.",
    images: [
      {
        url: "/visible-thinking-designer-og.png",
        width: 1200,
        height: 630,
        alt: "Visible Thinking Designer — Make judgement visible.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visible Thinking Designer",
    description:
      "Design learning that leaves consequential learner thinking visible.",
    images: ["/visible-thinking-designer-og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ">
      <body>{children}</body>
    </html>
  );
}
