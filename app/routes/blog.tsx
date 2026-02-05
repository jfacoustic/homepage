import { fetchDb } from "~/db";
import { type Post, posts } from "~/db/schema";
import type { Route } from "./+types/blog";

export async function loader({ context }: Route.LoaderArgs) {
  const db = fetchDb(context.cloudflare.env.DB);
  const allPosts = await db.select().from(posts).orderBy(posts.createdAt);
  return { posts: allPosts };
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostPreview key={`post-${post.id}`} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

function PostPreview({ post }: { post: Post }) {
  return (
    <article key={post.id} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl text-black font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <time className="text-sm text-gray-500">
        {new Date(post.createdAt).toLocaleDateString()}
      </time>
    </article>
  );
}
