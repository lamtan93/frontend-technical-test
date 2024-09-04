import { render, screen, fireEvent } from '@testing-library/react';
import { MemeContent } from './MemeContent';
import { MemeWithAuthor } from '../../api/apiType';

describe('MemeContent', () => {
  const mockMeme: MemeWithAuthor = {
    id: '1',
    authorId: 'autho-1',
    pictureUrl: 'https://example.com/meme.jpg',
    texts: [],
    description: 'This is a test description',
    commentsCount: '5',
    author: {
      id: 'author1',
      username: 'TestUser',
      pictureUrl: 'https://example.com/avatar.jpg',
    },
    createdAt: '01/01/2024'
  };

  const mockShowComments = vi.fn();

  it('should render meme picture, description, and comments section', () => {
    render(
      <MemeContent
        meme={mockMeme}
        showComments={mockShowComments}
        openedCommentSection={null}
      />
    );

    
    expect(screen.getByTestId(`meme-picture-${mockMeme.id}`)).toBeInTheDocument();
   
    expect(screen.getByTestId(`meme-description-${mockMeme.id}`)).toHaveTextContent(mockMeme.description);
    
    expect(screen.getByTestId(`meme-comments-count-${mockMeme.id}`)).toHaveTextContent(`${mockMeme.commentsCount} comments`);

    expect(screen.getByTestId(`meme-comments-section-${mockMeme.id}`)).toBeInTheDocument();
  });

  it('should call showComments with meme id when comments section is clicked', () => {
    render(
      <MemeContent
        meme={mockMeme}
        showComments={mockShowComments}
        openedCommentSection={null}
      />
    );

    fireEvent.click(screen.getByTestId(`meme-comments-section-${mockMeme.id}`));
    expect(mockShowComments).toHaveBeenCalledWith(mockMeme.id);
  });
});
