const User = `
    DROP TYPE IF EXISTS role_type;
    CREATE TYPE role_type AS ENUM ('admin', 'employee');
    CREATE TABLE IF NOT EXISTS
      users(
        id VARCHAR(128) NOT NULL,
        name VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        avater_url VARCHAR(128),
        role role_type,
        UNIQUE(email)
      )`;
export default User;
