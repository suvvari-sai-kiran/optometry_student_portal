import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FormulasPage() {
  const navigate = useNavigate();

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
        <div className="glass-card" style={{ padding: '1.5rem' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <BookOpen size={20} color="var(--primary)" /> Lens Power Formula
           </h3>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
             P = 1 / f
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
             Calculates the optical power (P) in diopters given the focal length (f) in meters.
           </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <BookOpen size={20} color="var(--primary)" /> Prentice's Rule
           </h3>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
             Δ = c × F
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
             Used to determine the induced prismatic effect (Δ) given decentration (c) in cm and lens power (F) in diopters.
           </p>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <BookOpen size={20} color="var(--primary)" /> Vertex Distance
           </h3>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
             F_new = F / (1 - dF)
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
             Adjusts the power of a lens (F) when the vertex distance (d, in meters) changes.
           </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <BookOpen size={20} color="var(--primary)" /> Near Addition (Add)
           </h3>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
             Add = (1 / WD) - D_power
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
             Calculated using the optimal working distance (WD, in meters) minus the distance power.
           </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <BookOpen size={20} color="var(--primary)" /> IOL Power (SRK)
           </h3>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
             P = A - 2.5L - 0.9K
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
             Estimates Intraocular Lens power given the A-constant, Axial Length (L), and Keratometry (K).
           </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <BookOpen size={20} color="var(--primary)" /> Vertical Imbalance
           </h3>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
             Δ = c × F (per eye)
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
             Calculate induced prism for each eye using Prentice's rule, then take the difference for total imbalance.
           </p>
        </div>
      </div>
    </div>
  );
}
