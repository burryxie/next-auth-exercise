import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Auth Tutorial",
  description: "Next Auth Tutorial",
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
