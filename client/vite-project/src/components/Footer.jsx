import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-background-dark text-white py-16 px-6 lg:px-20 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 8-4-4-4 4"/><path d="m8 16 4 4 4-4"/><path d="m16 12H8"/><path d="M4.5 16.5c-1.5-1.5-1.5-4 0-5.5l7-7c1.5-1.5 4-1.5 5.5 0s1.5 4 0 5.5l-7 7c-1.5 1.5-4 1.5-5.5 0Z"/></svg>
            <h2 className="text-xl font-bold tracking-tight text-white">Sugar & Gold</h2>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Redefining the art of luxury confectionery since 1994. Handcrafted with passion, delivered with love.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-primary">Shop</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link to="/sweets" className="hover:text-white transition-colors">All Sweets</Link></li>
            <li><Link to="/gifts" className="hover:text-white transition-colors">Gift Hampers</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Sugar-Free Range</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-primary">Company</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-primary">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-4">Subscribe for sweet updates and exclusive offers.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
            />
            <button className="bg-primary px-4 py-2 rounded text-white font-bold hover:bg-primary/80 transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4">
        <p>© 2024 Sugar & Gold Artisanal Confectionery. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
