import { ChakraProvider } from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return <ChakraProvider>
    <Component {...pageProps} />
    <Analytics />
  </ChakraProvider>
}
