import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Header from "@/components/Header";
import FloatingAd from "@/components/FloatingAd";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import Analytics from "@/components/Analytics";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ダイエットタイプ診断｜あなたの痩せ方、見つかる",
  description: "16タイプのダイエット性格診断で、あなたに合った続けやすい方法を発見。24問・約3分で完了。性格傾向に合わせたアプローチをご提案します。",
  keywords: "ダイエット,診断,MBTI,性格,痩せる,減量,健康,フィットネス",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://diet-type16.com'),
  authors: [{ name: "ダイエットタイプ診断" }],
  creator: "ダイエットタイプ診断",
  publisher: "ダイエットタイプ診断",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'ダイエットタイプ診断',
    locale: 'ja_JP',
    type: 'website',
    title: "ダイエットタイプ診断｜あなたの痩せ方、見つかる",
    description: "16タイプのダイエット性格診断で、あなたに最適なダイエット方法を発見。24問・約3分で完了。",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ダイエットタイプ診断',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ダイエットタイプ診断｜あなたの痩せ方、見つかる",
    description: "16タイプのダイエット性格診断で、あなたに最適なダイエット方法を発見。24問・約3分で完了。",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5911899389259411"
             crossOrigin="anonymous"></script>
        <StructuredData />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <Header />
        {children}
        <Footer />
        <Analytics />
        <FloatingAd 
          imageUrl="/line-ad.png"
          linkUrl="https://lin.ee/S61FXhE"
          altText="LINE公式アカウント"
          closable={true}
        />
        
        {/* Google Analytics */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
