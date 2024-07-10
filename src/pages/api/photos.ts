import { NextApiRequest, NextApiResponse } from 'next'

const photos = [
    { url: 'https://via.placeholder.com/300' },
    { url: 'https://via.placeholder.com/300' },
    { url: 'https://via.placeholder.com/300' },
    // Add more photo URLs here
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(photos)
}
