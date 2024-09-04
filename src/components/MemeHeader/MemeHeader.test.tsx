import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemeHeader } from './MemeHeader';
import { MemeWithAuthor } from '../../api/apiType';
import { format } from 'timeago.js';

describe('MemeHeader', () => {
  const mockMeme: MemeWithAuthor = {
    id: '1',
    authorId: 'author-1',
    pictureUrl: 'https://example.com/meme.jpg',
    texts: [],
    description: 'This is a test description',
    commentsCount: '5',
    author: {
      id: 'author1',
      username: 'TestUser',
      pictureUrl: 'https://example.com/avatar.jpg',
    },
    createdAt: '01/02/2024', 
  };

  it('should render meme author avatar and username', () => {
    render(<MemeHeader meme={mockMeme} />);

    expect(screen.getByTestId(`meme-author-${mockMeme.id}`)).toHaveTextContent(mockMeme.author.username);
  });

  it('should render the formatted creation date', () => {
    render(<MemeHeader meme={mockMeme} />);

    expect(screen.getByText(format(mockMeme.createdAt))).toBeInTheDocument();
  });

  it('should apply the ref to the Flex container', () => {
    const mockRef = React.createRef<HTMLDivElement>();
    render(<MemeHeader meme={mockMeme} lastMemeRef={mockRef} />);

    expect(mockRef.current).toBeInTheDocument();
  });
});
