FROM continuumio/miniconda3:v25.11.1 AS build
ENV version=1.7.1

ENV container=docker

# add conda channels
RUN conda config --add channels conda-forge \
    && conda config --add channels bioconda

RUN conda init bash \
    && . ~/.bashrc \
    && conda create --name assembly \
    && conda activate assembly 

# install dependencies
RUN conda install conda-libmamba-solver=25.11.0
RUN conda config --set solver libmamba

RUN conda install -n assembly -c bioconda samtools=1.17 racon=1.5 seqtk=1.3 flye=2.9.2 spades=3.15.5 minimap2=2.26 quast=5.2.0 megahit=1.2.9 unicycler=0.5.0 idba=1.1.3
RUN conda install -n assembly -c conda-forge python=3.9 

RUN wget https://github.com/ruanjue/wtdbg2/releases/download/v2.5/wtdbg-2.5_x64_linux.tgz \
    && tar -xvzf wtdbg-2.5_x64_linux.tgz \
    && cp wtdbg-2.5_x64_linux/* /opt/conda/envs/assembly/bin

RUN git clone https://gitlab.com/chienchi/long_read_assembly.git && \
    cd long_read_assembly && git checkout c504ecfd86cae702fa17f9a273b1913f6996535d

RUN conda install -c conda-forge conda-pack=0.8.1

RUN conda-pack -n assembly -o /tmp/env.tar && \
    mkdir /venv && cd /venv && tar xf /tmp/env.tar && \
    rm /tmp/env.tar

RUN /venv/bin/conda-unpack

FROM debian:trixie AS runtime

COPY --from=build /venv /venv


RUN apt-get update && apt-get install  procps -y && apt-get clean

ENV PATH="/venv/bin:/long_read_assembly:$PATH"
ENV PERL5LIB=/venv/lib/perl5/core_perl

SHELL ["/bin/bash", "-c"]
CMD /bin/bash