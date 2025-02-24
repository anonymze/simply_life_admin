import '@/styles/app.css';

import React from 'react';


export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
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
