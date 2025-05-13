import React from 'react'
import { Link } from 'react-router-dom'

interface CategoryActionProps {
  backUrl: string
  actionUrl: string
  actionText: string
}

const CategoryAction: React.FC<CategoryActionProps> = ({
  backUrl,
  actionUrl,
  actionText
}) => {
  return (
    <div className="flex justify-between my-4">
      <Link
        to={backUrl}
        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 text-sm"
      >
        Back to All Categories
      </Link>
      <Link
        to={actionUrl}
        className="px-4 py-2 bg-[#1ccfc9] text-white rounded-md hover:bg-[#19bbb5] text-sm"
      >
        {actionText}
      </Link>
    </div>
  )
}

export default CategoryAction 