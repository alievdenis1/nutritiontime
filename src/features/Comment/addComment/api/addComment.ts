import useApi from '@/shared/lib/api/use-api'

type AddCommentParams = {
    recipeId: string;
}

// TODO: возможно, что нужно использовать FormData
type AddCommentPayload = {
    text: string,
    rating: number,
    image?: File,
}

export function addComment(params: AddCommentParams, payload: AddCommentPayload) {
    return useApi('post', `/recipes/${params.recipeId}/comments`, payload)
}
