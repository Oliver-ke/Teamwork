const Article = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS
      articles(
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "ownerId" VARCHAR(128) NOT NULL REFERENCES users(id),
        "title" VARCHAR(128) NOT NULL,
        "article" TEXT NOT NULL,
        "createdOn" date DEFAULT current_date,
        "authorName" VARCHAR(128) NOT NULL,
        "share" boolean DEFAULT true,
        "coverImageUrl" VARCHAR(128) NOT NULL
      )`;
export default Article;