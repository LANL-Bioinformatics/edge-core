const fs = require('fs');
const config = require('../config');
const workflowConfig = require('../workflowConfig');

const cromwellWorkflows = [];
const nextflowWorkflows = [
  'sra2fastq',
];
const nextflowConfigs = {
  profiles: 'common/profiles.nf',
  nf_reports: 'common/nf_reports.tmpl',
};

const workflowList = {
  sra2fastq: {
    outdir: 'output/sra2fastq',
    nextflow_main: 'sra2fastq/nextflow/main.nf -profile local',
    config_tmpl: 'sra2fastq/workflow_config.tmpl',
  },
};

// eslint-disable-next-line no-unused-vars
const generateNextflowWorkflowParams = (projectConf, projHome) => {
  const params = {};
  if (projectConf.workflow.name === 'sra2fastq') {
    // download sra data to shared directory
    params.sraOutdir = config.IO.SRA_BASE_DIR;
  }
  return params;
};

const generateWorkflowResult = (proj) => {
  const projHome = `${config.IO.PROJECT_BASE_DIR}/${proj.code}`;
  const resultJson = `${projHome}/result.json`;

  if (!fs.existsSync(resultJson)) {
    const result = {};
    const projectConf = JSON.parse(fs.readFileSync(`${projHome}/conf.json`));
    const outdir = `${projHome}/${workflowList[projectConf.workflow.name].outdir}`;

    if (projectConf.workflow.name === 'sra2fastq') {
      // use relative path
      const { accessions } = projectConf.workflow.input;
      accessions.forEach((accession) => {
        // link sra downloads to project output
        fs.symlinkSync(`../../../../sra/${accession}`, `${outdir}/${accession}`);

      });
    }
    fs.writeFileSync(resultJson, JSON.stringify(result));
  }
};

const checkFlagFile = (proj) => {
  const projHome = `${config.IO.PROJECT_BASE_DIR}/${proj.code}`;
  // create output directory
  const outDir = `${projHome}/${workflowList[proj.type].outdir}`;
  if (proj.type === 'assayDesign') {
    const outJson = `${outDir}/jbrowse/jbrowse_url.json`;
    if (!fs.existsSync(outJson)) {
      return false;
    }
  }
  return true;
};

const getWorkflowCommand = (proj) => {
  const projHome = `${config.IO.PROJECT_BASE_DIR}/${proj.code}`;
  const projectConf = JSON.parse(fs.readFileSync(`${projHome}/conf.json`));
  const outDir = `${projHome}/${workflowList[projectConf.workflow.name].outdir}`;
  let command = '';
  if (proj.type === 'assayDesign') {
    // create bioaiConf.json
    const conf = `${projHome}/bioaiConf.json`;
    fs.writeFileSync(conf, JSON.stringify({ pipeline: 'bioai', params: { ...projectConf.workflow.input, ...projectConf.genomes } }));
    command += ` && ${workflowConfig.WORKFLOW.BIOAI_EXEC} -i ${conf} -o ${outDir}`;
  }
  return command;
};

module.exports = {
  cromwellWorkflows,
  nextflowWorkflows,
  nextflowConfigs,
  workflowList,
  generateNextflowWorkflowParams,
  generateWorkflowResult,
  checkFlagFile,
  getWorkflowCommand,
};
