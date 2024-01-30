import Post from '#models/post'
import { createPostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class PostsController {
  async homePage({ view }: HttpContext) {
    const posts = await Post.all()
    return view.render('pages/home', {
      posts: posts.map((p) => ({
        author: p.author,
        body: p.body,
        date: p.createdAt.toLocaleString(DateTime.DATETIME_FULL),
      })),
    })
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
      author: 'someone',
      body: payload.body,
    })
    response.redirect('/') // TODO redirect to the new post's page
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
