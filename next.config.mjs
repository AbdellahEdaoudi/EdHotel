/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Rules for HTML 
      config.module.rules.push({
        test: /\.html$/,
        use: ['html-loader'],
      });
  
      return config;
    },
    images:{
      domains :['https://lh3.googleusercontent.com']
    }
  };
  
  export default nextConfig;