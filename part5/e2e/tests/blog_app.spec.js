const { test, expect, describe, beforeEach } = require('@playwright/test')

const BACKEND_URL = 'http://localhost:3001'

const loginWith = async (page, username, password) => {
  await page.getByPlaceholder('username').fill(username)
  await page.getByPlaceholder('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create blog' }).click()
  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.locator('.blog', { hasText: `${title} ${author}` })).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post(`${BACKEND_URL}/api/testing/reset`)
    await request.post(`${BACKEND_URL}/api/users`, {
      data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' },
    })
    await request.post(`${BACKEND_URL}/api/users`, {
      data: { username: 'other', name: 'Other User', password: 'salainen' },
    })

    await page.goto('/')
  })

  test('login form is shown when visiting unauthenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page).toHaveURL(/\/$/)
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText(/wrong username or password/i)).toBeVisible()
      await expect(page.getByText(/logged in/)).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created and appears in the list', async ({ page }) => {
      await createBlog(page, 'E2E Title', 'E2E Author', 'http://example.com/e2e')
      await expect(page).toHaveURL(/\/$/)
    })

    test('a blog can be liked from the detail page', async ({ page }) => {
      await createBlog(page, 'Likable', 'Author', 'http://example.com/like')
      await page.getByRole('link', { name: 'Likable Author' }).click()

      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the creator can delete their blog', async ({ page }) => {
      await createBlog(page, 'Deletable', 'Author', 'http://example.com/del')
      await page.getByRole('link', { name: 'Deletable Author' }).click()

      page.once('dialog', (d) => d.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page).toHaveURL(/\/$/)
      await expect(page.locator('.blog', { hasText: 'Deletable Author' })).toHaveCount(0)
    })

    test('only the creator sees the remove button on a blog detail page', async ({ page }) => {
      await createBlog(page, 'Mine', 'Owner', 'http://example.com/mine')
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'other', 'salainen')

      await page.getByRole('link', { name: 'Mine Owner' }).click()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are sorted by likes in descending order', async ({ page }) => {
      await createBlog(page, 'A', 'A', 'http://a')
      await createBlog(page, 'B', 'B', 'http://b')
      await createBlog(page, 'C', 'C', 'http://c')

      const likeOnce = async (titleAuthor) => {
        await page.getByRole('link', { name: titleAuthor }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('link', { name: 'home' }).click()
      }

      await likeOnce('B B')
      await likeOnce('B B')
      await likeOnce('C C')

      const titles = await page.locator('.blog a').allTextContents()
      expect(titles).toEqual(['B B', 'C C', 'A A'])
    })
  })
})
