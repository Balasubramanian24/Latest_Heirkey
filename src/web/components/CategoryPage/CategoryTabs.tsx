import React from 'react'

interface Tab {
  id: string
  label: string
  isActive?: boolean
}

interface CategoryTabsProps {
  tabs: Tab[]
  onTabClick: (tabId: string) => void
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ tabs, onTabClick }) => {
  return (
    <div className="flex overflow-x-auto gap-2 py-2 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-6 py-2 rounded-md text-sm ${
            tab.isActive 
              ? 'bg-gray-100 font-medium' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onTabClick(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs 