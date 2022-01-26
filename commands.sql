CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    url text NOT NULL,
    title text,
    likes integer DEFAULT 0
);

SELECT * FROM blogs;