// src/App.js
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [updateText, setUpdateText] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Call getAll() when the component is created
    getAll();
  }, []);

  const getAll = () => {
    axios.get("https://todoapp-backend-aspnet-api-production.up.railway.app/api/Todo")
      .then((res) => {
        setTasks(res.data);
      });
  };

  const handelAddButton = () => {
    if (newTask.trim() !== '') {
      axios.post(`https://todoapp-backend-aspnet-api-production.up.railway.app/api/Todo?todoName=${newTask}`)
        .then(res => {
          setTasks(prevTask => [...prevTask, res.data]);
          setNewTask('');
        })
        .catch(e => {
          console.error("Error adding new task");
        });
    }
  };

  const handelDeleteButton = (id) => {
    axios.delete(`https://todoapp-backend-aspnet-api-production.up.railway.app/api/Todo?id=${id}`)
      .then(res => {
        getAll();
      })
      .catch(e => {
        console.error(e);
      });
  };

  const updateTask = (id) => {
    axios.put(`https://todoapp-backend-aspnet-api-production.up.railway.app/api/Todo?id=${id}&todoName=${updateText}`)
      .then((res) => {
        console.log(res);
        getAll();
      })
      .catch((e) => console.log(e));
    setUpdateId('');
    setUpdateText('');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handelAddButton();
    }
  };

  return (
    <div className={`container-fluid d-flex justify-content-center align-items-center ${isDarkMode ? "bg-dark text-light" : ""}`} style={{ minHeight: "100vh", padding: 0 }}>
      <div className="App" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className={`text-center mb-4 ${isDarkMode ? "text-light" : ""}`}>Todo App</h1>
        <div className="input-group mb-3">
          <span className={`input-group-text ${isDarkMode ? "bg-dark" : ""}`} id="basic-addon1">Input</span>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            type="text"
            onKeyDown={handleKeyDown}
            className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
            placeholder="new task..."
            aria-describedby="basic-addon1"
          />
          <button
            className={`btn btn-outline-primary ${isDarkMode ? "btn-outline-light" : ""}`}
            onClick={handelAddButton}
          >
            Add
          </button>
        </div>
        <ul className={`list-group ${isDarkMode ? "bg-dark" : "bg-light"}`}>
          {tasks.map((task) => (
            <li key={task.id} className={`list-group-item d-flex justify-content-between align-items-center py-2 ${isDarkMode ? "bg-secondary" : ""}`}>
              <div className="w-50">
                {updateId === task.id ? (
                  <input
                    type='text'
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
                  />
                ) : (<p className={isDarkMode ? "text-light" : "text-dark"}>{task.name}</p>)}
              </div>
              <div className="ms-auto">
                <button className={`btn btn-outline-danger me-2`} onClick={() => handelDeleteButton(task.id)}>Delete</button>
                <button
                  className={`btn ${updateId === task.id ? 'btn-outline-success' : 'btn-outline-warning'}`}
                  style={{ width: '6rem' }} // Set a fixed width for the button
                  onClick={() => {
                    if (updateId === task.id) {
                      updateTask(task.id);
                    } else {
                      setUpdateId(task.id);
                      setUpdateText(task.name);
                    }
                  }}
                >
                  {updateId === task.id ? 'Save' : 'Update'}
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-center mt-3">
          <button className={`btn ${isDarkMode ? "btn-light" : "btn-dark"}`} onClick={toggleTheme}>
            {isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
