# syntax=docker/dockerfile:1
FROM continuumio/miniconda3:v25.11.1 AS build
ENV version=0.6.1

ENV container=docker

# add conda channels
RUN conda config --add channels conda-forge \
    && conda config --add channels bioconda

RUN conda init bash \
    && . ~/.bashrc \
    && conda create --name annotation \
    && conda activate annotation 

RUN conda install -n annotation -c bioconda perl-lwp-protocol-https=6.15 prokka=1.15.6 mummer=3.23 blast=2.16 perl-yaml=1.30
RUN conda install -n annotation -c conda-forge r-base=4.3.0
RUN conda install -c conda-forge conda-pack=0.8.1

#Custom implementation of RATT from EDGE
RUN wget https://ref-db.edgebioinformatics.org/EDGE/dev/edge_dev_thirdParty_softwares.tgz \
    && tar -xvzf edge_dev_thirdParty_softwares.tgz \
    && tar -xvzf thirdParty/RATT.tar.gz -C . \
    && mv RATT /opt/conda/envs/annotation/opt


#pack environment for runtime image
RUN conda-pack -n annotation -o /tmp/env.tar && \
    mkdir /venv && cd /venv && tar xf /tmp/env.tar && \
    rm /tmp/env.tar

RUN /venv/bin/conda-unpack

FROM debian:latest AS runtime

COPY --from=build /venv /venv

ENV PATH=/venv/bin:/venv/opt/RATT:$PATH
RUN apt-get update && apt-get install  procps -y && apt-get clean

SHELL ["/bin/bash", "-c"]
CMD /bin/bash
