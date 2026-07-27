import { CircleNotch } from 'phosphor-react';

export default function LoadingButton({ loading, children, className = '', ...props }) {
  return (
    <button
      disabled={loading}
      className={`flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200 ${className}`}
      {...props}
    >
      {loading && <CircleNotch size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
