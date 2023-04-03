/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  images: {
    dangerouslyAllowSVG: true,//need this to enable svg images through Image component
    domains: ["content.linkedin.com", "static-exp1.licdn.com", "www.iconsdb.com", "content.linkedin.com", "images.fastcompany.net", "rb.gy"],
  },
}