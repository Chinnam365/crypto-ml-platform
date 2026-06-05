class RuntimeScheduler {

  constructor() {

    this.jobs = [];
  }

  register({

    name,

    interval,

    handler,

  }) {

    this.jobs.push({

      name,

      interval,

      handler,
    });
  }

  start() {

    this.jobs.forEach(

      job => {

        console.log(
          `Starting ${job.name}`
        );

        setInterval(

          job.handler,

          job.interval
        );
      }
    );
  }
}

module.exports =
  new RuntimeScheduler();
