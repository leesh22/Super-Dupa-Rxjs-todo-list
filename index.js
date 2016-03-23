/*jshint esnext: true */
const inputField   = document.getElementById('inputField');
const addButton    = document.getElementById('button');
const taskList     = document.getElementById('list');

const fromEvent = Rx.Observable.fromEvent;

const clickAddButton = fromEvent(addButton, 'click');
const observeKeysTyped = fromEvent(inputField, 'keyup');

const pressEnterKey = observeKeysTyped.filter(key => { return key.keyCode === 13; });
const submitTask = Rx.Observable.merge(clickAddButton, pressEnterKey);

var userTasks = [];

var addTask = function() {
  userTasks.push(inputField.value);
    inputField.value = '';
    taskList.innerHTML = '';
    userTasks.forEach(task =>{
      taskList.innerHTML += '<li id="task">'+task+'<button>x</button></li>';
    });
};

submitTask.subscribe(trigger => {
  if(inputField.value.length > 1)
    addTask();
});

const taskLi = (evt) => { return evt.target.closest('li'); };
const taskClicked = fromEvent(taskList, 'click', taskLi);

const delBut = (evt) => { return evt.target.closest('li button'); };

fromEvent(taskList, 'click', delBut)
 .filter(x => x !== null)
 .subscribe((x) => {
   userTasks.splice(userTasks.indexOf(x.closest('li').firstChild.nodeValue), 1);
   x.closest('li').remove();
});

//
// var doubleClick = taskClicked.buffer(taskClicked.debounce(250))
//     .map(click => click.length)
//     .filter(clickLength => clickLength === 2)
//     .subscribe((clickLength) => {
//         console.log('edit task');
//     });
