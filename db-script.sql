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
/* Bank A */ 
INSERT INTO users(name, address, dob, friendlyid, sanction,
balance, domain)
VALUES
('John Doe', 'cityA', '01011988', 'johndoe', true, 1000,
'banka.com');

INSERT INTO sanction(domain, bankname, sanction)
VALUES('bankb.com', 'Bank B', true);

/* Bank B */
INSERT INTO users(name, address, dob, friendlyid, sanction,
balance, domain)
VALUES
('Jane Smith', 'cityB', '31031991', 'janesmith', true, 2000,
'bankb.com');

INSERT INTO sanction(domain, bankname, sanction)
VALUES('banka.com', 'Bank A', true);

CREATE DATABASE bridgea OWNER bankauser;
CREATE DATABASE bridgeb OWNER bankbuser;
CREATE DATABASE compliancea OWNER bankauser;
CREATE DATABASE complianceb OWNER bankbuser;