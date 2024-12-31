useradd bankauser
useradd bankbuser

passwd bankauser
passwd bankbuser

CREATE DATABASE banka OWNER bankauser;
CREATE DATABASE bankb OWNER bankbuser;

CREATE TABLE users (
name VARCHAR,
address VARCHAR,
dob INTEGER,
friendlyid VARCHAR PRIMARY KEY,
sanction BOOLEAN,
balance INTEGER,
domain VARCHAR
);

CREATE TABLE sanction (
domain VARCHAR,
bankname VARCHAR,
sanction BOOLEAN
);

CREATE TABLE transactions (
txid VARCHAR,
sender VARCHAR,
receiver VARCHAR,
amount INTEGER,
currency VARCHAR,
kyc_info VARCHAR
);

CREATE DATABASE bridgea OWNER bankauser;
CREATE DATABASE bridgeb OWNER bankbuser;
CREATE DATABASE compliancea OWNER bankauser;
CREATE DATABASE complianceb OWNER bankbuser;