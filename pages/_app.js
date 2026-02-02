import Head from 'next/head';
import { Analytics } from '@vercel/analytics/next';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Mirai Investment - Think Ahead. Grow Ahead. Professional mutual fund distribution and investment advisory in Hyderabad." />
        <title>Mirai Investment | Think Ahead. Grow Ahead.</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Outfit:wght@200;300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
