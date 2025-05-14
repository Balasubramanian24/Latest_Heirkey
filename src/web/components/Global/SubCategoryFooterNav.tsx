import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SubCategoryFooterNavProps {
  leftLabel: string;
  leftTo: string;
  rightLabel: string;
  rightTo: string;
  className?: string;
}

const SubCategoryFooterNav: React.FC<SubCategoryFooterNavProps> = ({
  leftLabel,
  leftTo,
  rightLabel,
  rightTo,
  className,
}) => (
  <div className={`flex gap-4 mt-8 ${className || ''}`}>
    <Link to={leftTo} className="flex-1">
      <Button variant="outline" className="w-full">
        ← {leftLabel}
      </Button>
    </Link>
    <Link to={rightTo} className="flex-1">
      <Button className="w-full bg-[#1ccfc9] hover:bg-[#19bbb5] text-white">
        {rightLabel} →
      </Button>
    </Link>
  </div>
);

export default SubCategoryFooterNav; 