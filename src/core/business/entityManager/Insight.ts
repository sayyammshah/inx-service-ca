export class Post {
  // Immutable Properties
  readonly insightId: string
  readonly authorId: string
  readonly createdAt: number

  // Mutable Properties
  title: string
  content: string
  stats: {
    likes: number
    dislikes: number
    views: number
    comments: number
  }
  updatedAt: number
  tags: string[]

  constructor({
    insightId,
    authorId,
    title,
    content,
    tags,
  }: {
    insightId: string
    authorId: string
    title: string
    content: string
    tags?: string[]
  }) {
    this.insightId = insightId
    this.authorId = authorId
    this.title = title
    this.content = content
    this.tags = tags || []
    this.stats = {
      likes: 0,
      dislikes: 0,
      views: 0,
      comments: 0,
    }
    this.createdAt = this.updatedAt = new Date().getTime()
  }
}
