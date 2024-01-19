/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false,
            }
        ]
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    }
}

module.exports = nextConfig
