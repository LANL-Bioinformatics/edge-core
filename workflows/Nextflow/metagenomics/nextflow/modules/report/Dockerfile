# syntax=docker/dockerfile:1
FROM continuumio/miniconda3:v25.11.1 AS build
ENV version=0.5.1

ENV container=docker

# add conda channels
RUN conda config --add channels conda-forge \
    && conda config --add channels bioconda

RUN conda init bash \
    && . ~/.bashrc \
    && conda create --name report \
    && conda activate report 

RUN conda install -n report -c conda-forge r-base=4.5.2 r-gridextra=2.3 imagemagick=7.1.2_15
RUN conda install -n report -c bioconda perl-findbin=1.54 perl-pdf-api2=2.043
RUN conda install -c conda-forge conda-pack=0.8.1


RUN conda-pack -n report -o /tmp/env.tar && \
    mkdir /venv && cd /venv && tar xf /tmp/env.tar && \
    rm /tmp/env.tar

RUN /venv/bin/conda-unpack

FROM debian:trixie AS runtime
#RUN apk add --no-cache bash

COPY --from=build /venv /venv
RUN apt-get update && apt-get install procps=2:4.0.4-9 -y && apt-get clean
ENV PATH=/venv/bin:$PATH
ENV PERL5LIB=/venv/lib/perl5/core_perl
    
SHELL ["/bin/bash", "-c"]
CMD /bin/bash
