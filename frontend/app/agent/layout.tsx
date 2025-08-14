import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Dashboard",
  description: "Dashboard for bus trip agents",
};

export default function AgentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>){ 
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}