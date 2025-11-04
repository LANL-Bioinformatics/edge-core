profiles {
  local {
    executor.name = 'local'
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
      errorStrategy='retry'
      maxRetries = 3
    }
  }
}