import { Link } from 'react-router-dom';
import { getEmbedUrl, isEmbeddable } from '../utils/videoUtils';
import { useLanguage } from '../hooks/useLanguage';

interface ClientCardProps {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  imageUrl?: string;
  videoUrl?: string;
}

export default function ClientCard({ id, name, description, logoUrl, imageUrl, videoUrl }: ClientCardProps) {
  const { t } = useLanguage();

  return (
    <Link 
      to={`/client/${id}`} 
      className="block relative bg-[#060b14] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 group hover:border-[#ec533a]/50 hover:-translate-y-2 aspect-square"
    >
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center overflow-hidden">
        {videoUrl ? (
          isEmbeddable(videoUrl) ? (
            <iframe 
              src={getEmbedUrl(videoUrl, { autoplay: true, mute: true, loop: true, controls: false }) || ''}
              className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-110"
              allow="autoplay; encrypted-media; fullscreen"
              title={name}
            />
          ) : (
            <video 
              src={videoUrl} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          )
        ) : logoUrl || imageUrl ? (
          <img 
            src={logoUrl || imageUrl!} 
            alt={name} 
            className={`w-full h-full ${logoUrl && !imageUrl ? 'object-contain p-8' : 'object-cover'} transition-transform duration-700 group-hover:scale-110`} 
          />
        ) : (
          <div className="text-gray-600 font-bold text-2xl">{name}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-[#060b14]/80 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
      </div>
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
        <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#ec533a] transition-colors drop-shadow-md">{name}</h3>
          
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
             <div className="overflow-hidden">
                <p className="text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed drop-shadow">{description || t('clientCard.clickForDetails')}</p>
                <div className="w-full text-center bg-white/10 backdrop-blur-md hover:bg-[#ec533a] text-white py-3 rounded-lg transition-all duration-300 font-semibold border border-white/20 hover:border-[#ec533a] shadow-lg">
                  {t('clientCard.viewDetails')}
                </div>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
