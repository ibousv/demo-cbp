# 
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    apache2 \
    libnss3-tools \
    wget \
    curl \
    postgresql \
    postgresql-contrib \
    && rm -rf /var/lib/apt/lists/*

RUN curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" \
    && chmod +x mkcert-v*-linux-amd64 \
    && mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert

RUN useradd -m -s /bin/bash bankauser \
    && useradd -m -s /bin/bash bankbuser

WORKDIR /opt/stellar

# Stellar Federation Server 
RUN wget https://github.com/stellar/go/releases/download/federation-v0.2.1/federation-v0.2.1-linux-amd64.tar.gz \
    && tar -xzf federation-v0.2.1-linux-amd64.tar.gz \
    && rm federation-v0.2.1-linux-amd64.tar.gz

# Bridge Server and Compliance Server 
RUN wget https://github.com/stellar-deprecated/bridge-server/releases/download/v0.0.31/bridge-v0.0.31-linux-amd64.tar.gz \
    && tar -xzf bridge-v0.0.31-linux-amd64.tar.gz \
    && rm bridge-v0.0.31-linux-amd64.tar.gz \
    && wget https://github.com/stellar-deprecated/bridge-server/releases/download/v0.0.31/compliance-v0.0.31-linux-amd64.tar.gz \
    && tar -xzf compliance-v0.0.31-linux-amd64.tar.gz \
    && rm compliance-v0.0.31-linux-amd64.tar.gz

RUN chown -R root:root /opt/stellar
CMD service postgresql start && tail -f /dev/null
