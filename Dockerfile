# 
FROM ubuntu:22.04

WORKDIR /opt/stellar

RUN chown -R root:root /opt/stellar

EXPOSE 8001 8002 8003 8004 8005 8006 8007 8008 8009 5000 5100