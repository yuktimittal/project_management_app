/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  // Your app's config
  app(input) {
    return {
      name: "project-management-app",
      home: "aws",
    };
  },
  // Your app's resources
  async run() {
    // const bucket = new sst.aws.Bucket("MyBucket");
    // new sst.Function.onBind((func) => {
    //   func.props.reservedConcurrentExecutions = undefined;
    // });

    const web = new sst.aws.Nextjs("ProjectManagementApp");

    // Your app's outputs
    return {
      //   bucket: bucket.name
      SiteUrl: web.url,
    };
  },
  // Optionally, your app's Console config
  //   console: {
  //     autodeploy: {
  //       runner: { compute: "large" }
  //     }
  //   }
});
