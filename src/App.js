import "./App.css";
import { useState } from "react";
import Axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(0);

  const [newWage, setNewWage] = useState("");
  const [newNames, setNewNames] = useState({});

  const [employeeList, setEmployeeList] = useState([]);

  const addEmployee = () => {
    Axios.post("http://localhost:5000/create", {
      name,
      age,
      country,
      position,
      wage,
    }).then(() => {
      setEmployeeList([
        ...employeeList,
        {
          id: employeeList.length + 1, // Assuming the ID is generated in the backend and can be used here for simplicity
          name,
          age,
          country,
          position,
          wage,
        },
      ]);
    });
  };

  const getEmployees = () => {
    Axios.get("http://localhost:5000/workers").then((response) => {
      setEmployeeList(response.data);
    });
  };

  const updateEmployeeWage = (id) => {
    if (newWage !== "" && !isNaN(newWage)) {
      Axios.put("http://localhost:5000/updateWage", { wage: newWage, id }).then(
        (response) => {
          setEmployeeList(
            employeeList.map((val) => {
              return val.id === id ? { ...val, wage: newWage } : val;
            })
          );
          setNewWage("");
        }
      );
    } else {
      alert("Please enter a valid wage.");
    }
  };

  const updateEmployeeName = (id) => {
    const newName = newNames[id];
    if (newName && newName.trim() !== "") {
      Axios.put("http://localhost:5000/updateName", { name: newName, id }).then(
        (response) => {
          setEmployeeList(
            employeeList.map((val) => {
              return val.id === id ? { ...val, name: newName } : val;
            })
          );
          setNewNames((prevNames) => ({ ...prevNames, [id]: "" }));
        }
      );
    } else {
      alert("Please enter a valid name.");
    }
  };

  const deleteEmployee = (id) => {
    Axios.delete(`http://localhost:5000/delete/${id}`).then((response) => {
      setEmployeeList(employeeList.filter((val) => val.id !== id));
    });
  };

  return (
    <div className="App">
      <div className="information">
        <label>Name:</label>
        <input
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <label>Age:</label>
        <input
          type="number"
          onChange={(event) => {
            setAge(Number(event.target.value));
          }}
        />
        <label>Country:</label>
        <input
          type="text"
          onChange={(event) => {
            setCountry(event.target.value);
          }}
        />
        <label>Position:</label>
        <input
          type="text"
          onChange={(event) => {
            setPosition(event.target.value);
          }}
        />
        <label>Wage (year):</label>
        <input
          type="number"
          onChange={(event) => {
            setWage(Number(event.target.value));
          }}
        />
        <button onClick={addEmployee}>Add Employee</button>
      </div>
      <div className="employees">
        <button onClick={getEmployees}>Show Employees</button>

        {employeeList.map((val) => {
          return (
            <div className="employee" key={val.id}>
              <div>
                <h3>Name: {val.name}</h3>
                <h3>Age: {val.age}</h3>
                <h3>Country: {val.country}</h3>
                <h3>Position: {val.position}</h3>
                <h3>Wage: {val.wage}</h3>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Wage"
                  value={newWage}
                  onChange={(event) => {
                    setNewWage(event.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    updateEmployeeWage(val.id);
                  }}
                >
                  Update Wage
                </button>
                <input
                  type="text"
                  placeholder="Name"
                  value={newNames[val.id] || ""}
                  onChange={(event) => {
                    setNewNames({ ...newNames, [val.id]: event.target.value });
                  }}
                />
                <button
                  onClick={() => {
                    updateEmployeeName(val.id);
                  }}
                >
                  Update Name
                </button>

                <button
                  onClick={() => {
                    deleteEmployee(val.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;



