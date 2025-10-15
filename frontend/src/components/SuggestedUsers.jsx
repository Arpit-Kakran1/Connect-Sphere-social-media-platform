
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(store => store.auth)
  return (

    <div >
      <div className='flex items-center justify-between mb-4'>
        <h1 className='font-bold text-gray-500 dark:text-gray-400'>Suggested for you</h1>
        <span className='font-semibold cursor-pointer text-gray-900 dark:text-gray-200 text-xs'>See All</span>
      </div>
      {
        suggestedUsers.map((user) => {
          return (
            <div className="flex items-center justify-between my-3" key={user._id}>
              <div className='flex items-center gap-3'>
                <Link to={`/profile/${user?._id}`}>
                  <Avatar className="h-8 w-8object-cover overflow-hidden">
                    <AvatarImage className=" h-8 w-8 object-cover" src={user?.profilePicture} alt="user_profile" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className='flex flex-col'>
                  <h1 className='font-bold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                  <span className='text-gray-500 dark:text-gray-400 text-xs'>{user?.bio || 'Suggested for you'}</span>
                </div>
              </div>
              <button className="text-sky-500 hover:text-sky-700 dark:hover:text-sky-400 text-xs font-bold cursor-pointer"></button>
            </div>
          )
        })
      }
    </div>
  )
}

export default SuggestedUsers;