import { workflowList } from 'src/util'

export const workflowOptions = [{ value: 'spades', label: workflowList['spades'].label }]

export const workflows = {
  spades: {
    validForm: false,
    errMessage: 'input error',
    paramsOn: true,
    files: [],
    rawReadsInput: {
      source: 'fastq',
      text: 'READS/FASTQ',
      tooltip: 'Input raw sequencing reads in FASTQ format.',
      note: 'Enter either Illumina data or Oxford Nanopore data in FASTQ format as the input; the file can be compressed. <br/> Acceptable file name extensions: .fastq, .fq, .fastq.gz, .fq.gz',
      sourceOptions: [
        { text: 'READS/FASTQ', value: 'fastq' },
        { text: 'NCBI SRA', value: 'sra' },
      ],
      seqPlatformOptions: [
        { text: 'Illumina', value: 'Illumina' },
        { text: 'Oxford Nanopore', value: 'Nanopore' },
      ],
      seqPlatformText: 'Fastq File',
      seqPlatformDefaultValue: 'Nanopore',
      fastq: {
        enableInput: false,
        placeholder: 'Select a file',
        dataSources: ['upload', 'public'],
        fileTypes: ['fastq', 'fq', 'fastq.gz', 'fq.gz'],
        projectTypes: [],
        projectScope: ['self+shared'],
        viewFile: false,
        isOptional: false,
        cleanupInput: false,
        maxInput: 10000,
        isPaired: true,
      },
    },
  },
}
