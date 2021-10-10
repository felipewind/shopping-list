CREATE SCHEMA IF NOT EXISTS shop;

create table IF NOT EXISTS shop.USER_SHOPPING (
    userName varchar(20) not null,
    password varchar(20),
    primary key (userName)
);

create table IF NOT EXISTS shop.SHOPPING (
    shoppingName varchar(40) not null,
    userName varchar(20) not null,
    primary key (shoppingName, userName)
);

create table IF NOT EXISTS shop.PRODUCT (
    productName varchar(40) not null,
    shoppingName varchar(40) not null,
    userName varchar(20) not null,
    quantity integer not null,
    checked boolean not null,
    primary key (productName, shoppingName, userName)
);


