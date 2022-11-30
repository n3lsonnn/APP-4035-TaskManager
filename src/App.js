import { useState, useEffect } from "react";
import './styles/app.scss';
import "./styles/task.scss";
import React from 'react'
import { Button, Progress } from 'antd';
import { BulbTwoTone, FrownTwoTone } from '@ant-design/icons';

import StatusLine from './components/StatusLine'
import StatusLineTwo from "./components/StatusLineTwo";
import StatusLineThree from "./components/StatusLineThree";


function App() {
  
  const [percent, setPercent] = useState(0);
  
  const increase = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 12.5;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };
  
  const decline = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent - 12.5;
      if (newPercent < 0) {
        return 0;
      }
      return newPercent;
    });
  };

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasksFromLocalStorage();
  }, []);

  function addEmptyTask(status) {
    const lastTask = tasks[tasks.length - 1];

    let newTaskId = 1;

    if (lastTask !== undefined) {
      newTaskId = lastTask.id + 1;
    }

    setTasks((tasks) => [
      ...tasks,
      {
        id: newTaskId,
        title: "",
        description: "",
        date: "",
        urgency: "",
        status: status,
      },
    ]);
  }

  function addTask(taskToAdd) {
    let filteredTasks = tasks.filter((task) => {
      return task.id !== taskToAdd.id;
    });

    let newTaskList = [...filteredTasks, taskToAdd];

    setTasks(newTaskList);

    saveTasksToLocalStorage(newTaskList);
  }

  function deleteTask(taskId) {
    let filteredTasks = tasks.filter((task) => {
      return task.id !== taskId;
    });

    setTasks(filteredTasks);

    saveTasksToLocalStorage(filteredTasks);
  }

  function moveTask(id, newStatus) {
    let task = tasks.filter((task) => {
      return task.id === id;
    })[0];

    let filteredTasks = tasks.filter((task) => {
      return task.id !== id;
    });

    task.status = newStatus;

    let newTaskList = [...filteredTasks, task];

    setTasks(newTaskList);

    saveTasksToLocalStorage(newTaskList);
  }

  function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    let loadedTasks = localStorage.getItem("tasks");

    let tasks = JSON.parse(loadedTasks);

    if (tasks) {
      setTasks(tasks);
    }
  }

  return (
    <div className="App">
      <h1>Task Management Board</h1>
      <main>
        <section>
          <StatusLine
            tasks={tasks}
            addEmptyTask={addEmptyTask}
            addTask={addTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            status="Not Started"
          />
          <StatusLineTwo
            tasks={tasks}
            addEmptyTask={addEmptyTask}
            addTask={addTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            status="In Progress"
          />
          <StatusLineThree
            tasks={tasks}
            addEmptyTask={addEmptyTask}
            addTask={addTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            status="Done"
          />
        </section>
      </main>
      <div>
      <Progress percent={percent} />
  
      <Button onClick={increase} className="button delete" icon={<FrownTwoTone />} />
      <Button onClick={increase} className="button delete" icon={<BulbTwoTone />} />

      </div>
    </div>
  );
}

export default App;
