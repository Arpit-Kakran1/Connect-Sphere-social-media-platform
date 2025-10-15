import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import useGetAllPost from '@/hooks/getAllPosts'
import useGetSuggestedUsers from '@/hooks/UseSeeAllSuggestedUsers'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSideBar />
    </div>
  )
}

export default Home
