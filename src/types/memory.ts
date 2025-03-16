export interface Comment {
  id: string;
  text: string;
  author: 'Ayberk' | 'Selvi';
  createdAt: string;
}

export interface Memory {
  id: string;
  date: string;
  imageUrl: string;
  caption: string;
  author: 'Ayberk' | 'Selvi';
  comments: Comment[];
} 