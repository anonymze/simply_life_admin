import '@/styles/app.css';

import React from 'react';


export const metadata = {
  description: 'Admin office for Simply Life',
  title: 'Admin office for Simply Life',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
