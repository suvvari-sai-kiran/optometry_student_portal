import { useState } from 'react';
import { BookOpen, PlayCircle, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FormulasPage() {
  const navigate = useNavigate();
  const [activeVideoId, setActiveVideoId] = useState(null);

  const formulas = [
    {
      title: "Lens Power Formula",
      formula: "P = 1 / f",
      desc: "Calculates the optical power (P) in diopters given the focal length (f) in meters.",
      videoId: "w-XgXADoBeU",
      fullUrl: "https://www.youtube.com/watch?v=w-XgXADoBeU"
    },
    {
      title: "Prentice's Rule",
      formula: "Δ = c × F",
      desc: "Used to determine the induced prismatic effect (Δ) given decentration (c) in cm and lens power (F) in diopters.",
      videoId: "LAx3w6WM-g0",
      fullUrl: "https://www.youtube.com/watch?v=LAx3w6WM-g0"
    },
    {
      title: "Vertex Distance",
      formula: "F_new = F / (1 - dF)",
      desc: "Adjusts the power of a lens (F) when the vertex distance (d, in meters) changes.",
      videoId: "w-XgXADoBeU",
      fullUrl: "https://www.youtube.com/watch?v=w-XgXADoBeU"
    },
    {
      title: "Near Addition (Add)",
      formula: "Add = (1 / WD) - D_power",
      desc: "Calculated using the optimal working distance (WD, in meters) minus the distance power.",
      videoId: "dfwcu944LVc",
      fullUrl: "https://www.youtube.com/watch?v=dfwcu944LVc"
    },
    {
      title: "IOL Power (SRK)",
      formula: "P = A - 2.5L - 0.9K",
      desc: "Estimates Intraocular Lens power given the A-constant, Axial Length (L), and Keratometry (K).",
      videoId: "5CrgALxvzUE",
      fullUrl: "https://www.youtube.com/watch?v=5CrgALxvzUE"
    },
    {
      title: "Vertical Imbalance",
      formula: "Δ = c × F (per eye)",
      desc: "Calculate induced prism for each eye using Prentice's rule, then take the difference for total imbalance.",
      videoId: "x5TekSxNaJs",
      fullUrl: "https://www.youtube.com/watch?v=x5TekSxNaJs"
    }
  ];

  const handleClose = () => setActiveVideoId(null);

  const activeFormula = formulas.find(f => f.videoId === activeVideoId);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Optometry Calculations & Formulas</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Reference guide for essential formulas</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {formulas.map((item, idx) => (
          <div key={idx} className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <BookOpen size={22} color="var(--primary)" /> {item.title}
            </h3>
            
            <div style={{ 
              padding: '1.25rem', 
              backgroundColor: 'rgba(0,0,0,0.3)', 
              borderRadius: '12px', 
              fontFamily: 'monospace', 
              fontSize: '1.2rem', 
              marginBottom: '1.25rem', 
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {item.formula}
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, marginBottom: '2rem', lineHeight: '1.6' }}>
              {item.desc}
            </p>

            <button 
              onClick={() => setActiveVideoId(item.videoId)}
              className="btn btn-primary" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem', 
                width: '100%', 
                padding: '0.8rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <PlayCircle size={20} /> Watch Tutorial
            </button>
          </div>
        ))}
      </div>

      {/* Video Modal Overlay */}
      {activeVideoId && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(10px)',
            padding: '1.5rem'
          }}
          onClick={handleClose}
        >
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.9)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Tutorial: {activeFormula?.title}</h3>
              <button 
                onClick={handleClose}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  transition: 'all 0.2s'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Video Container */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1`}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title="YouTube Video Player"
              ></iframe>
            </div>

            {/* Modal Footer / Fallback */}
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.9)' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                If the player above is empty, your browser or an extension (like an adblocker) may be blocking the embed.
              </p>
              <a 
                href={activeFormula?.fullUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  transition: 'filter 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'brightness(1.0)'}
              >
                Watch directly on YouTube <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
