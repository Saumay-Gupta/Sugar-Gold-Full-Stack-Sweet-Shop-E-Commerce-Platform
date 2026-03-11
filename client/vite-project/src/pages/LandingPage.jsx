import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div>
      {/* Promotional Banner */}
      <div className="bg-primary text-white py-2 px-4 text-center text-sm font-medium tracking-wide">
        15% Off Your First Order - Use Code: <span className="font-bold underline">SWEET15</span>
      </div>

      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Luxury gold-leafed artisanal Indian barfi sweets on a platter" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC1YyeE261h7WwUcfBo4WjIFs8s3jrwy4VLcHuZe0NehEyiJaNOQ8cRFxgCRlxzfGx7DlAWUFsAMiLi2UbKC1ytNfCgeS_3gT3pVMKphXT97cHhew2JKd66kx5KsmzK4VSLbEli437BOXja04mDZo4c51lgN8wYJp3RQUqYUlPT2hl2OgXAPUccj0k9dDunWlNStuZGaE2kjxczi_PT4d9LMP_UJzbqUW3Bvpst5BBsbBhIaXBJ45gMC5pVELF7Gp2fpDDdOzQoWU5" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary font-bold text-xs tracking-widest uppercase mb-6">
              Handcrafted Luxury
            </span>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 drop-shadow-lg">
              Artisanal Sweets for <span className="text-primary">Every Celebration</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-200 mb-10 leading-relaxed max-w-lg">
              Experience the luxury of 24k gold-leafed barfis, handcrafted global delights, and gourmet gift boxes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/sweets" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2">
                Shop Now 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <Link to="/gifts" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold transition-all">
                View Gift Packs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6 lg:px-20 bg-background-light dark:bg-background-dark" id="categories">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Explore Categories</h2>
              <div className="h-1.5 w-20 bg-primary rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Traditional Sweets', sub: 'Timeless recipes passed through generations.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCezOT-gD4OgAR36RNrt0cZJxw1EDVcVVmh3LtqnSPSBMLT39xQuHuH8gFFPrKakMnn2abIPdpvfGh8KODM2rQuWIS-tc9GbWem4P43vg8V9w3FHytAhJSpm5ql4bzELTO2sGWFfh-3_T039S2HrJqRYSfdFmJDnQEwqFuO3ZHTk5bm0UIi0ilk3OMjsClRCSo3m3lhjhmAeyT2vw5y19AvarqdtkIbdpvOHsD9gOv1xzBHuIeB3aw09Sdh3qUBmeQiFZ5iOYv3CMYx' },
              { title: 'Sugar-Free Options', sub: 'Guilt-free indulgence without compromise.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8aU1moAjYhZhMEsYfqh5MWL3AOJccKYBHFA5CWPmUMhEP_UQFCCweVD3STAnWlkJYNK6GRrGiy1Xy2Am_-W8bvVZP19d1wWw9D8px21SY0QAZpmlD1BGAySbCAwwG7m6RS-H3YlczpJAq-d7AR3rssugwd67aD2YHiTWcVms7PlBit5drRIERFKUotPtEBH9ZT74VHquA4Ug1nIPJnmUIqsTLT_2rJ3taMMU5xZrlEC3oqdTcCclyJW6ZzpfioifRKp4NEfOwav_5'},
              { title: 'International Delights', sub: 'Macarons, baklava, and Belgian chocolates.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGKifMkxriZDNRjF5u1s--bF1Dr09ZMRjCmErm51GdpIWC08tsTXJCQC5OsU-rM0f9KXMNdHnTad8TwOs8KcyGMOfzlbLtl-lQmWqWIwbtKhkO_H6WS9yoJDgbRVf-VPPOa-pPETvmWb1wo4hmo99-2ZjrYxHQVPLgynZH5EV613Q0Prq1LTq81x6pBLpAJuv_YCyfNUZ9x6-wujpUJD359ex0pdM6b_-5uVlylsuuh8UOVio28ez5lIQ67rFJ51LUMCLOKVa3sJcZ'}
            ].map((cat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-slate-200"
              >
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.title} src={cat.img}/>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{cat.sub}</p>
                  <Link to={`/sweets`} className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                    Shop Collection 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
