// import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSideBar = () => {
  const { user } = useSelector(store => store.auth);
  return (
    <div className='hidden md:block  w-full max-w-xs lg:max-w-sm my-4 p-4'>
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="h-11 w-11">
              <AvatarImage className="object-cover" src={user?.profilePicture} alt="user_profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className='flex flex-col'>
            <h1 className='font-bold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
            <span className='text-gray-500 dark:text-gray-400 text-sm'>{user?.fullName || 'Your Name'}</span>
          </div>
        </div>
        <button className='text-sky-500 hover:text-sky-700 text-xs font-bold cursor-pointer'>Switch</button>
      </div>
      <SuggestedUsers />
    </div>
  )
}

export default RightSideBar;