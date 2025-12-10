import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const HeritageInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="label-caps">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'input-heritage w-full',
              icon && 'pl-12',
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

HeritageInput.displayName = 'HeritageInput';

export const HeritageTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="label-caps">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'input-heritage w-full min-h-[120px] resize-none',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

HeritageTextArea.displayName = 'HeritageTextArea';
