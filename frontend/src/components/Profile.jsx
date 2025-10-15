import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.post : userProfile?.bookmarks;

  return (

    <div className='max-w-5xl mx-auto px-4 pt-16 pb-20 md:pl-[20%] md:pr-10 md:py-8'>
      <div className='flex flex-col gap-8 md:gap-20 p-4 md:p-8'>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <section className='flex items-center justify-center col-span-1'>
            <Avatar className='h-32 w-32 object-cover overflow-auto'>
              <AvatarImage src={userProfile?.profilePicture} className="object-cover rounded-full" alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section className='col-span-1 md:col-span-2'>
            <div className='flex flex-col gap-5'>

              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                <span className='text-xl font-semibold'>{userProfile?.username}</span>
                <div className='flex items-center gap-2'>
                  {
                    isLoggedInUserProfile ? (
                      <>
                        <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
                        <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                      </>
                    ) : (
                      isFollowing ? (
                        <>
                          <Button variant='secondary' className='h-8'>Unfollow</Button>
                          <Button variant='secondary' className='h-8'>Message</Button>
                        </>
                      ) : (
                        <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
                      )
                    )
                  }
                </div>
              </div>
              s
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.post?.length || 0} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers?.length || 0} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following?.length || 0} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'Bio not available.'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign size={14} /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold border-t border-black' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold border-t border-black' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full h-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
