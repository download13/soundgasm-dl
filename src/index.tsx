import { program } from 'commander'
import { trackCommand } from './commands/track/index.ts'
import { profileCommand } from './commands/profile/index.ts'

program
	.name('soundgasm-dl')
	.description(
		'automatically download individual tracks or entire profiles from soundgasm.net'
	)
	.version('0.1.0')

program.option(
	'-d, --data-path <path>',
	'directory to use as storage context',
	'.'
)

program
	.command('track')
	.description("download a track by it's URL")
	.argument('<trackUrl>', 'URL of the track to download')
	.action(trackCommand)

program
	.command('profile')
	.description("download all tracks in an author's public profile")
	.argument('<profile>', 'URL or slug of the profile')
	.option('-c, --concurrency <int>', 'how many tracks to download at once', '1')
	.option('-w, --wait <seconds>', 'How long to wait between tracks', '1')
	.action(profileCommand)

program.parse()
