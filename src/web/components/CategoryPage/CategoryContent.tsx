import React, { ReactNode } from 'react'

interface CategoryContentProps {
  title: string
  categoryItems: {
    title: string
    path: string
  }[][]
  sidebar?: ReactNode
}

const CategoryContent: React.FC<CategoryContentProps> = ({ 
  title, 
  categoryItems,
  sidebar
}) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <h2 className="text-xl font-medium mb-4">Category: <span className="text-[#1ccfc9]">{title}</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {categoryItems.map((column, colIndex) => (
              <div key={colIndex} className="space-y-4">
                {colIndex === 0 && (
                  <div className="font-medium text-gray-600 text-sm">
                    retail
                  </div>
                )}
                {colIndex > 0 && (
                  <div className="font-medium text-gray-600 text-sm">
                    Category
                  </div>
                )}
                
                {column.map((item, index) => (
                  <div key={index} className="border-b pb-2">
                    {colIndex === 0 ? (
                      <div className="text-gray-700">{item.title}</div>
                    ) : (
                      <a href={item.path} className="text-[#1ccfc9] hover:underline">
                        {item.title}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {sidebar && (
          <div className="md:col-span-1">
            {sidebar}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryContent 