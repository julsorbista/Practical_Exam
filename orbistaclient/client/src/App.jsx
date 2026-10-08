import { useEffect, useState } from 'react';
import './App.css'
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [students, setStudents] = useState([]);

  function getStudents() {
    axios.get("http://localhost:5001/students")
    .then((response) => {
      setStudents(response.data);
    });
  }
  useEffect(() => {
    getStudents();
  },
  []);
  function clearForm() {
    setName("");
    setCourse("");
    setAge("");
    setError("");
    setEditingId(null);
  }
  function saveStudent() {
    if (!name || !course || !age) {
      setError("Please fill in all fields.");
      return;
    }
    if (editingId != null) {
      const current = students.find((student) => student._id == editingId);
      if (current.name == name && current.course == course && current.age == age) {
        setError("Nothing was changed.");
        return;
      }
    }
    const duplicate = students.find((student) =>
      student._id != editingId &&
      student.name.toLowerCase() == name.toLowerCase() &&
      student.course.toLowerCase() == course.toLowerCase()
    );
    if (duplicate) {
      setError("Student already exists.");
      return;
    }
    setError("");
    if (editingId == null) {
      axios.post("http://localhost:5001/students", { name, course, age })
        .then(() => {
          clearForm();
          getStudents();
        });
    } else {
      axios.put("http://localhost:5001/students/" + editingId, { name, course, age })
        .then(() => {
          clearForm();
          getStudents();
        });
    }
  }
  function editStudent(student) {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  }
  function deleteStudent(id) {
    axios.delete("http://localhost:5001/students/" + id)
      .then(() => {
        getStudents();
      });
  }
  return (
  <div>
  <h1>Student Management System</h1>
  <h2>{editingId == null ? "Add Student" : "Edit Student"}</h2>
  <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
  <br/>
  <input
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
  <br/>
  <input
        placeholder="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
  <br/><br/>
  
    <p style={{ color: "red" }}>{error}</p> <br/>
    <button type="button" onClick={saveStudent}>
      {editingId == null ? "Add Student" : "Update"}
    </button>
      {editingId != null && (
    <button type="button" onClick={clearForm}>Cancel</button>
  )}
  <br/>
  <br/>
  <h2>Students</h2>
    {students.length == 0 && <p>No students yet.</p>}

    {students.map((student) => (
  <div key={student._id}>
    <p>Name: {student.name}</p>
    <p>Course: {student.course}</p>
    <p>Age: {student.age}</p>
    
    <button type="button" onClick={() => editStudent(student)}>Edit</button>
    <button type="button" onClick={() => deleteStudent(student._id)}>Delete</button>
  <br/><br/>
  </div>
  ))}
</div>
);
}

export default App;