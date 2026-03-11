# syntax=docker/dockerfile:1
FROM continuumio/miniconda3:v25.11.1 AS build
ENV version=0.2

ENV container=docker

# add conda channels
RUN conda config --add channels conda-forge && \
    conda config --add channels bioconda

#TODO: evaluate if all environments here are required for running PathoFact2, given that our interest is in VF prediction
RUN conda create -n rgi_env -c conda-forge -c bioconda rgi=6.0.3 -y 
RUN conda create -n PathoFact_env -c conda-forge -c bioconda snakemake=7.25.0 Python=3.11.4 pandas=2.2.2 -y 
RUN conda create -n deeparg_env  -c defaults  -c conda-forge -c bioconda python=2.7.18 diamond=0.9.24 cxx-compiler=1.11.0 pip=19.3.1 -y 
RUN conda create -n amrfinder_plus_env -c conda-forge -c bioconda ncbi-amrfinderplus=3.12.8 -y 
RUN conda create -n genomad -c conda-forge -c bioconda genomad=1.8.0 -y

RUN conda init bash \
    && . ~/.bashrc 

#update databases for amrfinder_plus--the database update doesn't support a custom location, so we'll do it in the container
#as opposed to putting the DBs elsewhere, which we do for other tools
#TODO: examine need for AMRfinder and deeparg
RUN /opt/conda/envs/amrfinder_plus_env/bin/amrfinder -u 

#install DeepARG
RUN /opt/conda/envs/deeparg_env/bin/pip install git+https://github.com/gaarangoa/deeparg.git


#copy in custom PF2 config needed for setup.
COPY EDGE_PF2_Config.yaml /EDGE_PF2_Config.yaml

#get PF2 release
RUN wget https://gitlab.com/uniluxembourg/lcsb/systems-ecology/pathofact2/-/archive/submission-v1.0/pathofact2-submission-v1.0.tar.gz && \
    tar -xzf pathofact2-submission-v1.0.tar.gz \
    && mv pathofact2-submission-v1.0 PathoFact2
# create empty files to satisfy Snakemake rules, run Snakemake to generate needed conda environments
# Without this step, running the Snakemake pipeline attempts to create those environments at runtime, and will create
# errors due to running out of space in non-writeable containers
RUN mkdir -p /abs/path/to/PathoFact2/DATABASES/HMM \
    && mkdir -p /dry/run \
    && mkdir /prefix \
    && echo "#sample_name/folder,abs_path_to_contigs,input_type,extension(if folder)" > /abs/path/to/PathoFact2/list_of_samples.csv \
    && echo "Test_contigs,/dry/run/contigs.fa,contigs" >> /abs/path/to/list_of_samples.csv \
    && echo "#end" >> /abs/path/to/PathoFact2/list_of_samples.csv \
    && touch /dry/run/contigs.fa \
    && touch /abs/path/to/PathoFact2/DATABASES/HMM/virulence_factors_CDD.hmm \
    && conda run -n PathoFact_env snakemake -s /PathoFact2/Main.smk -c4 --configfile /EDGE_PF2_Config.yaml --use-conda --conda-frontend conda --conda-prefix /prefix  --conda-create-envs-only


# deeparg download_data -o "<path_to_database_dir>/deeparg_db" #TODO: download DBs for DeepARG


RUN apt-get update && apt-get install procps -y && apt-get clean
ENV PATH=/PathoFact2:$PATH

    
SHELL ["/bin/bash", "-c"]
CMD ["/bin/bash"]