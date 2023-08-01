
require('child_process').exec('git log -1 --pretty=%B', (err, commitMessage) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  const m = commitMessage.match(/^Release \d+\.\d+.\d+/);
  if (m) {
    console.log(`publish to npm with commit message: ${commitMessage}`);
    process.exit(0);
  } else {
    console.log(`don't publish npm`);
    process.exit(1);
  }
});
