const Comment = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS
      comments(
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "ownerId" VARCHAR(128) NOT NULL REFERENCES users(id),
        "postId" VARCHAR(128) NOT NULL,
        "createdOn" date DEFAULT current_date,
        "authorName" VARCHAR(128) NOT NULL,
        "comment" VARCHAR(128) NOT NULL
      )`;
export default Comment;