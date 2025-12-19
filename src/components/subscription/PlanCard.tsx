import React from 'react';
import { Button } from '../ui/Button';
import { Check, X } from 'lucide-react';

interface PlanCardProps {
    name: string;
    price: number;
    features: string[];
    recommended?: boolean;
    onSubscribe: () => void;
    isLoading?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
    name,
    price,
    features,
    recommended = false,
    onSubscribe,
    isLoading = false
}) => {
    return (
        <div className={`
      relative p-6 rounded-2xl border-2 transition-all duration-300
      ${recommended
                ? 'border-blue-500 bg-blue-50/50 shadow-xl scale-105 z-10'
                : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg'
            }
    `}>
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Recommended
                </div>
            )}

            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{name} Plan</h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-slate-900">₹{price}</span>
                </div>
            </div>

            <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        {feature.includes('No') ? (
                            <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        ) : (
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        )}
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                onClick={onSubscribe}
                disabled={isLoading}
                variant={recommended ? 'primary' : 'outline'}
                className={`w-full font-semibold rounded-xl
          ${recommended
                        ? 'shadow-lg shadow-slate-900/20'
                        : '!border-slate-200 hover:!bg-slate-50 hover:!border-slate-300 hover:!text-slate-900'
                    }
        `}
            >
                {isLoading ? 'Processing...' : 'Buy Now'}
            </Button>
        </div>
    );
};
