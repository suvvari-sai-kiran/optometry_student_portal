import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, BookOpen, Plus, FileText, Trash, ChevronLeft, HelpCircle } from 'lucide-react';
import BASE_URL from '../../api/config';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ courses: 0, tests: 0, students: 0 });
  const [courses, setCourses] = useState([]);
  
  // Navigation states
  const [view, setView] = useState('courses'); // 'courses', 'tests', 'questions'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  // Form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', thumbnailUrl: '' });
  
  const [showTestForm, setShowTestForm] = useState(false);
  const [testForm, setTestForm] = useState({ title: '', videoUrl: '' });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: ''
  });
  
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchCourses();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/stats`);
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/courses`);
      setCourses(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- COURSE HELPERS ---
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/admin/courses`, courseForm);
      setShowCourseForm(false);
      setCourseForm({ title: '', description: '', thumbnailUrl: '' });
      fetchCourses();
      fetchStats();
    } catch (error) {
      alert('Error adding course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete course and all its tests?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/courses/${id}`);
      fetchCourses();
      fetchStats();
    } catch (e) { alert("Error deleting course"); }
  };

  // --- TEST HELPERS ---
  const handleAddTest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/admin/tests`, { ...testForm, courseId: selectedCourse.id });
      setShowTestForm(false);
      setTestForm({ title: '', videoUrl: '' });
      fetchCourses(); // re-fetch courses to get updated tests
      
      // Update local selectedCourse tests array
      const updatedSelect = { ...selectedCourse };
      if (!updatedSelect.tests) updatedSelect.tests = [];
      updatedSelect.tests.push({ title: testForm.title, videoUrl: testForm.videoUrl, id: Date.now() }); // optimistic
      setSelectedCourse(updatedSelect);
      fetchStats();
    } catch (error) { alert('Error adding test'); }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm("Delete test?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/tests/${id}`);
      fetchCourses();
      const updatedSelect = { ...selectedCourse };
      updatedSelect.tests = updatedSelect.tests.filter(t => t.id !== id);
      setSelectedCourse(updatedSelect);
      fetchStats();
    } catch (e) { alert("Error deleting test"); }
  };

  // --- QUESTION HELPERS ---
  const fetchQuestions = async (testId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/tests/${testId}/questions`);
      setQuestions(res.data);
    } catch(e) { console.error(e); }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/admin/questions`, { ...questionForm, testId: selectedTest.id });
      setShowQuestionForm(false);
      setQuestionForm({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: '' });
      fetchQuestions(selectedTest.id);
    } catch (error) { alert("Error adding question"); }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Delete question?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/questions/${id}`);
      fetchQuestions(selectedTest.id);
    } catch (e) { alert("Error deleting question"); }
  };

  // --- RENDERERS ---

  const renderCoursesView = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
         <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
           <h3>{stats.courses}</h3>
           <p style={{ color: 'var(--text-muted)' }}>Total Courses</p>
         </div>
         <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
           <h3>{stats.tests}</h3>
           <p style={{ color: 'var(--text-muted)' }}>Total Tests</p>
         </div>
         <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
           <h3>{stats.students}</h3>
           <p style={{ color: 'var(--text-muted)' }}>Registered Students</p>
         </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Course Management</h3>
        <button className="btn btn-primary" onClick={() => setShowCourseForm(!showCourseForm)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Course
        </button>
      </div>

      {showCourseForm && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input type="text" className="input-base" placeholder="Course Title (e.g. Low Vision)" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required/>
            <textarea className="input-base" placeholder="Description" rows="2" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} required></textarea>
            <button type="submit" className="btn btn-secondary">Save Course</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {courses.map(course => (
          <div key={course.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0 }}>{course.title}</h4>
              <button 
                onClick={() => handleDeleteCourse(course.id)} 
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                <Trash size={18} />
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, marginTop: '0.5rem' }}>{course.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{course.tests?.length || 0} Tests</span>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => {
                setSelectedCourse(course);
                setView('tests');
              }}>
                Manage Tests
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderTestsView = () => (
    <>
      <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => setView('courses')}>
        <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Courses
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Tests for: {selectedCourse?.title}</h3>
        <button className="btn btn-primary" onClick={() => setShowTestForm(!showTestForm)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Test
        </button>
      </div>

      {showTestForm && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleAddTest} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input type="text" className="input-base" placeholder="Test Title" value={testForm.title} onChange={e => setTestForm({...testForm, title: e.target.value})} required/>
            <input type="text" className="input-base" placeholder="Video URL (e.g. /videos/lowvision/abc.mp4)" value={testForm.videoUrl} onChange={e => setTestForm({...testForm, videoUrl: e.target.value})} />
            <button type="submit" className="btn btn-secondary">Save Test</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {selectedCourse?.tests?.map(test => (
          <div key={test.id} className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{test.title}</h4>
              {test.videoUrl && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}><FileText size={12}/> Video Attached</span>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => {
                 setSelectedTest(test);
                 fetchQuestions(test.id);
                 setView('questions');
               }}>
                 Manage MCQs
               </button>
               <button onClick={() => handleDeleteTest(test.id)} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
                 Delete
               </button>
            </div>
          </div>
        ))}
        {(!selectedCourse?.tests || selectedCourse.tests.length === 0) && <p style={{ color: 'var(--text-muted)' }}>No tests available for this course.</p>}
      </div>
    </>
  );

  const renderQuestionsView = () => (
    <>
      <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => setView('tests')}>
        <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Tests
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Questions for: {selectedTest?.title}</h3>
        <button className="btn btn-primary" onClick={() => setShowQuestionForm(!showQuestionForm)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Question
        </button>
      </div>

      {showQuestionForm && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <textarea className="input-base" placeholder="Question Text" value={questionForm.questionText} onChange={e => setQuestionForm({...questionForm, questionText: e.target.value})} required rows="2" />
            <input type="text" className="input-base" placeholder="Option A" value={questionForm.optionA} onChange={e => setQuestionForm({...questionForm, optionA: e.target.value})} required/>
            <input type="text" className="input-base" placeholder="Option B" value={questionForm.optionB} onChange={e => setQuestionForm({...questionForm, optionB: e.target.value})} required/>
            <input type="text" className="input-base" placeholder="Option C" value={questionForm.optionC} onChange={e => setQuestionForm({...questionForm, optionC: e.target.value})} required/>
            <input type="text" className="input-base" placeholder="Option D" value={questionForm.optionD} onChange={e => setQuestionForm({...questionForm, optionD: e.target.value})} required/>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label>Correct Option:</label>
              <select className="input-base" value={questionForm.correctOption} onChange={e => setQuestionForm({...questionForm, correctOption: e.target.value})}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <textarea className="input-base" placeholder="Explanation (Optional)" value={questionForm.explanation} onChange={e => setQuestionForm({...questionForm, explanation: e.target.value})} rows="2" />
            <button type="submit" className="btn btn-secondary">Save Question</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card" style={{ padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{idx + 1}. {q.questionText}</p>
              <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                <Trash size={16} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
              <span style={{ color: q.correctOption === 'A' ? 'var(--primary)' : 'inherit' }}>A: {q.optionA}</span>
              <span style={{ color: q.correctOption === 'B' ? 'var(--primary)' : 'inherit' }}>B: {q.optionB}</span>
              <span style={{ color: q.correctOption === 'C' ? 'var(--primary)' : 'inherit' }}>C: {q.optionC}</span>
              <span style={{ color: q.correctOption === 'D' ? 'var(--primary)' : 'inherit' }}>D: {q.optionD}</span>
            </div>
            {q.explanation && (
               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 <HelpCircle size={14}/> {q.explanation}
               </p>
            )}
          </div>
        ))}
        {questions.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No questions added yet.</p>}
      </div>
    </>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ flex: '1 1 200px' }}>
          <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Welcome back, Dr. {user.name || 'Admin'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', padding: '0.6rem 1rem' }} onClick={handleLogout}>
            <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout
          </button>
        </div>
      </header>

      {view === 'courses' && renderCoursesView()}
      {view === 'tests' && renderTestsView()}
      {view === 'questions' && renderQuestionsView()}

    </div>
  );
}
