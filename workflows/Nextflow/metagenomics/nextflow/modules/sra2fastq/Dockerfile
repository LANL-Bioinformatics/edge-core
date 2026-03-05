# syntax=docker/dockerfile:1
FROM continuumio/miniconda3:v25.11.1
ENV version=1.6.4

# specify env variables (can check with echo env for ex.)
ENV container docker
# add directory relative to working directory
ADD sra2fastq_subroutines/* /opt/conda/bin/sra2fastq_subroutines/

# Update channels
RUN conda config --add channels conda-forge \
    && conda config --add channels bioconda

# Install packages
# run a command in terminal
RUN conda install -c bioconda sra-tools=3.0.3 enabrowsertools=1.5.4 pysradb=2.0.2 pigz=2.6
# RUN conda install -c conda-forge click=8.1.3

# add everything .py from working directory to specific location 
ADD *.py /opt/conda/bin/
# add to env
ENV PATH="${PATH}:/opt/conda/bin/sra2fastq_subroutines"

RUN apt-get update && apt-get install procps=2:4.0.4-9 -y && apt-get clean
# cmd and entry point similar
# cmd is run initiation. start shell and initialize /bin/bash
# entry point is for what the container calls every time container is run
#   less flexible
CMD ["/bin/bash"]

