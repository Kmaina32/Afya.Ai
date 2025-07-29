import React from 'react';
import { Stethoscope } from 'lucide-react';

export const Logo = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
  return <Stethoscope {...props} ref={ref} />;
});

Logo.displayName = 'Logo';
