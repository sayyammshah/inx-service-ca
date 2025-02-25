export class Post {
  // Immutable Properties
  private readonly entityId: string
  private readonly authorId: string
  private readonly createdAt: Date

  // Mutable Properties
  private title: string
  private content: string
  private stats: {
    likes: number
    dislikes: number
    views: number
    comments: number
  }
  private updatedAt: Date
  private tags: string[]

  constructor({
    entityId,
    authorId,
    title,
    content,
    tags,
  }: {
    entityId: string
    authorId: string
    title: string
    content: string
    tags?: string[]
  }) {
    this.entityId = entityId
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
    this.createdAt = this.updatedAt = new Date()
  }
}
