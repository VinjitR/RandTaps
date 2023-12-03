const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

module.exports = {
    Mutation: {
        createComment: async(_,{postId,body},context)=>{
            const {username} = checkAuth(context);
            if(body.trim() === ''){
                throw new UserInputError('Empty Comment',{
                    errors:{
                        body: 'Comment body should not be empty'
                    }
                })
            }
            const post = await Post.findById(postId);
            // //find old comment by the user
            // if(username === post.username){
            //     if (post.comments.find(item=> item.body===body)){
            //         console.log(body)
            //         throw new UserInputError('Same comment already exists')
            //     }
            // }
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            }else{
                throw new UserInputError('Post not found')
            }
        },
        deleteComment: async (_,{ postId,commentId }, context)=>{
            const { username } = checkAuth(context);
            const post =  await Post.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId)
                if(commentIndex>-1){
                    if (post.comments[commentIndex].username === username){ 
                        post.comments.splice(commentIndex,1)
                        await post.save()
                        return post;
                    }
                    else{
                        throw new AuthenticationError(' Action not Allowed invalid user')
                    }
                }else{
                    throw new UserInputError('Comment not found')
                }
            }
            else{
                throw new UserInputError('Post not found')
            }
        }
    }
}