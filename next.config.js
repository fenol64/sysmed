/** @type {import('next').NextConfig} */
const nextConfig = {
    // add minimize false to optimization
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        config.optimization.minimize = false;
        return config;
    },
}

module.exports = nextConfig
