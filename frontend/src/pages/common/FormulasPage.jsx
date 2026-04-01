import { BookOpen, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FormulasPage() {
  const navigate = useNavigate();

  const formulas = [
    {
      title: "Lens Power Formula",
      formula: "P = 1 / f",
      desc: "Calculates the optical power (P) in diopters given the focal length (f) in meters.",
      video: "https://www.youtube.com/watch?v=w-XgXADoBeU"
    },
    {
      title: "Prentice's Rule",
      formula: "Δ = c × F",
      desc: "Used to determine the induced prismatic effect (Δ) given decentration (c) in cm and lens power (F) in diopters.",
      video: "https://www.youtube.com/watch?v=LAx3w6WM-g0"
    },
    {
      title: "Vertex Distance",
      formula: "F_new = F / (1 - dF)",
      desc: "Adjusts the power of a lens (F) when the vertex distance (d, in meters) changes.",
      video: "https://www.youtube.com/watch?v=w-XgXADoBeU"
    },
    {
      title: "Near Addition (Add)",
      formula: "Add = (1 / WD) - D_power",
      desc: "Calculated using the optimal working distance (WD, in meters) minus the distance power.",
      video: "https://www.youtube.com/watch?v=dfwcu944LVc"
    },
    {
      title: "IOL Power (SRK)",
      formula: "P = A - 2.5L - 0.9K",
      desc: "Estimates Intraocular Lens power given the A-constant, Axial Length (L), and Keratometry (K).",
      video: "https://www.youtube.com/watch?v=5CrgALxvzUE"
    },
    {
      title: "Vertical Imbalance",
      formula: "Δ = c × F (per eye)",
      desc: "Calculate induced prism for each eye using Prentice's rule, then take the difference for total imbalance.",
      video: "https://www.youtube.com/watch?v=x5TekSxNaJs"
    }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Optometry Calculations & Formulas</h2>
          <p style={{ color: 'var(--text-muted)' }}>Reference guide for essential formulas</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {formulas.map((item, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BookOpen size={20} color="var(--primary)" /> {item.title}
            </h3>
            
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(0,0,0,0.2)', 
              borderRadius: '8px', 
              fontFamily: 'monospace', 
              fontSize: '1.1rem', 
              marginBottom: '1rem', 
              textAlign: 'center' 
            }}>
              {item.formula}
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flex: 1, marginBottom: '1.5rem' }}>
              {item.desc}
            </p>

            <a 
              href={item.video} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem', 
                width: '100%', 
                textDecoration: 'none',
                padding: '0.8rem',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
              }}
            >
              <PlayCircle size={18} color="var(--primary)" /> Watch Tutorial
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
