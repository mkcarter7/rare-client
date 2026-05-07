import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { PostList } from './PostList'
import { getAllPosts } from '../../managers/PostManager'

const singlePost = {
  id: 1,
  title: 'Test Card Post',
  content: 'This is the post body text.',
  publication_date: '2026-05-01',
  approved: true,
  user: { id: 10, username: 'jdoe', full_name: 'Jane Doe' },
  category: { id: 3, label: 'Science' },
  comment_count: 4,
  reaction_count: 7,
}

vi.mock('../../managers/PostManager', () => ({
  getAllPosts: vi.fn((page = 1) => Promise.resolve({
    count: page === 1 ? 1 : 0,
    results: page === 1 ? [singlePost] : [],
  })),
}))

vi.mock('../../managers/CategoryManager', () => ({
  getCategories: () => Promise.resolve([{ id: 3, label: 'Science' }]),
}))

vi.mock('../../managers/TagManager', () => ({
  getTags: () => Promise.resolve([]),
}))

const renderPostList = () =>
  render(
    <MemoryRouter>
      <PostList />
    </MemoryRouter>
  )

describe('PostList card layout', () => {
  it('renders the post title inside a card', async () => {
    renderPostList()
    const title = await screen.findByText('Test Card Post')
    expect(title.closest('.card')).not.toBeNull()
  })

  it("renders the author's full name", async () => {
    renderPostList()
    await screen.findByText('Jane Doe')
  })

  it('renders the category as a tag element', async () => {
    renderPostList()
    // 'Science' also appears in the filter dropdown, so target the span.tag specifically
    const tags = await screen.findAllByText('Science')
    const tagSpan = tags.find(el => el.tagName === 'SPAN' && el.classList.contains('tag'))
    expect(tagSpan).toBeDefined()
  })

  it('renders comment and reaction counts', async () => {
    renderPostList()
    await screen.findByText('4 comments')
    await screen.findByText('7 reactions')
  })

  it('renders the publication date', async () => {
    renderPostList()
    await screen.findByText('2026-05-01')
  })
})

describe('PostList pagination', () => {
  it('does not render pagination controls when there is only one page', async () => {
    renderPostList()
    await screen.findByText('Test Card Post')
    expect(screen.queryByRole('navigation', { name: 'pagination' })).toBeNull()
  })
})

describe('PostList sorting', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders a sort dropdown with newest, oldest, and title options', async () => {
    renderPostList()
    await screen.findByText('Test Card Post')
    expect(screen.getByDisplayValue('Newest First')).toBeDefined()
    expect(screen.getByRole('option', { name: 'Oldest First' })).toBeDefined()
    expect(screen.getByRole('option', { name: 'Title (A–Z)' })).toBeDefined()
  })

  it('changing sort to oldest refetches with sort=oldest and resets to page 1', async () => {
    renderPostList()
    await screen.findByText('Test Card Post')
    userEvent.selectOptions(screen.getByDisplayValue('Newest First'), 'oldest')
    expect(getAllPosts).toHaveBeenLastCalledWith(1, 'oldest')
  })
})
