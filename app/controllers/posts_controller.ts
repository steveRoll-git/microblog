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

export default class PostsController {
  async homePage({ view }: HttpContext) {
    const posts = await Post.all()
    return view.render('pages/home', {
      posts: posts.map((p) => ({
        author: p.author,
        authorColor: colorFromName(p.author),
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
      author: md5(request.ip()).substring(0, 6),
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
