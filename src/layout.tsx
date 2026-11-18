import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "InviteKart — Free Online Invitation Maker",
  description: "Create beautiful free wedding, birthday and celebration invitations in English, Hindi, Marathi, Kannada, Tamil and Telugu.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
