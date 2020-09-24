import server, { segment as s } from '@validator/rest-api-server';

const app = server();

app.post({
  path: ['/', s('username', stringField), '/todos/', s('uid', stringField)],
  payload: {
    title: stringField({
      description: 'Spec of what to do'
    }),
  },
  handler: (username, uid, payload)
});
