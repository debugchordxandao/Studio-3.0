import React from 'react';
import { useAdmin } from './AdminContext';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const SystemBanner: React.FC = () => {
    const { systemMessage } = useAdmin();

    if (!systemMessage.active) return null;

    const getStyles = () => {
        switch (systemMessage.type) {
            case 'warning':
                return 'bg-yellow-400 text-yellow-900 border-b-4 border-yellow-500';
            case 'alert':
                return 'bg-red-400 text-white border-b-4 border-red-600';
            case 'info':
            default:
                return 'bg-sky-400 text-white border-b-4 border-sky-600';
        }
    };

    const getIcon = () => {
        switch (systemMessage.type) {
            case 'warning': return <AlertTriangle size={20} className="animate-bounce" />;
            case 'alert': return <AlertCircle size={20} className="animate-pulse" />;
            case 'info': default: return <Info size={20} />;
        }
    };

    return (
        <div className={`w-full py-3 px-4 flex items-center justify-center gap-3 shadow-md animate-slide-down z-[60] relative ${getStyles()}`}>
            {getIcon()}
            <span className="font-poppins font-bold text-sm md:text-base tracking-wide">
                {systemMessage.text}
            </span>
        </div>
    );
};
