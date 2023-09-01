/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/818-api/:path*',
                destination: 'http://localhost:8080/:path*',
            },
        ]
    }
}

module.exports = nextConfig
