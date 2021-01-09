import gulp from 'gulp'










const getProjectsInBuildOrder = (): string[] => [
  'validator',
  'rest-api-server',
  'open-api-endpoint',
]

const buildProject = async (name: string) => {

}

export default gulp.series(getProjectsInBuildOrder().map(
  it => buildProject.bind(null, it)
))
