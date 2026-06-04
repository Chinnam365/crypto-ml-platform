class TaskScheduler {

  constructor() {

    this.tasks = [];
  }

  registerTask(
    name,
    interval,
    callback
  ) {

    this.tasks.push({

      name,

      interval,

      callback,
    });
  }

  start() {

    this.tasks.forEach(
      task => {

        setInterval(

          task.callback,

          task.interval
        );
      }
    );
  }
}

module.exports =
  TaskScheduler;
