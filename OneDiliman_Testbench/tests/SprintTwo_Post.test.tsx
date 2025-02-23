import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from "@testing-library/user-event";
//import FeedPage from '../src/pages/Feed/FeedPage.tsx'
//import CreatePostPage from '../src/pages/CreatePost/CreatePostPage.tsx'

test('render createpostpage', () => {
    render(
        <MemoryRouter><FeedPage /></MemoryRouter>
    )

    const instructions = screen.getByText(/test/i);
    expect(instructions).toBeInTheDocument();
})

test('create and upload a post', () => {
    const postId 
    const postOwner
    const postTitle
    const postContent
    const postPictures
    const postTags
    const postDate
    const postTime
})