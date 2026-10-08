import { useEffect, useState } from 'react';
import './App.css'

async function requestStudents(path = "", options = {}) {
  const response = await fetch(`/api/students${path}`, options);
  if (!response.ok) {
    throw new Error("Unable to complete the request. Please try again.");
  }
  return response.json();
}

function studentBody(method, student) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  };
}

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [students, setStudents] = useState([]);

  function getStudents() {
    requestStudents()
    .then(setStudents)
    .catch((error) => setError(error.message));
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
      requestStudents("", studentBody("POST", { name, course, age }))
        .then(() => {
          clearForm();
          getStudents();
        })
        .catch((error) => setError(error.message));
    } else {
      requestStudents("/" + editingId, studentBody("PUT", { name, course, age }))
        .then(() => {
          clearForm();
          getStudents();
        })
        .catch((error) => setError(error.message));
    }
  }
  function editStudent(student) {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  }
  function deleteStudent(id) {
    requestStudents("/" + id, { method: "DELETE" })
      .then(() => {
        getStudents();
      })
      .catch((error) => setError(error.message));
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
