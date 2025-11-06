import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    instructor: '',
    duration: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/courses`);
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      const data = await response.json();
      if (data.success) {
        setCourses([...courses, data.data]);
        setNewCourse({ title: '', instructor: '', duration: '', description: '', price: '' });
        setShowForm(false);
      }
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setCourses(courses.filter(course => course.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎓 EduTrack</h1>
          <p>Master DevOps with Hands-on Learning</p>
        </div>
      </header>

      <main className="main">
        <div className="courses-header">
          <h2>Available Courses ({courses.length})</h2>
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Course'}
          </button>
        </div>

        {showForm && (
          <form className="course-form" onSubmit={handleSubmit}>
            <h3>Create New Course</h3>
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Instructor Name"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 8 weeks)"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
            />
            <textarea
              placeholder="Course Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              rows="3"
            />
            <input
              type="number"
              placeholder="Price"
              value={newCourse.price}
              onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
              step="0.01"
            />
            <button type="submit" className="btn-primary">Create Course</button>
          </form>
        )}

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3>{course.title}</h3>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(course.id)}
                  title="Delete course"
                >
                  ×
                </button>
              </div>
              <p className="instructor">👨‍🏫 {course.instructor}</p>
              <p className="description">{course.description}</p>
              <div className="course-meta">
                <span>⏱️ {course.duration}</span>
                <span>👥 {course.students} students</span>
              </div>
              {course.price && (
                <p className="price">Rs {course.price}</p>
              )}
              <button className="btn-enroll">Enroll Now</button>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>Powered by React + Node.js + Docker 🚀</p>
      </footer>
    </div>
  );
}

export default App;