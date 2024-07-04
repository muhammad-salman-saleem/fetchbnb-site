// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { realEstate } from '../../utils/realEstate';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import axios from "axios";

type Data = any

type Suggestion = {
    city: string,
    state_code: string
    distance?: number
}

function levenshteinDistance(a: string, b: string): number {
    // Create a 2D array to store the distances
    let distances = new Array(a.length + 1);
    for (let i = 0; i <= a.length; i++) {
        distances[i] = new Array(b.length + 1);
    }

    // Initialize the first row and column
    for (let i = 0; i <= a.length; i++) {
        distances[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
        distances[0][j] = j;
    }

    // Fill in the rest of the array
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                distances[i][j] = distances[i - 1][j - 1];
            } else {
                distances[i][j] = Math.min(distances[i - 1][j], distances[i][j - 1], distances[i - 1][j - 1]) + 1;
            }
        }
    }

    // Return the final distance
    return distances[a.length][b.length];
}

function sortBySimilarity(words: Suggestion[], singleWord: string): Suggestion[] {
    // Create an array of objects to store the words and their distances
    let wordDistances = words.map(word => ({
        ...word,
        distance: levenshteinDistance(`${word.city, word.state_code}`, singleWord)
    }));

    // Sort the array by distance
    wordDistances.sort((a, b) => a.distance - b.distance);

    // Return the sorted list of words
    return wordDistances;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(400).json({ name: 'Bad Request' })
    }
    const session: any = await unstable_getServerSession(req, res, authOptions as any)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    if (session?.user?.plan === "UNPAID") {
        return res.status(403).json({ error: 'Forbidden, incorrect plan for task.' })
    }
    const query = req.query.query as string

    const options = {
        method: 'GET',
        url: 'https://us-real-estate.p.rapidapi.com/location/suggest',
        params: { input: query },
        headers: {
            'X-RapidAPI-Key': 'd214dd74admsh775d5293948fb9bp1dc6b0jsncaf3a1b545e5',
            'X-RapidAPI-Host': 'us-real-estate.p.rapidapi.com'
        }
    };
    const data = await axios.request(options);

    res.setHeader('Cache-Control', 's-maxage=2628000');
    res.status(200).json(data.data)
    // res.status(200).json({ data: sortBySimilarity(data.data.data, query) as Suggestion[] })
}
