const Gif = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS
      gifs(
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "ownerId" VARCHAR(128) NOT NULL REFERENCES users(id),
        "title" VARCHAR(128) NOT NULL,
        "createdAt" date DEFAULT current_date,
        "authorName" VARCHAR(128) NOT NULL,
        "share" boolean DEFAULT true,
        "image" VARCHAR(128) NOT NULL
      )`;
export default Gif;
