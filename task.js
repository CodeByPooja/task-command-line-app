const fs = require('fs');
const arguments = process.argv;
const handleError = (err) => {
  if (err) throw err;
};

const addItem = () => {
  if (!arguments[3]) {
    console.log('Error: Missing tasks string. Nothing added!');
    return;
  }
  let taskName = arguments[4];
  let data = `${taskName} [${arguments[3]}] \n`;
  if (fs.existsSync('task.txt')) {
    fs.appendFile('task.txt', data, handleError);
  } else {
    fs.writeFile('task.txt', data, handleError);
  }

  console.log(`Added task: "${taskName}" with priority ${arguments[3]}`);
};
const deleteItem = () => {
  if (!arguments[3]) {
    console.log('Error: Missing NUMBER for deleting tasks.');
    return;
  }
  let readTask = fs.readFileSync('task.txt', 'utf-8');
  if (arguments[3] <= 0) {
    console.log(
      `Error: task with index #${arguments[3]} does not exist. Nothing deleted.`
    );
    return;
  }
  const currentTask = readTask.split('\n')[arguments[3] - 1];
  if (currentTask?.length > 0) {
    readTask = readTask.replace(currentTask, '');
    readTask = readTask.split('\n');
    readTask = readTask.filter((task) => task);
    readTask = readTask.toString();
    const quamaRegx = /\,/g;
    readTask = readTask.replace(quamaRegx, '\n');
    console.log(`Deleted task #${arguments[3]}`);
    fs.writeFile('task.txt', readTask, handleError);
  } else {
    console.log(
      `Error: task with index #${arguments[3]} does not exist. Nothing deleted.`
    );
  }
};

const getReport = () => {
  let readTask = [];
  let doneTask = [];
  if (fs.existsSync('task.txt')) {
    readTask = fs.readFileSync('task.txt', 'utf-8');
    readTask = readTask.split('\n');
    readTask = readTask.filter((task) => task.trim());
  }
  if (fs.existsSync('done.txt')) {
    doneTask = fs.readFileSync('done.txt', 'utf-8');
    doneTask = doneTask.split('\n');
    doneTask = doneTask.filter((task) => task.trim());
  }
  const getPending = () =>
    readTask
      .map((item, i) => `${i + 1}. ${item}`)
      .toString()
      .toString()
      .replaceAll(',', '\n');
  const getDone = () =>
    doneTask
      .map((item, i) => `${i + 1}. ${item}`)
      .toString()
      .replaceAll(',', '\n');
  const pen = `Pending : ${readTask.length}\n${getPending()}`;
  const comp = `\nCompleted : ${doneTask.length}\n${getDone()}`;
  const result = pen.concat(comp);
  console.log(result);
};
const getList = () => {
  if (fs.existsSync('task.txt')) {
    var readTask = fs.readFileSync('task.txt', 'utf-8');
    readTask = readTask.split('\n');
    readTask = readTask.filter((task) => task);
    for (i = 0; i < readTask.length; i++) {
      console.log(`${i + 1}. ${readTask[i].trim()}`);
    }
  } else {
    console.log('There are no pending tasks!');
  }
};
const getDone = () => {
  if (arguments[3] <= 0) {
    console.log(
      `Error: no incomplete item with index #${arguments[3]} exists.`
    );
    return;
  }
  if (arguments[3]) {
    let readTask = fs.readFileSync('task.txt', 'utf-8');
    let regex = /\,/g;
    let data = readTask.split('\n')[arguments[3] - 1];

    if (arguments[3] !== 0 && arguments[3] <= readTask.split('\n').length - 1) {
      console.log('Marked item as done.');
      if (readTask.split('\n').length > 2) {
        readTask = readTask.replace(data, '');
        readTask = readTask.split('\n');
        readTask = readTask.filter((task) => task !== undefined);
        readTask = readTask.filter((task) => task);
        readTask = readTask.toString();
        readTask = readTask.replace(regex, '\n') + '\n';
        fs.writeFile('task.txt', readTask, handleError);
      } else {
        readTask = '';
        fs.writeFile('task.txt', readTask, handleError);
      }
    } else {
      console.log('Error: task #' + arguments[3] + ' does not exist.');
    }
    const taskLine = `${data.slice(0, -4).trim()}\n`;
    if (fs.existsSync('done.txt')) {
      fs.appendFile('done.txt', taskLine, handleError);
    } else {
      fs.writeFile('done.txt', taskLine, handleError);
    }
  } else {
    console.log('Error: Missing NUMBER for marking tasks as done.');
  }
};
const usage = () => {
  let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

  console.log(usage.toString());
};

switch (arguments[2]) {
  case 'add':
    addItem();
    break;
  case 'del':
    deleteItem();
    break;
  case 'done':
    getDone();
    break;
  case 'ls':
    getList();
    break;
  case 'report':
    getReport();
    break;
  case 'help':
    usage();
    break;
  default:
    usage();
}
