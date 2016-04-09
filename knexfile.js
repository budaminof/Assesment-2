// Update with your config settings.

module.exports = {

    development: {
       client: 'postgresql',
       connection: process.env.DATABASE_URL
       },
       seeds: {
            directory: './seeds/'
        },
    prodution: {
      client: 'postgresql',
      connection: process.env.DATABASE_UR
      }
      
};
