import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, PlayCircle, Eye, Calculator, ChevronLeft, MessageCircle, ExternalLink, CheckCircle, Info, Award } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [courses, setCourses] = useState([]);
  
  const [view, setView] = useState('courses'); // courses, tests, video-phase, take-test, result
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [tests, setTests] = useState([]);
  
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qId: 'A' }
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/student/courses');
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

  const openCourse = async (course) => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/courses/" + course.id + "/tests");
      setSelectedCourse(course);
      setTests(res.data);
      setView('tests');
    } catch (e) { console.error(e); }
  };

  const startVideoPhase = (test) => {
    setSelectedTest(test);
    if (test.videoUrl) {
      setView('video-phase');
    } else {
      startTest(test);
    }
  };

  const startTest = async (test) => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/tests/" + test.id + "/questions");
      setSelectedTest(test);
      setQuestions(res.data);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setScoreData(null);
      setView('take-test');
    } catch (e) { console.error(e); }
  };

  const selectAnswer = (qId, optionKey) => {
    setAnswers({ ...answers, [qId]: optionKey });
  };

  const submitTest = async () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOption) {
        score++;
      }
    });

    try {
      await axios.post('http://localhost:5000/api/student/tests/submit', {
        userId: user.id,
        testId: selectedTest.id,
        score,
        totalQuestions: questions.length
      });
      setScoreData({ score, total: questions.length });
      setView('result');
    } catch (e) { alert("Error submitting test"); }
  };


  const formatEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com/")) {
      videoId = url.split("vimeo.com/")[1].split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // Convert any existing standard youtube embed to nocookie
    if (url.includes("youtube.com/embed/")) {
      return url.replace("youtube.com", "youtube-nocookie.com");
    }
    return url; 
  };

  const renderCourses = () => (
    <>
      <h3 style={{ marginBottom: '1rem' }}>Available Subjects</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {courses.map(course => (
          <div key={course.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', width: 'fit-content' }}>
              <Eye size={28} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{course.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{course.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
               <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => openCourse(course)}>
                 <PlayCircle size={16} style={{ marginRight: '0.5rem' }} /> Go to Course
               </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderTests = () => (
    <>
      <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => setView('courses')}>
        <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Subjects
      </button>
      <h3 style={{ marginBottom: '1rem' }}>Modules: {selectedCourse?.title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tests.map(test => (
          <div key={test.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{test.title}</h4>
              {test.videoUrl && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contains Video Resource</span>}
            </div>
            <button className="btn btn-primary" onClick={() => startVideoPhase(test)}>
              Attempt
            </button>
          </div>
        ))}
        {tests.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No tests available yet.</p>}
      </div>
    </>
  );

  const renderTakeTest = () => {
    if (questions.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No questions have been added to this test yet!</p>
          <button className="btn btn-secondary" onClick={() => setView('tests')}>Go Back</button>
        </div>
      );
    }
    const currentQ = questions[currentQuestionIndex];

    return (
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>{selectedTest?.title}</span>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </h3>

        {/* Video Player is now in video-phase view */}

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{currentQ.questionText}</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['A', 'B', 'C', 'D'].map(opt => {
              const optText = currentQ["option" + opt];
              const isSelected = answers[currentQ.id] === opt;
              return (
                <div 
                  key={opt}
                  onClick={() => selectAnswer(currentQ.id, opt)}
                  style={{
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border)',
                    background: isSelected ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <strong>{opt}.</strong> {optText}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
           <button 
             className="btn btn-secondary" 
             disabled={currentQuestionIndex === 0}
             onClick={() => setCurrentQuestionIndex(p => p - 1)}
           >
             Previous
           </button>
           
           {currentQuestionIndex < questions.length - 1 ? (
             <button 
               className="btn btn-primary"
               onClick={() => setCurrentQuestionIndex(p => p + 1)}
               disabled={!answers[currentQ.id]}
             >
               Next Question
             </button>
           ) : (
             <button 
               className="btn btn-primary"
               onClick={submitTest}
               disabled={!answers[currentQ.id]}
               style={{ background: 'var(--success)' }}
             >
               Submit Test
             </button>
           )}
        </div>
      </div>
    );
  };

  const renderResult = () => (
    <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: scoreData.score > (scoreData.total / 2) ? 'var(--success)' : 'var(--danger)'}}>
        {scoreData.score} / {scoreData.total}
      </h2>
      <h3 style={{ marginBottom: '2rem' }}>Test Completed: {selectedTest?.title}</h3>
      
      <div style={{ textAlign: 'left', marginBottom: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
         <h4 style={{ marginBottom: '1rem' }}>Review Answers:</h4>
         {questions.map((q, idx) => {
           const isCorrect = answers[q.id] === q.correctOption;
           return (
             <div key={q.id} style={{ padding: '1rem', marginBottom: '1rem', background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', borderLeft: isCorrect ? '4px solid var(--success)' : '4px solid var(--danger)' }}>
               <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{idx + 1}. {q.questionText}</p>
               <p style={{ margin: '0 0 0.2rem 0', color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                 <strong>Your Answer:</strong> {q["option" + answers[q.id]]}
               </p>
               {!isCorrect && (
                 <p style={{ margin: '0 0 0.5rem 0', color: 'var(--success)' }}>
                   <strong>Correct Answer:</strong> {q["option" + q.correctOption]}
                 </p>
               )}
               {q.explanation && (
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', background: 'rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                   {q.explanation}
                 </p>
               )}
             </div>
           );
         })}
      </div>

      <button className="btn btn-primary" onClick={() => { setView('tests'); setScoreData(null); }}>
        Back to Modules
      </button>
    </div>
  );


  const renderVideoPhase = () => {
    const videoUrls = selectedTest?.videoUrl ? selectedTest.videoUrl.split(',').map(url => url.trim()).filter(Boolean) : [];

    return (
      <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
        {/* Progress Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setView('tests')}
            style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px' }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ 
                background: 'linear-gradient(90deg, var(--primary), #818CF8)', 
                color: 'white', 
                fontSize: '0.7rem', 
                fontWeight: '700', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Step 1: Mastery
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>&bull; Prerequisites for {selectedTest?.title}</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Study Material
            </h2>
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
            <Info size={24} color="var(--primary)" />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>Quick Briefing</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Watching these demonstrations will significantly improve your test scores. Pay close attention to the techniques used.
            </p>
          </div>
        </div>

        {/* Troubleshooting Tip (NEW) */}
        <div style={{ 
          background: 'rgba(245, 158, 11, 0.05)', 
          border: '1px solid rgba(245, 158, 11, 0.2)', 
          borderRadius: '12px', 
          padding: '1rem', 
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Info size={20} color="var(--warning)" />
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--warning)' }}>Trouble with the video?</strong> If it says "Unavailable," please disable your AdBlocker or click the <strong>Source Link</strong> below the player to watch it directly on YouTube.
          </p>
        </div>
        
        {videoUrls.map((url, idx) => {
          const embedUrl = formatEmbedUrl(url);
          return (
            <div key={idx} style={{ marginBottom: '4rem' }}>
              <div style={{ 
                position: 'relative',
                background: '#020617', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(79, 70, 229, 0.15)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#fff'
                }}>
                  <PlayCircle size={14} color="var(--secondary)" /> Resource #{idx + 1}
                </div>

                <iframe 
                  width="100%" 
                  height="500"
                  src={embedUrl}
                  frameBorder="0"
                  allowFullScreen
                  title={`Test Video ${idx + 1}`}
                  style={{ display: 'block' }}
                ></iframe>

                <div style={{ 
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)', 
                  padding: '2rem 1.5rem 1.5rem',
                  marginTop: '-4rem',
                  position: 'relative',
                  zIndex: 5
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Visual Guide: {selectedTest?.title}</h3>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: 'var(--text-muted)', 
                        textDecoration: 'none', 
                        fontSize: '0.85rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.4rem' 
                      }}
                      onMouseOver={e => e.currentTarget.style.color = '#fff'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      Source Link <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Level Up CTA Section */}
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.1), transparent 70%)',
          borderRadius: '30px',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem' 
          }}>
            <Award size={32} color="var(--secondary)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Preparation Complete!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            You've reviewed all the required material. Ready to test your knowledge and claim your score?
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button 
               className="btn btn-secondary" 
               onClick={() => {
                 window.scrollTo({ top: 0, behavior: 'smooth' });
                 setView('tests');
               }}
               style={{ padding: '0.8rem 2rem' }}
            >
              Review Modules
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                startTest(selectedTest);
              }}
              style={{ 
                padding: '0.8rem 3rem', 
                fontSize: '1.1rem',
                background: 'var(--secondary)',
                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
              }}
            >
              Start Module Test <CheckCircle size={20} style={{ marginLeft: '0.75rem' }} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Student Portal</h2>
          <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.name || 'Student'}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
           <button className="btn btn-secondary" onClick={() => navigate('/qna')}>
            <MessageCircle size={18} style={{ marginRight: '0.5rem' }} /> Q&A Forum
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/formulas')}>
            <Calculator size={18} style={{ marginRight: '0.5rem' }} /> Formulas
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout
          </button>
        </div>
      </header>

      {view === 'courses' && renderCourses()}
      {view === 'tests' && renderTests()}
      {view === 'video-phase' && renderVideoPhase()}
      {view === 'take-test' && renderTakeTest()}
      {view === 'result' && renderResult()}

    </div>
  );
}
