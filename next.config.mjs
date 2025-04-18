import { withPayload } from '@payloadcms/next/withPayload';


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  redirects: async () => [
    {
      source: "/",
      destination: "/admin",
      permanent: true,
    },
  ],
}

export default withPayload(nextConfig)
