import "../styles/task.scss";
import { useState } from "react";
import React from 'react';
import { LeftCircleTwoTone, RightCircleTwoTone, EditTwoTone,
 DeleteTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { Button } from 'antd';

export default function Task(props) {
  const { addTask, deleteTask, moveTask, task } = props;

  const [urgencyLevel, setUrgencyLevel] = useState(task.urgency);
  const [collapsed, setCollapsed] = useState(task.isCollapsed);
  const [formAction, setFormAction] = useState("");

  const [data, setTask] = useState({});
  const [ setSubmitted ] = useState(false);

  const serverHost = 'http://localhost:3000';

  async function addtask(task) {
    const url = serverHost + '/task';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(task)
    }
    const response = await fetch(url, options);
        if (response.status === 200) {
            setSubmitted(true);
    }
    
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    const currentInputFieldData = {
        [name]: value
    }

    const updatedData = {
        ...data,
        ...currentInputFieldData
    }
    setTask(updatedData);
  }

  function setUrgency(event) {
    setUrgencyLevel(event.target.attributes.urgency.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (formAction === "save") {
      if (collapsed) {
        setCollapsed(false);
      } 
      else {
        let newTask = {
          id: task.id,
          title: event.target.elements.title.value,
          description: event.target.elements.description.value,
          date: event.target.elements.date.value,
          urgency: urgencyLevel,
          status: task.status,
          isCollapsed: true,
        };

        addTask(newTask);
        setCollapsed(true);
        addTask(data);
      }
    }

    if (formAction === "delete") {
      deleteTask(task.id);
    }
  }

  function handleMoveLeft() {
    let newStatus = "";

    if (task.status === "In Progress") {
      newStatus = "Not Started";
    } 
    else if (task.status === "Done") {
      newStatus = "In Progress";
    }

    if (newStatus !== "") {
      moveTask(task.id, newStatus);
    }

  }

  function handleMoveRight() {
    let newStatus = "";

    if (task.status === "Not Started") {
      newStatus = "In Progress";
    } 
    else if (task.status === "In Progress") {
      newStatus = "Done";
    }

    if (newStatus !== "") {
      moveTask(task.id, newStatus);
    }

  }

  return (
    <div className={`task ${collapsed ? "collapsedTask" : ""}`}>
      <Button onClick={handleMoveLeft} className="button moveTask" icon={<LeftCircleTwoTone />}/>
        
      <form onSubmit={handleSubmit} className={collapsed ? "collapsed" : ""}>
        <input
          type="text"
          className="title input"
          name="title"
          placeholder="Task Name"
          disabled={collapsed}
          defaultValue={task.title}
          onChange={handleChange}
        />
        <textarea
          rows="2"
          className="description input"
          name="description"
          placeholder="Enter Description"
          defaultValue={task.description}
          onChange={handleChange}
        />
        <input
          type="date"
          className="description input"
          name="date"
          placeholder="End date"
          disabled={collapsed}
          defaultValue={task.date}
          onChange={handleChange}
        />
        <br/>
        <div className="urgencyLabels">
          <label className={`low ${urgencyLevel === "low" ? "selected" : ""}`}>
            <input
              urgency="low"
              onChange={setUrgency}
              type="radio"
              name="urgency"
            />
            Low
          </label>
          <label
            className={`medium ${urgencyLevel === "medium" ? "selected" : ""}`}
          >
            <input
              urgency="medium"
              onChange={setUrgency}
              type="radio"
              name="urgency"
            />
            Med
          </label>
          <label
            className={`high ${urgencyLevel === "high" ? "selected" : ""}`}
          >
            <input
              urgency="high"
              onChange={setUrgency}
              type="radio"
              name="urgency"
            />
            High
          </label>
        </div>
        <button
          onClick={() => {
            setFormAction("save");
          }}
          className="button delete"
        >
          {collapsed ? <EditTwoTone /> : <CheckCircleTwoTone />}
        </button>
        {collapsed && (
          <button
            onClick={() => {
              setFormAction("delete");
            }}
            className="button delete"
            
          >
          {<DeleteTwoTone twoToneColor="#eb2f96"/>} 
          </button>
          
        )}
      </form>
      <Button onClick={handleMoveRight} className="button moveTask" icon={<RightCircleTwoTone />}/>

      
    </div>

  );
}