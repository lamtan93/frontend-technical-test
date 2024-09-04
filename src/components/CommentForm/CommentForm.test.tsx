import { fireEvent, render, screen } from "@testing-library/react";
import { CommentForm } from "./CommentForm";
import { GetUserByIdResponse } from "../../api/apiType";

const mockUser: GetUserByIdResponse = {
    id: '1',
    username: 'Test User',
    pictureUrl: 'https://google.com/avatar.jpg'
}

const mockHandleOnSubmit = vi.fn()
const inputRef = {
    current: [] as HTMLInputElement[]
}
const indexMeme = 0;


const renderComponent = () => {
    const { container } = render(
        <CommentForm 
            inputRef={inputRef} 
            handleOnSubmit={mockHandleOnSubmit} 
            indexMeme={indexMeme}
            user={mockUser}
        />
    )
    return {container};
}

describe('CommentForm component', () => {
    it('should display initials image from username', () => {
        renderComponent()
        const avatarImage = screen.getByRole('img');
        expect(avatarImage).toHaveTextContent('TU');
    })
   
    it('should have the input', () => {
        renderComponent()
        const input = screen.getByTestId(`input-comment-${indexMeme}`)
        expect(input).toBeInTheDocument()
    })

    it('should have the placeholder', () => {
        renderComponent()
        const input = screen.getByTestId(`input-comment-${indexMeme}`)
        expect(input).toHaveAttribute('placeholder', 'Type your comment here...')
    })

    it('should call handleOnSubmit when submit form', () => {
        const {container} = renderComponent()

        const form = container.querySelector('form')
        const input = screen.getByTestId(`input-comment-${indexMeme}`)
        fireEvent.change(input, {target: { value: 'My super comment'}})
        if(form)
            fireEvent.submit(form)

        expect(mockHandleOnSubmit).toHaveBeenCalled()
    })

    it('should inputRef is assigned correctly', () => {
        renderComponent()
        const input = screen.getByTestId(`input-comment-${indexMeme}`)

        expect(inputRef.current[indexMeme]).toBe(input)
    })

})