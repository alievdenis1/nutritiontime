<<<<<<< HEAD
=======

>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
export type EmulateRequestArguments = {
	isError?: boolean,
	milliSeconds?: number
}

export const emulateRequest = ({
	isError,
	milliSeconds
}: EmulateRequestArguments = {
	isError: false,
	milliSeconds: 1500
<<<<<<< HEAD
}): Promise<unknown> => {
=======
}): Promise<any> => {
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (isError) reject()
			resolve(null)
		}, milliSeconds)
	})
}
