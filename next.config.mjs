/** @type {import('next').NextConfig} */
const nextConfig = {
  headers() {
      return [
        {
          source: "/favicon.ico",
          headers: [
            {
              key: "Content-Type",
              value: "image/x-icon",
            },
          ],
        },
      ];
  },
};

export default nextConfig;
