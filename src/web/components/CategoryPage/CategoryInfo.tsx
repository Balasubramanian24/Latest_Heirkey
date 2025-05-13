import React from 'react'

interface CategoryInfoProps {
  title: string
  description: string
  onClose?: () => void
}

const CategoryInfo: React.FC<CategoryInfoProps> = ({ 
  title, 
  description, 
  onClose 
}) => {
  return (
    <div className="border rounded-md p-4 my-4 bg-white relative">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium mb-2 text-blue-600">{title}</h3>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

export default CategoryInfo 