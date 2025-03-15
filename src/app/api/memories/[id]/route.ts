import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await connectDB();
    const db = client.db("memories");
    
    const result = await db.collection("memories").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Memory not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Memory deleted successfully" }), {
      status: 200,
    });
  } catch (_error) {
    return new Response(JSON.stringify({ error: "Failed to delete memory" }), {
      status: 500,
    });
  }
} 