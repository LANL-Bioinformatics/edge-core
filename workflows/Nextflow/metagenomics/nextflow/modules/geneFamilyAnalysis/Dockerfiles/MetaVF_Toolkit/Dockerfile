# syntax=docker/dockerfile:1
FROM continuumio/miniconda3:v25.11.1 AS build
ENV version=0.1.1

ENV container=docker

RUN git clone https://github.com/aw-watson/MetaVF_toolkit.git && \
    cd MetaVF_toolkit && git checkout b4f238f238dea0e831849cc568af5601ee10dc50

# add conda channels
RUN conda config --add channels conda-forge \
    && conda config --add channels bioconda

RUN conda init bash \
    && . ~/.bashrc \
    && conda env create --name MetaVF_toolkit -f /MetaVF_toolkit/env/MetaVF_toolkit_no_builds.yaml \
    && conda activate MetaVF_toolkit 

RUN gunzip /MetaVF_toolkit/databases/*.gz && chmod 755 /MetaVF_toolkit/metaVF.py

ENV PATH=/venv/bin:/MetaVF_toolkit:$PATH
RUN apt-get update && apt-get install procps -y && apt-get clean
    
SHELL ["/bin/bash", "-c"]
CMD /bin/bash
