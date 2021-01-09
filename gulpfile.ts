import gulp from 'gulp'

import tsGulp from 'gulp-typescript'


// yarn add --dev -W gulp-typescript ts-node typescript @types/gulp gulp

//gulp.task('default', function () {
//return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('dist'))
//})




// TODO determine build order based on package.json
const getProjectsInBuildOrder = (): string[] => [
  'validator',
  'rest-api-server',
  'open-api-endpoint',
]

const buildProject = async (name: string) => {
  const tsProject = tsGulp.createProject(`package/${name}/tsconfig.json`)
  tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('dist'))
}

export default gulp.series(getProjectsInBuildOrder().map(
  it => buildProject.bind(null, it)
))
