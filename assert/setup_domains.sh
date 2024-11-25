#!/bin/bash

# Update hosts file
echo "127.0.1.1 banka.com banka" | sudo tee -a /etc/hosts
echo "127.0.1.1 bankb.com bankb" | sudo tee -a /etc/hosts

# Install required tools
sudo apt-get update
sudo apt-get install -y libnss3-tools apache2

# Set up mkcert
mkdir -p mkcert
cd mkcert
wget https://github.com/FiloSottile/mkcert/releases/download/v1.1.2/mkcert-v1.1.2-linux-amd64
mv mkcert-v1.1.2-linux-amd64 mkcert
chmod +x mkcert

# Install mkcert and generate certificates
./mkcert -install
./mkcert banka.com
./mkcert bankb.com

# Create web directories
sudo mkdir -p /var/www/banka
sudo mkdir -p /var/www/bankb

# Create stellar.toml files
echo "FEDERATION_SERVER=\"https://banka.com/federation\"
AUTH_SERVER=\"https://banka.com/auth\"
SIGNING_KEY=\"BANK_A_SIGNING_KEY\"
NODE_NAMES=[\"BANK_A_NODE_NAME\"]" > /var/www/banka/.well-known/stellar.toml

echo "FEDERATION_SERVER=\"https://bankb.com/federation\"
AUTH_SERVER=\"https://bankb.com/auth\"
SIGNING_KEY=\"BANK_B_SIGNING_KEY\"
NODE_NAMES=[\"BANK_B_NODE_NAME\"]" > /var/www/bankb/.well-known/stellar.toml

# Copy Apache configuration
sudo cp apache2.conf /etc/apache2/apache2.conf

# Enable SSL module
sudo a2enmod ssl
sudo a2enmod rewrite

# Restart Apache
sudo systemctl restart apache2