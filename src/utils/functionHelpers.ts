export const isScrolledToBottom = 
(e: React.UIEvent<HTMLDivElement>) =>
      Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight) < 1;