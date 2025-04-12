import { Redis } from "@upstash/redis"

// Create Redis client using environment variables
// This will automatically use the UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// that were added to your Vercel project when you integrated Upstash [^3]
export const redis = Redis.fromEnv()

// Helper functions for common Redis operations
export async function incrementSpaceViews(spaceId: number): Promise<number> {
  return await redis.incr(`space:${spaceId}:views`)
}

export async function getSpaceViews(spaceId: number): Promise<number> {
  const views = await redis.get(`space:${spaceId}:views`)
  return typeof views === "number" ? views : 0
}

export async function storeReview(spaceId: number, review: any): Promise<string> {
  const reviewId = `review:${Date.now()}`
  await redis.hset(reviewId, {
    spaceId,
    ...review,
    timestamp: Date.now(),
  })

  // Add to the space's review list
  await redis.lpush(`space:${spaceId}:reviews`, reviewId)

  return reviewId
}

export async function getRecentReviews(spaceId: number, limit = 5): Promise<any[]> {
  const reviewIds = await redis.lrange(`space:${spaceId}:reviews`, 0, limit - 1)

  if (!reviewIds.length) return []

  const reviews = await Promise.all(reviewIds.map((id) => redis.hgetall(id)))

  return reviews
}

export async function getTopSpaces(limit = 5): Promise<{ id: number; views: number }[]> {
  // Get all keys matching the pattern
  const keys = await redis.keys("space:*:views")

  if (!keys.length) return []

  // Get the view counts for each space
  const viewCounts = await Promise.all(
    keys.map(async (key) => {
      const spaceId = Number.parseInt(key.split(":")[1])
      const views = (await redis.get(key)) as number
      return { id: spaceId, views }
    }),
  )

  // Sort by views in descending order and limit
  return viewCounts.sort((a, b) => b.views - a.views).slice(0, limit)
}
