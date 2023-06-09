import './globals.css'
import { Figtree } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import SupabaseProvider from '@/providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import getSongsByUserId from '@/actions/getSongsByUserId'
import Player from '@/components/Player'
import getActiveProductsWithPrices from '@/actions/getActiveProductsWithPrices'
import Head from 'next/head';


const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Melodyy',
  description: 'Listen to music',
};

export const revalidate = 0; //don't want the layout to be cached

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();
  

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products}/>
          <Sidebar songs={userSongs}>
           {children}
          </Sidebar>
          <Player />
          </UserProvider>
        </SupabaseProvider>
        </body>
    </html>
  )
}
