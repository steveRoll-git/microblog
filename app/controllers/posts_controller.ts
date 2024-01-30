import Post from '#models/post'
import { createPostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import md5 from 'md5'

function colorFromName(n: string) {
  const x = [...n].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const hue = x * 137.508
  return `hsl(${hue}, 50%, 75%)`
}

function serializePost(post: Post) {
  return {
    id: post.id,
    isReply: !!post.parentPostId,
    author: post.author,
    authorColor: colorFromName(post.author),
    body: post.body,
    date: post.createdAt.toLocaleString(DateTime.DATETIME_FULL),
  }
}

function serializePosts(posts: Post[]) {
  return posts.map((p) => serializePost(p))
}

export default class PostsController {
  async homePage({ view }: HttpContext) {
    const posts = await Post.all()
    return view.render('pages/home', { posts: serializePosts(posts) })
  }

  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createPostValidator.validate(data)
    const post = await Post.create({
      author: md5(request.ip()).substring(0, 6),
      body: payload.body,
      parentPostId: payload.parentPostId,
    })
    response.redirect(`/post/${post.id}`)
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const mainPost = await Post.findOrFail(params.postId)
    const replies = await Post.query().where('parent_post_id', mainPost.id)
    const contextPosts: Post[] = []
    if (mainPost.parentPostId) {
      contextPosts.push(await Post.findOrFail(mainPost.parentPostId))
    }
    return view.render('pages/home', {
      mainPost: serializePost(mainPost),
      posts: serializePosts(replies),
      contextPosts: serializePosts(contextPosts),
    })
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
