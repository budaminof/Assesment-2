// Update with your config settings.

module.exports = {

    development: {
       client: 'postgresql',
       connection: process.env.DATABASE_URL,
           pool: {
            min:2,
            max:10,
           },
           seeds: {
                directory: './seeds/'
            }
       },


    production: {
      client: 'postgresql',
      connection: process.env.DATABASE_UR,
          pool: {
           min:2,
           max:10,
          }
        }


};
