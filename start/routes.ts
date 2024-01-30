/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import PostsController from '#controllers/posts_controller'
import router from '@adonisjs/core/services/router'

router.get('/', [PostsController, 'homePage'])

router.post('/new_post', [PostsController, 'store'])
