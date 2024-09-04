import { render, screen } from "@testing-library/react";
import { CommentsList } from "./CommentsList";
import { CommentsWithAuthors } from "../../api/apiType";
import { format } from "timeago.js";

const commentsWithAuthorsListMock: CommentsWithAuthors = [
    {
      id: 'comment1',
      authorId: 'author-1',
      content: 'This is a test comment',
      createdAt: '01/09/2024',
      author: {
        id: 'author1',
        username: 'TestUser',
        pictureUrl: 'https://example.com/avatar1.jpg',
      },
      memeId: 'meme1',
    },
    {
      id: 'comment2',
      authorId: 'author-2',
      content: 'Another test comment',
      createdAt: '04/09/2024',
      author: {
        id: 'author2',
        username: 'AnotherUser',
        pictureUrl: 'https://example.com/avatar2.jpg',
      },
      memeId: 'meme1',
    },
  ];

  const commentsWithAuthorsListMock2: CommentsWithAuthors = [
    {
      id: 'comment1',
      authorId: 'author-1',
      content: 'This is a test comment',
      createdAt: '01/09/2024',
      author: {
        id: 'author1',
        username: 'TestUser',
        pictureUrl: 'https://example.com/avatar1.jpg',
      },
      memeId: 'meme1',
    },
  ];

const renderComponent = (isLoading: boolean) => {
    const { container } = render(
        <CommentsList 
            isLoading={isLoading}
            commentsWithAuthorsList={commentsWithAuthorsListMock}
        />
    )
    return {container };
}

describe('CommentList component', () => {
    it('should render comments with author details', () => {
        renderComponent(false)
    
        commentsWithAuthorsListMock.forEach((comment) => {
          expect(screen.getByTestId(`meme-comment-author-${comment.memeId}-${comment.id}`)).toHaveTextContent(comment.author.username);
          expect(screen.getByTestId(`meme-comment-content-${comment.memeId}-${comment.id}`)).toHaveTextContent(comment.content);
        });
      });

    it('should format the createdAt date correctly', () => {
        renderComponent(false)
    
        commentsWithAuthorsListMock.forEach((comment) => {
          const formattedDate = format(comment.createdAt);
          expect(screen.getByText(formattedDate)).toBeInTheDocument()
        });
    });

    it('should not render anything if commentsWithAuthorsList is empty', () => {
        const { container } = render(<CommentsList isLoading={false} commentsWithAuthorsList={[]} />);
    
        expect(container).toBeEmptyDOMElement();
      });

      it('should render the loader for the last comment when isLoading is true', () => {
        const {container } = render(<CommentsList isLoading={true} commentsWithAuthorsList={commentsWithAuthorsListMock2} />)
        const loader = container.querySelectorAll('span')
        expect(loader[1]).toHaveTextContent('Loading...')
      });
})