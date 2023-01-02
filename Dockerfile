# FROM ubuntu:bionic 
# w/o the tiledb base the tiledb wheel build takes ages
# *never waited long enough to see it actually finished
FROM tiledb/tiledb:latest

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
COPY [ "dist/",    "/cellxgene/dist/" ]

WORKDIR /cellxgene

#below is needed when building from ubuntu:bionic
#RUN apt-get update && apt-get install -y git build-essential libxml2-dev python3-dev python3-pip zlib1g-dev
ENV PATH="$PATH:/home/tiledb/.local/bin"
RUN pip3 install --upgrade pip
RUN pip3 install /cellxgene/dist/cellxgene-0.16.8.tar.gz --no-cache-dir


#ENTRYPOINT ["cellxgene"]
ENTRYPOINT ["sh"]
#ENTRYPOINT [ "/home/tiledb/.local/bin/cellxgene" ]

# RUN apt-get update && \
#     apt-get install -y build-essential libxml2-dev python3-dev python3-pip zlib1g-dev python3-requests python3-aiohttp && \
#     python3 -m pip install --upgrade pip && \
#     pip3 install cellxgene

# ENTRYPOINT ["cellxgene"]
