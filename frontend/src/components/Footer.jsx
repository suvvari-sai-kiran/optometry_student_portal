import { Mail, Heart } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();
    
    const team = [
        { name: 'Jyoshna.g', email: '231904150012@cutmap.ac.in' },
        { name: 'p Lakshmi kavya', email: '231904150006@cutmap.ac.in' },
        { name: 'N.nadhini', email: '231904151001@cutmap.ac.in' },
        { name: 'k.manasa', email: '231904151023@cutmap.ac.in' },
    ];

    return (
        <footer className="mt-20 pb-10 border-t border-white/5 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
                {/* Brand Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none">CLINICAL HUB</h3>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Version 1.2.0</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                        Advanced optometry learning portal designed for clinical excellence & medical precision.
                    </p>
                </div>

                {/* Developed By Section */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Developed By</h4>
                    <ul className="grid grid-cols-2 gap-y-3 gap-x-6">
                        {team.map((member, i) => (
                            <li key={i} className="text-slate-300 text-sm font-bold hover:text-primary transition-colors cursor-default flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                {member.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Us Section */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Contact Us</h4>
                    <div className="space-y-3">
                        {team.map((member, i) => (
                            <a 
                                key={i} 
                                href={`mailto:${member.email}`}
                                className="flex items-center gap-3 group"
                            >
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                                    <Mail size={14} className="text-slate-500 group-hover:text-primary" />
                                </div>
                                <span className="text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">{member.email}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Credits */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                    &copy; {year} Optometry Learning Portal. All Rights Reserved.
                </p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    Handcrafted with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> for Clinical Excellence
                </p>
            </div>
        </footer>
    );
};

export default Footer;
