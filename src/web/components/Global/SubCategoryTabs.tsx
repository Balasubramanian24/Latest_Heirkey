import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Pets', path: '/category/homeinstructions/pets' },
  { label: 'Trash', path: '/category/homeinstructions/trash' },
  { label: 'Other', path: '/category/homeinstructions/other' },
  { label: 'Security', path: '/category/homeinstructions/security' },
];

const SubCategoryTabs = () => {
  const location = useLocation();

  return (
    <div className="flex justify-center w-full mt-[-32px] mb-8 pt-12">
      <div className="flex gap-2 bg-white border border-[#d6e0ef] rounded-md px-1 py-1 shadow-sm">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`px-8 py-2 rounded-md border transition-all font-semibold text-base
                ${isActive
                  ? 'bg-white border-[#1ccfc9] text-[#183153] shadow'
                  : 'bg-transparent border-transparent text-[#888] hover:bg-[#f7f7f7] hover:border-[#1ccfc9]'}
              `}
              style={isActive ? { borderWidth: 2 } : {}}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SubCategoryTabs; 