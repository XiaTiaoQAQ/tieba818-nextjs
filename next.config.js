/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        if (process.env.NODE_ENV === 'development') {
            return [
                {
                    source: '/818-api/:path*',
                    destination: 'http://localhost:12014/:path*',
                },
            ]
        }
        return [];
    }
}

module.exports = nextConfig
