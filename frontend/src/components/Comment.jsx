import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const Comment = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment?.autor?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1>{comment?.author?.username} <span className="font-normal m-2 font-small">{comment.text}</span></h1>
      </div>
    </div>
  )
}

export default Comment
