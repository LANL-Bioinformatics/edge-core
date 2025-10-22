profiles {
  local {
    process.executor = 'local'
    executor.name = "local"
    process.cpus = 8
  }

  slurm {
      //sets executor to slurm
    executor.name = "slurm"
    //controls job names
    executor.jobName = {"$task.process"}
    executor.queueSize=5
    process {
      scratch = true
      //options to provide for all processes submitted as cluster jobs (e.g. "--account xx")
      clusterOptions = ""
      //resource requirements for processes
      withLabel: "tiny" {
          cpus = {2 * task.attempt}
          memory = {4.GB * task.attempt}
      }
      withLabel: "small" {
          cpus = {4 * task.attempt}
          memory = {8.GB * task.attempt}
      }
      withLabel: "medium" {
          cpus = {8 * task.attempt}
          memory = {16.GB * task.attempt}
          maxRetries = 2
      }
      withLabel: "large" {
          cpus = {8 * task.attempt}
          memory = {32.GB * task.attempt}
          maxRetries=2
      }
      time = {2.hours * task.attempt}
      //if not labeled, uses the below settings
      cpus = {4 * task.attempt}
      memory = {8.GB * task.attempt}

      errorStrategy='retry'
      maxRetries = 3
    }
  }
}