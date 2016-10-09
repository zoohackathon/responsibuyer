CREATE DATABASE responsibuyer;

CREATE TABLE product_category (
    id serial primary key,
    name varchar not null,
    description text
);

CREATE TABLE product (
    id serial primary key,
    name varchar not null,
    description text,
    product_category_id integer not null references product_category(id)
);

CREATE TABLE wildlife (
    id serial primary key,
    genus varchar not null,
    species varchar not null,
    common_name varchar not null,
    info text,
    image_link varchar,
    conservation_status char(2) not null,
    unique(genus, species)
);

CREATE TABLE wildlife_trade (
    id serial primary key,
    wildlife_id integer not null references wildlife(id),
    product_category_id integer references product_category(id),
    date date,
    count integer,
    country_code char(2),
    lat double precision,
    lng double precision
);
