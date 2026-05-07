import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getAllPosts } from "../../managers/PostManager"
import { getCategories } from "../../managers/CategoryManager"
import { getTags } from "../../managers/TagManager"

const PAGE_SIZE = 10

export const PostList = () => {
  const [posts, setPosts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    getAllPosts(page).then(data => {
      setPosts(data.results)
      setTotalCount(data.count)
    })
  }, [page])

  useEffect(() => {
    getCategories().then(setCategories)
    getTags().then(setTags)
  }, [])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category && post.category.id === parseInt(selectedCategory))
    : posts

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">Posts</h2>
      <div className="is-flex is-gap-4 mb-4" style={{ gap: "1rem" }}>
        <div className="field">
          <div className="control">
            <div className="select">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <div className="select">
              <select value="" onChange={e => { if (e.target.value) navigate(`/tags/${e.target.value}/posts`) }}>
                <option value="">Filter by Tag</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="columns is-multiline mt-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="column is-one-third">
            <div className="card">
              <div className="card-content">
                <p className="title is-5">
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </p>
                <p className="subtitle is-6">{post.user.full_name || post.user.username}</p>
                {post.category && (
                  <span className="tag is-info mb-3">{post.category.label}</span>
                )}
                <p className="content">
                  {post.content?.slice(0, 150)}{post.content?.length > 150 ? "…" : ""}
                </p>
              </div>
              <footer className="card-footer">
                <span className="card-footer-item">{post.comment_count} comments</span>
                <span className="card-footer-item">{post.reaction_count} reactions</span>
                <span className="card-footer-item has-text-grey is-size-7">{post.publication_date}</span>
              </footer>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="pagination is-centered mt-5" role="navigation" aria-label="pagination">
          <button
            className="pagination-previous"
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="pagination-next"
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
          <p className="has-text-centered mt-2">Page {page} of {totalPages}</p>
        </nav>
      )}
    </div>
  )
}
