# GoXLR: Discord Mute Sync Injection
A code injection for Discord to sync the mute state of GoXLR with Discord.
Does not use any plugin loading system.

## Why does this not use a plugin loader? (BetterDiscord, Vencord, etc.)
This code does not use a plugin loader because it is designed to be a simple, 
standalone solution that directly injects the necessary code into Discord's Desktop client. 

I personally do not use any Discord plugin loaders, so it does not make sense to start using one just for this feature.
It should be easy to adapt this code to work with a plugin loader though. I might do that in the future, or not idk.

## How to use
Clone this repository, then run the `npm run build` command to build the code.
This will create a `dist` folder with the built code.

To install it simply copy the content of `dist/standalone` into `~/.config/discord/0.0.98/modules/discord_desktop_core/`. 
You may need to adjust the version number in the path depending on your Discord version. Discord will automatically load the code when it starts.

You can verify that the code is loaded by checking the Developer Tools console (Ctrl+Shift+I) or running Discord in the terminal.
If you see a purple message saying `Code Injection Successful!` then the code has been loaded successfully.

## References / Sources
Thanks to the following projects I was able to figure out how the code injection works:
* [DiscordInject](https://github.com/Jabka-M/DiscordInject)
* [BetterDiscord](https://github.com/BetterDiscord/BetterDiscord)
* [Vesktop](https://github.com/Vencord/Vesktop)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.