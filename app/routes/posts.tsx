import TextArea from "~/components/form/text-area";
import type { Route } from "./+types/posts";
import { eq } from "drizzle-orm";
import TextInput from "~/components/form/text-input";
import { fetchDb } from "~/db";
import { posts, type Post } from "~/db/schema";

export async function loader({ context }: Route.LoaderArgs) {
  const db = fetchDb(context.cloudflare.env.DB);
  const allPosts = await db.select().from(posts).orderBy(posts.createdAt);
  return { posts: allPosts };
}

export async function action({ request, context }: Route.ActionArgs) {
  const db = fetchDb(context.cloudflare.env.DB);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const title = formData.get("title");
    const content = formData.get("content");

    if (typeof title === "string" && typeof content === "string") {
      await db.insert(posts).values({ title, content });
    }
  }

  return null;
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>

      <form method="post" className="mb-8 bg-gray-50 p-6 rounded-lg">
        <input type="hidden" name="intent" value="create" />
        <div className="mb-4">
          <TextInput labelText="Title" name="title" />
        </div>
        <div className="mb-4">
          <TextArea labelText="Content" name="content" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Post
        </button>
      </form>

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

