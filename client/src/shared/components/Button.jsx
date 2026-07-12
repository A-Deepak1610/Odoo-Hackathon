import React from 'react';
import { cn } from '../utils/cn';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm border border-transparent',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border border-transparent',
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} className={cn('mr-2 -ml-1', !children && 'mr-0 ml-0')} />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
