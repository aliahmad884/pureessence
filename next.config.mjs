/** @type {import('next').NextConfig} */
const nextConfig = {
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