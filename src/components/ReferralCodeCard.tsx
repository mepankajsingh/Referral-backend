import { Link } from 'react-router-dom';
import { ReferralCode } from '@/lib/database.types';

interface ReferralCodeCardProps {
  referralCode: ReferralCode;
}

const ReferralCodeCard = ({ referralCode }: ReferralCodeCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        {referralCode.logo_url && (
          <img 
            src={referralCode.logo_url} 
            alt={`${referralCode.service_name} logo`} 
            className="w-10 h-10 object-contain mr-3"
          />
        )}
        <h3 className="text-lg font-semibold">{referralCode.service_name}</h3>
        {referralCode.featured && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Featured
          </span>
        )}
      </div>
      
      <div className="mb-3">
        <span className="font-medium">Code: </span>
        <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{referralCode.code}</code>
      </div>
      
      {referralCode.description && (
        <p className="text-gray-600 mb-3 line-clamp-2">{referralCode.description}</p>
      )}
      
      <div className="flex justify-between items-center">
        <Link 
          to={`/referral-codes/${referralCode.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </Link>
        {referralCode.url && (
          <a 
            href={referralCode.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Use Code
          </a>
        )}
      </div>
    </div>
  );
};

export default ReferralCodeCard;
