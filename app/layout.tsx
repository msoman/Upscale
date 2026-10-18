import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/provider";
export const metadata: Metadata = {
  title: "UPSCALE — Your next chapter starts here",
  description: "The creative workspace for ambitious small businesses.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
