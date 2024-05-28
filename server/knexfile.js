// knexfile.js
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "r00t_d3v3L0pm3nt",
      database: "esri_test",
    },
    migrations: {
      directory: "./migrations", // Lokasi direktori migrasi
    },
  },
};
