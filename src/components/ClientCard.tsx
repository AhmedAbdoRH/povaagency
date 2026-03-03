import { Link } from 'react-router-dom';

interface ClientCardProps {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

export default function ClientCard({ id, name, description, logoUrl }: ClientCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 group hover:border-[#ee5239]/50 hover:-translate-y-1">
      <div className="h-48 bg-black/40 flex items-center justify-center p-6 relative overflow-hidden">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={name} 
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="text-gray-600 font-bold text-xl">NO LOGO</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ee5239] transition-colors">{name}</h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">{description || 'لا يوجد وصف متاح.'}</p>
        <Link 
          to={`/client/${id}`} 
          className="block w-full text-center bg-white/5 hover:bg-[#ee5239] text-white py-3 rounded-lg transition-all font-semibold border border-white/10 hover:border-[#ee5239]"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}
