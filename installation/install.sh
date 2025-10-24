#!/bin/bash
echo "Install LANL EDGE webapp..."
pwd=$PWD
app_home="$(dirname "$pwd")"

#create upload/log/projects/public directories, skip this step for reinstallation
io_home=$app_home/io
if [ ! -d  $io_home ]; then
  echo "Create directories"
  mkdir ${io_home}
  dirs=(
    "upload"
    "upload/files"
    "upload/tmp" 
    "log"
    "projects"
    "public"
    "sra"
    "db"
    "nextflow"
  )

  for dir in "${dirs[@]}"
  do
    mkdir ${io_home}/${dir}
  done

  cromwell_test_data_home=$app_home/workflows/Cromwell/test_data
  if [ -d  $cromwell_test_data_home ]; then
    ln -s ${cromwell_test_data_home} ${io_home}/public/cromwell
  fi

  nextflow_test_data_home=$app_home/workflows/Nextflow/test_data
  if [ -d  $nextflow_test_data_home ]; then
    ln -s ${nextflow_test_data_home} ${io_home}/public/nextflow
  fi
fi

echo "Generate Cromwell wdl imports.zip"
workflows=(
  # "sra2fastq"
)

for workflow in "${workflows[@]}"
do
  cd $app_home/workflows/Cromwell/${workflow}
  zip -r imports.zip *.wdl
  if [ "$?" != "0" ]; then
    echo "Cannot create $app_home/workflows/Cromwell/${workflow}/imports.zip!" 1>&2
    exit 1
  fi
done

#copy .js.core to .js
files=(
  # client files
  "webapp/client/src/_nav.js"
  "webapp/client/src/workflows/common/ProjectResult.js"
  "webapp/client/src/workflows/common/private-routes.js"
  "webapp/client/src/workflows/common/routes.js"
  "webapp/client/src/workflows/common/util.js"
  # server files
  "webapp/server/workflow/config.js"
  "webapp/server/workflow/indexRouter.js"
  "webapp/server/workflow/util.js"
)
for file in "${files[@]}"
do
  if [ -f "$app_home/$file" ]; then
  # do nothing, skip existing files
    continue
  fi
  cp $app_home/${file}.core $app_home/${file}
  if [ "$?" != "0" ]; then
    echo "Cannot copy $app_home/${file}.core to $app_home/${file}!" 1>&2
    exit 1
  fi
done

echo "Setup LANL EDGE webapp ..."
#install client
echo "install client..."
cd $app_home/webapp/client
npm install --legacy-peer-deps
#install server
echo "install server..."
cd $app_home/webapp/server
npm install

echo "LANL EDGE webapp successfully installed!"
echo "Next steps:"
echo "1. copy webapp/client/.env.example to webapp/client/.env and update settings in the .env file"
echo "2. inside webapp/client, run command: npm run build"
echo "3. copy webapp/server/.env.example to webapp/server/.env and update settings in the .env file"
echo "4. start MongoDB if it's not started yet"
echo "5. start the webapp in EDGEv3's root directory: pm2 start pm2.config.js"
