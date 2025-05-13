import React, { useState } from 'react'
import AppHeader from '@/web/components/Layout/AppHeader'
import Footer from '@/web/components/Layout/Footer'
import SearchPanel from '@/web/pages/Global/SearchPanel'
import CategoryHeader from './CategoryHeader'
import CategoryTabs from './CategoryTabs'
import CategoryInfo from './CategoryInfo'
import CategoryContent from './CategoryContent'
import CategoryAction from './CategoryAction'

interface CategoryPageProps {
  title: string
  userName: string
  userEmail: string
  userAvatar?: string
  infoTitle?: string
  infoDescription?: string
  tabs?: { id: string; label: string }[]
  categoryItems: {
    title: string
    path: string
  }[][]
  backUrl?: string
  actionUrl?: string
  actionText?: string
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  title,
  userName,
  userEmail,
  userAvatar,
  infoTitle = "How to edit your information",
  infoDescription = "Now, you are about to enter details about your home, life, and essential information to be passed on to your family members. Each section has several questions. Fill out as much as you can/like. You can always come back to fill out more information later.",
  tabs = [
    { id: 'tab1', label: 'Topic' },
    { id: 'tab2', label: 'Topic' },
    { id: 'tab3', label: 'Topic' },
    { id: 'tab4', label: 'Topic' },
    { id: 'tab5', label: 'Topic' }
  ],
  categoryItems,
  backUrl = "/dashboard",
  actionUrl = "/get-started",
  actionText = "Get Started with \"Selected Category\""
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)
  const [showInfo, setShowInfo] = useState(true)

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-grow">
        <CategoryHeader 
          title={title}
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
        />
        
        <div className="container mx-auto px-4 mt-4">
          <CategoryTabs 
            tabs={tabs.map(tab => ({
              ...tab,
              isActive: tab.id === activeTab
            }))}
            onTabClick={setActiveTab}
          />
          
          {showInfo && (
            <CategoryInfo
              title={infoTitle}
              description={infoDescription}
              onClose={() => setShowInfo(false)}
            />
          )}
          
          <CategoryAction
            backUrl={backUrl}
            actionUrl={actionUrl}
            actionText={actionText}
          />
        </div>
        
        <CategoryContent
          title={title}
          categoryItems={categoryItems}
          sidebar={<SearchPanel />}
        />
      </main>
      
      <Footer />
    </div>
  )
}

export default CategoryPage 