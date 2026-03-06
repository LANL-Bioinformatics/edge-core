# syntax=docker/dockerfile:1
FROM continuumio/miniconda3:v25.11.1 AS build
ENV version=1.2.1

ENV container=docker

# add conda channels
RUN conda config --add channels conda-forge \
    && conda config --add channels bioconda

RUN conda init bash \
    && . ~/.bashrc \
    && conda create --name phageFinder \
    && conda activate phageFinder 

# install dependencies for phageFinder
RUN conda install -n phageFinder -c bioconda aragorn=1.2.41 blast-legacy=2.2.26 hmmer=3.4 trnascan-se=2.0.12
RUN conda install -c conda-forge conda-pack=0.8.1

RUN conda-pack -n phageFinder -o /tmp/env.tar && \
    mkdir /venv && cd /venv && tar xf /tmp/env.tar && \
    rm /tmp/env.tar

RUN /venv/bin/conda-unpack

#we need the version of phage_finder from EDGE's third-party database to handle some bugs

RUN wget https://ref-db.edgebioinformatics.org/EDGE/dev/edge_dev_thirdParty_softwares.tgz \
    && tar -xvzf edge_dev_thirdParty_softwares.tgz \
    && tar -xvzf thirdParty/phage_finder_v2.1.tar.gz -C .


RUN chmod -R a+rx phage_finder_v2.1/* 

FROM debian:trixie AS runtime

COPY --from=build /venv /venv
COPY --from=build /phage_finder_v2.1 /venv/opt/phage_finder_v2.1
ENV PATH=/venv/opt/phage_finder_v2.1/bin:/venv/bin:$PATH
RUN apt-get update && apt-get install procps=2:4.0.4-9 -y && apt-get clean
    
SHELL ["/bin/bash", "-c"]
CMD /bin/bash
