import { 
  LoginResponse, 
  GetUserByIdResponse, 
  GetMemesResponse, 
  GetMemeCommentsResponse, 
  CreateCommentResponse, 
  IMemeResponse, 
  TextCaption 
} from "./apiType";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

enum ERROR_LABEL {
  UNAUTHORIZED = 'Unauthorized',
  NOTFOUND = 'Not Found',
}

enum ERROR_HTTP_STATUS {
  UNAUTHORIZED = 401,
  NOTFOUND = 404
}

type Headers = {
  'Content-Type' : 'application/json',
  'Authorization'?: `Bearer ${string}`
}
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
const returnCorrectRequest = (method: Method, data: unknown, token?: string, ) => {
  const headers: Headers = token ? 
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
      :
    {
      'Content-Type': 'application/json',
    }
  
  if(method === 'GET'){
    return {
      method,
      headers
    }
  }

  return {
    method,
    headers,
    body: JSON.stringify(data)
  }
}


export class UnauthorizedError extends Error {
  constructor() {
    super(ERROR_LABEL.UNAUTHORIZED);
  }
}

export class NotFoundError extends Error {
  constructor() {
    super(ERROR_LABEL.NOTFOUND);
  }
}

function checkStatus(response: Response) {
  if (response.status === ERROR_HTTP_STATUS.UNAUTHORIZED) {
    throw new UnauthorizedError();
  }
  if (response.status === ERROR_HTTP_STATUS.NOTFOUND) {
    throw new NotFoundError();
  }
  return response;
}


/**
 * Authenticate the user with the given credentials
 * @param username 
 * @param password 
 * @returns 
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  return await fetch(`${BASE_URL}/authentication/login`, 
    returnCorrectRequest('POST', { username, password })
  ).then(res => checkStatus(res).json())
}



/**
 * Get a user by their id
 * @param token 
 * @param id 
 * @returns 
 */
export async function getUserById(token: string, id: string): Promise<GetUserByIdResponse> {
  return await fetch(`${BASE_URL}/users/${id}`, 
    returnCorrectRequest('GET', null, token)
  ).then(res => checkStatus(res).json())
}

/**
 * Get the list of memes for a given page
 * @param token 
 * @param page 
 * @returns 
 */
export async function getMemes(token: string, page: number): Promise<GetMemesResponse> {
 
  return await fetch(`${BASE_URL}/memes?page=${page}`, 
    returnCorrectRequest('GET', null, token)
  ).then(res => { 
    return checkStatus(res).json()
   })
}


/**
 * Get comments for a meme
 * @param token
 * @param memeId
 * @returns
 */
export async function getMemeComments(token: string, memeId: string, page: number): Promise<GetMemeCommentsResponse> {
  return await fetch(`${BASE_URL}/memes/${memeId}/comments?page=${page}`, 
    returnCorrectRequest('GET', null, token)
  ).then(res => checkStatus(res).json())
}



/**
 * Create a comment for a meme
 * @param token
 * @param memeId
 * @param content
 */
export async function createMemeComment(token: string, memeId: string, content: string): Promise<CreateCommentResponse> {
  return await fetch(`${BASE_URL}/memes/${memeId}/comments`, 
    returnCorrectRequest('POST', { content }, token)
).then(res => checkStatus(res).json());
}


/**
 * Create a meme 
 * @param token 
 * @param picture 
 * @param description 
 * @param texts 
 * @returns 
 */
export async function createMeme(token: string, picture: File, description: string, texts: TextCaption[])
: Promise<IMemeResponse> {
  const formData = new FormData();
  formData.append('Picture', picture)
  formData.append('Description', description)

  texts.forEach((text, index) => {
    formData.append(`Texts[${index}][Content]`, text.content)
    formData.append(`Texts[${index}][X]`, text.x.toString())
    formData.append(`Texts[${index}][Y]`, text.y.toString())
  })
  const response =  await fetch(`${BASE_URL}/memes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });

  if(!response.ok){
    throw new Error('Failed to create meme')
  }

  return await response.json()
}