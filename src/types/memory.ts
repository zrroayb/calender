export interface Memory {
  id: string;
  date: string;
  imageUrl: string;
  caption: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
} 