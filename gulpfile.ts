import gulp from 'gulp'

import tsGulp from 'gulp-typescript'


// yarn add --dev -W gulp-typescript ts-node typescript @types/gulp

//gulp.task('default', function () {
//return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('dist'))
//})

const tsProject = tsGulp.createProject('tsconfig.base.json')
tsProject.config.compilerOptions = {
  ...tsProject.config.compilerOptions,
}

// TODO determine build order based on package.json
const getProjectsInBuildOrder = (): string[] => [
  'validator',
  'rest-api-server',
  'open-api-endpoint',
]

const buildProject = async (name: string) => {
  console.log(`Build project ${name}`)
}

export default gulp.series(getProjectsInBuildOrder().map(
  it => buildProject.bind(null, it)
))
