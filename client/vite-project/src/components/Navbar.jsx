import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, UserCircle } from 'lucide-react';
import useStore from '../store/useStore';

export default function Navbar() {
  const { cart, user, openAuthModal } = useStore();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-6 lg:px-20 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 8-4-4-4 4"/><path d="m8 16 4 4 4-4"/><path d="m16 12H8"/><path d="M4.5 16.5c-1.5-1.5-1.5-4 0-5.5l7-7c1.5-1.5 4-1.5 5.5 0s1.5 4 0 5.5l-7 7c-1.5 1.5-4 1.5-5.5 0Z"/></svg>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Sugar & Gold</h2>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/sweets" className="text-sm font-medium hover:text-primary transition-colors">Sweets</Link>
            <Link to="/gifts" className="text-sm font-medium hover:text-primary transition-colors">Gifts</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden sm:flex items-center bg-primary/5 dark:bg-primary/10 rounded-lg px-3 py-1.5 border border-primary/10">
            <Search className="text-primary w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search sweets..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-32 lg:w-48 placeholder:text-primary/50 text-slate-900 dark:text-slate-100 outline-none ml-2" 
            />
          </div>

          {!user ? (
            <button onClick={openAuthModal} className="text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors">
              Login
            </button>
          ) : (
            <Link to="/dashboard" className="flex items-center gap-2 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
              <UserCircle className="text-primary w-6 h-6" />
              <span className="text-sm font-medium hidden sm:block">{user.name || user.phoneNumber}</span>
            </Link>
          )}

          <Link to="/cart" className="relative p-2 hover:bg-primary/10 rounded-full transition-colors">
            <ShoppingBag className="text-slate-900 dark:text-slate-100 w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2">
            <Menu className="text-slate-900 dark:text-slate-100 w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
