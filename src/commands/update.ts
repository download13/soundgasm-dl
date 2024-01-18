import { profileCommand } from './profile/index.ts'
import { readdir } from 'fs/promises'

export async function updateCommand() {
	const profileNames = await readdir('')
	profileCommand
}
