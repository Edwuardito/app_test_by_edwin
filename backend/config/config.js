import mssql from "mssql";

const connectionStrings = {
  server: "DESKTOP-N9PD4TO",
  authentication: {
    type: "default",
    options: {
      userName: "sa",
      password: "123456",
    },
  },
  options: {
    port: 1433,
    database: "db_users",
    trustServerCertificate: true,
  },
};

export const poolPromise = new mssql.ConnectionPool(connectionStrings)
  .connect()
  .then((pool) => {
    console.log("Conexión a la base de datos establecida");
    return pool;
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1);
  });
