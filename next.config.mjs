/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.6'],
  serverExternalPackages: ['sequelize', 'mysql2', 'mariadb'],
  images:{
    localPatterns:[
      {
        pathname:"/**"
      }
    ]
  }
};

export default nextConfig;